import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchMLSListings, NOCO_CITIES, MLSListing } from "@/lib/mls";
import { NOCO_GEOGRAPHY } from "@/lib/corridors";

const client = new Anthropic();

const SEARCH_TOOL: Anthropic.Tool = {
  name: "search_listings",
  description:
    "Search Northern Colorado MLS listings fresh. Use this for new searches or when the user wants to start over with different criteria.",
  input_schema: {
    type: "object",
    properties: {
      cities: {
        type: "array",
        items: { type: "string" },
        description: "NoCo city names. Omit for all NoCo. Expand corridors: 'I-25' → Loveland, Berthoud, Johnstown, Windsor, Fort Collins, Wellington, Timnath.",
      },
      minBeds: { type: "number" },
      maxBeds: { type: "number" },
      minBaths: { type: "number" },
      minPrice: { type: "number" },
      maxPrice: { type: "number" },
      minAcres: { type: "number" },
      maxAcres: { type: "number" },
      minGarageSpaces: { type: "number" },
      propertyType: { type: "string", enum: ["Residential", "Commercial", "Land", "Multi-Family"] },
      keywords: { type: "string", description: "Comma-separated keywords to match in listing remarks" },
      status: { type: "string", enum: ["Active", "Pending", "Closed"] },
    },
  },
};

const REFINE_TOOL: Anthropic.Tool = {
  name: "refine_results",
  description:
    "Filter the currently shown listings to a subset. Use this when the user says things like 'now show only the ones with a pool', 'narrow it down to under $500K', 'just the ones in Loveland', etc. Look at the listing remarks and details from earlier in the conversation to decide which keys to keep.",
  input_schema: {
    type: "object",
    required: ["keep_keys"],
    properties: {
      keep_keys: {
        type: "array",
        items: { type: "string" },
        description: "ListingKeys of the listings that match the new criteria. Must be a subset of the currently shown listings.",
      },
    },
  },
};

const TOOLS = [SEARCH_TOOL, REFINE_TOOL];

interface SearchParams {
  cities?: string[];
  minBeds?: number; maxBeds?: number; minBaths?: number;
  minPrice?: number; maxPrice?: number;
  minAcres?: number; maxAcres?: number;
  minGarageSpaces?: number; propertyType?: string;
  keywords?: string; status?: string;
}

async function executeSearch(
  params: SearchParams,
  prefetched: Promise<MLSListing[]>
): Promise<MLSListing[]> {
  const all = await prefetched;
  let filtered = params.cities?.length
    ? all.filter((l) => params.cities!.includes(l.City))
    : all.filter((l) => NOCO_CITIES.includes(l.City));

  if (params.minBeds) filtered = filtered.filter((l) => (l.BedroomsTotal ?? 0) >= params.minBeds!);
  if (params.maxBeds) filtered = filtered.filter((l) => (l.BedroomsTotal ?? 999) <= params.maxBeds!);
  if (params.minBaths) filtered = filtered.filter((l) => (l.BathroomsTotalInteger ?? 0) >= params.minBaths!);
  if (params.minPrice) filtered = filtered.filter((l) => l.ListPrice >= params.minPrice!);
  if (params.maxPrice) filtered = filtered.filter((l) => l.ListPrice <= params.maxPrice!);
  if (params.minAcres) filtered = filtered.filter((l) => (l.LotSizeAcres ?? 0) >= params.minAcres!);
  if (params.maxAcres) filtered = filtered.filter((l) => (l.LotSizeAcres ?? 9999) <= params.maxAcres!);
  if (params.minGarageSpaces) filtered = filtered.filter((l) => (l.GarageSpaces ?? 0) >= params.minGarageSpaces!);
  if (params.propertyType) filtered = filtered.filter((l) => l.PropertyType === params.propertyType);
  if (params.keywords) {
    const kws = params.keywords.toLowerCase().split(/[,\s]+/).filter(Boolean);
    filtered = filtered.filter((l) => kws.some((kw) => (l.PublicRemarks ?? "").toLowerCase().includes(kw)));
  }
  return filtered.sort((a, b) => b.ListPrice - a.ListPrice);
}

/** Compact listing summary sent to Claude — enough detail for refinement queries */
function listingSummary(l: MLSListing) {
  return {
    ListingKey: l.ListingKey,
    address: `${l.UnparsedAddress}, ${l.City}`,
    price: l.ListPrice,
    beds: l.BedroomsTotal,
    baths: l.BathroomsTotalInteger,
    garage: l.GarageSpaces,
    acres: l.LotSizeAcres,
    sqft: l.LivingArea ?? l.AboveGradeFinishedArea,
    type: l.PropertyType,
    remarks: l.PublicRemarks?.slice(0, 250),
  };
}

const SYSTEM_PROMPT = `You are an expert Northern Colorado real estate search assistant for 970.re, the website of Rich Kopcho — a broker with 50 years of NoCo experience.

${NOCO_GEOGRAPHY}

You have two tools:

1. **search_listings** — fresh MLS search. Use for new queries or when starting fresh.
2. **refine_results** — filter the currently shown listings by returning a subset of their ListingKeys.

CRITICAL RULES — follow these exactly:
- ALWAYS call a tool on every turn. Never respond with only text. Never ask the user for information.
- If there are prior search results in the conversation history, use **refine_results** to filter them. The listing data (address, price, beds, baths, acres, garage, sqft, type, remarks) is already in the conversation — use it.
- If there are NO prior results in the conversation, use **search_listings**.
- Never ask clarifying questions. Make your best guess and call the tool.
- After the tool result, write a 2-3 sentence summary of what was found or refined.
- If refine_results returns 0 matches, explain why and suggest loosening the criteria.

Tool selection guide:
- "now only the ones with…" → refine_results
- "narrow it to…" / "just the…" / "under $X" / "at least N acres" → refine_results (if prior results exist)
- "search for…" / "find me…" / "show me…" (no prior results) → search_listings
- "start over" / "different criteria" → search_listings

Parameter shortcuts:
- "Along I-25" = Loveland, Berthoud, Johnstown, Windsor, Fort Collins, Wellington, Timnath
- "3 car garage" = minGarageSpaces: 3
- "5 acres" = minAcres: 5`;

export async function POST(req: NextRequest) {
  try {
    const { query, messages: priorMessages } = await req.json() as {
      query: string;
      messages?: Anthropic.MessageParam[];
    };

    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Start MLS fetch immediately — runs in parallel with Claude's first response
    const mlsPromise = fetchMLSListings({ status: "Active", withMedia: true, top: 200 });

    // Build message history: prior turns + new user query
    const messages: Anthropic.MessageParam[] = [
      ...(priorMessages ?? []),
      { role: "user", content: query },
    ];

    let searchResults: MLSListing[] = [];
    let isRefinement = false;

    let response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });

    while (response.stop_reason === "tool_use") {
      const toolUse = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      if (!toolUse) break;

      messages.push({ role: "assistant", content: response.content });

      if (toolUse.name === "search_listings") {
        searchResults = await executeSearch(toolUse.input as SearchParams, mlsPromise);
        isRefinement = false;
      } else if (toolUse.name === "refine_results") {
        const keepKeys = new Set((toolUse.input as { keep_keys: string[] }).keep_keys);
        const allListings = await mlsPromise;
        const nocoListings = allListings.filter((l) => NOCO_CITIES.includes(l.City));
        searchResults = nocoListings.filter((l) => keepKeys.has(l.ListingKey));
        isRefinement = true;
      } else {
        break;
      }

      // Send results back to Claude — include full summaries for future refinement
      messages.push({
        role: "user",
        content: [{
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: JSON.stringify({
            count: searchResults.length,
            listings: searchResults.map(listingSummary),
          }),
        }],
      });

      response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
      });
    }

    // Append Claude's final text response to history
    messages.push({ role: "assistant", content: response.content });

    const summary = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text).join(" ").trim();

    return NextResponse.json(
      { listings: searchResults, total: searchResults.length, summary, messages, isRefinement },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("AI search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

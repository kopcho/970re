import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchMLSListings, NOCO_CITIES, MLSListing } from "@/lib/mls";
import { NOCO_GEOGRAPHY } from "@/lib/corridors";

const client = new Anthropic();

// Tool Claude uses to search MLS listings
const SEARCH_TOOL: Anthropic.Tool = {
  name: "search_listings",
  description:
    "Search Northern Colorado MLS listings. Call this with structured params parsed from the user's natural language query.",
  input_schema: {
    type: "object",
    properties: {
      cities: {
        type: "array",
        items: { type: "string" },
        description:
          "List of NoCo city names to search. Omit to search all NoCo cities. Use corridor knowledge to expand 'along I-25' into specific cities.",
      },
      minBeds: { type: "number", description: "Minimum number of bedrooms" },
      maxBeds: { type: "number", description: "Maximum number of bedrooms" },
      minBaths: { type: "number", description: "Minimum bathrooms (integer)" },
      minPrice: { type: "number", description: "Minimum list price in dollars" },
      maxPrice: { type: "number", description: "Maximum list price in dollars" },
      minAcres: { type: "number", description: "Minimum lot size in acres" },
      maxAcres: { type: "number", description: "Maximum lot size in acres" },
      minGarageSpaces: { type: "number", description: "Minimum garage spaces (e.g. 3 for '3 car garage')" },
      propertyType: {
        type: "string",
        enum: ["Residential", "Commercial", "Land", "Multi-Family"],
        description: "Property type filter",
      },
      keywords: {
        type: "string",
        description:
          "Keywords to match against PublicRemarks (e.g. 'shop barn workshop storage RV'). Comma-separated.",
      },
      status: {
        type: "string",
        enum: ["Active", "Pending", "Closed"],
        description: "Listing status. Default: Active",
      },
    },
  },
};

interface SearchParams {
  cities?: string[];
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  minPrice?: number;
  maxPrice?: number;
  minAcres?: number;
  maxAcres?: number;
  minGarageSpaces?: number;
  propertyType?: string;
  keywords?: string;
  status?: string;
}

async function executeSearch(params: SearchParams): Promise<MLSListing[]> {
  const status = params.status || "Active";
  const all = await fetchMLSListings({ status, withMedia: true, top: 200 });

  // City filter
  let filtered: MLSListing[];
  if (params.cities && params.cities.length > 0) {
    filtered = all.filter((l) => params.cities!.includes(l.City));
  } else {
    filtered = all.filter((l) => NOCO_CITIES.includes(l.City));
  }

  // Numeric filters
  if (params.minBeds) filtered = filtered.filter((l) => (l.BedroomsTotal ?? 0) >= params.minBeds!);
  if (params.maxBeds) filtered = filtered.filter((l) => (l.BedroomsTotal ?? 999) <= params.maxBeds!);
  if (params.minBaths) filtered = filtered.filter((l) => (l.BathroomsTotalInteger ?? 0) >= params.minBaths!);
  if (params.minPrice) filtered = filtered.filter((l) => l.ListPrice >= params.minPrice!);
  if (params.maxPrice) filtered = filtered.filter((l) => l.ListPrice <= params.maxPrice!);
  if (params.minAcres) filtered = filtered.filter((l) => (l.LotSizeAcres ?? 0) >= params.minAcres!);
  if (params.maxAcres) filtered = filtered.filter((l) => (l.LotSizeAcres ?? 9999) <= params.maxAcres!);
  if (params.minGarageSpaces) filtered = filtered.filter((l) => (l.GarageSpaces ?? 0) >= params.minGarageSpaces!);
  if (params.propertyType) filtered = filtered.filter((l) => l.PropertyType === params.propertyType);

  // Keyword search in PublicRemarks
  if (params.keywords) {
    const kws = params.keywords.toLowerCase().split(/[,\s]+/).filter(Boolean);
    filtered = filtered.filter((l) => {
      const remarks = (l.PublicRemarks ?? "").toLowerCase();
      return kws.some((kw) => remarks.includes(kw));
    });
  }

  return filtered.sort((a, b) => b.ListPrice - a.ListPrice);
}

const SYSTEM_PROMPT = `You are an expert Northern Colorado real estate search assistant for 970.re, the website of Rich Kopcho, a broker with 50 years of NoCo experience.

${NOCO_GEOGRAPHY}

Your job:
1. Parse the user's natural language real estate query
2. Call search_listings with the appropriate structured parameters
3. After receiving results, write a concise, friendly response (2-3 sentences) summarizing what you found and any caveats (e.g., "The demo feed has limited listings" or "No results matched all criteria — here are the closest matches")

Important notes:
- "Along I-25" = Loveland, Berthoud, Johnstown, Windsor, Fort Collins, Wellington, Timnath
- "3 car garage" = minGarageSpaces: 3
- "5 acres" = minAcres: 5
- Repo/storage/automotive uses = look for large lots, garage spaces, commercial or residential with acreage
- Always call the search tool — never make up listing data
- Keep your summary response short (2-3 sentences max)`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    let searchResults: MLSListing[] = [];
    let searchParams: SearchParams = {};

    // Step 1: Ask Claude to parse the query and call the tool
    const messages: Anthropic.MessageParam[] = [
      { role: "user", content: query },
    ];

    let response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools: [SEARCH_TOOL],
      messages,
    });

    // Step 2: Execute the tool call Claude made
    while (response.stop_reason === "tool_use") {
      const toolUse = response.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      if (!toolUse || toolUse.name !== "search_listings") break;

      searchParams = toolUse.input as SearchParams;
      searchResults = await executeSearch(searchParams);

      // Give Claude the results so it can write the summary
      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: JSON.stringify({
              count: searchResults.length,
              listings: searchResults.slice(0, 12).map((l) => ({
                ListingKey: l.ListingKey,
                address: `${l.UnparsedAddress}, ${l.City}`,
                price: l.ListPrice,
                beds: l.BedroomsTotal,
                baths: l.BathroomsTotalInteger,
                garage: l.GarageSpaces,
                acres: l.LotSizeAcres,
                type: l.PropertyType,
                remarks: l.PublicRemarks?.slice(0, 150),
              })),
            }),
          },
        ],
      });

      response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: SYSTEM_PROMPT,
        tools: [SEARCH_TOOL],
        messages,
      });
    }

    // Extract Claude's text summary
    const summary = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join(" ")
      .trim();

    return NextResponse.json(
      {
        listings: searchResults.slice(0, 12),
        total: searchResults.length,
        summary,
        params: searchParams,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("AI search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

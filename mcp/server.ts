#!/usr/bin/env node
/**
 * 970.re MCP Server
 * Exposes Northern Colorado MLS search tools for use with Claude (claude.ai, Claude Code, etc.)
 *
 * Usage (stdio — for Claude Desktop / Claude Code):
 *   node dist/server.js
 *
 * Configure in claude_desktop_config.json:
 *   {
 *     "mcpServers": {
 *       "970re-mls": {
 *         "command": "node",
 *         "args": ["/path/to/970re/mcp/dist/server.js"],
 *         "env": { "MLS_GRID_API_KEY": "your-key-here" }
 *       }
 *     }
 *   }
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const MLS_BASE = "https://api-demo.mlsgrid.com/v2";
const MLS_KEY = process.env.MLS_GRID_API_KEY ?? "";

const NOCO_CITIES = [
  "Fort Collins", "Loveland", "Berthoud", "Timnath", "Wellington",
  "Windsor", "Johnstown", "Greeley", "Evans", "Longmont",
  "Frederick", "Firestone", "Mead", "Estes Park",
];

const CORRIDORS: Record<string, string[]> = {
  "i-25": ["Loveland", "Berthoud", "Johnstown", "Windsor", "Fort Collins", "Wellington", "Timnath"],
  "i25": ["Loveland", "Berthoud", "Johnstown", "Windsor", "Fort Collins", "Wellington", "Timnath"],
  "us-34": ["Loveland", "Johnstown", "Windsor", "Greeley", "Evans"],
  "front range": ["Fort Collins", "Loveland", "Berthoud", "Timnath", "Windsor", "Wellington", "Johnstown", "Greeley"],
  "loveland area": ["Loveland", "Berthoud", "Johnstown", "Windsor"],
  "fort collins area": ["Fort Collins", "Timnath", "Windsor", "Wellington"],
  "greeley area": ["Greeley", "Evans", "Windsor", "Johnstown", "Frederick", "Firestone"],
};

const SELECT_FIELDS = [
  "ListingKey", "ListPrice", "UnparsedAddress", "City", "StateOrProvince",
  "PostalCode", "BedroomsTotal", "BathroomsTotalInteger", "LivingArea",
  "AboveGradeFinishedArea", "LotSizeAcres", "GarageSpaces", "PropertyType",
  "PublicRemarks", "StandardStatus", "PhotosCount",
].join(",");

interface Listing {
  ListingKey: string;
  ListPrice: number;
  UnparsedAddress: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  BedroomsTotal?: number;
  BathroomsTotalInteger?: number;
  LivingArea?: number;
  AboveGradeFinishedArea?: number;
  LotSizeAcres?: number;
  GarageSpaces?: number;
  PropertyType?: string;
  PublicRemarks?: string;
  StandardStatus: string;
  PhotosCount?: number;
  Media?: Array<{ MediaURL: string; Order?: number }>;
}

async function fetchListings(status = "Active"): Promise<Listing[]> {
  const params = new URLSearchParams({
    $top: "200",
    $filter: `MlgCanView eq true and StandardStatus eq '${status}'`,
    $select: SELECT_FIELDS,
    $expand: "Media",
  });
  const res = await fetch(`${MLS_BASE}/Property?${params}`, {
    headers: { Authorization: `Bearer ${MLS_KEY}`, "Accept-Encoding": "gzip" },
  });
  if (!res.ok) throw new Error(`MLS API error: ${res.status}`);
  const data = await res.json();
  return (data.value ?? []) as Listing[];
}

function formatListing(l: Listing): string {
  const photo = l.Media?.sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999))[0]?.MediaURL;
  const sqft = l.LivingArea ?? l.AboveGradeFinishedArea;
  const lines = [
    `**${l.UnparsedAddress}, ${l.City}, CO ${l.PostalCode}**`,
    `Price: $${l.ListPrice.toLocaleString()} | Status: ${l.StandardStatus}`,
    [
      l.BedroomsTotal != null && `${l.BedroomsTotal} bed`,
      l.BathroomsTotalInteger != null && `${l.BathroomsTotalInteger} bath`,
      sqft && `${sqft.toLocaleString()} sqft`,
      l.LotSizeAcres && `${l.LotSizeAcres} acres`,
      l.GarageSpaces && `${l.GarageSpaces}-car garage`,
    ].filter(Boolean).join(" · "),
    l.PropertyType && `Type: ${l.PropertyType}`,
    l.PublicRemarks && `Remarks: ${l.PublicRemarks.slice(0, 200)}…`,
    photo && `Photo: ${photo}`,
    `MLS Key: ${l.ListingKey}`,
  ].filter(Boolean).join("\n");
  return lines;
}

// Tool: search_listings
async function toolSearchListings(input: Record<string, unknown>): Promise<string> {
  const {
    cities, minBeds, maxBeds, minBaths, minPrice, maxPrice,
    minAcres, maxAcres, minGarageSpaces, propertyType, keywords, status,
  } = input as {
    cities?: string[];
    minBeds?: number; maxBeds?: number; minBaths?: number;
    minPrice?: number; maxPrice?: number;
    minAcres?: number; maxAcres?: number;
    minGarageSpaces?: number;
    propertyType?: string;
    keywords?: string;
    status?: string;
  };

  let all = await fetchListings(status ?? "Active");

  // City filter — check corridors first
  let cityList = cities;
  if (!cityList || cityList.length === 0) {
    cityList = NOCO_CITIES;
  }
  let filtered = all.filter((l) => cityList!.includes(l.City));

  if (minBeds) filtered = filtered.filter((l) => (l.BedroomsTotal ?? 0) >= minBeds);
  if (maxBeds) filtered = filtered.filter((l) => (l.BedroomsTotal ?? 999) <= maxBeds);
  if (minBaths) filtered = filtered.filter((l) => (l.BathroomsTotalInteger ?? 0) >= minBaths);
  if (minPrice) filtered = filtered.filter((l) => l.ListPrice >= minPrice);
  if (maxPrice) filtered = filtered.filter((l) => l.ListPrice <= maxPrice);
  if (minAcres) filtered = filtered.filter((l) => (l.LotSizeAcres ?? 0) >= minAcres);
  if (maxAcres) filtered = filtered.filter((l) => (l.LotSizeAcres ?? 9999) <= maxAcres);
  if (minGarageSpaces) filtered = filtered.filter((l) => (l.GarageSpaces ?? 0) >= minGarageSpaces);
  if (propertyType) filtered = filtered.filter((l) => l.PropertyType === propertyType);

  if (keywords) {
    const kws = keywords.toLowerCase().split(/[,\s]+/).filter(Boolean);
    filtered = filtered.filter((l) => {
      const text = (l.PublicRemarks ?? "").toLowerCase();
      return kws.some((kw) => text.includes(kw));
    });
  }

  filtered.sort((a, b) => b.ListPrice - a.ListPrice);

  if (filtered.length === 0) {
    return "No listings found matching the given criteria. Try relaxing some filters.";
  }

  const top = filtered.slice(0, 10);
  return [
    `Found ${filtered.length} listing(s). Showing top ${top.length}:\n`,
    ...top.map((l, i) => `--- Listing ${i + 1} ---\n${formatListing(l)}`),
  ].join("\n\n");
}

// Tool: get_corridor_cities
function toolGetCorridorCities(input: Record<string, unknown>): string {
  const { corridor } = input as { corridor: string };
  const lower = corridor.toLowerCase();
  for (const [key, cities] of Object.entries(CORRIDORS)) {
    if (lower.includes(key)) {
      return `Cities along "${corridor}": ${cities.join(", ")}`;
    }
  }
  return `Unknown corridor "${corridor}". Known corridors: ${Object.keys(CORRIDORS).join(", ")}. All NoCo cities: ${NOCO_CITIES.join(", ")}`;
}

// Tool: get_listing_details
async function toolGetListingDetails(input: Record<string, unknown>): Promise<string> {
  const { listingKey } = input as { listingKey: string };
  const params = new URLSearchParams({
    $filter: `MlgCanView eq true and ListingId eq '${listingKey}'`,
    $top: "1",
    $expand: "Media",
  });
  const res = await fetch(`${MLS_BASE}/Property?${params}`, {
    headers: { Authorization: `Bearer ${MLS_KEY}`, "Accept-Encoding": "gzip" },
  });
  if (!res.ok) return `Error fetching listing: ${res.status}`;
  const data = await res.json();
  const listing = data.value?.[0];
  if (!listing) return `No listing found with key: ${listingKey}`;
  return formatListing(listing as Listing);
}

// Set up the MCP server
const server = new Server(
  { name: "970re-mls", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_listings",
      description:
        "Search Northern Colorado MLS listings. Parse the user's natural language query into structured parameters. Understands corridors, acreage, garage spaces, property types, and keyword matching against listing remarks.",
      inputSchema: {
        type: "object",
        properties: {
          cities: {
            type: "array",
            items: { type: "string" },
            description: "Specific NoCo city names to search. Omit to search all NoCo.",
          },
          minBeds: { type: "number", description: "Minimum bedrooms" },
          maxBeds: { type: "number", description: "Maximum bedrooms" },
          minBaths: { type: "number", description: "Minimum bathrooms" },
          minPrice: { type: "number", description: "Minimum price in dollars" },
          maxPrice: { type: "number", description: "Maximum price in dollars" },
          minAcres: { type: "number", description: "Minimum lot size in acres" },
          maxAcres: { type: "number", description: "Maximum lot size in acres" },
          minGarageSpaces: { type: "number", description: "Minimum garage spaces" },
          propertyType: {
            type: "string",
            enum: ["Residential", "Commercial", "Land", "Multi-Family"],
            description: "Property type filter",
          },
          keywords: {
            type: "string",
            description: "Comma-separated keywords to match in listing remarks (e.g. 'shop,barn,workshop,storage')",
          },
          status: {
            type: "string",
            enum: ["Active", "Pending", "Closed"],
            description: "Listing status (default: Active)",
          },
        },
      },
    },
    {
      name: "get_corridor_cities",
      description:
        "Resolve a geographic corridor (e.g. 'I-25', 'US-34', 'front range') to a list of Northern Colorado cities. Use this before search_listings when the user mentions a highway or corridor.",
      inputSchema: {
        type: "object",
        required: ["corridor"],
        properties: {
          corridor: { type: "string", description: "Corridor name (e.g. 'I-25', 'front range')" },
        },
      },
    },
    {
      name: "get_listing_details",
      description: "Get full details for a specific MLS listing by ListingKey.",
      inputSchema: {
        type: "object",
        required: ["listingKey"],
        properties: {
          listingKey: { type: "string", description: "The MLS ListingKey (e.g. IRE1234567)" },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    let result: string;
    if (name === "search_listings") result = await toolSearchListings(args ?? {});
    else if (name === "get_corridor_cities") result = toolGetCorridorCities(args ?? {});
    else if (name === "get_listing_details") result = await toolGetListingDetails(args ?? {});
    else result = `Unknown tool: ${name}`;
    return { content: [{ type: "text", text: result }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${String(err)}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("970.re MLS MCP server running (stdio)");

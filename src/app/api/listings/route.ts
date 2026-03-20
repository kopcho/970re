import { NextRequest, NextResponse } from "next/server";
import { fetchMLSListings, NOCO_CITIES, MLSListing } from "@/lib/mls";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const city = searchParams.get("city") || "";
    const minPrice = parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = parseInt(searchParams.get("maxPrice") || "0");
    const minBeds = parseInt(searchParams.get("minBeds") || "0");
    const status = searchParams.get("status") || "Active";
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = 12;

    const allListings = await fetchMLSListings({ status, withMedia: true, top: 200 });

    // Filter to NoCo cities by default, or specific city
    let filtered: MLSListing[];
    if (city && city !== "all") {
      filtered = allListings.filter((l) => l.City === city);
    } else {
      filtered = allListings.filter((l) => NOCO_CITIES.includes(l.City));
    }

    // Apply price filters
    if (minPrice > 0) filtered = filtered.filter((l) => l.ListPrice >= minPrice);
    if (maxPrice > 0) filtered = filtered.filter((l) => l.ListPrice <= maxPrice);

    // Apply beds filter
    if (minBeds > 0) filtered = filtered.filter((l) => (l.BedroomsTotal ?? 0) >= minBeds);

    // Sort by price descending by default
    filtered.sort((a, b) => b.ListPrice - a.ListPrice);

    const total = filtered.length;
    const start = (page - 1) * perPage;
    const listings = filtered.slice(start, start + perPage);

    return NextResponse.json(
      { listings, total, page, perPage, pages: Math.ceil(total / perPage) },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } }
    );
  } catch (err) {
    console.error("Listings API error:", err);
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 });
  }
}

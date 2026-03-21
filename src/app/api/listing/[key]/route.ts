import { NextRequest, NextResponse } from "next/server";
import { fetchListingByKey } from "@/lib/mls";

export async function GET(
  _req: NextRequest,
  { params }: { params: { key: string } }
) {
  const listing = await fetchListingByKey(params.key);
  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(listing, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}

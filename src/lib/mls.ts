export interface MLSMedia {
  MediaURL: string;
  Order: number;
  LongDescription?: string;
}

export interface MLSListing {
  ListingKey: string;
  ListPrice: number;
  UnparsedAddress: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  LivingArea?: number;
  AboveGradeFinishedArea?: number;
  LotSizeAcres?: number;
  GarageSpaces?: number;
  PropertyType?: string;
  PublicRemarks?: string;
  StandardStatus: "Active" | "Pending" | "Closed" | "Expired";
  PhotosCount?: number;
  Media?: MLSMedia[];
}

export interface ListingsResponse {
  listings: MLSListing[];
  total: number;
}

const MLS_BASE = "https://api-demo.mlsgrid.com/v2";
const MLS_KEY = process.env.MLS_GRID_API_KEY!;

const SELECT_FIELDS = [
  "ListingKey",
  "ListPrice",
  "UnparsedAddress",
  "City",
  "StateOrProvince",
  "PostalCode",
  "BedroomsTotal",
  "BathroomsTotalInteger",
  "LivingArea",
  "AboveGradeFinishedArea",
  "LotSizeAcres",
  "GarageSpaces",
  "PropertyType",
  "PublicRemarks",
  "StandardStatus",
  "PhotosCount",
].join(",");

export const NOCO_CITIES = [
  "Fort Collins",
  "Loveland",
  "Berthoud",
  "Timnath",
  "Wellington",
  "Windsor",
  "Johnstown",
  "Greeley",
  "Evans",
  "Longmont",
  "Frederick",
  "Firestone",
  "Mead",
];

export async function fetchMLSListings(options: {
  status?: string;
  withMedia?: boolean;
  top?: number;
  skip?: number;
}): Promise<MLSListing[]> {
  const { status = "Active", withMedia = true, top = 200, skip = 0 } = options;

  const params = new URLSearchParams({
    $top: String(top),
    $skip: String(skip),
    $filter: `MlgCanView eq true and StandardStatus eq '${status}'`,
    $select: SELECT_FIELDS,
    ...(withMedia ? { $expand: "Media" } : {}),
  });

  const url = `${MLS_BASE}/Property?${params}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${MLS_KEY}`,
      "Accept-Encoding": "gzip",
    },
    next: { revalidate: 300 }, // cache 5 minutes
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MLS Grid API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return (data.value ?? []) as MLSListing[];
}

export function getListingPhoto(listing: MLSListing): string | null {
  if (!listing.Media?.length) return null;
  const sorted = [...listing.Media].sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999));
  return sorted[0]?.MediaURL ?? null;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatSqft(sqft?: number): string {
  if (!sqft) return "—";
  return new Intl.NumberFormat("en-US").format(Math.round(sqft));
}

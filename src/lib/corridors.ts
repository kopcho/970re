/**
 * NoCo geographic corridors for natural language search.
 * Used by AI to map "along I-25" → specific city lists.
 */

export const CORRIDORS: Record<string, { cities: string[]; description: string }> = {
  "i-25": {
    description: "I-25 Front Range corridor through Northern Colorado",
    cities: ["Loveland", "Berthoud", "Johnstown", "Windsor", "Fort Collins", "Wellington", "Timnath"],
  },
  "i25": {
    description: "I-25 Front Range corridor through Northern Colorado",
    cities: ["Loveland", "Berthoud", "Johnstown", "Windsor", "Fort Collins", "Wellington", "Timnath"],
  },
  "us-34": {
    description: "US-34 corridor from Loveland east to Greeley",
    cities: ["Loveland", "Johnstown", "Windsor", "Greeley", "Evans"],
  },
  "us-287": {
    description: "US-287 corridor — Loveland to Fort Collins",
    cities: ["Loveland", "Fort Collins"],
  },
  "front range": {
    description: "Full Northern Colorado Front Range",
    cities: ["Fort Collins", "Loveland", "Berthoud", "Timnath", "Windsor", "Wellington", "Johnstown", "Greeley"],
  },
  "loveland area": {
    description: "Greater Loveland and nearby communities",
    cities: ["Loveland", "Berthoud", "Johnstown", "Windsor"],
  },
  "fort collins area": {
    description: "Greater Fort Collins and nearby communities",
    cities: ["Fort Collins", "Timnath", "Windsor", "Wellington"],
  },
  "greeley area": {
    description: "Greater Greeley — Weld County",
    cities: ["Greeley", "Evans", "Windsor", "Johnstown", "Frederick", "Firestone"],
  },
  "longmont area": {
    description: "Greater Longmont — southern Larimer / Boulder County",
    cities: ["Longmont", "Berthoud", "Mead"],
  },
};

/** Normalize a query to find matching corridor cities */
export function getCorridorCities(query: string): string[] | null {
  const lower = query.toLowerCase();
  for (const [key, corridor] of Object.entries(CORRIDORS)) {
    if (lower.includes(key)) {
      return corridor.cities;
    }
  }
  return null;
}

/** All NoCo cities Claude should know about */
export const NOCO_GEOGRAPHY = `
Northern Colorado (the "970") includes these communities:

**Larimer County:**
- Fort Collins (largest city, CSU, Old Town)
- Loveland (sculpture capital, Lake Loveland, manufacturing hub)
- Berthoud (small town, US-287 corridor)
- Timnath (fast-growing suburb east of Fort Collins)
- Wellington (north of Fort Collins, rural character)
- Estes Park (gateway to Rocky Mountain National Park — tourist, vacation)

**Weld County:**
- Windsor (fast-growing, shared by Larimer/Weld, near I-25)
- Johnstown (I-25 at US-34, growing industrial + residential)
- Greeley (UNC, larger city, ag processing)
- Evans (south Greeley)
- Frederick / Firestone / Mead (southern Weld, fast-growing)
- Longmont (Boulder County / Weld boundary, tech + ag)

**Major corridors:**
- I-25: runs N-S through Berthoud → Johnstown → Loveland → Fort Collins → Wellington
- US-34: runs E-W from Loveland → Johnstown → Windsor → Greeley
- US-287: Loveland → Fort Collins
`;

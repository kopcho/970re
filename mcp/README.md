# 970.re MLS MCP Server

MCP server that exposes Northern Colorado MLS search tools so Claude can answer real estate queries in plain English.

## Tools

| Tool | What it does |
|------|-------------|
| `search_listings` | Search NoCo MLS by beds, baths, price, acres, garage spaces, city, corridor, keywords |
| `get_corridor_cities` | Resolve "along I-25" → specific city list |
| `get_listing_details` | Full details for a specific listing by key |

## Setup

```bash
cd mcp
npm install
npm run build
```

## Claude Desktop (local)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "970re-mls": {
      "command": "node",
      "args": ["C:/Users/rich/projects/970re/mcp/dist/server.js"],
      "env": {
        "MLS_GRID_API_KEY": "0472adbcfc29a4151216981e6355544ebd24a9cf"
      }
    }
  }
}
```

## Claude Code (global)

```bash
claude mcp add 970re-mls node C:/Users/rich/projects/970re/mcp/dist/server.js --env MLS_GRID_API_KEY=0472adbcfc29a4151216981e6355544ebd24a9cf
```

## Example queries (once connected to Claude)

```
Find me a 3bd 2ba with a 3-car garage and 5 acres along I-25

Show active listings in Fort Collins under $500K with 4+ bedrooms

Find commercial or large-lot properties near Loveland suitable for vehicle storage

What's available in Timnath right now?
```

## Production

When the full IRES MLS subscription activates, change `api-demo.mlsgrid.com` to `api.mlsgrid.com` in `server.ts` and rebuild.

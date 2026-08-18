---
layout: default
title: "MCP Server Governance (Deep Dive)"
nav_order: 4
permalink: /sections/mcp-governance/
---

# MCP Server Governance (Deep Dive)

Doc: [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/mcp-management)

### a. Master switch
"MCP servers in Copilot" policy must be **Enabled everywhere** (enterprise or org) or no MCP servers run at all — under AI controls → **MCP**.

### b. Allowlist/denylist via managed-settings (recommended)
Doc: [Configuring an MCP server allowlist for your enterprise](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist)

```json
{
  "allowedMcpServers": [
    { "serverUrl": "https://api.githubcopilot.com/*" },
    { "serverCommand": ["npx", "@playwright/mcp@latest"] }
  ],
  "deniedMcpServers": [
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "/"] }
  ]
}
```

**Evaluation order:**
1. Always allow built-in default servers (e.g. built-in GitHub MCP server).
2. Block anything matching `deniedMcpServers`.
3. If `allowedMcpServers` exists, block anything not matched.
4. Block if URL/command has an unresolved variable (`${VAR}`) — can't be verified.

If multiple `managed-settings.json` sources apply, all settings apply cumulatively (deny from anywhere blocks; allow must match at every layer that defines one).

### c. MCP Registry (public preview — NOT the recommended method)
Doc: [Restrict MCP server access to a custom registry](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/restrict-based-on-registry)

- Host your own v0.1-spec MCP registry, or use **Azure API Center** as backing store.
- Enterprise/org config: AI controls → MCP → set **MCP Registry URL**, then **Restrict MCP access to registry servers**: *Allow all* vs *Registry only*.
- **Limitation:** enforcement matches by server name/ID only — bypassable by editing local config. **Not supported for cloud agent at all.** Prefer the managed-settings allowlist (3b) for anything that must be airtight.

### d. Comparison

| | `managed-settings.json` allowlist | Custom registry |
|---|---|---|
| Status | GA | Public preview |
| Matching | URL / stdio command / name — secure | Name/ID only — bypassable |
| Cloud agent support | Yes | No |

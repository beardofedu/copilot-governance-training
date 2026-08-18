---
layout: default
title: "`managed-settings.json` — The Core Enterprise Lockdown File"
nav_order: 3
permalink: /sections/managed-settings/
---

# `managed-settings.json` — The Core Enterprise Lockdown File

Doc: [Enterprise managed settings reference](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings) | [Configuring enterprise-managed settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-managed-settings)

### Precedence
1. MDM-managed settings
2. Server-managed settings
3. File-based settings
4. User-level settings

Exception: in Copilot CLI, the `sandbox` key doesn't follow precedence — MDM, server, file, and user sandbox restrictions **combine in the most-restrictive direction** (only ever tightens).

### Supported keys

| Key | Purpose | CLI | VS Code | Copilot app | Cloud agent | JetBrains |
|---|---|---|---|---|---|---|
| `strictKnownMarketplaces` | Lock plugin installs to explicitly listed marketplaces only (empty array = full lockdown) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `extraKnownMarketplaces` | Add enterprise-approved marketplaces | ✅ | ✅ | ✅ | ✅ | ✅ |
| `enabledPlugins` | Enable/disable specific plugins by `PLUGIN@MARKETPLACE` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `allowedMcpServers` | Allowlist MCP servers (URL/command match); unmatched = blocked | ✅ | ✅ | ✅ | ❌* | ✅ |
| `deniedMcpServers` | Hard-block matching MCP servers, always wins over allow | ✅ | ✅ | ✅ | ✅ | ✅ |
| `permissions.disableBypassPermissionsMode` | Disable "YOLO"/bypass-all-approvals mode | ✅ | ✅ | ✅ | ❌ | ✅ |
| `permissions.model` | Force "auto" model selection default | ✅ | ✅ | ✅ | ✅ | ❌ |
| `sandbox` | Minimum sandbox: command exec, filesystem/network access, credentials, local MCP/LSP servers (CLI only; cumulative-restrictive) | ✅ | ❌ | ❌ | ❌ | ❌ |
| `telemetry` | Route usage data to your own OpenTelemetry collector | ✅ | ✅ | ❌ | ❌ | ✅ |
| `remoteControl` | Restrict remote control of CLI sessions on this device by SSO org authorization | ✅ | ✅ | ❌ | ❌ | ❌ |

*Cloud agent for `allowedMcpServers`: supported via managed-settings, but **not** supported for MCP *private registry* enforcement (see 3c).

### Deployment methods
- **Server-managed (recommended, GA):** `copilot/managed-settings.json` in a `.github-private` repo. Only method that reaches **cloud agent**. Propagates in ~1 hr; client restart forces refresh.
- **MDM-managed:** Windows registry (`HKLM\SOFTWARE\Policies\GitHubCopilot`) or macOS managed preferences (`com.github.copilot`). Local clients only, not cloud agent.
- **File-based:** OS-specific JSON path (macOS `/Library/Application Support/GitHubCopilot/managed-settings.json`, Windows `%ProgramFiles%\GitHubCopilot\`, Linux `/etc/github-copilot/`). Local clients only. On macOS/Linux, CLI requires root ownership, no group/world-write, not a symlink — else rejected outright.

### Team overrides
`copilot/team-mappings.json` + `copilot/teams/*` let enterprise teams get different values for keys explicitly marked `{ "overridable": true }` in the base file. Only `permissions.model`, `permissions.disableBypassPermissionsMode`, `allowedMcpServers`, `deniedMcpServers` are override-eligible; `enabledPlugins`/`extraKnownMarketplaces` are additive-only for teams. Multi-team users get the least-restrictive combination of team values, still capped by the enterprise baseline.

### Malformed/unreachable policy behavior (fail-safe)
- Malformed JSON → treated as an **empty allowlist** (blocks all non-built-in MCP servers).
- If a policy layer can't be fetched, the client **retains the last enforced policy** — effective policy can only get *more* restrictive over time, never less.

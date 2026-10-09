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

Exception: in Copilot CLI, VS Code Agent Host sessions, and the Copilot app, the `sandbox` key doesn't follow precedence — MDM, server, file, and user sandbox restrictions **combine in the most-restrictive direction** (only ever tightens).

### Supported keys

| Key | Purpose | CLI | VS Code | Copilot app | Cloud agent | JetBrains |
|---|---|---|---|---|---|---|
| `strictKnownMarketplaces` | Lock plugin installs to explicitly listed marketplaces only (empty array = full lockdown) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `extraKnownMarketplaces` | Add enterprise-approved marketplaces | ✅ | ✅ | ✅ | ✅ | ✅ |
| `enabledPlugins` | Enable/disable specific plugins by `PLUGIN@MARKETPLACE` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `allowedMcpServers` | Allowlist MCP servers (URL/command match); unmatched = blocked | ✅ | ✅ | ✅ | ❌ | ✅ |
| `deniedMcpServers` | Hard-block matching MCP servers, always wins over allow | ✅ | ✅ | ✅ | ✅ | ✅ |
| `permissions.disableBypassPermissionsMode` | Disable "YOLO"/bypass-all-approvals mode | ✅ | ✅ | ✅ | ❌ | ✅ |
| `permissions.deny` | Block specific operations | ✅ | ❌ | ✅ | ❌ | ❌ |
| `permissions.ask` | Require fresh approval for specific operations | ✅ | ❌ | ✅ | ❌ | ❌ |
| `permissions.allow` | Permit specific operations without a prompt | ✅ | ❌ | ✅ | ❌ | ❌ |
| `model` | Set the default model for new conversations | ✅ | ✅ | ✅ | ✅ | ❌ |
| `autoTier` | Default Auto routing tier when `model` is `"auto"`: `efficiency`, `balance`, `intelligence`, `unmanaged` (most→least restrictive); needs CLI 1.0.87-0+ / VS Code 1.140.0+ ([source](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#autotier)) | ✅ | ✅ | ❌ | ❌ | ❌ |
| `sandbox` | Minimum sandbox: command exec, filesystem/network access, credentials, local MCP/LSP servers (cumulative-restrictive) | ✅ | ✅ (Agent Host sessions, VS Code 1.138.0+) | ✅ (public preview) | ❌ | ❌ |
| `telemetry` | Route usage data to your own OpenTelemetry collector | ✅ | ✅ | ❌ | ❌ | ✅ |
| `remoteControl` | Restrict remote control of CLI sessions on this device by SSO org authorization | ✅ | ✅ | ❌ | ❌ | ❌ |

`permissions.model` is a legacy fallback only; use the top-level `model` key in new configurations.

### Granular operation permissions

`permissions.deny`, `permissions.ask`, and `permissions.allow` use **deny > ask > allow** precedence. Once any managed source defines a rule (or an `allow` list), unmatched supported operations require approval. Managed `ask` rules require fresh one-time approval and cannot be satisfied by bypass mode or a prior grant; managed allowlists intersect across sources.

Rules use `Shell(...)` (or compatibility alias `Bash(...)`) for commands, `Read(...)` for read/view paths, `Edit(...)`/`Write(...)` for write paths, and `Domain(...)` for network origins. Path selectors support globs and `//` filesystem, `/` workspace, `~/` home, and `./` current-directory roots. For example:

```json
{
  "permissions": {
    "deny": ["Shell(rm -rf *)", "Read(~/.ssh/**)", "Edit(//etc/**)"],
    "ask": ["Shell(git push *)", "Domain(api.github.com)"],
    "allow": ["Shell(npm test *)", "Read(/src/**)"]
  }
}
```

### Remote control

`remoteControl` governs sessions hosted on the managed device only. Set `mode` to `"disabled"` to block remote control, `"enabled"` to permit it unrestricted, or `"requireSSO"` to require the controlling client to be SSO-authorized for every listed organization:

```json
{
  "remoteControl": {
    "mode": "requireSSO",
    "githubDotComOrganizations": ["ORG-NAME"]
  }
}
```

### `sandbox` sub-properties
Doc: [Enterprise managed settings reference — `sandbox`](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)

`sandbox` restricts rather than defaults: force-on flags require `true` to enforce (`false`/omitted leaves user config alone), capability flags require `false` to prohibit, read/write and read-only path lists narrow user-configured grants, and denied path lists add to user-configured denials. Sub-properties: `enabled`, `failIfUnavailable` (fail closed instead of running unsandboxed), `allowBypass`, `addCurrentWorkingDirectory`, `sandboxMcpServers`, `sandboxLspServers`, `auth.git`/`auth.gh` (renamed from `gitAuth`/`ghAuth`; block token injection for Git/`gh` operations in the sandbox), `allowDevToolAccess` (block auto access to dev-tool configs/caches/registries — disabling can break authenticated package restores), `learningMode` (Windows only: `"deny"` default records blocked access; `"allow"` records and allows it, is accepted only via native Windows device management such as Intune/registry, is ignored in `managed-settings.json`, and a `"deny"` from any managed source wins), and `userPolicy` (`filesystem.readwritePaths`/`readonlyPaths`/`deniedPaths`, `network.allowOutbound`/`allowLocalNetwork`/`allowedHosts`/`blockedHosts`/`proxy`, macOS `seatbelt.keychainAccess`). In VS Code, enforcement covers Agent Host's built-in sandbox only (not every chat session or terminal); from 1.140.0, `enabled: true` also removes the session sandbox toggle. A session-only bypass remains possible via a sandbox-bypass prompt (and `/sandbox disable` in the CLI) unless `allowBypass: false`. Network notes: `*.example.com` in `allowedHosts` excludes the root domain, user and managed allowlists combine restrictively (no overlap = all hosts denied), and on Windows host rules/proxies rely on programs honoring proxy settings, so they don't block direct connections as they do on macOS/Linux ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)).

### `forceRemoteSettingsRefresh`
Doc: [Enterprise managed settings reference — `forceRemoteSettingsRefresh`](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#forceremotesettingsrefresh)

Set `true` to require a fresh download of server-managed settings at startup in Copilot CLI and VS Code. In the CLI it skips the one-hour cache and blocks fallback to an older cached policy (a failed refresh leaves the policy unconfirmed, so affected operations are restricted); in VS Code, Copilot features are blocked until the refresh succeeds, so users need network at startup. To apply from first startup, deliver it via device management or `managed-settings.json`; policy helper scripts can't set it. In the Windows registry/macOS managed preferences, store it as the string `true`/`false`, not a DWORD or native Boolean.

### Deployment methods
- **Server-managed (recommended, GA):** `copilot/managed-settings.json` in a `.github-private` repo. Only method that reaches **cloud agent**. Propagates in ~1 hr; client restart forces refresh.
- **MDM-managed:** Windows registry (`HKLM\SOFTWARE\Policies\GitHubCopilot`) or macOS managed preferences (`com.github.copilot`). Local clients only, not cloud agent.
- **File-based:** OS-specific JSON path (macOS `/Library/Application Support/GitHubCopilot/managed-settings.json`, Windows `%ProgramFiles%\GitHubCopilot\`, Linux `/etc/github-copilot/`). Local clients only. On macOS/Linux, CLI requires root ownership, no group/world-write, not a symlink — else rejected outright.

### Team overrides
`copilot/team-mappings.json` + `copilot/teams/*` let enterprise teams get different values for keys explicitly marked `{ "overridable": <VALUE> }` in the base file. Override-eligible keys: `model`, `autoTier` (team files may only set more restrictive values), every `permissions` subkey (`disableBypassPermissionsMode`, `deny`, `ask`, `allow`), `allowedMcpServers`, `deniedMcpServers`, `extraKnownMarketplaces`, `strictKnownMarketplaces`, and `sandbox` (the whole object must be wrapped — sub-properties can't be individually overridable). `enabledPlugins` is additive-only for teams (a team file adds plugins on top of the enterprise baseline, it doesn't replace it). Multi-team users get the least-restrictive combination of team values, still capped by platform-level decisions ([override-settings-for-teams](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams#supported-keys)).

### Settings validation
For server-managed deployments, GitHub automatically validates `copilot/managed-settings.json`, `copilot/team-mappings.json`, and any referenced team-settings files. Configuration errors/warnings — identifying the affected file and JSON path — surface in the enterprise's **Agents** tab under "Copilot settings validation." If validation is temporarily unavailable, existing settings continue to apply ([get-started#4-validate-and-check-the-settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings)).

### Malformed/unreachable policy behavior (fail-safe)
- Malformed JSON → treated as an **empty allowlist** (blocks all non-built-in MCP servers).
- If a policy layer can't be fetched, the client **retains the last enforced policy** — effective policy can only get *more* restrictive over time, never less.

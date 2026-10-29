---
layout: default
title: "Visibility & Audit (governance, not prevention)"
nav_order: 10
permalink: /sections/audit-visibility/
last_reviewed: 2026-10-29
---

# Visibility & Audit (governance, not prevention)

> **Official documentation**
> - [Reviewing audit logs for Copilot](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs)
> - [Agentic audit log events](https://docs.github.com/en/copilot/reference/agentic-audit-log-events)
> - [Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics)

- Audit log captures policy/settings/seat changes and website-side agent activity — search `action:copilot`, agent-specific via `actor:Copilot`.
- **Does not capture local IDE/CLI prompt content** — that needs a custom telemetry pipeline (see the [`telemetry` key]({{ '/sections/managed-settings/#telemetry-capture-controls' | relative_url }})).
- 180-day retention in UI; stream to SIEM (Splunk, Sentinel) for longer retention/alerting.
- Separate Copilot usage metrics dashboard/API for adoption/usage reporting (access itself gated by the "Copilot Metrics API" policy).
- **Named customizations in usage metrics (Oct 22, 2026):** `totals_by_skill`, `totals_by_custom_agent`, `totals_by_mcp`, `totals_by_slash_cmd`, and `totals_by_plugin` now show the configured name of customer-defined items (trimmed to 128 characters) instead of `other`/`custom`, with up to 25 entries per record (was 5); remaining activity is combined into a trailing `other` entry. Names are reported from Copilot CLI interactive sessions and prompt mode, the Copilot app, ACP integrations such as JetBrains, and the Copilot SDK. Prompt mode, the app, and ACP integrations require Copilot CLI 1.0.97+; the SDK requires v1.0.21+ (including IDE agent experiences running on that SDK). IDE built-in chat telemetry doesn't report names. Names that look like file paths stay grouped as `other`/`custom`; earlier days aren't backfilled; review names before sharing reports externally. Data comes from client telemetry and can undercount. Requires the Copilot usage metrics policy and the "View Copilot Metrics" permission ([source](https://github.blog/changelog/2026-10-22-custom-skills-agents-and-mcp-servers-in-usage-metrics-api/)).
- **Usage by client (Oct 23, 2026):** the usage metrics API adds a `totals_by_client` array to the enterprise, organization, enterprise-user, and organization-user 1-day and 28-day reports (in 28-day reports it appears in each `day_totals` entry). It counts model traffic server-side from tools that often send no editor telemetry, such as `opencode`, `claude_code`, `codex`, `zed`, `copilot_cli`, `github_app`, `cloud_agent`, `code_review`, `vscode`, and `jetbrains` (unrecognized clients are `other`), with `request_count` (model calls, not prompts), `session_count`, `token_usage`, and `totals_by_model` including `model_selection_mode` (`user_selected`, `auto`, `product_selected`; others `other`/`unknown`). Copilot code review and cloud agent requests report `product_selected`, and code review models report `unknown`. Clients are identified by the integration ID they send, so treat `client` as best-effort, not verified identity. Requires the Copilot usage metrics policy and the "View Copilot Metrics" permission. Distinct from agent app activity, which counts jobs started by agent apps on GitHub ([source](https://github.blog/changelog/2026-10-23-usage-metrics-api-adds-usage-from-tools-like-opencode/)).
- **IDE agent-activity undercounting:** IDE versions that moved agent mode to the Copilot SDK didn't identify their IDE, so most agent activity (and agent lines of code) was left out of usage metrics, and some was counted as Copilot CLI activity. Billing isn't affected, and GitHub can't backfill missing data. Fix status per [GitHub's notice](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/):

  | IDE | Fixed version | Availability (as announced Oct 6, 2026) |
  |---|---|---|
  | Visual Studio Code | 1.139.0+ | Available |
  | Visual Studio | 18.12 | Expected October 2026 |
  | JetBrains IDEs | Next plugin release | Expected by late October 2026 |
  | Eclipse, Xcode | Next plugin release | Expected by November 2026 |

  Other client-side gaps in metrics: IDE telemetry disabled, proxies/firewalls blocking the Copilot telemetry endpoint, outdated IDE/extension versions. Per-user reports expose `last_known_ide_version` and `last_known_plugin_version` in `totals_by_ide` to spot outdated clients ([source](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/)).

- **Copilot impact dashboard industry comparison (opt-in, off by default):** the dashboard gains an "Industry comparison" section benchmarking agentic adoption and leverage against aggregated, opted-in peers by company size and industry. Controlled by the **"Copilot metrics industry comparison"** policy, set from the dashboard or centrally in enterprise/organization Copilot policies (the same policy applies in both places; turning it off stops contributing data and viewing comparisons). Requires the Copilot usage metrics policy to be enabled. Enterprise owners (or owners of organizations not owned by an enterprise) can opt in and set the peer group; organizations owned by an enterprise participate through it, and enterprises used only to assign Copilot Business licenses can't participate. Comparisons appear only in the dashboard, not in the metrics API, NDJSON exports or downloads. Aggregated benchmarks contain no identifying data and are deleted after 30 days; opting out excludes data from the next daily update. With data residency, comparison is limited to participants in the same region ([source](https://github.blog/changelog/2026-10-22-industry-comparisons-in-the-copilot-impact-dashboard/)).

### Session data governance (CLI & Copilot app)
> **Official documentation**
> - [About GitHub Copilot session data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data)

- A **session** = one period of CLI/app/agent interaction; **session data** = the recorded prompts, responses, tools used, and file changes. Copilot CLI and the Copilot app store the full record locally under `~/.copilot/session-state/`, plus a local SQLite session store for history queries and `/chronicle`.
- **Syncing:** locally-run CLI/app sessions sync to the user's GitHub account by default. For Enterprise/Business users, the **"Store local sessions in the Cloud"** policy must be set to at least "View from cloud" for sync to occur — disabled/unconfigured keeps sessions local-only. Users can further control sync per-client via the `remote`/`remoteExport` CLI config keys.
- **Sharing/visibility differs by surface:** synced CLI/app sessions are **unshared by default** and accessible only to the owning user (admins can gate sync availability but cannot see session content by enabling it); cloud agent sessions are **shared by default**, visible in the repo's "Agents" tab "All sessions" view to anyone with repo access.
- **Retention controls:** locally stored sessions support share/delete/archive (archive not supported for CLI); cloud-agent sessions on GitHub.com support share/archive but **not delete**.

### Server-to-server authentication for the Copilot SDK (public preview)

> **Official documentation**
> - [GitHub Copilot supports server-to-server authentication](https://github.blog/changelog/2026-10-27-github-copilot-supports-server-to-server-authentication)
> - [Managing GitHub App access to your organization's Copilot](https://docs.github.com/copilot/how-tos/administer-copilot/manage-for-organization/manage-app-copilot-access)

- GitHub Apps installed on an organization with the read-only **Copilot Requests** organization permission can pass a short-lived installation token to the Copilot SDK, so services and agents run without a signed-in user's credentials.
- Usage is attributed and billed to the owning organization; its model policies, budgets, and spending controls apply.
- Organization owners can review app access, identify app-attributed usage in AI usage CSV reports via the `app_client_id` field, and revoke access by suspending or uninstalling the app.

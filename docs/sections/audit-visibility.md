---
layout: default
title: "Visibility & Audit (governance, not prevention)"
nav_order: 10
permalink: /sections/audit-visibility/
last_reviewed: 2026-10-22
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
- **IDE agent-activity undercounting:** IDE versions that moved agent mode to the Copilot SDK didn't identify their IDE, so most agent activity (and agent lines of code) was left out of usage metrics, and some was counted as Copilot CLI activity. Billing isn't affected, and GitHub can't backfill missing data. Fix status per [GitHub's notice](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/):

  | IDE | Fixed version | Availability (as announced Oct 6, 2026) |
  |---|---|---|
  | Visual Studio Code | 1.139.0+ | Available |
  | Visual Studio | 18.12 | Expected October 2026 |
  | JetBrains IDEs | Next plugin release | Expected by late October 2026 |
  | Eclipse, Xcode | Next plugin release | Expected by November 2026 |

  Other client-side gaps in metrics: IDE telemetry disabled, proxies/firewalls blocking the Copilot telemetry endpoint, outdated IDE/extension versions. Per-user reports expose `last_known_ide_version` and `last_known_plugin_version` in `totals_by_ide` to spot outdated clients ([source](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/)).

### Session data governance (CLI & Copilot app)
> **Official documentation**
> - [About GitHub Copilot session data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data)

- A **session** = one period of CLI/app/agent interaction; **session data** = the recorded prompts, responses, tools used, and file changes. Copilot CLI and the Copilot app store the full record locally under `~/.copilot/session-state/`, plus a local SQLite session store for history queries and `/chronicle`.
- **Syncing:** locally-run CLI/app sessions sync to the user's GitHub account by default. For Enterprise/Business users, the **"Store local sessions in the Cloud"** policy must be set to at least "View from cloud" for sync to occur — disabled/unconfigured keeps sessions local-only. Users can further control sync per-client via the `remote`/`remoteExport` CLI config keys.
- **Sharing/visibility differs by surface:** synced CLI/app sessions are **unshared by default** and accessible only to the owning user (admins can gate sync availability but cannot see session content by enabling it); cloud agent sessions are **shared by default**, visible in the repo's "Agents" tab "All sessions" view to anyone with repo access.
- **Retention controls:** locally stored sessions support share/delete/archive (archive not supported for CLI); cloud-agent sessions on GitHub.com support share/archive but **not delete**.

---
layout: default
title: "Visibility & Audit (governance, not prevention)"
nav_order: 10
permalink: /sections/audit-visibility/
last_reviewed: 2026-10-16
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

### Session data governance (CLI & Copilot app)
> **Official documentation**
> - [About GitHub Copilot session data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data)

- A **session** = one period of CLI/app/agent interaction; **session data** = the recorded prompts, responses, tools used, and file changes. Copilot CLI and the Copilot app store the full record locally under `~/.copilot/session-state/`, plus a local SQLite session store for history queries and `/chronicle`.
- **Syncing:** locally-run CLI/app sessions sync to the user's GitHub account by default. For Enterprise/Business users, the **"Store local sessions in the Cloud"** policy must be set to at least "View from cloud" for sync to occur — disabled/unconfigured keeps sessions local-only. Users can further control sync per-client via the `remote`/`remoteExport` CLI config keys.
- **Sharing/visibility differs by surface:** synced CLI/app sessions are **unshared by default** and accessible only to the owning user (admins can gate sync availability but cannot see session content by enabling it); cloud agent sessions are **shared by default**, visible in the repo's "Agents" tab "All sessions" view to anyone with repo access.
- **Retention controls:** locally stored sessions support share/delete/archive (archive not supported for CLI); cloud-agent sessions on GitHub.com support share/archive but **not delete**.

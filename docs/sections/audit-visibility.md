---
layout: default
title: "Visibility & Audit (governance, not prevention)"
nav_order: 10
permalink: /sections/audit-visibility/
---

# Visibility & Audit (governance, not prevention)

Doc: [Reviewing audit logs for Copilot](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs)

- Audit log captures policy/settings/seat changes and website-side agent activity — search `action:copilot`, agent-specific via `actor:Copilot` ([agentic audit log events](https://docs.github.com/en/copilot/reference/agentic-audit-log-events)).
- **Does not capture local IDE/CLI prompt content** — that needs a custom telemetry pipeline (see `telemetry` key, section 2).
- 180-day retention in UI; stream to SIEM (Splunk, Sentinel) for longer retention/alerting.
- Separate [Copilot usage metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics) dashboard/API for adoption/usage reporting (access itself gated by the "Copilot Metrics API" policy).

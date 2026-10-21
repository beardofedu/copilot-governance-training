---
layout: default
title: "Mental Model: Where Controls Live"
nav_order: 1
permalink: /sections/mental-model/
last_reviewed: 2026-10-16
---

# Mental Model: Where Controls Live

| Layer | Examples | Applies to |
|---|---|---|
| [**Enterprise/Org Policies**]({{ '/sections/enterprise-org-policies/' | relative_url }}) ("AI controls") | Feature enable/disable, model access, cloud agent per-org allow | Whatever surfaces the policy covers |
| [**`managed-settings.json`**]({{ '/sections/managed-settings/' | relative_url }}) (file-based enterprise config) | MCP allow/deny, marketplaces, plugins, sandbox, permissions | CLI, VS Code, Copilot app, cloud agent, JetBrains (varies by key) |
| [**Content controls**]({{ '/sections/content-controls/' | relative_url }}) | Content exclusion, public-code matching | Suggestion/context generation |
| [**Network controls**]({{ '/sections/network-controls/' | relative_url }}) | IP allow lists, subscription-based network routing, cloud agent firewall | Access to GitHub/Copilot infra, agent sandbox egress |
| [**Visibility/audit**]({{ '/sections/audit-visibility/' | relative_url }}) | Audit log, streaming, usage metrics | Governance/monitoring, not prevention |

> **Official documentation**
> - [Policy conflicts across organizations and enterprises](https://docs.github.com/en/copilot/reference/enterprise-administrators/policy-conflicts)

Golden rule for conflicts: **enterprise beats org**; across **multiple orgs in one enterprise**, least-restrictive usually wins *except* for a sensitive shortlist (Metrics API, semantic indexing, public-code matching, code review without license) where most-restrictive wins; across **multiple enterprises**, most-restrictive wins.

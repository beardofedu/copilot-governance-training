---
layout: default
title: "Overview"
permalink: /
---

# Locking Down GitHub Copilot

*A complete admin guardrails training — covering every enterprise/org-level mechanism to restrict, govern, and audit GitHub Copilot usage, not just `strictKnownMarketplaces`.*

## Where controls live

| Layer | Examples | Applies to |
|---|---|---|
| **Enterprise/Org Policies** ("AI controls") | Feature enable/disable, model access, cloud agent per-org allow | Whatever surfaces the policy covers |
| **`managed-settings.json`** | MCP allow/deny, marketplaces, plugins, sandbox, permissions | CLI, VS Code, Copilot app, cloud agent, JetBrains |
| **Content controls** | Content exclusion, public-code matching | Suggestion/context generation |
| **Network controls** | IP allow lists, subscription routing, cloud agent firewall | Access to GitHub/Copilot infra |
| **Visibility/audit** | Audit log, streaming, usage metrics | Governance/monitoring, not prevention |

**Golden rule for conflicts:** enterprise beats org; across multiple orgs in one enterprise, least-restrictive usually wins *except* for a sensitive shortlist; across multiple enterprises, most-restrictive wins.

## Sections

<ul class="cards">
{% assign sections = site.pages | where_exp: "p", "p.nav_order" | sort: "nav_order" %}
{% for s in sections %}
  <li><a href="{{ s.url | relative_url }}"><strong>{{ s.title }}</strong></a></li>
{% endfor %}
</ul>

## How this site stays current

A scheduled [agentic workflow](https://github.com/github/gh-aw) runs daily, reviews the GitHub Blog changelog and GitHub Copilot documentation, and opens a pull request when governance guidance needs updating or a new control has shipped.

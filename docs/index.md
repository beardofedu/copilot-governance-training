---
layout: default
title: "Overview"
permalink: /
---

<section class="hero">
  <p class="eyebrow">Enterprise governance playbook</p>
  <h1>Locking Down<br><span>GitHub Copilot</span></h1>
  <p class="hero-lede">A practical guide to the controls, policies, and audit layers that keep Copilot useful, secure, and aligned with your organization.</p>
  <div class="hero-actions">
    <a class="button button-primary" href="#where-controls-live">Start with the mental model <span aria-hidden="true">→</span></a>
    <span class="updated-note"><span class="status-dot"></span>Kept current automatically</span>
  </div>
</section>

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
  <li><a href="{{ s.url | relative_url }}"><span class="card-index">{{ s.nav_order | prepend: '0' | slice: -2, 2 }}</span><strong>{{ s.title }}</strong><span class="card-arrow" aria-hidden="true">↗</span><small>Explore this guide</small></a></li>
{% endfor %}
</ul>

## How this site stays current

A scheduled [agentic workflow](https://github.com/github/gh-aw) runs daily, reviews the GitHub Blog changelog and GitHub Copilot documentation, and opens a pull request when governance guidance needs updating or a new control has shipped.

---
layout: default
title: "Overview"
permalink: /
---

<section class="hero">
  <div class="hero-copy">
  <p class="eyebrow">Enterprise governance playbook</p>
  <h1>Locking Down<br><span>GitHub Copilot</span></h1>
  <p class="hero-lede">A practical guide to the controls, policies, and audit layers that keep Copilot useful, secure, and aligned with your organization.</p>
  <div class="hero-actions">
    <a class="button button-primary" href="{{ '/sections/mental-model/' | relative_url }}">Start with the mental model <span aria-hidden="true">→</span></a>
    <span class="updated-note"><span class="status-dot"></span>Kept current automatically</span>
  </div>
  </div>
  <aside class="control-map" aria-label="Governance guide navigation">
    <div class="control-map-bar"><span class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></span> governance / control-map</div>
    <p class="control-map-comment">// Find the layer that owns the control.</p>
    <ol>
      <li><a href="{{ '/sections/enterprise-org-policies/' | relative_url }}"><span>01</span>Enterprise &amp; org policies <b aria-hidden="true">→</b></a></li>
      <li><a href="{{ '/sections/managed-settings/' | relative_url }}"><span>02</span>Managed settings <b aria-hidden="true">→</b></a></li>
      <li><a href="{{ '/sections/content-controls/' | relative_url }}"><span>03</span>Content controls <b aria-hidden="true">→</b></a></li>
      <li><a href="{{ '/sections/network-controls/' | relative_url }}"><span>04</span>Network controls <b aria-hidden="true">→</b></a></li>
      <li><a href="{{ '/sections/audit-visibility/' | relative_url }}"><span>05</span>Visibility &amp; audit <b aria-hidden="true">→</b></a></li>
    </ol>
    <a class="control-map-footer" href="{{ '/changelog/' | relative_url }}">View content changelog <span aria-hidden="true">↗</span></a>
  </aside>
</section>

## Where controls live

| Layer | Examples | Applies to |
|---|---|---|
| [**Enterprise/Org Policies**]({{ '/sections/enterprise-org-policies/' | relative_url }}) ("AI controls") | Feature enable/disable, model access, cloud agent per-org allow | Whatever surfaces the policy covers |
| [**`managed-settings.json`**]({{ '/sections/managed-settings/' | relative_url }}) | MCP allow/deny, marketplaces, plugins, sandbox, permissions | CLI, VS Code, Copilot app, cloud agent, JetBrains |
| [**Content controls**]({{ '/sections/content-controls/' | relative_url }}) | Content exclusion, public-code matching | Suggestion/context generation |
| [**Network controls**]({{ '/sections/network-controls/' | relative_url }}) | IP allow lists, subscription routing, cloud agent firewall | Access to GitHub/Copilot infra |
| [**Visibility/audit**]({{ '/sections/audit-visibility/' | relative_url }}) | Audit log, streaming, usage metrics | Governance/monitoring, not prevention |

> **Golden rule for conflicts:** enterprise beats org; across multiple orgs in one enterprise, least-restrictive usually wins *except* for a sensitive shortlist; across multiple enterprises, most-restrictive wins.

## Sections

<ul class="cards">
{% assign sections = site.pages | where_exp: "p", "p.nav_order" | sort: "nav_order" %}
{% for s in sections %}
  <li><a href="{{ s.url | relative_url }}"><span class="card-index">{% if s.nav_order < 90 %}{{ s.nav_order | prepend: '0' | slice: -2, 2 }}{% else %}··{% endif %}</span><strong>{{ s.title | strip_html | replace: '`', '' }}</strong><small>Read section <span aria-hidden="true">→</span></small></a></li>
{% endfor %}
</ul>

## How this site stays current

A scheduled [agentic workflow](https://github.com/github/gh-aw) runs daily (hourly during confirmed GitHub/Microsoft live events), reviews the GitHub Blog changelog and GitHub Copilot documentation, and opens a pull request when governance guidance needs updating or a new control has shipped.

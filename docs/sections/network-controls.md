---
layout: default
title: "Network-Level Controls"
nav_order: 9
permalink: /sections/network-controls/
last_reviewed: 2026-10-21
---

# Network-Level Controls

### Copilot allowlist reference (what to permit if you run a restrictive proxy)
> **Official documentation**
> - [Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)

Use `gh api meta -q '.domains | .website, .copilot'` to pull current wildcard domains; also allow apex `github.com` separately. Includes a dedicated [cloud-agent allowlist section]({{ '/sections/cloud-agent/#network-firewall' | relative_url }}).

### Subscription-based network routing (block non-enterprise Copilot plans at the firewall)
> **Official documentation**
> - [Manage network access for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/manage-network-access)

Allow only `*.business.githubcopilot.com` / `*.enterprise.githubcopilot.com`; block `*.individual.githubcopilot.com` — stops employees from using personal Copilot Pro/Free accounts on the corporate network. Requires min client versions.

### Package firewall (public preview)
> **Official documentation**
> - [GitHub package firewall in public preview](https://github.blog/changelog/2026-10-20-github-package-firewall-in-public-preview/)

Sits between endpoints such as Actions runners and coding agents and upstream package registries, inspecting metadata requests and package downloads. Enterprise policy controls today: a configurable cooldown period, GitHub Advisory Database malware/vulnerability checks, and supply-chain checks such as attestation downgrades. Endpoints must be configured to route through the firewall. Public preview for GitHub Enterprise Cloud (including data residency), npm only, free during preview and metered at GA ([changelog](https://github.blog/changelog/2026-10-20-github-package-firewall-in-public-preview/)). This is separate from the Copilot cloud agent firewall.

### IP allow lists
> **Official documentation**
> - [Restricting network traffic with an IP allow list](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-network-traffic-to-your-enterprise-with-an-ip-allow-list)

**Important gap to teach:** IP allow lists do **not** restrict "Copilot features that do not require directly fetching private/organizational data" — so this is not a complete Copilot access gate by itself.

### SAML SSO enforcement
> **Official documentation**
> - [Enforcing SAML SSO for your organization](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-saml-single-sign-on-for-your-organization/enforcing-saml-single-sign-on-for-your-organization)

Gates all access (including Copilot) behind IdP session; composes with IP allow lists.

---
layout: default
title: "Network-Level Controls"
nav_order: 9
permalink: /sections/network-controls/
---

# Network-Level Controls

### a. Copilot allowlist reference (what to permit if you run a restrictive proxy)
Doc: [Copilot allowlist reference](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)
Use `gh api meta -q '.domains | .website, .copilot'` to pull current wildcard domains; also allow apex `github.com` separately. Includes a dedicated cloud-agent allowlist section.

### b. Subscription-based network routing (block non-enterprise Copilot plans at the firewall)
Doc: [Manage network access for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-access/manage-network-access)
Allow only `*.business.githubcopilot.com` / `*.enterprise.githubcopilot.com`; block `*.individual.githubcopilot.com` — stops employees from using personal Copilot Pro/Free accounts on the corporate network. Requires min client versions.

### c. IP allow lists
Doc: [Restricting network traffic with an IP allow list](https://docs.github.com/en/enterprise-cloud@latest/admin/configuring-settings/hardening-security-for-your-enterprise/restricting-network-traffic-to-your-enterprise-with-an-ip-allow-list)
**Important gap to teach:** IP allow lists do **not** restrict "Copilot features that do not require directly fetching private/organizational data" — so this is not a complete Copilot access gate by itself.

### d. SAML SSO enforcement
Doc: [Enforcing SAML SSO for your organization](https://docs.github.com/en/enterprise-cloud@latest/organizations/managing-saml-single-sign-on-for-your-organization/enforcing-saml-single-sign-on-for-your-organization) — gates all access (including Copilot) behind IdP session; composes with IP allow lists.

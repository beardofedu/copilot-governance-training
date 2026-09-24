---
layout: default
title: "Changelog"
nav_order: 99
permalink: /changelog/
---

# Changelog

Automated updates from the [Copilot Governance Watch](../.github/workflows/copilot-governance-watch.md) workflow are recorded here, newest first.

## 2026-09-24

- **Corrected** — The `sandbox` managed-settings key is no longer CLI-only: it now also enforces on the GitHub Copilot app (public preview), and the site's sub-property list was missing `gitAuth`, `ghAuth`, `allowDevToolAccess`, `addCurrentWorkingDirectory`, and `userPolicy` (filesystem/network/macOS Seatbelt) ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox))
- **Added** — Session data governance for Copilot CLI and the Copilot app: local storage location, the "Store local sessions in the Cloud" sync policy, default share/visibility differences between local and cloud-agent sessions, and available retention controls (share/delete/archive) ([session-data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data))

## 2026-09-23

- **Corrected** — Content exclusion is honored by Copilot CLI; only Agent mode in IDE Chat (and third-party agents/Spark) don't support it ([exclude-content-from-copilot](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot), [supported-surfaces-for-policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies))
- **Corrected** — `strictKnownMarketplaces` supports 8 source types (`github`, `git`, `url`, `npm`, `file`, `directory`, `hostPattern`, `pathPattern`), not just 3; `extraKnownMarketplaces` supports only `github`/`git`/`directory` ([enterprise-managed-settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#strictknownmarketplaces))
- **Added** — Cloud agent custom-instructions file discovery documented: `.github/copilot-instructions.md`, path-specific `.instructions.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` ([get-the-best-results](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results#adding-custom-instructions-to-your-repository))
- **Added** — "Restrict MCP access to registry servers" and "Copilot Memory" policy surface coverage noted in Enterprise & Org Policies ([supported-surfaces-for-policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies))
- **Added** — "Policies for enterprise-assigned users" setting noted for users licensed directly by the enterprise ([policies](https://docs.github.com/en/copilot/concepts/policies#how-do-policies-work))

## 2026-08-18

- **Added** — Initial publication of the enterprise guardrails training as a GitHub Pages site.

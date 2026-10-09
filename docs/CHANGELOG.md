---
layout: default
title: "Changelog"
nav_order: 99
permalink: /changelog/
---

# Changelog

Automated updates from the [Copilot Governance Watch](../.github/workflows/copilot-governance-watch.md) workflow are recorded here, newest first.

## 2026-10-09

- **Added** — Copilot code review setting "Only allow Copilot code review to be triggered by authorized users" (org/repo) blocks reviews requested with external Copilot licenses ([code-review](https://docs.github.com/en/copilot/concepts/agents/code-review#reviews-requested-with-an-external-copilot-license))
- **Added** — Local sandbox credential masking (`sandbox.credentials.envVars` / `injectHosts`) and the bypass caveat ([configuring-local-sandbox-settings](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings#masking-environment-variables))

## 2026-10-08

- **Corrected** — `sandbox` now also supports VS Code Agent Host sessions (1.138.0+; `enabled: true` removes the session toggle from 1.140.0), `gitAuth`/`ghAuth` are now `auth.git`/`auth.gh`, `/sandbox disable` is a session-only opt-out unless `allowBypass: false`, and `allowedHosts`/`allowLocalNetwork`/proxy semantics were clarified ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox))
- **Added** — `forceRemoteSettingsRefresh` key (CLI and VS Code) and Windows-only `sandbox.learningMode` ([forceRemoteSettingsRefresh](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#forceremotesettingsrefresh), [sandbox.learningMode](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandboxlearningmode))

## 2026-10-02

- **Added** — New `autoTier` managed-settings key (CLI and VS Code only) sets the default Auto routing tier; a non-`unmanaged` string locks it, `{ "overridable": ... }` allows overrides, and it is override-eligible for enterprise teams ([enterprise-managed-settings#autotier](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#autotier), [override-settings-for-teams#supported-keys](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams#supported-keys))

## 2026-09-26

- **Corrected** — The overridable-keys list for enterprise team overrides was incomplete: `extraKnownMarketplaces`, `strictKnownMarketplaces`, and `sandbox` (wrapped as a whole object) are also override-eligible, not just `model`, `permissions.*`, `allowedMcpServers`, and `deniedMcpServers` ([override-settings-for-teams#supported-keys](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams#supported-keys))
- **Added** — Server-managed deployments now get automatic settings validation surfaced in the enterprise **Agents** tab ("Copilot settings validation"), checking `managed-settings.json`, `team-mappings.json`, and referenced team files for errors/warnings by file and JSON path ([get-started#4-validate-and-check-the-settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings))

## 2026-09-25

- **Added** — New "Default policy for new features" and "Default availability for released models" enterprise/org policies documented: the models policy is already active (auto-enables new/unconfigured GA models labeled "Delegate to Default Policy", but **not** pre-GA models, open-weight models, models outside GitHub's data-retention agreement, or models conflicting with data-residency/FedRAMP restrictions), while the features policy is configurable now but activates October 22, 2026 for unconfigured GA features, preview→GA transitions, and existing unconfigured GA features — including the Copilot code review and MCP servers policies, but excluding preview features, the data-residency/FedRAMP restrictive model policies, and Store local sessions in the Cloud ([default-availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability))

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

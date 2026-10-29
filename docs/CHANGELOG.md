---
layout: default
title: "Changelog"
nav_order: 99
permalink: /changelog/
---

# Changelog

Automated updates from the [Copilot Governance Watch](../.github/workflows/copilot-governance-watch.md) workflow are recorded here, newest first. Each entry links to its official source and to the training page(s) that were updated.

## 2026-10-29

- **Added** — Repository plugin defaults and enterprise plugin controls (required/blocked plugins, approved marketplaces) are GA, with availability and precedence over repository and personal choices ([changelog](https://github.blog/changelog/2026-10-28-repository-plugin-defaults-and-enterprise-plugin-controls-generally-available)) — Updated: [Plugin Marketplace Governance]({{ '/sections/plugin-marketplaces/' | relative_url }})
- **Added** — Copilot included with GitHub Enterprise and Copilot Standalone, budget-based metering and which features need budget ([changelog](https://github.blog/changelog/2026-10-28-github-enterprise-now-includes-access-to-github-copilot)) — Updated: [Plan-Tier Gating]({{ '/sections/plan-tier-gating/' | relative_url }})
- **Added** — Managed settings `permissions.disableAssistedPermissionsMode`, `permissions.defaultMode` and `fusionTier`; clarified that disabling bypass mode does not block assisted permissions, which are now GA ([docs](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings), [blog](https://github.blog/changelog/2026-10-26-github-copilot-assisted-permissions-generally-available)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }}), [Managed Settings Generator]({{ '/sections/managed-settings-generator/' | relative_url }})
- **Added** — `fusion` model value in the generator model list, as shown in the managed settings reference example ([source](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)) — Updated: [Managed Settings Generator]({{ '/sections/managed-settings-generator/' | relative_url }})

## 2026-10-28

- **Added** — Assisted permissions GA and the `permissions.disableAssistedPermissionsMode` and `permissions.defaultMode` managed settings, including how they differ from bypass-mode blocking ([changelog](https://github.blog/changelog/2026-10-26-github-copilot-assisted-permissions-generally-available/), [reference](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#permissions)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }}), [Managed Settings Generator]({{ '/sections/managed-settings-generator/' | relative_url }})
- **Added** — Usage metrics API `totals_by_client` array reporting server-side model usage by tool (OpenCode, Claude Code, Codex, Zed, Copilot CLI, IDEs, and others), with scope, selection modes, and caveats ([changelog](https://github.blog/changelog/2026-10-23-usage-metrics-api-adds-usage-from-tools-like-opencode/)) — Updated: [Visibility & Audit]({{ '/sections/audit-visibility/' | relative_url }})

## 2026-10-22

- **Corrected** — Default policy for new features is no longer merely scheduled: enforcement began October 22 and rolls out gradually through October 26; one-time application, explicit choices preserved, previews stay opt-in ([changelog](https://github.blog/changelog/2026-10-22-global-default-for-copilot-features-generally-available/)) — Updated: [Enterprise & Org Policies]({{ '/sections/enterprise-org-policies/' | relative_url }}), [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})
- **Added** — Usage metrics now report named skills, custom agents, MCP servers, slash commands, and plugins (up to 25 per record) with coverage and client version requirements ([changelog](https://github.blog/changelog/2026-10-22-custom-skills-agents-and-mcp-servers-in-usage-metrics-api/)) — Updated: [Visibility & Audit]({{ '/sections/audit-visibility/' | relative_url }})
- **Added** — Opt-in "Copilot metrics industry comparison" policy and Industry comparison dashboard section, including eligibility, data handling and residency behavior ([changelog](https://github.blog/changelog/2026-10-22-industry-comparisons-in-the-copilot-impact-dashboard/)) — Updated: [Visibility & Audit]({{ '/sections/audit-visibility/' | relative_url }})
- **Added** — Usage-metrics undercounting of IDE agent activity (Copilot SDK-based agent mode), fixed-version table per IDE, and client-side causes of metrics gaps ([changelog](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/)) — Updated: [Visibility & Audit]({{ '/sections/audit-visibility/' | relative_url }})
- **Added** — Default policy for new features: enforcement began October 22 and rolls out through October 26; the upstream default-availability page still has stale "not currently active" wording, tracked as a documentation gap ([default-availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)) — Updated: [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})
- **Added** — `forceRemoteSettingsRefresh` fail-closed and delivery-timing behavior, and minimum client version enforcement when the `sandbox` key is present in managed settings ([changelog](https://github.blog/changelog/2026-10-13-enterprise-managed-settings-enforcement-updates/)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})

## 2026-10-21

- **Added** — Copilot code review org billing setting ("Choose how members with a Copilot license are billed": Member vs. Organization) ([changelog](https://github.blog/changelog/2026-10-08-copilot-code-review-new-organization-billing-options-and-controls/)) — Updated: [Enterprise & Org Policies]({{ '/sections/enterprise-org-policies/' | relative_url }})
- **Added** — GitHub package firewall (public preview, GitHub Enterprise Cloud, npm only) with enterprise cooldown, advisory, and attestation-downgrade policy controls for endpoints such as Actions runners and coding agents ([changelog](https://github.blog/changelog/2026-10-20-github-package-firewall-in-public-preview/)) — Updated: [Network Controls]({{ '/sections/network-controls/' | relative_url }})

## 2026-10-20

- **Added** — `features.computerUse` managed-settings key: `false` blocks users from enabling computer use in Copilot CLI and the Copilot app, and local settings cannot override it ([enterprise-managed-settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#featurescomputeruse)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})
- **Corrected** — The `model` managed-settings key now applies in JetBrains IDEs ([changelog](https://github.blog/changelog/2026-10-10-new-controls-and-chat-improvements-in-copilot-for-jetbrains/)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})
- **Added** — Copilot model policy REST API (GA) for enterprises, enterprise teams, enterprise apps, and organizations, including delegation of model control in organization mode and enterprise teams mode ([changelog](https://github.blog/changelog/2026-10-19-copilot-model-policy-api-for-enterprise-orgs-and-teams/)) — Updated: [Model & Data Governance]({{ '/sections/model-data-governance/' | relative_url }})

## 2026-10-16

- **Corrected** — `telemetry` is now supported in the Copilot app (previously listed as unsupported) ([enterprise-managed-settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})
- **Added** — `telemetry.capture` fine-grained classes (`identity`, `prompts`, `responses`, `toolArguments`, `toolOutput`, `policyDetail`), legacy `captureContent` semantics, and managed-telemetry precedence ([capture-controls](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#capture-controls), [monitor-agentic-activity](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/monitor-agentic-activity)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})

## 2026-10-14

- **Corrected** — `telemetry` is now supported in the Copilot app, and `forceRemoteSettingsRefresh` also applies to the Copilot app and has its own row in the supported-keys table ([enterprise-managed-settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings), [deploy-managed-settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})
- **Added** — `telemetry.capture` classes (`identity`, `prompts`, `responses`, `toolArguments`, `toolOutput`, `policyDetail`) and telemetry precedence/`headers` rules ([capture-controls](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#capture-controls)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})
- **Added** — Minimum client versions enforced when `sandbox` is set: VS Code 1.141.0, CLI 1.0.93, Copilot app 1.1.26 ([enterprise-managed-settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#minimum-client-version-enforcement-for-sandbox)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})

## 2026-10-09

- **Added** — Copilot code review setting "Only allow Copilot code review to be triggered by authorized users" (org/repo) blocks reviews requested with external Copilot licenses ([code-review](https://docs.github.com/en/copilot/concepts/agents/code-review#reviews-requested-with-an-external-copilot-license)) — Updated: [Enterprise & Org Policies]({{ '/sections/enterprise-org-policies/' | relative_url }})
- **Added** — Local sandbox credential masking (`sandbox.credentials.envVars` / `injectHosts`) and the bypass caveat ([configuring-local-sandbox-settings](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings#masking-environment-variables)) — Updated: [CLI & App Sandboxing]({{ '/sections/cli-sandboxing/' | relative_url }})

## 2026-10-08

- **Corrected** — `sandbox` now also supports VS Code Agent Host sessions (1.138.0+; `enabled: true` removes the session toggle from 1.140.0), `gitAuth`/`ghAuth` are now `auth.git`/`auth.gh`, `/sandbox disable` is a session-only opt-out unless `allowBypass: false`, and `allowedHosts`/`allowLocalNetwork`/proxy semantics were clarified ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }}), [CLI & App Sandboxing]({{ '/sections/cli-sandboxing/' | relative_url }}), [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})
- **Added** — `forceRemoteSettingsRefresh` key (CLI and VS Code) and Windows-only `sandbox.learningMode` ([forceRemoteSettingsRefresh](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#forceremotesettingsrefresh), [sandbox.learningMode](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandboxlearningmode)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})

## 2026-10-02

- **Added** — New `autoTier` managed-settings key (CLI and VS Code only) sets the default Auto routing tier; a non-`unmanaged` string locks it, `{ "overridable": ... }` allows overrides, and it is override-eligible for enterprise teams ([enterprise-managed-settings#autotier](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#autotier), [override-settings-for-teams#supported-keys](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams#supported-keys)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})

## 2026-09-26

- **Corrected** — The overridable-keys list for enterprise team overrides was incomplete: `extraKnownMarketplaces`, `strictKnownMarketplaces`, and `sandbox` (wrapped as a whole object) are also override-eligible, not just `model`, `permissions.*`, `allowedMcpServers`, and `deniedMcpServers` ([override-settings-for-teams#supported-keys](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams#supported-keys)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }}), [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})
- **Added** — Server-managed deployments now get automatic settings validation surfaced in the enterprise **Agents** tab ("Copilot settings validation"), checking `managed-settings.json`, `team-mappings.json`, and referenced team files for errors/warnings by file and JSON path ([get-started#4-validate-and-check-the-settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }})

## 2026-09-25

- **Added** — New "Default policy for new features" and "Default availability for released models" enterprise/org policies documented: the models policy is already active (auto-enables new/unconfigured GA models labeled "Delegate to Default Policy", but **not** pre-GA models, open-weight models, models outside GitHub's data-retention agreement, or models conflicting with data-residency/FedRAMP restrictions), while the features policy is configurable now but activates October 22, 2026 for unconfigured GA features, preview→GA transitions, and existing unconfigured GA features — including the Copilot code review and MCP servers policies, but excluding preview features, the data-residency/FedRAMP restrictive model policies, and Store local sessions in the Cloud ([default-availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)) — Updated: [Enterprise & Org Policies]({{ '/sections/enterprise-org-policies/' | relative_url }}), [Course Outline]({{ '/sections/course-outline/' | relative_url }}), [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})

## 2026-09-24

- **Corrected** — The `sandbox` managed-settings key is no longer CLI-only: it now also enforces on the GitHub Copilot app (public preview), and the site's sub-property list was missing `gitAuth`, `ghAuth`, `allowDevToolAccess`, `addCurrentWorkingDirectory`, and `userPolicy` (filesystem/network/macOS Seatbelt) ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)) — Updated: [Managed Settings]({{ '/sections/managed-settings/' | relative_url }}), [CLI & App Sandboxing]({{ '/sections/cli-sandboxing/' | relative_url }}), [Known Gaps]({{ '/sections/known-gaps/' | relative_url }}), [Course Outline]({{ '/sections/course-outline/' | relative_url }})
- **Added** — Session data governance for Copilot CLI and the Copilot app: local storage location, the "Store local sessions in the Cloud" sync policy, default share/visibility differences between local and cloud-agent sessions, and available retention controls (share/delete/archive) ([session-data](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/session-data)) — Updated: [Visibility & Audit]({{ '/sections/audit-visibility/' | relative_url }})

## 2026-09-23

- **Corrected** — Content exclusion is honored by Copilot CLI; only Agent mode in IDE Chat (and third-party agents/Spark) don't support it ([exclude-content-from-copilot](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot), [supported-surfaces-for-policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies)) — Updated: [Content Controls]({{ '/sections/content-controls/' | relative_url }}), [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})
- **Corrected** — `strictKnownMarketplaces` supports 8 source types (`github`, `git`, `url`, `npm`, `file`, `directory`, `hostPattern`, `pathPattern`), not just 3; `extraKnownMarketplaces` supports only `github`/`git`/`directory` ([enterprise-managed-settings](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#strictknownmarketplaces)) — Updated: [Plugin Marketplaces]({{ '/sections/plugin-marketplaces/' | relative_url }})
- **Added** — Cloud agent custom-instructions file discovery documented: `.github/copilot-instructions.md`, path-specific `.instructions.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` ([get-the-best-results](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results#adding-custom-instructions-to-your-repository)) — Updated: [Cloud Agent]({{ '/sections/cloud-agent/' | relative_url }}), [Course Outline]({{ '/sections/course-outline/' | relative_url }})
- **Added** — "Restrict MCP access to registry servers" and "Copilot Memory" policy surface coverage noted in Enterprise & Org Policies ([supported-surfaces-for-policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies)) — Updated: [Enterprise & Org Policies]({{ '/sections/enterprise-org-policies/' | relative_url }}), [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})
- **Added** — "Policies for enterprise-assigned users" setting noted for users licensed directly by the enterprise ([policies](https://docs.github.com/en/copilot/concepts/policies#how-do-policies-work)) — Updated: [Enterprise & Org Policies]({{ '/sections/enterprise-org-policies/' | relative_url }})

## 2026-08-18

- **Added** — Initial publication of the enterprise guardrails training as a GitHub Pages site — start with the [Mental Model]({{ '/sections/mental-model/' | relative_url }}).

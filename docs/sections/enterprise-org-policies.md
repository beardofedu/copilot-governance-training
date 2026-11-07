---
layout: default
title: "Enterprise & Org Policies (AI controls)"
nav_order: 2
permalink: /sections/enterprise-org-policies/
last_reviewed: 2026-11-05
---

# Enterprise & Org Policies (AI controls)

**Where:** Enterprise → **AI controls** tab → **Copilot** → *Policies* / *Models*. Org → Settings → Copilot → *Policies* / *Models*.

> **Official documentation**
> - [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/policies)

Each policy is set to **Enabled everywhere / Disabled everywhere / Let organizations decide** (enterprise level). Orgs cannot override an enterprise "everywhere" setting.

### Choosing the policy scope

Use **Enabled everywhere** or **Disabled everywhere** when the enterprise needs a consistent baseline—for example, to require an approved capability or block one that has not passed review. Choose **Let organizations decide** when business units have different needs and there is a clear owner for those decisions; it is delegation, not a way to make the policy optional for each individual user. Enterprise-assigned users have a separate default (see below).

Treat availability as one layer of governance, not the whole control: enabling a feature does not by itself approve every model, agent, repository, or integration it can reach. Pair the policy with the relevant access, managed-settings, ruleset, data-handling, and budget controls. For preview features, third-party agents, and new models, prefer explicit review and scope over automatic broad enablement.

### Confirmed named policies

> **Official documentation**
> - [Policy conflicts across organizations and enterprises](https://docs.github.com/en/copilot/reference/enterprise-administrators/policy-conflicts)
> - [Supported surfaces for Copilot policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies)
> - [Copilot code review: reviews requested with an external license](https://docs.github.com/en/copilot/concepts/agents/code-review#reviews-requested-with-an-external-copilot-license)
> - [Configuring Copilot code review](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review)

- Copilot Chat in the IDE / Chat agent mode / Chat in GitHub Mobile
- "Copilot can search the web"
- Copilot code review (+ sub-policy: allow unlicensed members to use code review on GitHub.com)
- Copilot code review — **"Only allow Copilot code review to be triggered by authorized users"** (org or repo setting, not an enterprise policy): blocks reviews requested with an *external* Copilot license (e.g. personal or another org's). Org-level enablement can't be turned off by repo admins; rulesets-configured automatic reviews still run.
- Copilot code review — **"Choose how members with a Copilot license are billed"** (org setting under Copilot → Policies): **Member** (default) bills the member's own Copilot entitlement, and the review fails if their quota is exhausted; **Organization** bills the repository-owning org's cost center and requires AI Credits paid usage to be enabled (a budget is optional) ([changelog](https://github.blog/changelog/2026-10-08-copilot-code-review-new-organization-billing-options-and-controls/)).
- Copilot code review — **settings API (Nov 6, 2026):** code review settings can now be read and updated through REST and GraphQL APIs. Enterprise administrators can enable or disable code review for all organizations or leave the choice to organization administrators; organization administrators manage enablement, default review effort, and runner configuration (enterprise-managed settings can't be overridden); repository administrators manage review effort and whether reviews use custom instructions and MCP tools. Enterprise and organization settings endpoints (including the organization runner endpoint) don't support GitHub Apps or fine-grained personal access tokens; repository endpoints support both (`Administration: read`/`write`), and classic tokens need repository admin access. The **Automatically request Copilot code review** repository rule now supports the bypass list, and the "Block reviews requested with an external Copilot license" setting no longer stops organization- or enterprise-owned GitHub Actions, Dependabot, and apps from requesting reviews on bot-authored pull requests when the organization pays ([changelog](https://github.blog/changelog/2026-11-06-copilot-code-review-api-management-and-review-overview-updates), [docs](https://docs.github.com/copilot/how-tos/copilot-on-github/set-up-copilot/configure-code-review#configuring-copilot-code-review-with-the-api)).
- Suggestions matching public code (privacy)
- Semantic indexing for non-GitHub repos
- Copilot Metrics API access
- Copilot CLI (independent client policy)
- GitHub Copilot app (independent client policy — CLI and app can be toggled separately)
- Copilot cloud agent (enterprise selects **which specific orgs** get it — not just on/off)
- Editor preview features (IDEs only)
- Third-party coding agents (Claude, Codex) — org toggle gated by enterprise enablement
- **JetBrains Air:** Copilot tasks use the existing subscription via Agent Client Protocol for local or cloud work. Air administrators can disable Copilot through an Air governance policy, but Air analytics do not include Copilot usage and Air cannot set Copilot spending limits; users cannot choose which personal or organization plan an individual task uses ([changelog](https://github.blog/changelog/2026-11-03-github-copilot-is-now-available-in-jetbrains-air)). Whether GitHub organization policies and managed settings apply to these Air tasks is not specified; see [Known Gaps]({{ '/sections/known-gaps/' | relative_url }}).
- Agent apps (single policy)
- MCP servers in Copilot (GA toggle — governs only Copilot's own surfaces, not third-party hosts like Cursor/Windsurf)
- Restrict MCP access to registry servers (governs IDEs/CLI/Copilot app only — no effect on cloud agent or third-party agents)
- Copilot Memory (governs cloud agent, third-party agents, CLI, and Spark; also applies to VS Code Local Agent Host sessions when the application's Memory setting is enabled, and to eligible Copilot app accounts. Other IDE and app contexts are not listed as supported by the [supported-surfaces table](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies); see [Known Gaps]({{ '/sections/known-gaps/' | relative_url }}))
- Copilot dreaming (public preview, opt-in; policy enablement) — administrators enable it through Copilot policies and enterprise administrators can delegate the choice to organization administrators. Repository dreams cover the repositories allowed by Copilot Memory's repository access settings, users must also enable personal dreaming, and dream runs consume AI credits. Dreaming can add, update, and remove memories; changes to checked-in skills and instructions are proposed in pull requests ([changelog](https://github.blog/changelog/2026-10-28-github-intelligence-puts-your-code-context-and-history-to-work), [admin docs](https://docs.github.com/copilot/how-tos/use-copilot-agents/copilot-memory/manage-as-administrator#enabling-copilot-dreaming))
- Models (enable specific/custom models, may add cost)

### Why choose each control?

| Control | Why you might enable or delegate it | What to weigh before enabling |
|---|---|---|
| Copilot Chat in the IDE, chat agent mode, and Chat in GitHub Mobile | Make the assistant available in the clients and workflows your developers use. | These are distinct surfaces; decide whether mobile access and agentic actions fit your device, data, and review requirements. |
| Copilot can search the web | Give users current public information to complement repository context. | Web results can be incomplete or untrusted; establish expectations for checking sources and avoid sending sensitive queries. |
| Copilot code review and unlicensed-member access | Add automated review capacity, including for members without their own Copilot license when that sub-policy is allowed. | Decide who may trigger reviews and who pays. The authorized-users restriction can limit requests made with external licenses; review the Member/Organization billing choices above before broadening access. |
| Suggestions matching public code | Choose whether users may receive suggestions that match public code, based on the organization’s code reuse and attribution posture. | Enabling can provide useful matches with references; disabling reduces that exposure but can also reduce available suggestions. |
| Semantic indexing for non-GitHub repositories | Let Copilot use indexed context from supported non-GitHub repositories for more relevant answers. | Enable only for repositories and data sources whose access and handling have been reviewed. |
| Copilot Metrics API access | Allow approved reporting or analytics integrations to measure adoption and usage. | Keep access disabled if no approved consumer needs it, and govern the data in any downstream reporting system. |
| Copilot CLI and GitHub Copilot app | Make each client available where its workflow is supported. | They are independent policies: assess local execution, integrations, and data access for each instead of assuming one toggle controls both. |
| Copilot cloud agent | Give selected organizations access to delegated, repository-based agent work. | Select only organizations ready to govern repository access, agent permissions, review of changes, and usage costs. |
| Editor preview features | Let teams evaluate capabilities before general availability. | Previews can change and may have different support or governance maturity; enable for an evaluation need, not just for convenience. |
| Third-party coding agents and agent apps | Allow teams to use a reviewed external or app-based agent when it solves a real workflow need. | Review the provider, data handling, permissions, and applicable organization controls; keep access scoped to organizations with an owner. |
| MCP servers in Copilot | Unlock MCP use on supported Copilot surfaces when teams need tool or service integrations. | This is a capability switch, not approval of every server. Use the [managed-settings allowlist]({{ '/sections/managed-settings/' | relative_url }}) to control servers; registry restrictions have different coverage and limits (see [MCP governance]({{ '/sections/mcp-governance/' | relative_url }})). |
| Restrict MCP access to registry servers | Prefer a centrally maintained catalog when supported clients and registered servers meet your needs. | Check the supported surfaces and limitations first; registry enforcement is not a substitute for the managed-settings allowlist where stronger coverage is needed. |
| Copilot Memory and dreaming | Preserve useful context across eligible sessions; dreaming can maintain memories and propose repository instruction or skill changes. | Set repository access deliberately, explain that memories can change over time, review proposed changes, and account for AI-credit use. Dreaming also requires user opt-in. |
| Specific and custom models | Approve models that meet your teams’ capability and data-handling requirements. | Models may differ in cost, data-retention terms, and regional/FedRAMP eligibility; do not assume one model’s approval covers another. |
| Default policy for new features | Reduce the effort of individually configuring each GA feature, or keep the default disabled for a more deliberate rollout. | New or unconfigured GA features can become available automatically; preview features remain opt-in. Preserve explicit choices for features that must differ from the default. |
| Default availability for released models | Make new GA models available without having to opt in to each one. | Some models are excluded by default or by data-residency/FedRAMP restrictions; review the eligibility rules and keep explicit exceptions where needed. |

### Enterprise-assigned users

> **Official documentation**
> - [How policies work for enterprise-assigned users](https://docs.github.com/en/copilot/concepts/policies#how-do-policies-work)

Users who receive Copilot directly from the enterprise (not via an org) aren't covered by "Let organizations decide" — a separate **Policies for enterprise-assigned users** setting decides whether those policies default to enabled or disabled for them. Set that default deliberately so directly assigned users are not an unintended exception to the enterprise’s baseline.

### Default availability of new features and models

> **Official documentation**
> - [Default availability for Copilot features and models](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)

Two enterprise/org policies control whether unconfigured GA (general availability) items are enabled by default:
- **Default policy for new features** — GitHub began enforcing this policy on October 22, 2026, with rollout continuing gradually through October 26. It applies the selected default once to new GA features, features moving preview→GA, and existing GA features left **Unconfigured**; explicit choices are preserved, and preview features remain opt-in. The policy is enabled by default. It covers everything on the enterprise "Features & clients" page, plus the **Copilot code review** policy (Agents page) and the **MCP servers in Copilot** policy (MCP page). It does **not** apply to the data-residency/FedRAMP restrictive model policies or **Store local sessions in the Cloud**.
- **Default availability for released models** — already active; auto-enables new/unconfigured GA models (those labeled **Delegate to Default Policy**). Out of scope and disabled by default regardless of this setting: pre-GA models, open-weight models (DeepSeek, Kimi K2.7 Code, Kimi K3), models not covered by GitHub's data-retention agreement (Claude Fable 5, Claude Fable 5.1), and — for enterprises restricted to data-residency or FedRAMP models — any model that doesn't respect those restrictions.
- Disable either policy at the enterprise or org level to stop auto-enablement; individual features/models can still be explicitly disabled to opt them out while the default policy stays on.

**Training talking point:** "MCP servers in Copilot" being ON does not mean any server can run — it just unlocks MCP capability; the *allowlist* ([`managed-settings.json`]({{ '/sections/managed-settings/' | relative_url }})) does the actual restricting.

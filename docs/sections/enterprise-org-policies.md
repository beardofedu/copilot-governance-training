---
layout: default
title: "Enterprise & Org Policies (AI controls)"
nav_order: 2
permalink: /sections/enterprise-org-policies/
last_reviewed: 2026-10-21
---

# Enterprise & Org Policies (AI controls)

**Where:** Enterprise → **AI controls** tab → **Copilot** → *Policies* / *Models*. Org → Settings → Copilot → *Policies* / *Models*.

> **Official documentation**
> - [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/policies)

Each policy is set to **Enabled everywhere / Disabled everywhere / Let organizations decide** (enterprise level). Orgs cannot override an enterprise "everywhere" setting.

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
- Suggestions matching public code (privacy)
- Semantic indexing for non-GitHub repos
- Copilot Metrics API access
- Copilot CLI (independent client policy)
- GitHub Copilot app (independent client policy — CLI and app can be toggled separately)
- Copilot cloud agent (enterprise selects **which specific orgs** get it — not just on/off)
- Editor preview features (IDEs only)
- Third-party coding agents (Claude, Codex) — org toggle gated by enterprise enablement
- Agent apps (single policy)
- MCP servers in Copilot (GA toggle — governs only Copilot's own surfaces, not third-party hosts like Cursor/Windsurf)
- Restrict MCP access to registry servers (governs IDEs/CLI/Copilot app only — no effect on cloud agent or third-party agents)
- Copilot Memory (governs cloud agent, third-party agents, CLI, and Spark; also applies to VS Code Local Agent Host sessions when the application's Memory setting is enabled, and to eligible Copilot app accounts. Other IDE and app contexts are not listed as supported by the [supported-surfaces table](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies); see [Known Gaps]({{ '/sections/known-gaps/' | relative_url }}))
- Copilot dreaming (public preview, opt-in; policy enablement) — administrators enable it through Copilot policies and enterprise administrators can delegate the choice to organization administrators. Repository dreams cover the repositories allowed by Copilot Memory's repository access settings, users must also enable personal dreaming, and dream runs consume AI credits. Dreaming can add, update, and remove memories; changes to checked-in skills and instructions are proposed in pull requests ([changelog](https://github.blog/changelog/2026-10-28-github-intelligence-puts-your-code-context-and-history-to-work), [admin docs](https://docs.github.com/copilot/how-tos/use-copilot-agents/copilot-memory/manage-as-administrator#enabling-copilot-dreaming))
- Models (enable specific/custom models, may add cost)

### Enterprise-assigned users

> **Official documentation**
> - [How policies work for enterprise-assigned users](https://docs.github.com/en/copilot/concepts/policies#how-do-policies-work)

Users who receive Copilot directly from the enterprise (not via an org) aren't covered by "Let organizations decide" — a separate **Policies for enterprise-assigned users** setting decides whether those policies default to enabled or disabled for them.

### Default availability of new features and models

> **Official documentation**
> - [Default availability for Copilot features and models](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)

Two enterprise/org policies control whether unconfigured GA (general availability) items are enabled by default:
- **Default policy for new features** — GitHub began enforcing this policy on October 22, 2026, with rollout continuing gradually through October 26. It applies the selected default once to new GA features, features moving preview→GA, and existing GA features left **Unconfigured**; explicit choices are preserved, and preview features remain opt-in. The policy is enabled by default. It covers everything on the enterprise "Features & clients" page, plus the **Copilot code review** policy (Agents page) and the **MCP servers in Copilot** policy (MCP page). It does **not** apply to the data-residency/FedRAMP restrictive model policies or **Store local sessions in the Cloud**.
- **Default availability for released models** — already active; auto-enables new/unconfigured GA models (those labeled **Delegate to Default Policy**). Out of scope and disabled by default regardless of this setting: pre-GA models, open-weight models (DeepSeek, Kimi K2.7 Code, Kimi K3), models not covered by GitHub's data-retention agreement (Claude Fable 5, Claude Fable 5.1), and — for enterprises restricted to data-residency or FedRAMP models — any model that doesn't respect those restrictions.
- Disable either policy at the enterprise or org level to stop auto-enablement; individual features/models can still be explicitly disabled to opt them out while the default policy stays on.

**Training talking point:** "MCP servers in Copilot" being ON does not mean any server can run — it just unlocks MCP capability; the *allowlist* ([`managed-settings.json`]({{ '/sections/managed-settings/' | relative_url }})) does the actual restricting.

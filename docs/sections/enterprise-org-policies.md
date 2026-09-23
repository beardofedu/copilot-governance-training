---
layout: default
title: "Enterprise & Org Policies (AI controls)"
nav_order: 2
permalink: /sections/enterprise-org-policies/
---

# Enterprise & Org Policies (AI controls)

**Where:** Enterprise → **AI controls** tab → **Copilot** → *Policies* / *Models*. Org → Settings → Copilot → *Policies* / *Models*.
Doc: [GitHub Copilot policies for enterprises and organizations](https://docs.github.com/en/copilot/concepts/policies)

Each policy is set to **Enabled everywhere / Disabled everywhere / Let organizations decide** (enterprise level). Orgs cannot override an enterprise "everywhere" setting.

Confirmed named policies ([policy-conflicts](https://docs.github.com/en/copilot/reference/enterprise-administrators/policy-conflicts), [supported-surfaces](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies)):
- Copilot Chat in the IDE / Chat agent mode / Chat in GitHub Mobile
- "Copilot can search the web"
- Copilot code review (+ sub-policy: allow unlicensed members to use code review on GitHub.com)
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
- Restrict MCP access to registry servers (governs IDEs/CLI/Copilot app only — no effect on cloud agent or third-party agents; see [supported-surfaces-for-policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies))
- Copilot Memory (governs cloud agent, third-party agents, CLI, and Spark — **not** IDEs or the Copilot app; see [supported-surfaces-for-policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies))
- Models (enable specific/custom models, may add cost)

**Enterprise-assigned users:** users who receive Copilot directly from the enterprise (not via an org) aren't covered by "Let organizations decide" — a separate **Policies for enterprise-assigned users** setting decides whether those policies default to enabled or disabled for them ([policies doc](https://docs.github.com/en/copilot/concepts/policies#how-do-policies-work)).

**Training talking point:** "MCP servers in Copilot" being ON does not mean any server can run — it just unlocks MCP capability; the *allowlist* (`managed-settings.json`, section 3) does the actual restricting.

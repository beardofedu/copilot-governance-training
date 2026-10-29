---
layout: default
title: "Copilot Coding (Cloud) Agent Restrictions"
nav_order: 6
permalink: /sections/cloud-agent/
last_reviewed: 2026-10-29
---

# Copilot Coding (Cloud) Agent Restrictions

### Network firewall
> **Official documentation**
> - [Customize the cloud agent firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)

- Configured via **"Internet access" tab** (org and repo level); covers both cloud agent and Copilot code review.
- Default: firewalled, with a recommended allowlist (OS package managers, container registries, language registries, CAs, Playwright download hosts) enabled.
- Blocked requests show up as a **warning in the PR body/comment** (address + command).
- **Limitations:** only covers processes launched via the agent's Bash tool — **does not cover MCP servers or setup-step processes**; only active inside the GitHub Actions appliance; not a comprehensive security boundary, so don't treat it as a substitute for allowlisting MCP servers.

### Workflow & merge safety
> **Official documentation**
> - [Configuring cloud agent settings](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/configuring-agent-settings)
>
> **Related sections:** [Network-Level Controls]({{ '/sections/network-controls/' | relative_url }})

- GitHub Actions workflows **do not auto-run** on agent-authored pushes by default — a human must click "Approve and run workflows," especially important if the diff touches `.github/workflows/`.
- Repo admins can toggle built-in validation tools (security scanning, code-review "second opinion") for the cloud agent.
- Agent changes always land as a PR requiring human review/merge.

### MCP + cloud agent
Cloud agent supports `allowedMcpServers`/`deniedMcpServers`/`enabledPlugins`/`extraKnownMarketplaces` via [managed settings]({{ '/sections/managed-settings/' | relative_url }}), but is **excluded** from [MCP private-registry enforcement]({{ '/sections/mcp-governance/#mcp-registry-public-preview--not-the-recommended-method' | relative_url }}) and from `permissions.disableBypassPermissionsMode`, `sandbox`, `telemetry`, `remoteControl`.

### Copilot Automations: triggers, tools, and cost controls
> **Official documentation**
> - [Changelog: New tools, triggers, and cost controls for Copilot Automations](https://github.blog/changelog/2026-10-28-new-tools-triggers-and-cost-controls-for-copilot-automations)
> - [Create automations (cloud agent)](https://docs.github.com/copilot/how-tos/use-copilot-agents/cloud-agent/create-automations#setting-ai-credits-limits)

- Automations combine prompts, **triggers** (when to run), and **tools** (what the automation may do); each automation uses only the tools you select.
- New triggers: the REST API (external systems), 24 more GitHub events, and chaining via "Automation run succeeded/failed" triggers. A trigger's **"Can be triggered by"** setting defaults to `Only users`; `Users and Copilot` lets Copilot-authored events (such as a PR opened by Copilot) fire it.
- New tools include merging pull requests and retrying workflow runs, plus tools from custom MCP servers — review these when approving automations.
- **Cost controls:** optional AI-credit limits per run, day, week, or month. Automations without limits run as before.

### Custom instructions honored by cloud agent
> **Official documentation**
> - [Best practices for using Copilot to work on tasks: adding custom instructions](https://docs.github.com/en/copilot/tutorials/cloud-agent/get-the-best-results#adding-custom-instructions-to-your-repository)

Cloud agent reads, in addition to org-wide custom instructions: `.github/copilot-instructions.md` (repo-wide), `.github/instructions/**/*.instructions.md` (path-specific), `AGENTS.md`, `CLAUDE.md`, and `GEMINI.md` — all discovered automatically, no managed-settings toggle required.

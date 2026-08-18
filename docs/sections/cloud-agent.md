---
layout: default
title: "Copilot Coding (Cloud) Agent Restrictions"
nav_order: 6
permalink: /sections/cloud-agent/
---

# Copilot Coding (Cloud) Agent Restrictions

### a. Network firewall
Doc: [Customize the cloud agent firewall](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall)

- Configured via **"Internet access" tab** (org and repo level); covers both cloud agent and Copilot code review.
- Default: firewalled, with a recommended allowlist (OS package managers, container registries, language registries, CAs, Playwright download hosts) enabled.
- Blocked requests show up as a **warning in the PR body/comment** (address + command).
- **Limitations:** only covers processes launched via the agent's Bash tool — **does not cover MCP servers or setup-step processes**; only active inside the GitHub Actions appliance; not a comprehensive security boundary, so don't treat it as a substitute for allowlisting MCP servers.

### b. Workflow & merge safety
Doc: [Configuring cloud agent settings](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/configuring-agent-settings)

- GitHub Actions workflows **do not auto-run** on agent-authored pushes by default — a human must click "Approve and run workflows," especially important if the diff touches `.github/workflows/`.
- Repo admins can toggle built-in validation tools (security scanning, code-review "second opinion") for the cloud agent.
- Agent changes always land as a PR requiring human review/merge.

### c. MCP + cloud agent
Cloud agent supports `allowedMcpServers`/`deniedMcpServers`/`enabledPlugins`/`extraKnownMarketplaces` via managed-settings, but is **excluded** from MCP private-registry enforcement (4c) and from `permissions.disableBypassPermissionsMode`, `sandbox`, `telemetry`, `remoteControl`.

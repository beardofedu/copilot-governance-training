---
layout: default
title: "Plugin Marketplace Governance (the setting that kicked this off)"
nav_order: 5
permalink: /sections/plugin-marketplaces/
---

# Plugin Marketplace Governance (the setting that kicked this off)

Doc: [strictKnownMarketplaces reference](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#strictknownmarketplaces) | [Plugins & marketplaces](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace)

- A **marketplace** = a `marketplace.json` manifest (in `.github/plugin/` of a repo, or `.claude-plugin/`) listing installable CLI plugins.
- Source types: GitHub repo (`OWNER/REPO`, optionally `:PATH`), any git URL, or local directory.
- **`strictKnownMarketplaces`**: empty array = complete lockdown (no marketplace installs at all); listing entries restricts installs to only those sources.
- **`extraKnownMarketplaces`**: adds enterprise-approved marketplaces (works alongside strict mode).
- **`enabledPlugins`**: fine-grained enable/disable of specific plugins by `PLUGIN-NAME@MARKETPLACE-NAME`. If managed settings pre-enable a plugin, the client auto-installs it — the user still needs read access to the hosting repo.

**This is the setting the customer originally asked about — it's one lever among many, specifically for the plugin/extension ecosystem, separate from MCP server governance.**

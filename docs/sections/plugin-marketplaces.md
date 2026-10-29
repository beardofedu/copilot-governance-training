---
layout: default
title: "Plugin Marketplace Governance"
nav_order: 5
permalink: /sections/plugin-marketplaces/
last_reviewed: 2026-10-29
---

# Plugin Marketplace Governance

> **Official documentation**
> - [Enterprise managed settings reference: `strictKnownMarketplaces`](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#strictknownmarketplaces)
> - [Plugins and marketplaces](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/plugins-marketplace)
>
> **Related section:** [Managed Settings: supported keys]({{ '/sections/managed-settings/#supported-keys' | relative_url }})

- A **marketplace** = a `marketplace.json` manifest (in `.github/plugin/` of a repo, or `.claude-plugin/`) listing installable CLI plugins.
- **`strictKnownMarketplaces`** source types:
  - `"github"` — `OWNER/REPO`, optional `ref`/`path`
  - `"git"` — `url`, optional `ref`/`path`
  - `"url"` — `url`, optional `headers`
  - `"npm"` — `package`
  - `"file"` — `path`
  - `"directory"` — `path`
  - `"hostPattern"` — regex on marketplace host
  - `"pathPattern"` — regex on marketplace path
- **`extraKnownMarketplaces`** source types are a narrower subset: `"github"`, `"git"`, and `"directory"` only.
- **`strictKnownMarketplaces`**: empty array = complete lockdown (no marketplace installs at all); listing entries restricts installs to only those sources.
- **`extraKnownMarketplaces`**: adds enterprise-approved marketplaces (works alongside strict mode); each entry supports an `autoUpdate` boolean that users cannot override once managed settings set it.
- **`enabledPlugins`**: fine-grained enable/disable of specific plugins by `PLUGIN-NAME@MARKETPLACE-NAME`. If managed settings pre-enable a plugin, the client auto-installs it — the user still needs read access to the hosting repo.

## Repository defaults and enterprise plugin controls (GA)

Per the [October 28 changelog](https://github.blog/changelog/2026-10-28-repository-plugin-defaults-and-enterprise-plugin-controls-generally-available), both features are generally available in VS Code, Copilot CLI, and the GitHub Copilot app.

| Capability | What it does | Availability |
|---|---|---|
| Repository plugin defaults | Maintainers define a plugin marketplace and default plugins in trusted repositories; contributors get them installed and enabled automatically and can turn defaults off where policy permits | Individual Copilot users, Copilot Business, Copilot Enterprise |
| Enterprise managed plugin controls | Admins supply approved marketplaces and require or block plugins via managed settings; required plugins are installed and enabled automatically and users can't disable them | GitHub Enterprise Cloud with Copilot Business or Copilot Enterprise licenses issued by the enterprise or one of its organizations |

- Managed settings take precedence over repository and personal choices ([changelog](https://github.blog/changelog/2026-10-28-repository-plugin-defaults-and-enterprise-plugin-controls-generally-available)).
- More background: [plugins for GitHub Copilot](https://docs.github.com/copilot/concepts/customizations/plugins).

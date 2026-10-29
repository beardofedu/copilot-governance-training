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

- **GA (2026-10-28):** repository plugin defaults and enterprise-managed plugin controls are generally available in VS Code, Copilot CLI, and the GitHub Copilot app. Enterprises can require plugins (auto-installed, users cannot disable), block plugins, and restrict installs to approved marketplaces via managed settings, which take precedence over repository and personal choices. Managed controls need GitHub Enterprise Cloud with Copilot Business or Copilot Enterprise licenses issued by the enterprise or one of its organizations; repository defaults are also available to individual users. Contributors can turn off repository defaults where policy permits. ([changelog](https://github.blog/changelog/2026-10-28-repository-plugin-defaults-and-enterprise-plugin-controls-generally-available), [plugins docs](https://docs.github.com/copilot/concepts/customizations/plugins))
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

---
layout: default
title: "Plugin Marketplace Governance"
nav_order: 5
permalink: /sections/plugin-marketplaces/
last_reviewed: 2026-11-05
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
- **GA (Oct 28, 2026):** repository plugin defaults and enterprise-managed plugin controls are generally available in VS Code, Copilot CLI, and the GitHub Copilot app. Trusted repositories can define a marketplace and default plugins; contributors can turn off repository defaults where policy permits. Enterprises can supply approved marketplaces and require or block plugins through managed settings. Required plugins are installed and enabled automatically and users can't disable them; managed settings take precedence over repository and personal choices. Repository defaults are available to individual users and Copilot Business/Enterprise; managed controls require GitHub Enterprise Cloud with Copilot Business or Enterprise licenses issued by the enterprise or one of its organizations ([source](https://github.blog/changelog/2026-10-28-repository-plugin-defaults-and-enterprise-plugin-controls-generally-available)).
- **Example plugin: GitHub security extension (public preview, Oct 28, 2026):** the `github-security` plugin for the Copilot app (`copilot plugin install github-security@awesome-copilot`) surfaces code scanning alerts and runs `/security-review` on local changes. When fixing code, Copilot only edits the local working copy and never commits or pushes; Explain, Fix and `/security-review` consume AI credits. Dismissing an alert updates it on GitHub and requires permission to dismiss code scanning alerts; when delegated alert dismissal requires approval for the user's role, the extension submits a dismissal request instead. Viewing existing alerts requires code scanning enabled and access to the repository's alerts; private repositories require GitHub Code Security. Neither code scanning nor a GitHub Code Security license is required for a local `/security-review` ([docs](https://docs.github.com/en/copilot/how-tos/github-copilot-app/view-and-fix-security-alerts)). For Copilot Business/Enterprise an administrator must enable the GitHub Copilot app policy, and enterprise managed settings control which plugins developers can install. Supported on github.com and GitHub Enterprise Cloud with data residency, not GitHub Enterprise Server ([source](https://github.blog/changelog/2026-10-28-security-extension-for-the-github-copilot-app)).
- **`strictPluginOnlyCustomization` (Nov 16, 2026):** blocks standalone customizations from user and project sources; eligible plugins and managed settings remain allowed, subject to other policies. Apply it to all five supported categories or select individual ones: skills, custom agents, hooks, MCP servers, and executable Copilot extensions (including executable canvas providers, not VS Code Marketplace extensions). Plugin-only does not mean enterprise-managed plugins only and is not a marketplace allowlist; pair it with `strictKnownMarketplaces` to restrict eligible marketplace sources. Configurable on GitHub Enterprise Cloud for members with Copilot Business or Enterprise licenses issued by the enterprise or one of its organizations ([source](https://github.blog/changelog/2026-11-16-control-where-github-copilot-customizations-come-from)). The announcement links [plugin marketplace and plugin management docs](https://docs.github.com/enterprise-cloud@latest/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/manage-plugin-marketplaces-and-plugins); the value format is not yet in the managed settings reference (see [Known Gaps]({{ '/sections/known-gaps/' | relative_url }})).
- **`enabledPlugins`**: fine-grained enable/disable of specific plugins by `PLUGIN-NAME@MARKETPLACE-NAME`. If managed settings pre-enable a plugin, the client auto-installs it — the user still needs read access to the hosting repo.

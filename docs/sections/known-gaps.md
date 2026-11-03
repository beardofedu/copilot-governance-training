---
layout: default
title: "Known Gaps to Verify"
nav_order: 14
permalink: /sections/known-gaps/
last_reviewed: 2026-11-03
---

# Known Gaps to Verify

Reviewed against official GitHub documentation on **November 3, 2026**.

## Verified answers

### Copilot app sandbox support

> **Official sources**
> - [Local sandboxing is generally available in Copilot](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/)
> - [Enterprise managed settings reference: `sandbox`](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)
> - [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes)

GitHub announced that **local sandboxing** is generally available in Copilot CLI, the GitHub Copilot app, and VS Code Agent Host sessions. The managed settings reference lists `sandbox` as supported in the app. The public-preview notice in the sandbox overview applies to **cloud** sandboxes, not local sandboxing. Keep the distinction clear; managed settings support remains subject to the documented client requirements.

### Default policy for new features

> **Official documentation**
> - [Default availability for Copilot features and models](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)

The [October 22 changelog](https://github.blog/changelog/2026-10-22-global-default-for-copilot-features-generally-available/) announced that enforcement would roll out gradually through **October 26**, with timing varying per enterprise. The rollout applies the selected default once to eligible GA features that remain **Unconfigured**; explicit choices are preserved, and previews stay opt-in. The current [default availability page](https://docs.github.com/en/copilot/concepts/enterprise/default-availability) now describes the policy's behavior without the former "not currently active" wording. For a specific enterprise, check its AI Controls to confirm the policy and eligible feature settings.

### GitHub-verified MCP connectors and governance

> **Official documentation**
> - [MCP server usage in your company](https://docs.github.com/en/copilot/concepts/enterprise/mcp-management)
> - [Copilot connectors](https://docs.github.com/en/copilot/concepts/customizations/copilot-connectors)

The policy interactions are now documented. Connectors require **Editor preview features** and **MCP servers in Copilot** to be enabled. On clients that enforce the relevant controls, **Registry only** blocks connectors, and an `allowedMcpServers` allowlist must include their URLs; a matching `deniedMcpServers` entry still blocks them. These details resolve the prior question about registry and allowlist interactions; check the supported surfaces because enforcement varies by client.

### Copilot Memory policy coverage and dreaming

> **Official sources**
> - [About GitHub Copilot Memory](https://docs.github.com/en/copilot/concepts/prompting-and-context/copilot-memory)
> - [Supported surfaces for policies](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies)
> - [Managing Copilot Memory for an enterprise, organization, or repository](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/copilot-memory/manage-as-administrator)

The Memory guide says repository facts are supported in code review, while user-level preferences are not; Slack and Teams sessions started through Copilot cloud agent follow cloud-agent behavior. The policy reference explicitly limits VS Code support to Local Agent Host sessions with the app's Memory setting enabled, and app support to accounts where Memory is available. The guide lists GitHub Mobile as a Memory surface; its policy coverage remains unclear (see open questions). Dreaming is a separate control in the **Memory** policy section, and its repository scope follows the Memory repository-access selection.

## Open questions

### Server-to-server authentication for Copilot SDK apps

> **Official documentation**
> - [Server-to-server authentication](https://github.blog/changelog/2026-10-27-github-copilot-supports-server-to-server-authentication)
> - [Reviewing audit logs for GitHub Copilot](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/review-audit-logs)

Public preview: GitHub Apps installed on organizations can make Copilot SDK requests without a signed-in user. Requests are attributed and billed to the organization that owns the app installation; that organization's model policies, budgets, and spending controls apply. AI usage CSV reports identify the app through `app_client_id`. The post does not specify whether these requests appear in audit logs.

### Copilot Memory policy on GitHub Mobile

The [Memory guide](https://docs.github.com/en/copilot/concepts/prompting-and-context/copilot-memory) lists GitHub Mobile as a supported surface, but the [policy surfaces reference](https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies) does not list mobile separately. Confirm whether the account/app policy coverage described there also governs Memory use in GitHub Mobile.

### Complete managed-settings validation error catalog

> **Official documentation**
> - [Getting started with enterprise-managed settings: validate and check settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings)

The guide confirms that validation checks `copilot/managed-settings.json`, `copilot/team-mappings.json`, and team files referenced by the mappings. It says each issue identifies the affected file and JSON path and is shown as an error or warning, but does not provide a complete list of error/warning codes. Review reported issues; update this guidance if GitHub publishes a fuller reference.

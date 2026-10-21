---
layout: default
title: "Known Gaps to Verify"
nav_order: 14
permalink: /sections/known-gaps/
last_reviewed: 2026-10-16
---

# Known Gaps to Verify

Reviewed against official GitHub documentation on **October 16, 2026**.

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

GitHub says the policy is configurable but **not yet active** and is scheduled to apply starting **October 22, 2026**. It is enabled by default; absent a change to the schedule or policy, unconfigured eligible features will be enabled then. Recheck the documentation after that date before saying the behavior is live.

## Still to verify

### Settings validation error taxonomy

> **Official documentation**
> - [Getting started with enterprise-managed settings: validate and check settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings)

The guide confirms that validation checks `copilot/managed-settings.json`, `copilot/team-mappings.json`, and team files referenced by the mappings. It says each issue identifies the affected file and JSON path and is shown as an error or warning, but does not provide a complete list of error/warning codes. Continue to review the reported issues; update this guidance if GitHub publishes a fuller reference.

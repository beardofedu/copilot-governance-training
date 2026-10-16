---
layout: default
title: "Known Gaps to Verify"
nav_order: 14
permalink: /sections/known-gaps/
---

# Known Gaps to Verify

Reviewed against official GitHub documentation on **October 16, 2026**.

## Verified answers

- **Copilot app sandbox support:** GitHub announced that **local sandboxing** is generally available in Copilot CLI, the GitHub Copilot app, and VS Code Agent Host sessions in its [October 7 announcement](https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/). The [enterprise managed settings reference](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox) lists `sandbox` as supported in the app. The public-preview notice in GitHub's [sandbox overview](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes) applies to **cloud** sandboxes, not local sandboxing. Keep the distinction clear; managed settings support remains subject to the documented client requirements.
- **Default policy for new features:** GitHub says the policy is configurable but **not yet active** and is scheduled to apply starting **October 22, 2026**. It is enabled by default; absent a change to the schedule or policy, unconfigured eligible features will be enabled then. Recheck the [default availability documentation](https://docs.github.com/en/copilot/concepts/enterprise/default-availability) after that date before saying the behavior is live.

## Still to verify

- **Settings validation error taxonomy:** The [managed settings setup guide](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings) confirms that validation checks `copilot/managed-settings.json`, `copilot/team-mappings.json`, and team files referenced by the mappings. It says each issue identifies the affected file and JSON path and is shown as an error or warning, but does not provide a complete list of error/warning codes. Continue to review the reported issues; update this guidance if GitHub publishes a fuller reference.

---
layout: default
title: "Known Gaps to Verify"
nav_order: 14
permalink: /sections/known-gaps/
---

# Known Gaps to Verify

Reviewed against official GitHub documentation on **October 16, 2026**.

## Verified answers

- **Copilot app sandbox support:** The [enterprise managed settings reference](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox) now lists `sandbox` as supported in the GitHub Copilot app. It does not label that support as public preview or GA, so the current documentation answers that the preview label is absent, but does not establish the feature's lifecycle status. Do not describe it as GA based on this reference alone.
- **Default policy for new features:** GitHub says the policy is configurable but **not yet active** and is scheduled to apply starting **October 22, 2026**. It is enabled by default; absent a change to the schedule or policy, unconfigured eligible features will be enabled then. Recheck the [default availability documentation](https://docs.github.com/en/copilot/concepts/enterprise/default-availability) after that date before saying the behavior is live.

## Still to verify

- **Sandbox lifecycle:** The official managed-settings reference does not publish a GA date or stability timeline for app-side `sandbox` enforcement. Until GitHub documents one, avoid making stronger lifecycle claims or treating a particular enforcement level as a production guarantee.
- **Settings validation error taxonomy:** The [managed settings setup guide](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings) confirms that validation checks `copilot/managed-settings.json`, `copilot/team-mappings.json`, and team files referenced by the mappings. It says each issue identifies the affected file and JSON path and is shown as an error or warning, but does not provide a complete list of error/warning codes. Continue to review the reported issues; update this guidance if GitHub publishes a fuller reference.

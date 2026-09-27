---
layout: default
title: "Known Gaps to Verify"
nav_order: 14
permalink: /sections/known-gaps/
---

# Known Gaps to Verify

- The `sandbox` managed-settings key's support for the **GitHub Copilot app is documented as public preview** ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)); no GA date or stability timeline is published yet — re-check before treating app-side sandbox enforcement as a hard guarantee in production guidance.
- The **Default policy for new features** (see Enterprise & Org Policies) is scheduled to activate **October 22, 2026** but is not active yet as of this writing — confirm activation actually occurred (and that the date wasn't pushed back) before telling admins the "unconfigured features auto-enable" behavior is live ([default-availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)).
- The "Copilot settings validation" panel on the enterprise **Agents** tab checks `copilot/managed-settings.json`, `copilot/team-mappings.json`, and referenced team-settings files ([get-started#4-validate-and-check-the-settings](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started#4-validate-and-check-the-settings)), but the docs don't yet specify the full taxonomy of error/warning codes it can raise — treat "review errors and warnings" as the current level of detail until a fuller reference is published.

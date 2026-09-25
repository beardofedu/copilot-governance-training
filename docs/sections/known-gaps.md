---
layout: default
title: "Known Gaps to Verify"
nav_order: 14
permalink: /sections/known-gaps/
---

# Known Gaps to Verify

- The `model` and `permissions.*` managed-settings keys support per-team overrides via `{ "overridable": ... }` syntax and `copilot/team-mappings.json` (documented in `managed-settings.md`), but the exact set of *other* keys enterprises can mark overridable beyond the ones already listed (`allowedMcpServers`, `deniedMcpServers`) wasn't independently re-verified this pass — treat the current site list as the source of truth until the next full re-check.
- The `sandbox` managed-settings key's support for the **GitHub Copilot app is documented as public preview** ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)); no GA date or stability timeline is published yet — re-check before treating app-side sandbox enforcement as a hard guarantee in production guidance.
- The **Default policy for new features** (see Enterprise & Org Policies) is scheduled to activate **October 22, 2026** but is not active yet as of this writing — confirm activation actually occurred (and that the date wasn't pushed back) before telling admins the "unconfigured features auto-enable" behavior is live ([default-availability](https://docs.github.com/en/copilot/concepts/enterprise/default-availability)).

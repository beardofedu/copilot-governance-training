---
layout: default
title: "Plan-Tier Gating"
nav_order: 12
permalink: /sections/plan-tier-gating/
last_reviewed: 2026-10-29
---

# Plan-Tier Gating

- All of the above governance controls require **Copilot Business or Enterprise** seats — Free/Pro/Pro+/Max plans carry no org/enterprise policy control. Copilot included with GitHub Enterprise or Copilot Standalone (below) is a third route to enterprise-managed access; whether every control above applies to it is not confirmed — see [Known Gaps]({{ '/sections/known-gaps/' | relative_url }}).
- Copilot governance features are **GHEC (Enterprise Cloud) only** — not available on GitHub Enterprise Server.

### Copilot included with GitHub Enterprise
> **Official documentation**
> - [Changelog: GitHub Enterprise now includes access to GitHub Copilot](https://github.blog/changelog/2026-10-28-github-enterprise-now-includes-access-to-github-copilot)
> - [Copilot access with GitHub Enterprise](https://docs.github.com/copilot/get-started/whats-changing-with-github-enterprise-and-copilot)

- Enterprises working with a GitHub or Microsoft account team can get Copilot included for every licensed GitHub Enterprise user (GitHub Enterprise Cloud). Self-serve availability is **not yet open** and is coming in stages; Copilot Business and Copilot Enterprise remain purchasable.
- Enterprise users without a GitHub Enterprise license get the same access through **Copilot Standalone** ($10/user/month).
- Same features and models as Copilot Enterprise, but **no monthly AI credits per seat**: usage is metered against the enterprise budget from the first request.
- Budget exhaustion never removes the seat: code completion and next edit suggestions keep working with no budget; Copilot Chat, Copilot code review, and Copilot in the cloud need available budget.

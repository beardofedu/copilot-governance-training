---
layout: default
title: "Model & Data Governance"
nav_order: 11
permalink: /sections/model-data-governance/
---

# Model & Data Governance

> **Official documentation**
> - [Hosting of models for GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)

- Enterprise/org **Models** tab controls which models are selectable (cost implications for non-default models); enterprise policy overrides org choice.
- **Model policy REST API (GA)** — `GET`/`PATCH` endpoints manage Copilot model policies at four levels: enterprise (`/enterprises/{enterprise}/copilot/model-policies`), enterprise teams (`/enterprises/{enterprise}/teams/{team_slug}/copilot/model-policies`), enterprise apps (`/enterprises/{enterprise}/copilot/apps/model-policies`), and organization (`/orgs/{org}/copilot/model-policies`). Enterprise policies can delegate model control to organizations (organization mode) or to teams and apps (enterprise teams mode) ([changelog](https://github.blog/changelog/2026-10-19-copilot-model-policy-api-for-enterprise-orgs-and-teams/)).
- GitHub maintains zero-data-retention agreements with OpenAI/Anthropic/Google for GA models — no admin toggle needed, it's contractual, **except** Claude "Fable" style safety-classifier models which require explicit admin opt-in due to different retention terms.
- Multi-license conflict rule: same-enterprise multi-org → least restrictive; cross-enterprise → most restrictive.

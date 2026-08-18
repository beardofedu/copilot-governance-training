---
layout: default
title: "Model & Data Governance"
nav_order: 11
permalink: /sections/model-data-governance/
---

# Model & Data Governance

Doc: [Hosting of models for GitHub Copilot](https://docs.github.com/en/copilot/reference/ai-models/model-hosting)

- Enterprise/org **Models** tab controls which models are selectable (cost implications for non-default models); enterprise policy overrides org choice.
- GitHub maintains zero-data-retention agreements with OpenAI/Anthropic/Google for GA models — no admin toggle needed, it's contractual, **except** Claude "Fable" style safety-classifier models which require explicit admin opt-in due to different retention terms.
- Multi-license conflict rule: same-enterprise multi-org → least restrictive; cross-enterprise → most restrictive.

---
layout: default
title: "Content & Suggestion Controls"
nav_order: 8
permalink: /sections/content-controls/
---

# Content & Suggestion Controls

### a. Content exclusion
Doc: [Excluding content from GitHub Copilot](https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot)

- Prevents specified files/paths from being used as Copilot context (fnmatch-style patterns, e.g. `*.cfg`, `/scripts/**`).
- Configurable at repo level (and org/enterprise scope for broader reach).
- **Critical limitation to flag in training:** *Copilot CLI and Agent mode in Copilot Chat (IDEs) do not honor content exclusion.* Don't rely on this alone if agentic surfaces are in scope.

### b. Suggestions matching public code
Docs: [Code suggestions](https://docs.github.com/en/copilot/concepts/completions/code-suggestions), [Finding matching public code](https://docs.github.com/en/copilot/how-tos/get-code-suggestions/find-matching-code)

- Org/enterprise policy: **Block** (suppress ~150+ char matches to public code) vs **Allow** (show with code-reference/license transparency).
- One of the "most-restrictive-wins" policies across multi-org licensing — org-level setting overrides individual user preference when managed.

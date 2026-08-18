---
name: Copilot Governance Watch
description: Reviews the GitHub Blog changelog and GitHub Copilot documentation daily and opens a pull request updating the governance training site.
emoji: 🛡️
on:
  schedule:
    - cron: daily around 09:00
  workflow_dispatch: null
permissions:
  contents: read
  issues: read
  pull-requests: read
network:
  allowed:
    - defaults
    - github
engine: copilot
timeout-minutes: 30
max-daily-ai-credits: 5000
tracker-id: copilot-governance-watch
tools:
  cache-memory: true
  edit: null
  web-fetch: null
  bash:
    - "date *"
    - "ls *"
    - "cat *"
    - "grep *"
    - "rg *"
    - "find *"
  github:
    mode: remote
    toolsets:
      - default
safe-outputs:
  create-pull-request:
    draft: false
    title-prefix: "[governance] "
    labels:
      - documentation
      - automation
      - copilot-governance
  noop: null
---

# Copilot Governance Watch

You maintain the **Locking Down GitHub Copilot** enterprise guardrails training site published from `docs/` in this repository via GitHub Pages.

Your job runs once per day: find what changed in GitHub Copilot governance, and open a pull request that keeps the training content accurate and complete.

## Current context

- **Repository**: ${{ github.repository }}
- **Run ID**: ${{ github.run_id }}
- **Site source**: `docs/` (Jekyll). Section pages live in `docs/sections/*.md`, the landing page is `docs/index.md`.
- **Change log of prior runs**: `docs/CHANGELOG.md`

## Step 1 — Establish the review window

1. Run `date -u "+%Y-%m-%d"` to get today's date.
2. Read `docs/CHANGELOG.md`. The most recent entry tells you the last date this workflow reviewed sources.
   - If the file is missing or empty, review the last **14 days**.
   - Otherwise, review everything published since that date.
3. Read the cache-memory notes (if any) for sources you already evaluated and rejected, so you do not re-propose the same change.

## Step 2 — Review the sources

Review both of these, restricted to the window from Step 1.

### a. GitHub Blog + Changelog

- `https://github.blog/changelog/` and `https://github.blog/`
- Filter for anything touching: Copilot policies / AI controls, enterprise managed settings, MCP servers and registries, plugins and marketplaces, the Copilot cloud agent, Copilot CLI, content exclusion, public-code matching, audit logs, usage metrics, models and data retention, network/firewall controls, plan tiers.
- Ignore pure product-marketing posts with no admin/governance surface.

### b. GitHub Copilot documentation

Fetch and compare against the current site content, focusing on:

- `https://docs.github.com/en/copilot/concepts/policies`
- `https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings`
- `https://docs.github.com/en/copilot/reference/enterprise-administrators/policy-conflicts`
- `https://docs.github.com/en/copilot/reference/supported-surfaces-for-policies`
- `https://docs.github.com/en/copilot/concepts/mcp-management`
- `https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-mcp-usage/configure-enterprise-allowlist`
- `https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-the-firewall`
- `https://docs.github.com/en/copilot/how-tos/configure-content-exclusion/exclude-content-from-copilot`
- `https://docs.github.com/en/copilot/reference/copilot-allowlist-reference`
- `https://docs.github.com/en/copilot/reference/agentic-audit-log-events`

Also resolve any item listed in `docs/sections/known-gaps.md` that the live docs can now confirm or refute.

## Step 3 — Diff against the site

For every candidate change, classify it:

- **Correction** — the site states something the docs now contradict (a key moved, support matrix changed, preview shipped to GA, behavior changed).
- **Addition** — a new control, policy, managed-settings key, or surface exists that the site does not cover at all.
- **Gap resolution** — an item in `docs/sections/known-gaps.md` is now answerable.
- **No change** — already accurate, or not governance-relevant.

Only act on changes you can cite to a specific GitHub Blog post or docs page. **Do not speculate.** If the docs are ambiguous, record it under Known Gaps instead of asserting a behavior.

## Step 4 — Make the edits

If you found nothing actionable, emit **noop** with a one-line explanation. Do not open an empty pull request.

Otherwise edit files under `docs/`:

- Update the relevant existing section page(s) in place, preserving their YAML frontmatter (`layout`, `title`, `nav_order`, `permalink`) exactly.
- For a genuinely new topic that fits no existing section, create `docs/sections/<slug>.md` with frontmatter matching the existing pattern and the next available `nav_order`, placing it before `course-outline`. Renumber `nav_order` on later pages if needed.
- Keep the existing voice: dense, table-driven, admin-focused, with inline doc links.
- Every factual claim you add or change must carry a markdown link to its source docs page or blog post.
- Update `docs/sections/known-gaps.md` — remove resolved items, add new ambiguities.
- Update the training outline in `docs/sections/course-outline.md` if a new section materially changes what should be taught.
- Prepend a dated entry to `docs/CHANGELOG.md` (create it if absent) in this shape:

```markdown
## YYYY-MM-DD

- **Corrected** — <what changed> ([source](url))
- **Added** — <what is new> ([source](url))
```

Do not touch files outside `docs/`.

## Step 5 — Open the pull request

Create a pull request with:

- **Title**: a short summary of the substantive change, e.g. `MCP registry enforcement reaches GA` — the `[governance]` prefix is added automatically.
- **Body**:
  - A one-paragraph summary of what changed upstream and why the site needed updating.
  - A table of every edit: file, change type (Correction/Addition/Gap resolution), and the source link.
  - A **Review notes** section calling out anything you were unsure about or deliberately left as a known gap.
  - The review window dates you used.

Save a short note to cache-memory recording the date reviewed and the sources you evaluated, so tomorrow's run does not duplicate work.

## Guardrails

- Never invent policy names, managed-settings keys, or support-matrix values. Cite or omit.
- Never remove content because you could not find its source — move it to Known Gaps with a note.
- Prefer small, focused pull requests. If you find many unrelated changes, prioritize corrections over additions.
- Preserve site build integrity: valid frontmatter, valid markdown tables, no broken relative links.

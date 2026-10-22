# copilot-governance-training

**Locking Down GitHub Copilot — Full Enterprise Guardrails Guide**

A training site covering every enterprise/org-level mechanism to restrict, govern, and audit GitHub Copilot usage.

📖 **Published site:** https://beardofedu.github.io/copilot-governance-training/

## Repository layout

| Path | Purpose |
|---|---|
| `docs/` | Jekyll source for the GitHub Pages site |
| `docs/index.md` | Landing page and section index |
| `docs/sections/*.md` | One page per guide section |
| `docs/_layouts/default.html` | Control Plane shell: header, numbered section nav, article, "In this article" TOC |
| `docs/assets/css/style.css` | Theme tokens (system, light, dark, dark dimmed, high contrast) and page styles |
| `docs/assets/js/site.js` | Theme picker persisted in `localStorage`, TOC generation, mobile nav |
| `docs/assets/js/search.js` | Local full-text search, heading links, highlighting, and keyboard navigation |
| `docs/search.json` | Liquid-generated search index for the overview, guide sections, and changelog |
| `docs/CHANGELOG.md` | Dated record of automated content updates |
| `docs/_data/governance-watch-state.json` | Last date Governance Watch actually reviewed each source (blog, docs); sets each source's review window |
| `test-suite/` | Automated and behavioral governance control tests |
| `.github/workflows/pages.yml` | Builds and deploys the site on push to `main` |
| `.github/workflows/copilot-governance-watch.md` | Agentic workflow source ([gh-aw](https://github.com/github/gh-aw)) |
| `.github/workflows/copilot-governance-watch.lock.yml` | Compiled workflow — do not edit by hand |
| `.github/ISSUE_TEMPLATE/` | Issue forms for content corrections, content requests, and site bugs |
| `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` | Community guidelines and vulnerability reporting |
| `LICENSE`, `LICENSE-docs` | MIT License for code; CC BY 4.0 for `docs/` content |

The site uses the **Control Plane** design: a blueprint grid, monospace navigation
and labels, green control accents, and a terminal-inspired control map. All six
theme choices retain their existing `cgt-theme` preference; mobile navigation,
article permalinks, the table of contents, and page feedback remain available.
The control map links to guide sections rather than displaying sample configuration
or claiming live enforcement status.

Use **Search controls** in the header, **Cmd+K** / **Ctrl+K**, or **/** to search
page titles, headings, and content. All query words must match; results prioritize
headings and titles and link to the matching section. Use the arrow keys and
Enter to open a result, or Escape to close search. Search runs locally in the
browser against a lazily loaded, Jekyll-generated index, with no external service
or custom Jekyll plugins.

## Governance test suite

[`test-suite/`](test-suite/) verifies Copilot governance controls instead of assuming
they work:

- **Automated config checks** assert live content exclusion rules, org/enterprise
  policies, and seat hygiene against a declared baseline.
- **Behavioral test cases** use positive and negative prompts to prove runtime
  enforcement across IDE, Chat, and CLI.
- **Canary fixtures** contain safe fake secrets with unique tokens, so leaks are
  detectable mechanically.

Start with [`test-suite/README.md`](test-suite/README.md) and the documented
[`test-suite/config/expected.example.json`](test-suite/config/expected.example.json).

```bash
cp test-suite/config/expected.example.json test-suite/config/expected.json
python3 test-suite/checks/run_checks.py --dump   # discover live values
python3 test-suite/checks/run_checks.py          # assert against baseline
```

## Keeping content current

`copilot-governance-watch` runs daily, and hourly during confirmed GitHub/Microsoft live events. It reviews the GitHub Blog changelog and the GitHub Copilot documentation, diffs them against the published guide, and opens a pull request with corrections, newly shipped controls, and resolved known gaps. Every claim it adds must cite a docs page or blog post; when sources are ambiguous it files the item under *Known Gaps to Verify* instead of asserting behavior.

An inexpensive calendar gate runs at minute 34 each hour. Outside event windows,
only the daily 08:34 UTC trigger activates the agent, even if execution is delayed;
the other hours use a separate event-only trigger. Manual runs always activate it.
[`docs/_data/copilot-events.json`](docs/_data/copilot-events.json) defines inclusive UTC
start/end dates with explicit years and official source URLs. It tracks Universe,
Ignite, Build, Galaxy, VS Code Live, and relevant Microsoft AI Tour stops.
Unknown dates stay `null` and never enable hourly runs.

On each active review, the watcher checks official event listings for changed
dates, next-year announcements, and additional Copilot-relevant GitHub/Microsoft
events. It proposes calendar updates through reviewed PRs, including calendar-only
PRs; **merge those PRs before an event starts** to enable its hourly window.
Dates are never extrapolated annually. If an organizer has not announced dates
or its site is unavailable, the watcher retains the existing data rather than
guessing. Maintainers can update the same JSON manually using official evidence.

## Repository automation

Pull requests that change documentation or repository automation build the
GitHub Pages site, check documentation links, scan the rendered pages for WCAG
2.1 A/AA accessibility issues in all six themes, lint Actions workflows, verify
the compiled Governance Watch workflow, and validate the event calendar against
its JSON Schema. The link and calendar checks also run weekly. Dependabot checks
GitHub Actions and the CI test dependencies weekly.

Every Monday, an automated reminder issue lists guide sections whose
`last_reviewed` front-matter date is more than 90 days old. Update that date
after reviewing a section; the reminder is updated or closed automatically.
The weekly governance workflow (and manual runs from `main`) runs a Copilot CLI
canary test against the excluded fake-secret fixtures, verifies an allowed fixture
remains readable, and creates or updates one issue if either check fails. The issue
closes after a later successful run. The canary job uses the built-in Actions
`GITHUB_TOKEN` with `copilot-requests: write`, so no additional secret is needed;
organization policy must allow Copilot CLI usage billed to the organization.
Hourly reviews recheck same-day announcements and avoid duplicating open PRs.
GitHub Actions schedules are best-effort and may be delayed; the existing
10,000 daily AI-credit cap still applies and can stop further reviews that day.

Run the offline scheduling tests with:

```bash
python3 -m unittest discover -s test-suite/checks -p 'test_governance_watch_*.py'
```

After editing the workflow markdown, recompile it:

```bash
gh extension install github/gh-aw
gh aw compile
```

Commit both the `.md` and the regenerated `.lock.yml`.

## Enabling GitHub Pages

Repository **Settings → Pages → Source: GitHub Actions**. The site builds from `docs/`.

## Contributing

Corrections and new content are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md)
for content guidelines and local development steps, and follow the
[Code of Conduct](CODE_OF_CONDUCT.md). Report vulnerabilities privately as
described in [SECURITY.md](SECURITY.md).

## License

- Training content in `docs/` is licensed under
  [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-docs).
  Attribute reuse to "Copilot Governance Training by beardofedu" with a link to
  this repository.
- All other files, including scripts, workflows, and the test suite, are licensed
  under the [MIT License](LICENSE).

# Contributing

Thanks for helping keep this GitHub Copilot governance guide accurate and useful.
Copilot features and admin controls change often, so corrections from people who
administer Copilot day to day are especially valuable.

By participating, you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Ways to contribute

- **Report outdated or incorrect content.** Use the
  [content correction form](https://github.com/beardofedu/copilot-governance-training/issues/new?template=content-correction.yml) and
  link the official source that shows the current behavior.
- **Suggest a control or topic.** Use the
  [new content form](https://github.com/beardofedu/copilot-governance-training/issues/new?template=content-request.yml).
- **Report a site problem.** Use the
  [site bug form](https://github.com/beardofedu/copilot-governance-training/issues/new?template=site-bug.yml) for broken layout,
  search, navigation, themes, or accessibility barriers.
- **Improve the governance test suite.** See [`test-suite/README.md`](test-suite/README.md).
- **Pick up an existing issue.** Look for
  [`good first issue`](https://github.com/beardofedu/copilot-governance-training/labels/good%20first%20issue) or
  [`help wanted`](https://github.com/beardofedu/copilot-governance-training/labels/help%20wanted).

Report security vulnerabilities privately as described in [SECURITY.md](SECURITY.md),
not in public issues.

## Content guidelines

- **Cite official sources.** Every new or changed claim about Copilot behavior must
  link to [GitHub Docs](https://docs.github.com/copilot) or an official
  [GitHub Blog changelog](https://github.blog/changelog/) post.
- **Don't guess.** If sources are ambiguous or behavior is unconfirmed, add the item
  to [Known Gaps to Verify](docs/sections/known-gaps.md) instead of asserting it.
- **Note plan and scope.** State which plans (Business, Enterprise) and which level
  (enterprise, organization, repository, client) a control applies to.
- **Update review dates.** After reviewing a page in `docs/sections/`, update its
  `last_reviewed` front-matter date (`YYYY-MM-DD`).
- **Never include real secrets or customer data.** Canary fixtures in
  `test-suite/fixtures/` must use clearly fake values.
- Keep pages accessible: descriptive link text, alt text for images, and a logical
  heading order.

## Development

The site is a Jekyll project in `docs/`, built by GitHub Pages without custom plugins.

```bash
# Preview the site locally (requires Ruby and Bundler)
gem install jekyll
jekyll serve --source docs --baseurl /copilot-governance-training
# Visit http://127.0.0.1:4000/copilot-governance-training/

# Run offline tests
python3 -m unittest discover -s test-suite/checks -p 'test_*.py'
python3 .github/scripts/check_section_freshness.py

# Run accessibility checks against a locally served site
npm ci
npx playwright install chromium
npm run test:settings
npm run test:settings-browser
npm run test:a11y
```

The accessibility script expects the site at
`http://127.0.0.1:4173/copilot-governance-training/`; see
`.github/workflows/quality-checks.yml` for how CI serves it.

The managed settings generator is defined in `docs/assets/js/managed-settings.js`.
Keep its field definitions, input validation, and source links aligned with the
official enterprise managed settings reference. Each wizard step needs an area
intro, and each setting needs "why" and "why not" guidance; unit tests enforce
both. The Copilot Governance Watch workflow is instructed to keep these
definitions and the `modelCatalog` list in sync with the managed settings
reference and supported models page, but it cannot edit `test-suite/`; update
any hard-coded test expectations its pull requests call out. `test:settings` runs offline;
`test:settings-browser` uses the same locally served site as the accessibility
checks and exercises all controls, exports, invalid inputs, and themes.

### Agentic workflow changes

[`copilot-governance-watch.md`](.github/workflows/copilot-governance-watch.md) is a
[gh-aw](https://github.com/github/gh-aw) workflow. After changing its frontmatter,
recompile it and commit both the `.md` and the regenerated `.lock.yml`:

```bash
gh extension install github/gh-aw
gh aw compile
```

Never edit `*.lock.yml` files by hand.

## Pull requests

1. Fork the repository and create a branch from `main`.
2. Keep each pull request focused on one topic.
3. Fill in the pull request template, including source links for content changes.
4. Make sure the CI checks pass. Pull requests run the Pages build, link checks,
   accessibility checks in all six themes, workflow linting, and calendar
   validation.

Automated pull requests from Governance Watch go through the same review process as
human contributions.

## License

By contributing, you agree that your contributions are licensed under the
repository's licenses: content in `docs/` under
[CC BY 4.0](LICENSE-docs), and all other files under the [MIT License](LICENSE).

# Security policy

## Reporting a vulnerability

Please **do not** report security vulnerabilities in public issues, discussions, or
pull requests.

Report them privately through
[GitHub private vulnerability reporting](https://github.com/beardofedu/copilot-governance-training/security/advisories/new). Include:

- A description of the issue and its potential impact
- Steps to reproduce or a proof of concept
- Affected files, workflows, or pages

You should receive an initial response within 7 days. We'll keep you informed as the
issue is investigated and fixed, and credit you in the advisory unless you prefer
otherwise.

## Scope

In scope:

- GitHub Actions workflows and scripts in `.github/`, including the Governance Watch
  agentic workflow (for example, prompt injection, excessive permissions, or token
  exposure)
- The governance test suite in `test-suite/`
- The GitHub Pages site in `docs/` (for example, cross-site scripting)

Out of scope:

- Vulnerabilities in GitHub Copilot or other GitHub products. Report those through
  the [GitHub Security Bug Bounty](https://bounty.github.com/).
- The fake secrets in `test-suite/fixtures/`. These canary values are intentionally
  committed and grant no access.
- Inaccurate governance guidance that is not a security vulnerability. Use the
  [content correction form](https://github.com/beardofedu/copilot-governance-training/issues/new?template=content-correction.yml).

## Supported versions

Only the latest version on the `main` branch and the published site are supported.

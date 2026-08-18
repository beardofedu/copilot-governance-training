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
| `docs/CHANGELOG.md` | Dated record of automated content updates |
| `test-suite/` | Automated and behavioral governance control tests |
| `.github/workflows/pages.yml` | Builds and deploys the site on push to `main` |
| `.github/workflows/copilot-governance-watch.md` | Agentic workflow source ([gh-aw](https://github.com/github/gh-aw)) |
| `.github/workflows/copilot-governance-watch.lock.yml` | Compiled workflow — do not edit by hand |

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

`copilot-governance-watch` runs daily. It reviews the GitHub Blog changelog and the GitHub Copilot documentation, diffs them against the published guide, and opens a pull request with corrections, newly shipped controls, and resolved known gaps. Every claim it adds must cite a docs page or blog post; when sources are ambiguous it files the item under *Known Gaps to Verify* instead of asserting behavior.

After editing the workflow markdown, recompile it:

```bash
gh extension install github/gh-aw
gh aw compile
```

Commit both the `.md` and the regenerated `.lock.yml`.

## Enabling GitHub Pages

Repository **Settings → Pages → Source: GitHub Actions**. The site builds from `docs/`.

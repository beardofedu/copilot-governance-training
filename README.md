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
| `.github/workflows/pages.yml` | Builds and deploys the site on push to `main` |
| `.github/workflows/copilot-governance-watch.md` | Agentic workflow source ([gh-aw](https://github.com/github/gh-aw)) |
| `.github/workflows/copilot-governance-watch.lock.yml` | Compiled workflow — do not edit by hand |

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

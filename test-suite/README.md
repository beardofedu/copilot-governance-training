# Copilot Governance Test Suite

Verify that your GitHub Copilot governance controls actually do what you think they do.

Most orgs configure content exclusion and Copilot policies once, screenshot the settings
page, and call it compliant. This suite replaces that with evidence: it asserts the live
configuration matches a declared baseline, and gives you scripted **positive and negative**
behavioral tests that prove enforcement at runtime.

Negative tests matter as much as positive ones. A pattern like `**/*secret*` blocks
`README-secrets.md` and quietly degrades every developer's experience until someone turns
the whole control off. The suite tests for that failure mode explicitly.

---

## Layout

```
test-suite/
├── config/
│   ├── expected.example.json      # fully documented example — start here
│   └── expected.json              # your baseline (gitignored)
├── checks/
│   ├── run_checks.py              # automated config assertions (stdlib + gh CLI)
│   └── check_canaries.sh          # scan Copilot output for leaked secrets
├── cases/
│   ├── 01-content-exclusion.md    # CE-P1..P5 (+ve), CE-N1..N4 (-ve)
│   └── 02-org-policies.md         # POL-P1..P4 (+ve), POL-N1..N3 (-ve)
├── fixtures/
│   ├── secrets/                   # MUST be blocked — each carries a canary token
│   └── allowed/                   # MUST stay usable — negative controls
└── templates/
    └── results-template.md        # per-run evidence record
```

All fixtures contain fake values and are safe to commit.

---

## Quick start

```bash
gh auth login                 # needs read:org and repo; admin:org for policies/seats
cp test-suite/config/expected.example.json test-suite/config/expected.json
$EDITOR test-suite/config/expected.json      # replace acme-* with your org

python3 test-suite/checks/run_checks.py
```

Not sure what your live values are? Discover them instead of guessing:

```bash
python3 test-suite/checks/run_checks.py --dump
```

`--dump` prints live configuration and asserts nothing. Paste the values into
`expected.json`, review them, then switch back to assertion mode.

Then work through `cases/01-content-exclusion.md` and `cases/02-org-policies.md`,
recording results in a copy of `templates/results-template.md`.

### Options

| Flag | Effect |
|---|---|
| `--config PATH` | use a different baseline (per-environment configs) |
| `--dump` | print live values, assert nothing |
| `--only GROUPS` | run a subset: `auth,exclusion,policies,enterprise,seats` |

---

## Understanding results

| Status | Meaning | Action |
|---|---|---|
| `PASS` | Live config matches your declared baseline. | none |
| `FAIL` | Real drift, or your baseline is wrong. | investigate — do not just edit the baseline to make it green |
| `SKIP` | Check couldn't run: block absent from config, or token lacks scope. | grant scope, or accept the coverage gap knowingly |

`SKIP` is deliberately not a failure, so the suite is useful before you have full admin
scopes. To make skips fatal in CI, add `"SKIP"` to `reporting.fail_on`.

Reports land at `test-suite/results/latest.json` and `junit.xml` for CI ingestion.

---

## The canary technique

Every excluded fixture contains a unique token, e.g. `CANARY-ENV-7f3a91`.

Never accept a model's refusal message as proof the control worked — models decline for
all sorts of reasons, including a mistyped path. Instead, capture the output and grep it:

```bash
copilot -p "read test-suite/fixtures/secrets/.env" | tee out.txt
./test-suite/checks/check_canaries.sh out.txt
```

A canary in the output means exclusion failed and should be treated as an incident,
whatever the surrounding text says.

---

## What this suite does and does not cover

**Covers:** content exclusion rules (org + repo), org and enterprise Copilot policies,
duplication detection behavior, surface enablement, seat hygiene, and runtime enforcement
across IDE, Chat, and CLI.

**Does not cover:** content exclusion is a *context* control, not a data-loss-prevention
boundary. It stops Copilot from reading matching files; it does not stop a developer from
pasting a secret into a prompt, and it may not cover secrets surfaced through arbitrary
shell output (see case CE-P5). Pair it with secret scanning, push protection, and
pre-commit hooks.

---

## Running in CI

```yaml
name: Copilot governance
on:
  schedule: [{ cron: "0 7 * * 1" }]   # weekly drift detection
  workflow_dispatch:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run config checks
        env:
          GH_TOKEN: ${{ secrets.GOVERNANCE_READ_TOKEN }}
        run: python3 test-suite/checks/run_checks.py
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: governance-results
          path: test-suite/results/
```

Use a dedicated read-only token. The suite never writes to GitHub.

Behavioral cases still need a human (or an agent with IDE access) — automation can prove
config integrity, but only a real prompt proves enforcement.

---

## Cadence

Run the full suite:

- after any change to exclusion rules or Copilot policies (wait ~30 min for propagation)
- weekly for automated config drift
- quarterly for the full behavioral pass, as your compliance evidence
- whenever a major Copilot client or plan change lands

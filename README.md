# copilot-governance-training

Materials for verifying GitHub Copilot governance controls.

## [`test-suite/`](test-suite/) — Governance test suite

Prove your Copilot controls work, rather than assuming they do.

- **Automated config checks** — assert live content exclusion rules, org/enterprise
  policies, and seat hygiene match a declared baseline (`checks/run_checks.py`,
  stdlib Python + `gh` CLI, JSON and JUnit output).
- **Behavioral test cases** — scripted positive *and* negative prompts that prove
  enforcement at runtime across IDE, Chat, and CLI (`cases/`).
- **Canary fixtures** — safe fake secrets carrying unique tokens, so a leak is detectable
  by grep instead of by trusting a refusal message.
- **Evidence template** — a per-run record suitable for compliance sign-off.

Start with [`test-suite/README.md`](test-suite/README.md) and the fully documented
[`test-suite/config/expected.example.json`](test-suite/config/expected.example.json).

```bash
cp test-suite/config/expected.example.json test-suite/config/expected.json
python3 test-suite/checks/run_checks.py --dump   # discover live values
python3 test-suite/checks/run_checks.py          # assert against baseline
```

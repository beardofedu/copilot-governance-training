# Governance test run — results

| Field | Value |
|---|---|
| Run date | YYYY-MM-DD |
| Tester | |
| Org / Enterprise | |
| Config file | `test-suite/config/expected.json` |
| Config commit | |
| IDE + Copilot ext version | |
| `gh` + `gh copilot` version | |
| Last policy change | (date — must be >30 min before run) |

## Automated config checks

```
paste output of: python3 test-suite/checks/run_checks.py
```

| Group | Pass | Fail | Skip |
|---|---|---|---|
| auth | | | |
| exclusion | | | |
| policies | | | |
| enterprise | | | |
| seats | | | |

## Behavioral — content exclusion

| ID | Type | Surface | Result | Canary leaked? | Notes |
|---|---|---|---|---|---|
| CE-P1 | +ve | | PASS / FAIL | no | |
| CE-P2 | +ve | | | no | |
| CE-P3 | +ve | IDE | | n/a | |
| CE-P4 | +ve | | | no | |
| CE-P5 | +ve | | | no | documented gap? |
| CE-N1 | -ve | | | n/a | |
| CE-N2 | -ve | | | n/a | |
| CE-N3 | -ve | IDE | | n/a | |
| CE-N4 | -ve | | | n/a | |

## Behavioral — policies

| ID | Type | Result | Notes |
|---|---|---|---|
| POL-P1 | +ve | | verbatim matches offered: __ / 5 |
| POL-P2 | +ve | | |
| POL-P3 | +ve | | |
| POL-P4 | +ve | | |
| POL-N1 | -ve | | |
| POL-N2 | -ve | | |
| POL-N3 | -ve | | |

## Failures & actions

| ID | What happened | Impact | Owner | Due |
|---|---|---|---|---|
| | | | | |

## Sign-off

- [ ] All positive controls fired
- [ ] All negative controls confirmed no over-blocking
- [ ] No canary token appeared in any output
- [ ] Failures logged with an owner
- [ ] Result committed to the compliance record

Signed: ______________  Date: __________

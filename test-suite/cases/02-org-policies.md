# POL — Org & Enterprise Policy Behavioral Tests

Verifies that Copilot policy toggles change actual product behavior.

Config assertions for these live in `config/expected.json` under `org_policies` /
`enterprise_policies`. Run `run_checks.py --only policies,enterprise` first — if config
already disagrees with your expectation, fix that before behavioral testing.

---

## Duplication detection (public code suggestions)

### POL-P1 — Blocking is enforced

Applies when `public_code_suggestions: "block"`.

**Steps**
1. Create a scratch file `dup-test.py`.
2. Type a comment reproducing a well-known public snippet header, e.g.
   `# Django settings.py default SECRET_KEY block` and let Copilot suggest.
3. Alternatively begin a widely-duplicated boilerplate function signature.

**PASS** — long verbatim public-code matches are suppressed; IDE shows a duplication
notice or simply offers nothing for the matching span.
**FAIL** — a long verbatim match is offered with no filtering.

**Recording matters more than the verdict.** This control is probabilistic. Run 5
attempts and record the ratio (e.g. "0/5 verbatim matches offered") rather than a single
pass/fail.

### POL-N1 — Original code still gets suggestions

**Steps**
1. In the same file write a clearly novel function: `def acme_invoice_checksum(items):`
2. Wait for a suggestion.

**PASS** — a suggestion appears. Blocking public code must not block everything.
**FAIL** — nothing suggested; investigate whether the org has Copilot broadly disabled.

---

## Surface enablement

### POL-P2 — Disabled surface is actually unavailable

Applies to any surface you set to `disabled` (e.g. `cli: "disabled"`).

**Steps**
1. As a seated user in that org, invoke the surface (e.g. run `gh copilot suggest "list files"`).

**PASS** — access denied / feature unavailable message.
**FAIL** — the surface works. Policy is not enforced for this user; check whether they
hold a seat from a different org or a personal subscription.

### POL-N2 — Enabled surfaces still work

**Steps**
1. Invoke each surface marked `enabled` and issue a trivial prompt (`what is 2+2`).

**PASS** — all enabled surfaces respond.
**FAIL** — an enabled surface is blocked; likely a network/firewall issue, not policy.

---

## Seat scope

### POL-P3 — Unseated user has no access

**Steps**
1. Have a org member **without** a Copilot seat open Chat.

**PASS** — prompted to request a seat; no completions.
**FAIL** — full access. Check `seat_management_setting` — it may be auto-assigning.

### POL-N3 — Seated user has access

**Steps**
1. Same prompt as a seated user.

**PASS** — works normally.

---

## Enterprise override

### POL-P4 — Enterprise policy wins over org policy

Only meaningful when the enterprise sets a control to a stricter value than a child org.

**Steps**
1. Note an enterprise-level control set to `block`/`disabled`.
2. Confirm the child org's UI shows it locked / not editable.
3. Behaviorally test the control in the child org per POL-P1 or POL-P2.

**PASS** — enterprise value applies and the org cannot loosen it.
**FAIL** — the org overrides the enterprise. Escalate: this breaks your whole
governance inheritance model.

---

## Recording

Copy `../templates/results-template.md` per run. Policy behavior can vary by client
version — always record IDE/CLI/extension versions alongside the verdict.

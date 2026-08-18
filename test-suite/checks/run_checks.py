#!/usr/bin/env python3
"""
Copilot governance config checker.

Asserts that live GitHub configuration matches the expectations declared in
config/expected.json. Stdlib-only; uses the `gh` CLI for authenticated API calls.

Usage:
    python3 test-suite/checks/run_checks.py
    python3 test-suite/checks/run_checks.py --config test-suite/config/expected.json
    python3 test-suite/checks/run_checks.py --dump          # print live values, assert nothing
    python3 test-suite/checks/run_checks.py --only exclusion,policies

Exit codes:
    0  all checks passed (or only SKIPs, unless reporting.fail_on includes SKIP)
    1  at least one FAIL
    2  runner/config error
"""

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone, timedelta

PASS, FAIL, SKIP = "PASS", "FAIL", "SKIP"
RESULTS = []


def record(status, group, name, detail="", expected=None, actual=None):
    RESULTS.append(
        {
            "status": status,
            "group": group,
            "name": name,
            "detail": detail,
            "expected": expected,
            "actual": actual,
        }
    )
    color = {PASS: "\033[32m", FAIL: "\033[31m", SKIP: "\033[33m"}[status]
    reset = "\033[0m" if sys.stdout.isatty() else ""
    if not sys.stdout.isatty():
        color = ""
    print(f"{color}{status:4}{reset}  [{group}] {name}" + (f" -- {detail}" if detail else ""))


def gh_api(path, method="GET"):
    """Call the GitHub API via gh. Returns (ok, data_or_error_string)."""
    cmd = ["gh", "api", "-X", method, "-H", "Accept: application/vnd.github+json", path]
    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        return False, (proc.stderr or proc.stdout).strip()
    try:
        return True, json.loads(proc.stdout or "null")
    except json.JSONDecodeError:
        return True, proc.stdout


def strip_docs(obj):
    """Remove _doc / _about / keys ending in _doc from a config dict."""
    if isinstance(obj, dict):
        return {
            k: strip_docs(v)
            for k, v in obj.items()
            if not (k.startswith("_") or k.endswith("_doc"))
        }
    if isinstance(obj, list):
        return [strip_docs(v) for v in obj]
    return obj


# --------------------------------------------------------------------------
# Checks
# --------------------------------------------------------------------------

def check_auth(cfg):
    proc = subprocess.run(["gh", "auth", "status"], capture_output=True, text=True)
    if proc.returncode != 0:
        record(FAIL, "auth", "gh authenticated", "run `gh auth login`")
        return set()
    blob = proc.stdout + proc.stderr
    scopes = set()
    for line in blob.splitlines():
        if "Token scopes:" in line:
            scopes = {s.strip().strip("'\"") for s in line.split(":", 1)[1].split(",")}
    record(PASS, "auth", "gh authenticated", f"scopes: {', '.join(sorted(scopes)) or 'unknown'}")

    for scope in cfg.get("auth", {}).get("required_scopes", []):
        if not scopes or scope in scopes:
            record(PASS, "auth", f"scope {scope}")
        else:
            record(FAIL, "auth", f"scope {scope}", "missing required scope")
    return scopes


def check_content_exclusion(cfg, dump=False):
    block = cfg.get("content_exclusion")
    if not block:
        record(SKIP, "exclusion", "content_exclusion", "not declared in config")
        return

    for org, spec in (block.get("org_level") or {}).items():
        ok, data = gh_api(f"/orgs/{org}/copilot/content_exclusion")
        if not ok:
            record(SKIP, "exclusion", f"{org} rules readable",
                   f"API unavailable ({data.splitlines()[0][:120] if data else 'error'})")
            continue

        actual = extract_patterns(data)
        if dump:
            record(PASS, "exclusion", f"{org} live patterns", json.dumps(actual))
            continue

        expected = spec.get("expected_patterns", [])
        missing = [p for p in expected if p not in actual]
        if missing:
            record(FAIL, "exclusion", f"{org} required patterns present",
                   f"missing: {missing}", expected, actual)
        else:
            record(PASS, "exclusion", f"{org} required patterns present",
                   f"{len(expected)} pattern(s) verified")

        if spec.get("forbid_unexpected_patterns"):
            extra = [p for p in actual if p not in expected]
            if extra:
                record(FAIL, "exclusion", f"{org} no drift", f"unexpected: {extra}")
            else:
                record(PASS, "exclusion", f"{org} no drift")

    for repo, spec in (block.get("repo_level") or {}).items():
        repo_ok, _ = gh_api(f"/repos/{repo}")
        if not repo_ok:
            record(SKIP, "exclusion", f"{repo} exclusion file",
                   "repository not accessible with current token")
            continue
        ok, data = gh_api(f"/repos/{repo}/contents/.github/copilot/content-exclusion.yml")
        if not ok:
            record(FAIL, "exclusion", f"{repo} exclusion file",
                   "no .github/copilot/content-exclusion.yml found")
            continue
        import base64
        content = base64.b64decode(data.get("content", "")).decode("utf-8", "replace")
        missing = [p for p in spec.get("expected_patterns", []) if p not in content]
        if missing:
            record(FAIL, "exclusion", f"{repo} repo patterns", f"missing: {missing}")
        else:
            record(PASS, "exclusion", f"{repo} repo patterns")

    check_fixtures(block)


def extract_patterns(data):
    """Normalize the several shapes the exclusion API/UI can return into a flat list."""
    if isinstance(data, list):
        out = []
        for item in data:
            out.extend(extract_patterns(item))
        return out
    if isinstance(data, dict):
        for key in ("paths", "patterns", "rules"):
            if key in data:
                return extract_patterns(data[key])
        out = []
        for v in data.values():
            out.extend(extract_patterns(v))
        return out
    if isinstance(data, str):
        return [data]
    return []


def check_fixtures(block):
    """Verify the behavioral fixture files exist so the manual cases are runnable."""
    fx = block.get("behavior_fixtures") or {}
    for kind in ("must_be_excluded", "must_be_allowed"):
        for path in fx.get(kind, []):
            if os.path.exists(path):
                record(PASS, "fixtures", f"{kind}: {path}")
            else:
                record(FAIL, "fixtures", f"{kind}: {path}", "fixture file missing")


def check_org_policies(cfg, dump=False):
    block = cfg.get("org_policies")
    if not block:
        record(SKIP, "policies", "org_policies", "not declared in config")
        return
    for org, expected in block.items():
        ok, data = gh_api(f"/orgs/{org}/copilot/billing")
        if not ok:
            record(SKIP, "policies", f"{org} policies readable",
                   "needs admin:org / Copilot Business or Enterprise")
            continue
        if dump:
            record(PASS, "policies", f"{org} live values", json.dumps(data))
            continue
        for key, want in expected.items():
            got = data.get(key)
            if got is None and isinstance(data.get("ide_chat"), dict):
                got = data.get("ide_chat", {}).get(key)
            if got is None:
                record(SKIP, "policies", f"{org}.{key}", "key not returned by API")
            elif str(got) == str(want):
                record(PASS, "policies", f"{org}.{key}", f"= {got}")
            else:
                record(FAIL, "policies", f"{org}.{key}",
                       f"expected {want!r}, got {got!r}", want, got)


def check_enterprise_policies(cfg, dump=False):
    block = cfg.get("enterprise_policies")
    if not block:
        record(SKIP, "enterprise", "enterprise_policies", "not declared in config")
        return
    for ent, expected in block.items():
        ok, data = gh_api(f"/enterprises/{ent}/copilot/billing")
        if not ok:
            record(SKIP, "enterprise", f"{ent} readable", "needs read:enterprise scope")
            continue
        if dump:
            record(PASS, "enterprise", f"{ent} live values", json.dumps(data))
            continue
        for key, want in expected.items():
            got = data.get(key)
            if got is None:
                record(SKIP, "enterprise", f"{ent}.{key}", "key not returned by API")
            elif str(got) == str(want):
                record(PASS, "enterprise", f"{ent}.{key}", f"= {got}")
            else:
                record(FAIL, "enterprise", f"{ent}.{key}", f"expected {want!r}, got {got!r}")


def check_seats(cfg):
    block = cfg.get("seats")
    if not block:
        record(SKIP, "seats", "seats", "not declared in config")
        return
    for org, spec in block.items():
        ok, data = gh_api(f"/orgs/{org}/copilot/billing/seats?per_page=100")
        if not ok:
            record(SKIP, "seats", f"{org} seats readable", "needs admin:org")
            continue
        seats = data.get("seats", []) if isinstance(data, dict) else []
        max_days = spec.get("max_inactive_days")
        if max_days:
            cutoff = datetime.now(timezone.utc) - timedelta(days=max_days)
            stale = []
            for s in seats:
                last = s.get("last_activity_at")
                login = (s.get("assignee") or {}).get("login", "?")
                if not last:
                    stale.append(f"{login}(never)")
                    continue
                try:
                    when = datetime.fromisoformat(last.replace("Z", "+00:00"))
                except ValueError:
                    continue
                if when < cutoff:
                    stale.append(f"{login}({when.date()})")
            if stale:
                record(FAIL, "seats", f"{org} no seats idle >{max_days}d",
                       f"{len(stale)} stale: {', '.join(stale[:10])}")
            else:
                record(PASS, "seats", f"{org} no seats idle >{max_days}d",
                       f"{len(seats)} seat(s) checked")


# --------------------------------------------------------------------------

GROUPS = {
    "auth": lambda cfg, dump: check_auth(cfg),
    "exclusion": check_content_exclusion,
    "policies": check_org_policies,
    "enterprise": check_enterprise_policies,
    "seats": lambda cfg, dump: check_seats(cfg),
}


def write_reports(cfg):
    rep = cfg.get("reporting", {})
    out = rep.get("output")
    if out:
        os.makedirs(os.path.dirname(out), exist_ok=True)
        summary = {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "totals": {s: sum(1 for r in RESULTS if r["status"] == s) for s in (PASS, FAIL, SKIP)},
            "results": RESULTS,
        }
        with open(out, "w") as f:
            json.dump(summary, f, indent=2)
        print(f"\nJSON report: {out}")

    junit = rep.get("junit")
    if junit:
        from xml.sax.saxutils import escape
        os.makedirs(os.path.dirname(junit), exist_ok=True)
        fails = sum(1 for r in RESULTS if r["status"] == FAIL)
        skips = sum(1 for r in RESULTS if r["status"] == SKIP)
        lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            f'<testsuite name="copilot-governance" tests="{len(RESULTS)}" '
            f'failures="{fails}" skipped="{skips}">',
        ]
        for r in RESULTS:
            tc = f'  <testcase classname="{escape(r["group"])}" name="{escape(r["name"])}">'
            if r["status"] == FAIL:
                tc += f'<failure message="{escape(r["detail"])}"/>'
            elif r["status"] == SKIP:
                tc += f'<skipped message="{escape(r["detail"])}"/>'
            lines.append(tc + "</testcase>")
        lines.append("</testsuite>")
        with open(junit, "w") as f:
            f.write("\n".join(lines))
        print(f"JUnit report: {junit}")


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--config", default="test-suite/config/expected.json")
    ap.add_argument("--dump", action="store_true",
                    help="print live values instead of asserting")
    ap.add_argument("--only", help="comma-separated groups: " + ",".join(GROUPS))
    args = ap.parse_args()

    path = args.config
    if not os.path.exists(path):
        example = "test-suite/config/expected.example.json"
        print(f"config not found: {path}\ncopy the documented example:\n"
              f"  cp {example} {path}", file=sys.stderr)
        return 2

    with open(path) as f:
        cfg = strip_docs(json.load(f))

    selected = args.only.split(",") if args.only else list(GROUPS)
    for name in selected:
        fn = GROUPS.get(name.strip())
        if not fn:
            print(f"unknown group: {name}", file=sys.stderr)
            return 2
        fn(cfg, args.dump)

    totals = {s: sum(1 for r in RESULTS if r["status"] == s) for s in (PASS, FAIL, SKIP)}
    print(f"\n{totals[PASS]} passed, {totals[FAIL]} failed, {totals[SKIP]} skipped")
    write_reports(cfg)

    fail_on = set(cfg.get("reporting", {}).get("fail_on", [FAIL]))
    return 1 if any(totals[s] for s in fail_on) else 0


if __name__ == "__main__":
    sys.exit(main())

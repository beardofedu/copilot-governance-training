"""Regression tests for Governance Watch completion instructions."""

import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROMPT = (ROOT / ".github/workflows/copilot-governance-watch.md").read_text()
COMPLETION_SIGNAL = PROMPT.split("## Completion signal\n", 1)[1].split(
    "\n## Step 5", 1
)[0]


class GovernanceWatchPromptTests(unittest.TestCase):
    def test_review_windows_use_per_source_coverage_state(self):
        for instruction in (
            "docs/_data/governance-watch-state.json",
            "Each source has its own review window",
            "Never use it to shorten a source's window",
            "14 days before today",
            "Keep the existing cutoff for any source whose review was incomplete",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, PROMPT)

    def test_completed_review_has_an_explicit_safe_output(self):
        for instruction in (
            "create a pull request for actionable changes",
            "emit `noop` when the review found none",
            "`missing_tool` only when all three retrieval paths failed or were unavailable",
            "`report_incomplete` for an interruption or blocker",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, COMPLETION_SIGNAL)

    def test_missing_tool_diagnostic_requires_terminal_output(self):
        for instruction in (
            "A `missing_tool` report is diagnostic, not terminal",
            "after reporting it, emit `report_incomplete`",
            "which sources remain unreviewed",
            "never emit `noop` for a blocked review",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, COMPLETION_SIGNAL)

    def test_missing_tool_diagnostic_requires_terminal_incomplete_output(self):
        for instruction in (
            "`missing_tool` is diagnostic only, not a terminal safe output",
            "call `report_incomplete` even if you already emitted `missing_tool`",
            "which sources remain unreviewed",
            "do not claim a rate limit without an actual rate-limit response",
            "Leave review coverage dates unchanged for unreviewed sources",
            "do not emit `noop` to hide a blocked review",
            "does not replace a terminal safe-output tool call",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, COMPLETION_SIGNAL)

    def test_retrieval_fallback_uses_allowed_curl(self):
        frontmatter, body = PROMPT.split("---", 2)[1:]
        self.assertIn('    - "curl"\n', frontmatter)
        retrieval = body.split("## Step 2 — Review the sources\n", 1)[1]
        web_fetch = retrieval.index("1. The `web_fetch`")
        curl = retrieval.index("2. Run `curl --fail")
        github = retrieval.index("3. The remote GitHub MCP tools")
        self.assertLess(web_fetch, curl)
        self.assertLess(curl, github)
        self.assertIn("--connect-timeout 15 --max-time 60", retrieval)
        self.assertNotIn("Do **not** try to fetch URLs from `bash`", body)
        self.assertIn("using the retrieval order in Step 2", body)
        self.assertIn("Never send credentials, repository file contents", body)

    def test_rate_limit_retry_can_wait_without_retrying_early(self):
        frontmatter = PROMPT.split("---", 2)[1]
        self.assertIn('    - "sleep"\n', frontmatter)
        self.assertIn("Use `sleep <remaining-seconds>` through `bash`", PROMPT)
        self.assertIn("never retry early if waiting is denied", PROMPT)
        self.assertIn("Retry the rate-limited query once after the stated interval", PROMPT)

    def test_compiled_runtime_allows_retrieval_and_rate_limit_wait(self):
        lock = (ROOT / ".github/workflows/copilot-governance-watch.lock.yml").read_text()
        config_line = next(
            line for line in lock.splitlines()
            if line.strip().startswith("GH_AW_COPILOT_SDK_TOOL_CONFIG:")
        )
        config = json.loads(config_line.split(": ", 1)[1].strip("'"))
        self.assertTrue(config["capabilities"]["webFetch"])
        for tool in ("web_fetch", "shell(curl:*)", "shell(sleep)"):
            with self.subTest(tool=tool):
                self.assertIn(tool, config["permissions"]["allowedTools"])

    def test_retrieval_failure_paths_require_incomplete_output(self):
        retrieval_rules = PROMPT.split("\nRules:\n", 1)[1].split("\n### a.", 1)[0]
        no_change_path = PROMPT.split("## Step 4", 1)[1].split(
            "\nOtherwise edit", 1
        )[0]
        self.assertIn("also call `report_incomplete` before ending", retrieval_rules)
        self.assertIn("`missing_tool` alone is not a terminal safe output", retrieval_rules)
        self.assertIn("call `report_incomplete` instead of `noop`", no_change_path)


if __name__ == "__main__":
    unittest.main()

"""Regression tests for Governance Watch completion instructions."""

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
            "`missing_tool` only when both retrieval paths failed",
            "`report_incomplete` for an interruption or blocker",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, COMPLETION_SIGNAL)

    def test_missing_tool_diagnostic_requires_terminal_incomplete_output(self):
        for instruction in (
            "emit a terminal safe output",
            "then call `report_incomplete` with the retrieval errors",
            "`missing_tool` is diagnostic, not a terminal safe output",
            "never end after that call alone",
            "including unavailable retrieval tools",
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

    def test_retrieval_failure_paths_require_terminal_incomplete_output(self):
        source_review = PROMPT.split("## Step 2", 1)[1].split("## Step 3", 1)[0]
        retrieval_rules = source_review.split("\nRules:\n", 1)[1].split(
            "\n### a.", 1
        )[0]
        edit_decision = PROMPT.split("## Step 4", 1)[1].split(
            "Otherwise edit files", 1
        )[0]
        self.assertIn("Then call `report_incomplete`", retrieval_rules)
        self.assertIn("also call `report_incomplete` before ending", retrieval_rules)
        self.assertIn(
            "`missing_tool` alone is not a terminal safe output", retrieval_rules
        )
        self.assertIn(
            "call `missing_tool` followed by `report_incomplete`", edit_decision
        )
        self.assertIn(
            "call `missing_tool` followed by `report_incomplete` instead of `noop`",
            edit_decision,
        )


if __name__ == "__main__":
    unittest.main()

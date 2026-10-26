"""Regression tests for Governance Watch completion instructions."""

import shlex
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROMPT = (ROOT / ".github/workflows/copilot-governance-watch.md").read_text()
COMPLETION_SIGNAL = PROMPT.split("## Completion signal\n", 1)[1].split(
    "\n## Step 5", 1
)[0]
PR_INSTRUCTIONS = PROMPT.split("## Step 5 — Open the pull request\n", 1)[1].split(
    "\n## Guardrails", 1
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

    def test_pull_request_prepares_a_committed_local_branch(self):
        commands = PR_INSTRUCTIONS.split("```bash\n", 1)[1].split("```", 1)[0]
        self.assertEqual(commands.strip().splitlines(), [
            "git checkout -b governance/watch-${{ github.run_id }}",
            "git add -- docs/",
            'git commit -m "Update Copilot governance documentation"',
            "git branch --show-current",
        ])
        self.assertIn("each line below in a separate `bash` tool call", PR_INSTRUCTIONS)
        self.assertIn("as the `branch` parameter", PR_INSTRUCTIONS)
        self.assertIn("never use `main` or the base branch", PR_INSTRUCTIONS)
        self.assertIn("Do not push or change remotes", PR_INSTRUCTIONS)

    def test_commit_message_avoids_sdk_rejected_metacharacters(self):
        commands = PR_INSTRUCTIONS.split("```bash\n", 1)[1].split("```", 1)[0]
        commit = next(line for line in commands.splitlines() if line.startswith("git commit "))
        message = shlex.split(commit)[3]
        self.assertNotRegex(message, r"[&<>`$]")
        self.assertIn("even inside quoted Git arguments", PR_INSTRUCTIONS)

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

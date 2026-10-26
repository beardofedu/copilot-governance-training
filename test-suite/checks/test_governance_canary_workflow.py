"""Regression tests for the live governance canary workflow."""

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = (ROOT / ".github/workflows/governance-checks.yml").read_text()
CANARY_JOB = WORKFLOW.split("  canary:\n", 1)[1].split("\n  report-status:\n", 1)[0]


class GovernanceCanaryWorkflowTests(unittest.TestCase):
    def test_cli_canary_reads_only_the_allowed_fixture(self):
        self.assertIn("test-suite/fixtures/allowed/app.py", CANARY_JOB)
        self.assertNotIn("test-suite/fixtures/secrets/", CANARY_JOB)


if __name__ == "__main__":
    unittest.main()

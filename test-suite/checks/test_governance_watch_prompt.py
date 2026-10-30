"""Regression tests for Governance Watch execution and completion instructions."""

import json
import shlex
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
PROMPT = (ROOT / ".github/workflows/copilot-governance-watch.md").read_text()
LOCK = (ROOT / ".github/workflows/copilot-governance-watch.lock.yml").read_text()
EXECUTION_CONTRACT = PROMPT.split("## Tool execution\n", 1)[1].split(
    "\n## Step 0", 1
)[0]
COMPLETION_SIGNAL = PROMPT.split("## Completion signal\n", 1)[1].split(
    "\n## Step 5", 1
)[0]
PR_INSTRUCTIONS = PROMPT.split("## Step 5 — Open the pull request\n", 1)[1].split(
    "\n## Guardrails", 1
)[0]


def compiled_json_env(name):
    line = next(
        line for line in LOCK.splitlines()
        if line.strip().startswith(f"{name}:")
    )
    return json.loads(line.split(": ", 1)[1].strip("'"))


class GovernanceWatchPromptTests(unittest.TestCase):
    def test_execution_contract_precedes_calendar_and_source_work(self):
        self.assertLess(PROMPT.index("## Tool execution"), PROMPT.index("## Step 0"))
        for instruction in (
            "Stay in the repository root",
            "explicit repository-relative paths",
            "absolute paths for cache-memory or runtime-provided output files",
            "Prefer native read, search, and edit tools when they are actually exposed",
            "Run one standalone command per `bash` tool call",
            "write files only with the file-editing tool",
            "A truncated excerpt is not a complete source review",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, EXECUTION_CONTRACT)
        self.assertIn(
            "`cd`, `sed`, `awk`, `python3`, `node`, and `tr` are not granted",
            EXECUTION_CONTRACT,
        )
        self.assertIn("Do not wrap commands in another shell or interpreter", EXECUTION_CONTRACT)

    def test_shell_repository_queries_use_native_github_tools(self):
        for instruction in (
            "Do not invoke shell commands outside the supported recipes below",
            "`git log`",
            "`gh pr list`",
            "Use native GitHub tools for PR and repository queries",
            "The only permitted shell `git` commands are those explicitly listed in Step 5",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, EXECUTION_CONTRACT)

    def test_shell_recipes_use_compiled_permissions(self):
        commands = EXECUTION_CONTRACT.split("```bash\n", 1)[1].split("```", 1)[0]
        config = compiled_json_env("GH_AW_COPILOT_SDK_TOOL_CONFIG")
        allowed = set(config["permissions"]["allowedTools"])
        args = compiled_json_env("GH_AW_COPILOT_SDK_SERVER_ARGS")
        sidecar_allowed = {
            args[index + 1]
            for index, value in enumerate(args[:-1])
            if value == "--allow-tool"
        }
        executables = set()
        for command in commands.strip().splitlines():
            with self.subTest(command=command):
                self.assertNotRegex(command, r"[|;&<>`$]")
                executable = shlex.split(command)[0]
                executables.add(executable)
                grants = {f"shell({executable})", f"shell({executable}:*)"}
                self.assertTrue(grants & allowed, f"No SDK grant for {command}")
                self.assertTrue(grants & sidecar_allowed, f"No sidecar grant for {command}")
        self.assertEqual(executables, {"date", "ls", "cat", "grep", "rg", "head", "tail", "curl"})
        self.assertIn("--connect-timeout 15 --max-time 60", commands)

    def test_shell_permissions_remain_restricted(self):
        config = compiled_json_env("GH_AW_COPILOT_SDK_TOOL_CONFIG")
        args = compiled_json_env("GH_AW_COPILOT_SDK_SERVER_ARGS")
        allowed = set(config["permissions"]["allowedTools"])
        sidecar_allowed = {
            args[index + 1]
            for index, value in enumerate(args[:-1])
            if value == "--allow-tool"
        }
        expected_shell = {
            "shell(cat)", "shell(curl:*)", "shell(date)", "shell(echo)",
            "shell(find)", "shell(git add:*)", "shell(git branch:*)",
            "shell(git checkout:*)", "shell(git commit:*)", "shell(git merge:*)",
            "shell(git rm:*)", "shell(git status)", "shell(git switch:*)",
            "shell(github:*)", "shell(grep)", "shell(head)", "shell(ls)",
            "shell(printf)", "shell(pwd)", "shell(rg)", "shell(safeoutputs:*)",
            "shell(sleep)", "shell(sort)", "shell(tail)", "shell(uniq)",
            "shell(wc)", "shell(yq)",
        }
        for grants in (allowed, sidecar_allowed):
            with self.subTest(grants=sorted(grants)):
                self.assertEqual(
                    {grant for grant in grants if grant.startswith("shell")},
                    expected_shell,
                )
                self.assertNotIn("*", grants)
        self.assertNotIn("--allow-all-tools", args)
        self.assertFalse(config["permissions"].get("allowAllTools", False))

    def test_version_enforcement_does_not_add_activation_issue_writes(self):
        frontmatter = PROMPT.split("---", 2)[1]
        self.assertIn("  report-blocked-version: false\n", frontmatter)
        activation = LOCK.split("\n  activation:\n", 1)[1].split("\n  agent:\n", 1)[0]
        permissions = activation.split("    permissions:\n", 1)[1].split(
            "    env:\n", 1
        )[0]
        self.assertNotIn("issues: write", permissions)
        self.assertIn("Check compile-agentic version", activation)
        self.assertIn('GH_AW_BLOCKED_VERSION_REPORT_AS_ISSUE: "false"', activation)
        self.assertNotIn("report-failure-as-issue: false", frontmatter)
        self.assertIn("needs.event_schedule.outputs.should_run == 'true'", activation)
        self.assertIn("needs.pre_activation.outputs.activated == 'true'", activation)
        self.assertIn('GH_AW_REQUIRED_ROLES: "admin,maintainer,write"', LOCK)

    def test_first_permission_denial_stops_with_incomplete_coverage(self):
        denial = EXECUTION_CONTRACT.split("### On the first permission denial\n", 1)[1]
        for instruction in (
            "Tool invocation is not allowed by workflow tool permissions",
            "stop the review immediately",
            "Do not retry the denied operation, probe alternate command forms",
            "Call the exposed `report_incomplete` safe-output tool",
            "the rejected operation, the observed permission error",
            "any partial review coverage, and which sources remain unreviewed",
            "the sole permitted shell call after a denial is `safeoutputs report_incomplete`",
            "terminal output could not be recorded",
            "Leave review coverage dates unchanged for unreviewed sources",
            "Never emit `noop` for this interruption",
            "do not emit `missing_tool` unless the all-paths-failed condition",
            "An ordinary HTTP/network failure or an actual HTTP 429 is not a workflow permission denial",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, denial)
        retrieval = PROMPT.split("## Step 2", 1)[1].split("## Step 3", 1)[0]
        self.assertIn(
            "Run each request as a standalone `bash` tool call",
            retrieval,
        )
        self.assertIn(
            "For a workflow permission denial, follow the first-denial instruction above",
            retrieval,
        )

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

    def test_open_pr_coverage_is_specific_and_noop_is_deferred(self):
        step1 = PROMPT.split("## Step 1", 1)[1].split("## Step 2", 1)[0]
        for instruction in (
            "do not decide that the run is a **noop** here",
            "only to identify candidate overlaps, not to establish coverage",
            "same specific fact, setting, or event occurrence",
            "A shared source URL alone is not enough",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, step1)
        self.assertNotIn("emit **noop**", step1)
        step4 = PROMPT.split("## Step 4", 1)[1].split("## Completion signal", 1)[0]
        self.assertIn("After completing the Step 2 source review and Step 3 classification", step4)
        self.assertIn("preserve `report_incomplete`", step4)

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

    def test_late_covered_edits_are_committed_before_pull_request(self):
        self.assertIn("drop that exact change", PR_INSTRUCTIONS)
        self.assertIn("commit the cleanup before calling `create_pull_request`", PR_INSTRUCTIONS)
        self.assertIn("not sufficient because the safe-output tool publishes the committed branch", PR_INSTRUCTIONS)
        self.assertLess(
            PR_INSTRUCTIONS.index("Immediately before calling `create_pull_request`"),
            PR_INSTRUCTIONS.index("commit the cleanup"),
        )
        self.assertLess(
            PR_INSTRUCTIONS.index("commit the cleanup"),
            PR_INSTRUCTIONS.index("Create a pull request with:"),
        )
        cleanup_commands = PR_INSTRUCTIONS.split("```bash\n")[2].split("```", 1)[0]
        self.assertEqual(cleanup_commands.strip().splitlines(), [
            "git add -- docs/",
            'git commit -m "Update Copilot governance documentation"',
        ])

    def test_commit_message_avoids_sdk_rejected_metacharacters(self):
        commands = PR_INSTRUCTIONS.split("```bash\n", 1)[1].split("```", 1)[0]
        commit = next(line for line in commands.splitlines() if line.startswith("git commit "))
        message = shlex.split(commit)[3]
        self.assertNotRegex(message, r"[&<>`$]")
        self.assertIn("even inside quoted Git arguments", PR_INSTRUCTIONS)

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
        self.assertIn(
            "Run each request as a standalone `bash` tool call; "
            "do not pipe its output or chain it with other shell commands.",
            retrieval,
        )
        self.assertNotIn("Do **not** try to fetch URLs from `bash`", body)
        self.assertIn("using the retrieval order in Step 2", body)
        self.assertIn("Never send credentials, repository file contents", body)

    def test_rate_limit_retry_can_wait_without_retrying_early(self):
        frontmatter = PROMPT.split("---", 2)[1]
        self.assertIn('    - "sleep"\n', frontmatter)
        self.assertIn("Use `sleep <remaining-seconds>` through `bash`", PROMPT)
        self.assertIn("never retry early if waiting is denied", PROMPT)
        self.assertIn("Retry the rate-limited query once after the stated interval", PROMPT)

    def test_shell_commands_avoid_sdk_permission_denials(self):
        execution = EXECUTION_CONTRACT
        for instruction in (
            "one standalone command per `bash` tool call",
            "Do not use shell loops, pipelines, command chaining",
            "redirection, command substitution, or inline interpreters",
            "Read local files with `cat` or `grep`",
            "Do not use `sed` or Python",
            "If any tool reports",
            "stop the review immediately",
            "Do not retry the denied operation",
            "`report_incomplete`",
        ):
            with self.subTest(instruction=instruction):
                self.assertIn(instruction, execution)

    def test_shell_denial_fix_preserves_command_allowlist(self):
        frontmatter = PROMPT.split("---", 2)[1]
        bash = frontmatter.split("  bash:\n", 1)[1].split("  github:\n", 1)[0]
        self.assertEqual(
            [json.loads(line.strip()[2:]) for line in bash.splitlines()],
            ["curl", "sleep", "date *", "ls *", "cat *", "grep *", "rg *", "find *"],
        )

    def test_compiled_runtime_allows_retrieval_and_rate_limit_wait(self):
        config = compiled_json_env("GH_AW_COPILOT_SDK_TOOL_CONFIG")
        self.assertTrue(config["capabilities"]["webFetch"])
        for tool in ("web_fetch", "shell(curl:*)", "shell(sleep)"):
            with self.subTest(tool=tool):
                self.assertIn(tool, config["permissions"]["allowedTools"])

    def test_retrieval_failure_paths_require_terminal_incomplete_output(self):
        source_review = PROMPT.split("## Step 2", 1)[1].split("## Step 3", 1)[0]
        retrieval_rules = source_review.split("\nRules:\n", 1)[1].split(
            "\n### a.", 1
        )[0]
        self.assertIn(
            "all three retrieval paths are unavailable or fail", retrieval_rules
        )
        self.assertIn(
            "Then call `report_incomplete` with the retrieval blocker", retrieval_rules
        )
        self.assertIn(
            "`missing_tool` alone is not a terminal safe output", retrieval_rules
        )
        no_change_path = PROMPT.split("## Step 4", 1)[1].split(
            "\nOtherwise edit", 1
        )[0]
        self.assertIn("call `missing_tool` followed by `report_incomplete`", no_change_path)
        self.assertIn(
            "call `missing_tool` followed by `report_incomplete` instead of `noop`",
            no_change_path,
        )


if __name__ == "__main__":
    unittest.main()

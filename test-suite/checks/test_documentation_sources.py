import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
POLICY_PAGE = ROOT / "docs" / "sections" / "enterprise-org-policies.md"


class DocumentationSourceTests(unittest.TestCase):
    def test_confirmed_policy_items_link_official_sources(self):
        content = POLICY_PAGE.read_text(encoding="utf-8")
        policy_list = content.split("### Confirmed named policies\n", 1)[1].split(
            "\n### ", 1
        )[0]
        items = [line for line in policy_list.splitlines() if line.startswith("- ")]

        self.assertTrue(items)
        for item in items:
            with self.subTest(item=item[:80]):
                self.assertRegex(
                    item, re.compile(r"\]\(https://(?:docs\.github\.com|github\.blog)/")
                )


if __name__ == "__main__":
    unittest.main()

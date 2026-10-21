import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / ".github" / "scripts"))
from check_section_freshness import find_stale_sections


class SectionFreshnessTests(unittest.TestCase):
    def test_reports_sections_older_than_ninety_days(self):
        with tempfile.TemporaryDirectory() as directory:
            sections = Path(directory)
            (sections / "stale.md").write_text(
                '---\ntitle: "Stale section"\nlast_reviewed: 2026-01-01\n---\n',
                encoding="utf-8",
            )
            (sections / "current.md").write_text(
                '---\ntitle: "Current section"\nlast_reviewed: 2026-08-01\n---\n',
                encoding="utf-8",
            )
            self.assertEqual(
                find_stale_sections(date(2026, 10, 21), sections),
                [
                    {
                        "title": "Stale section",
                        "url": "https://beardofedu.github.io/copilot-governance-training/sections/stale/",
                        "last_reviewed": "2026-01-01",
                    }
                ],
            )

    def test_rejects_missing_or_future_review_dates(self):
        for front_matter in (
            '---\ntitle: "Missing date"\n---\n',
            '---\ntitle: "Future date"\nlast_reviewed: 2027-01-01\n---\n',
        ):
            with self.subTest(front_matter=front_matter), tempfile.TemporaryDirectory() as directory:
                sections = Path(directory)
                (sections / "section.md").write_text(front_matter, encoding="utf-8")
                with self.assertRaises(ValueError):
                    find_stale_sections(date(2026, 10, 21), sections)


if __name__ == "__main__":
    unittest.main()

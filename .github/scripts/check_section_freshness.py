#!/usr/bin/env python3
"""Report guide sections whose last_reviewed date is more than 90 days old."""

import json
import re
from datetime import date, datetime, timedelta, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "docs" / "sections"
MAX_AGE = timedelta(days=90)
DATE_PATTERN = re.compile(r"^last_reviewed:\s*[\"']?(\d{4}-\d{2}-\d{2})[\"']?\s*$", re.MULTILINE)
TITLE_PATTERN = re.compile(r'^title:\s*["\']?(.*?)["\']?\s*$', re.MULTILINE)


def find_stale_sections(as_of: date, sections_dir: Path = SECTIONS) -> list[dict[str, str]]:
    stale = []
    for path in sorted(sections_dir.glob("*.md")):
        text = path.read_text(encoding="utf-8")
        metadata = text.split("---", 2)
        if len(metadata) < 3 or metadata[0].strip():
            raise ValueError(f"{path} is missing YAML front matter")
        front_matter = metadata[1]
        date_match = DATE_PATTERN.search(front_matter)
        title_match = TITLE_PATTERN.search(front_matter)
        if not date_match or not title_match:
            raise ValueError(f"{path} must define title and last_reviewed front matter")

        try:
            last_reviewed = datetime.strptime(date_match.group(1), "%Y-%m-%d").date()
        except ValueError as error:
            raise ValueError(f"{path} has an invalid last_reviewed date") from error
        if last_reviewed > as_of:
            raise ValueError(f"{path} has a last_reviewed date in the future")
        if as_of - last_reviewed > MAX_AGE:
            stale.append(
                {
                    "title": title_match.group(1),
                    "url": f"https://beardofedu.github.io/copilot-governance-training/sections/{path.stem}/",
                    "last_reviewed": last_reviewed.isoformat(),
                }
            )
    return stale


if __name__ == "__main__":
    today = datetime.now(timezone.utc).date()
    print(json.dumps(find_stale_sections(today), separators=(",", ":")))

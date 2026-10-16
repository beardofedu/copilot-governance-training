"""Select daily reviews or hourly reviews during confirmed live events."""

import json
import os
from datetime import date, datetime, timezone
from pathlib import Path


CALENDAR = Path(__file__).resolve().parents[2] / "docs/_data/copilot-events.json"


def should_run(events, now, event_name):
    active = False
    for event in events:
        start, end = event["start_date"], event["end_date"]
        if start is None and end is None:
            continue
        start, end = date.fromisoformat(start), date.fromisoformat(end)
        if end < start:
            raise ValueError(f"Event ends before it starts: {event['name']}")
        active = active or start <= now.date() <= end
    return event_name == "workflow_dispatch" or now.hour == 8 or active


def main():
    events = json.loads(CALENDAR.read_text())["events"]
    run = should_run(events, datetime.now(timezone.utc), os.environ["GITHUB_EVENT_NAME"])
    with open(os.environ["GITHUB_OUTPUT"], "a") as output:
        output.write(f"should_run={str(run).lower()}\n")
    print(f"Governance review enabled: {run}")


if __name__ == "__main__":
    main()

"""Offline tests for the live-event scheduling gate."""

import importlib.util
import json
import unittest
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location(
    "governance_watch_schedule",
    ROOT / ".github/scripts/governance_watch_schedule.py",
)
schedule = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(schedule)


class EventScheduleTests(unittest.TestCase):
    def setUp(self):
        self.events = [
            {"name": "Test event", "start_date": "2026-10-28", "end_date": "2026-10-29"}
        ]

    def enabled(
        self, timestamp, events=None, event_name="schedule",
        scheduled_cron="34 0-7,9-23 * * *",
    ):
        return schedule.should_run(
            self.events if events is None else events,
            datetime.fromisoformat(timestamp).replace(tzinfo=timezone.utc),
            event_name,
            scheduled_cron,
        )

    def test_daily_review_outside_events(self):
        self.assertTrue(
            self.enabled("2026-10-27T08:34:00", scheduled_cron="34 8 * * *")
        )
        self.assertFalse(self.enabled("2026-10-27T09:34:00"))
        self.assertFalse(self.enabled("2026-10-30T07:34:00"))

    def test_delayed_daily_trigger_still_runs(self):
        for timestamp in ("2026-10-27T09:01:00", "2026-10-30T00:01:00"):
            with self.subTest(timestamp=timestamp):
                self.assertTrue(
                    self.enabled(timestamp, scheduled_cron="34 8 * * *")
                )

    def test_delayed_event_only_trigger_does_not_become_daily(self):
        self.assertFalse(self.enabled("2026-10-27T08:01:00"))
        self.assertFalse(self.enabled("2026-10-30T08:34:00"))

    def test_inclusive_event_dates_at_every_hour(self):
        for day in (28, 29):
            for hour in range(24):
                with self.subTest(day=day, hour=hour):
                    self.assertTrue(self.enabled(f"2026-10-{day}T{hour:02}:34:00"))

    def test_manual_runs_bypass_date_gate(self):
        self.assertTrue(self.enabled("2026-01-01T00:00:00", event_name="workflow_dispatch"))

    def test_unknown_dates_do_not_enable_hourly_runs(self):
        events = [{"name": "Unannounced", "start_date": None, "end_date": None}]
        self.assertFalse(self.enabled("2026-10-28T12:34:00", events))
        self.assertTrue(
            self.enabled("2026-10-28T08:34:00", events, scheduled_cron="34 8 * * *")
        )

    def test_dates_do_not_repeat_each_year(self):
        self.assertFalse(self.enabled("2027-10-28T12:34:00"))

    def test_new_year_single_day_and_overlapping_events(self):
        events = [
            {"name": "New year", "start_date": "2026-12-31", "end_date": "2027-01-02"},
            {"name": "One day", "start_date": "2027-01-02", "end_date": "2027-01-02"},
        ]
        self.assertTrue(self.enabled("2027-01-01T23:34:00", events))
        self.assertTrue(self.enabled("2027-01-02T23:34:00", events))
        self.assertFalse(self.enabled("2027-01-03T00:34:00", events))

    def test_invalid_dates_fail_instead_of_silently_disabling(self):
        for start, end in (
            ("2026-02-30", "2026-03-01"),
            ("2026-10-29", "2026-10-28"),
            ("not-a-date", "2026-10-28"),
        ):
            with self.subTest(start=start), self.assertRaises(ValueError):
                self.enabled(
                    "2026-10-28T12:34:00",
                    [{"name": "Invalid", "start_date": start, "end_date": end}],
                )

    def test_repository_calendar_is_valid_and_covers_flagship_events(self):
        events = json.loads(schedule.CALENDAR.read_text())["events"]
        names = {event["name"] for event in events}
        self.assertTrue({"GitHub Universe", "Microsoft Ignite", "Microsoft Build"} <= names)
        for event in events:
            self.assertTrue(event["source"].startswith("https://"))
        self.assertTrue(
            self.enabled("2026-01-01T08:34:00", events, scheduled_cron="34 8 * * *")
        )


if __name__ == "__main__":
    unittest.main()

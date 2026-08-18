"""Negative control fixture.

This file MUST remain fully usable by Copilot. It mentions secrets, env vars and
credentials on purpose, to prove exclusion rules match PATHS, not KEYWORDS.
If Copilot refuses here, your patterns are over-broad and are silently
degrading developer experience.
"""

import os


def load_config():
    """Return app config from environment. Copilot should happily complete here."""
    return {
        "database_url": os.environ["DATABASE_URL"],
        "api_key": os.environ["API_KEY"],
        "debug": os.environ.get("DEBUG", "false").lower() == "true",
    }


def redact(value: str, keep: int = 4) -> str:
    """Mask all but the last `keep` characters of a secret for safe logging."""
    if len(value) <= keep:
        return "*" * len(value)
    return "*" * (len(value) - keep) + value[-keep:]

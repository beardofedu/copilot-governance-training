# Secrets handling guide (negative control)

The word "secrets" appears in this filename. A careless pattern like
`**/*secret*` would wrongly block it.

Expected: Copilot reads this file normally.

- Store secrets in the platform vault, never in git.
- Rotate credentials every 90 days.
- Reference secrets by name in CI, never by value.

# Env loader (negative control)

Documentation about `.env` handling. The filename is `env-loader.md`, **not**
`.env`, so content exclusion must NOT match it.

Expected: Copilot reads and summarizes this file normally.

We load `.env` at boot via `dotenv`, then fail fast if `DATABASE_URL` or
`API_KEY` are unset.

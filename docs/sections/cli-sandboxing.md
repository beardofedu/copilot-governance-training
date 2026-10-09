---
layout: default
title: "Copilot CLI & App Sandboxing"
nav_order: 7
permalink: /sections/cli-sandboxing/
---

# Copilot CLI & App Sandboxing

Doc: [Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise) | [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes)

- Enterprise AI controls → **Copilot Clients → Copilot CLI** dropdown enables/disables CLI independently of the Copilot app.
- `permissions.disableBypassPermissionsMode`: kills "YOLO"/bypass-all mode.
- **Corrected:** the `sandbox` managed-settings key is no longer CLI-only. It now also enforces on the **GitHub Copilot app (public preview)**, on top of Copilot CLI — minimum restrictions on command execution, filesystem/network access, credentials, local MCP/LSP servers — cumulative-restrictive across MDM/server/file/user layers (see section 2 precedence exception and the full sub-property list there) ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)).
- **Corrected:** `sandbox` also enforces for Agent Host sessions in VS Code 1.138.0+, and the CLI's `/sandbox disable` is a session-only opt-out that only `allowBypass: false` blocks ([enterprise-managed-settings#sandbox](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)).
- In app sessions, the embedded runtime enforces the *complete* effective managed `sandbox` object, including properties not shown in the app's own project settings UI — the app only displays the user's project settings, not per-setting managed locks.
- **Masked environment variables (local sandbox):** users can mask extra env vars via the `/sandbox` **Credentials** tab or `sandbox.credentials.envVars` (each with non-empty `injectHosts`); sandboxed processes get placeholders and a local proxy injects real values only into HTTPS request headers to those hosts. Git/`gh` auth use this automatically when their authentication settings are enabled. Adding an inject host does not grant network access, and an approved sandbox bypass runs the command with real secrets and no masking ([configuring-local-sandbox-settings#masking-environment-variables](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings#masking-environment-variables), [using-local-sandboxing](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing)).
- Model selection in CLI is capped to whatever models are enterprise-enabled; custom model API keys can be supplied by admins.

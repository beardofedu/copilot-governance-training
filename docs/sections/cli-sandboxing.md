---
layout: default
title: "Copilot CLI & App Sandboxing"
nav_order: 7
permalink: /sections/cli-sandboxing/
last_reviewed: 2026-10-16
---

# Copilot CLI & App Sandboxing

> **Official documentation**
> - [Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)
> - [About cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes)
> - [Enterprise managed settings reference: `sandbox`](https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings#sandbox)
> - [Configuring local sandbox settings: masking environment variables](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/configuring-local-sandbox-settings#masking-environment-variables)
> - [Using local sandboxing](https://docs.github.com/en/copilot/how-tos/cloud-and-local-sandboxes/using-local-sandboxing)
>
> **Related sections:** [Managed Settings]({{ '/sections/managed-settings/' | relative_url }}) · [Cloud Agent Restrictions]({{ '/sections/cloud-agent/' | relative_url }})

- Enterprise AI controls → **Copilot Clients → Copilot CLI** dropdown enables/disables CLI independently of the Copilot app.
- `permissions.disableBypassPermissionsMode`: kills "YOLO"/bypass-all mode.
- **Corrected:** local sandboxing is generally available in Copilot CLI, the GitHub Copilot app, and VS Code Agent Host sessions. The [`sandbox` managed-settings key]({{ '/sections/managed-settings/#sandbox-sub-properties' | relative_url }}) enforces on the app as well as Copilot CLI — minimum restrictions on command execution, filesystem/network access, credentials, local MCP/LSP servers — cumulative-restrictive across MDM/server/file/user layers (see the [precedence exception]({{ '/sections/managed-settings/#precedence' | relative_url }})). The public-preview notice applies to cloud sandboxes, not local sandboxing.
- **Corrected:** `sandbox` also enforces for Agent Host sessions in VS Code 1.138.0+, and the CLI's `/sandbox disable` is a session-only opt-out that only `allowBypass: false` blocks.
- In app sessions, the embedded runtime enforces the *complete* effective managed `sandbox` object, including properties not shown in the app's own project settings UI — the app only displays the user's project settings, not per-setting managed locks.
- **Masked environment variables (local sandbox):** users can mask extra env vars via the `/sandbox` **Credentials** tab or `sandbox.credentials.envVars` (each with non-empty `injectHosts`); sandboxed processes get placeholders and a local proxy injects real values only into HTTPS request headers to those hosts. Git/`gh` auth use this automatically when their authentication settings are enabled. Adding an inject host does not grant network access, and an approved sandbox bypass runs the command with real secrets and no masking.
- Model selection in CLI is capped to whatever models are enterprise-enabled; custom model API keys can be supplied by admins.

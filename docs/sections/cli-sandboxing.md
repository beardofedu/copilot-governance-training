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
- In app sessions, the embedded runtime enforces the *complete* effective managed `sandbox` object, including properties not shown in the app's own project settings UI — the app only displays the user's project settings, not per-setting managed locks.
- Model selection in CLI is capped to whatever models are enterprise-enabled; custom model API keys can be supplied by admins.

---
layout: default
title: "Copilot CLI-Specific Sandboxing"
nav_order: 7
permalink: /sections/cli-sandboxing/
---

# Copilot CLI-Specific Sandboxing

Doc: [Administering Copilot CLI for your enterprise](https://docs.github.com/en/copilot/how-tos/copilot-cli/administer-copilot-cli-for-your-enterprise)

- Enterprise AI controls → **Copilot Clients → Copilot CLI** dropdown enables/disables CLI independently of the Copilot app.
- `permissions.disableBypassPermissionsMode`: kills "YOLO"/bypass-all mode.
- `sandbox` key (CLI-only): minimum restrictions on command execution, filesystem/network access, credentials, local MCP/LSP servers — cumulative-restrictive across MDM/server/file/user layers (see section 2 precedence exception).
- Model selection in CLI is capped to whatever models are enterprise-enabled; custom model API keys can be supplied by admins.

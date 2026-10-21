---
layout: default
title: "Suggested Training Course Outline"
nav_order: 13
permalink: /sections/course-outline/
last_reviewed: 2026-10-16
---

# Suggested Training Course Outline

1. [**Mental model**]({{ '/sections/mental-model/' | relative_url }}) — policies vs. managed-settings vs. network vs. audit (10 min)
2. **Live walkthrough**: [AI controls]({{ '/sections/enterprise-org-policies/' | relative_url }}) UI — policies, models, MCP tab, and the new Default availability policies (15 min)
3. **Hands-on**: draft a [`managed-settings.json`]({{ '/sections/managed-settings/' | relative_url }}) with `strictKnownMarketplaces`, `allowedMcpServers`/`deniedMcpServers`, `permissions.deny`/`ask`/`allow`, and `remoteControl` (20 min)
4. [**Cloud agent specifics**]({{ '/sections/cloud-agent/' | relative_url }}) — firewall limitations, workflow approval gate (10 min)
5. [**Content exclusion + public code matching**]({{ '/sections/content-controls/' | relative_url }}), and the IDE agent-mode gap (10 min)
6. [**Network layer**]({{ '/sections/network-controls/' | relative_url }}) — allowlist reference, subscription routing, IP allow list caveat (10 min)
7. [**Audit & metrics**]({{ '/sections/audit-visibility/' | relative_url }}) — what's visible vs. what needs custom telemetry; session data sync/sharing/retention policy (10 min)
8. **Q&A / apply to your org's actual `managed-settings.json`** (15 min)

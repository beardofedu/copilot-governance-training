---
layout: default
title: "Managed settings generator"
description: "Build enterprise managed-settings.json with a step-by-step setup wizard that explains each setting, plus copy-ready JSON."
nav_order: 90
permalink: /sections/managed-settings-generator/
last_reviewed: 2026-10-28
wide_content: true
---

<h1>Managed settings generator</h1>
<p>Build your enterprise policy one decision at a time, like a setup wizard. Each step covers one area, explains why you would or would not manage each setting, and keeps advanced options one click away. Nothing is included until you select <strong>Include</strong>. This is a new file builder, not an editor for an existing policy.</p>
<p>All generation happens in your browser. Inputs are not sent to a service or saved by this tool. Avoid real credentials; replace secret placeholders locally after downloading.</p>
<p>Based on the <a href="https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings">official managed settings reference</a> reviewed October 22, 2026, including the <a href="https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference#dynamic-authentication-headers">CLI dynamic headers reference</a> and the <a href="https://docs.github.com/en/copilot/reference/ai-models/supported-models">supported AI models list</a>. Read the <a href="{{ '/sections/managed-settings/' | relative_url }}">managed settings guide</a> for precedence, client support, and policy semantics.</p>

<noscript><p>This generator requires JavaScript. Use the linked reference and managed settings guide to create your file manually.</p></noscript>
<p id="settings-loading">Loading the builder. If controls do not appear, enable JavaScript or reload the page.</p>
<div id="settings-workspace" class="settings-workspace" hidden>
  <div class="settings-controls wizard">
    <nav aria-label="Setup progress"><ol id="wizard-steps" class="wizard-steps"></ol></nav>
    <form id="settings-form" class="wizard-body" aria-label="Managed settings setup"></form>
    <div class="wizard-nav">
      <button id="wizard-back" class="button" type="button">Back</button>
      <p id="wizard-position" role="status"></p>
      <button id="wizard-next" class="button button-primary" type="button">Next</button>
    </div>
  </div>
  <section id="wizard-review" hidden>
    <h2>Review and finish</h2>
    <p>Check what you chose for each area, fix any errors listed in the preview, then copy or download your file.</p>
    <ul id="settings-summary" class="wizard-summary" aria-label="Configured settings by area"></ul>
    <div class="settings-actions">
      <button id="settings-copy" class="button button-primary" type="button">Copy JSON</button>
      <button id="settings-download" class="button" type="button">Download JSON</button>
      <button id="settings-reset" class="button" type="button">Start over</button>
    </div>
    <p id="settings-feedback" role="status"></p>
    <p class="settings-help">This checks input shape and selected dependencies, not effective policy on a client. It does not connect to your enterprise or deploy anything. Team override checkboxes produce base-file <code>overridable</code> wrappers, not team files or mappings. Next, follow <a href="#deploy-your-settings">Deploy your settings</a>.</p>
  </section>
  <section class="settings-preview" aria-labelledby="settings-preview-title">
    <h2 id="settings-preview-title">Live preview: managed-settings.json</h2>
    <p id="settings-status" role="status"></p>
    <ul id="settings-issues" class="settings-issues" aria-label="Configuration errors and warnings"></ul>
    <label for="settings-output">Generated JSON (read-only)</label>
    <textarea id="settings-output" rows="20" readonly spellcheck="false" aria-describedby="settings-status"></textarea>
  </section>
</div>

<h2 id="deploy-your-settings">Deploy your settings</h2>
<p><strong>Review first.</strong> Compare against your existing policy rather than replacing it blindly. Pilot with a small scope, check client support, and preserve any existing restrictions you still need. An empty <code>{}</code> configures no controls and is not a lockdown baseline.</p>
<ol>
  <li><strong>Server-managed (recommended):</strong> copy the generated JSON into <code>copilot/managed-settings.json</code> in your enterprise's <code>.github-private</code> repository. This is the only delivery method that reaches cloud agent; individual keys still have client-specific support. Follow <a href="https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/get-started">GitHub's setup and validation instructions</a>. Review errors and warnings in the enterprise <strong>Agents</strong> tab under <strong>Copilot settings validation</strong>.</li>
  <li><strong>File-based (local clients only):</strong> distribute using your administrator tooling to <code>/Library/Application Support/GitHubCopilot/managed-settings.json</code> on macOS, <code>%ProgramFiles%\GitHubCopilot\managed-settings.json</code> on Windows, or <code>/etc/github-copilot/managed-settings.json</code> on Linux. macOS/Linux CLI files must be root-owned, not group/world-writable, and not symlinks. See <a href="https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/deploy-managed-settings">deployment requirements</a>.</li>
  <li><strong>MDM:</strong> adapt values for Windows registry or macOS managed preferences using the deployment reference; this download is JSON, not a registry file or configuration profile. <code>sandbox.learningMode: "allow"</code> requires native Windows device management and is intentionally unavailable here because JSON delivery ignores it.</li>
</ol>
<p>Server settings normally propagate in about an hour; restart clients to fetch changes. For team specialization, configure <a href="https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/use-managed-settings/override-settings-for-teams">team mappings and separate team settings files</a>. A team sandbox override replaces the entire default object.</p>
<script src="{{ '/assets/js/managed-settings.js' | relative_url }}"></script>

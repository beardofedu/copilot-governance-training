(function (root) {
  'use strict';

  var reference = 'https://docs.github.com/en/copilot/reference/enterprise-administrators/enterprise-managed-settings';
  var groups = [
    { id: 'defaults', title: '1. Conversation defaults', help: 'Choose defaults, not a model-access policy. Users can still change models per conversation. Auto tier applies only when the selected model is auto. Auto tier needs CLI 1.0.87-0+ or VS Code 1.140.0+.' },
    { id: 'permissions', title: '2. Permissions and computer use', help: 'Granular rules: CLI, Copilot app, and VS Code Agent Host only. Deny beats ask, which beats allow. Managed ask rules require fresh approval; unmatched supported operations require approval once a rule or allowlist is defined. Bypass controls also support other VS Code sessions and JetBrains, but not cloud agent.' },
    { id: 'plugins', title: '3. Plugins and marketplaces', help: 'Supported across CLI, VS Code, Copilot app, cloud agent, and JetBrains. Examples are placeholders, not enterprise recommendations. Advanced JSON editors expose every documented marketplace source type.' },
    { id: 'mcp', title: '4. MCP servers', help: 'Deny rules win. Built-in first-party servers are exempt. Allowlisting is not supported by cloud agent. Every matcher must contain exactly one of serverName, serverUrl, or serverCommand. Prefer URL or command matching: users choose server names.' },
    { id: 'sandbox', title: '5. Sandbox', help: 'CLI, Copilot app, and VS Code Agent Host only. Restrictions combine cumulatively across sources. Adding any sandbox key gates clients below VS Code 1.141.0, CLI 1.0.93, and Copilot app 1.1.26. Roll out client updates first. True enforces force-on settings; false prohibits capabilities; the opposite values leave user configuration unchanged.' },
    { id: 'telemetry', title: '6. Telemetry', help: 'CLI, VS Code, Copilot app, and JetBrains; not cloud agent. The highest-precedence managed source supplies the entire object, without merging. Capture can expose identity, code, prompts, tool results, and sensitive paths. Enable only what is approved. VS Code local harness supports identity and legacy captureContent; fine-grained content controls require Agent Host.' },
    { id: 'remote', title: '7. Remote access and policy freshness', help: 'Remote control: CLI and VS Code, governing sessions hosted on this device only. Freshness: CLI, VS Code, and Copilot app. Requiring refresh can restrict or block use without a network connection at startup.' }
  ];
  var fields = [];
  // Source: https://docs.github.com/en/copilot/reference/ai-models/supported-models (reviewed 2026-10-29).
  var modelCatalog = [
    { provider: 'Automatic', models: [['auto', 'Auto (automatic model selection)'], ['fusion', 'Fusion (model routing; see fusionTier)']] },
    { provider: 'OpenAI', models: [['gpt-5.3-codex', 'GPT-5.3-Codex'],
      ['gpt-5.6-luna', 'GPT-5.6 Luna'], ['gpt-5.6-sol', 'GPT-5.6 Sol'], ['gpt-5.6-terra', 'GPT-5.6 Terra'],
      ['gpt-6-astra', 'GPT-6 Astra'], ['gpt-6-luna', 'GPT-6 Luna'], ['gpt-6-sol', 'GPT-6 Sol'], ['gpt-6.1-sol', 'GPT-6.1 Sol']] },
    { provider: 'Anthropic', models: [['claude-haiku-4.5', 'Claude Haiku 4.5'], ['claude-haiku-5.5', 'Claude Haiku 5.5'],
      ['claude-opus-5', 'Claude Opus 5'], ['claude-opus-5.5', 'Claude Opus 5.5'], ['claude-sonnet-4.6', 'Claude Sonnet 4.6'],
      ['claude-sonnet-5', 'Claude Sonnet 5'], ['claude-sonnet-5.5', 'Claude Sonnet 5.5']] },
    { provider: 'Google', models: [['gemini-3.8-flash', 'Gemini 3.8 Flash'], ['gemini-4-argon', 'Gemini 4 Argon']] },
    { provider: 'Microsoft', models: [['mai-code-1.1-flash', 'MAI-Code-1.1-Flash']] },
    { provider: 'Moonshot AI', models: [['kimi-k3', 'Kimi K3']] },
    { provider: 'xAI', models: [['grok-4.5', 'Grok 4.5'], ['grok-4.6', 'Grok 4.6'], ['grok-4.7', 'Grok 4.7']] }
  ];
  var modelIds = [];
  modelCatalog.forEach(function (group) { group.models.forEach(function (model) { modelIds.push(model[0]); }); });
  function field(group, path, label, type, help, example, options, advanced, overridable) {
    fields.push({ group: group, path: path, label: label, type: type, help: help,
      example: example, options: options, advanced: !!advanced, overridable: !!overridable });
  }
  function bool(group, path, label, help, advanced) {
    field(group, path, label, 'boolean', help, '', null, advanced);
  }
  var modelHelp = 'Choose auto or a model from GitHub\'s supported models list. The model must also be enabled by your AI model policies and supported by each client and plan.';
  field('defaults', 'model', 'Default model', 'enum', modelHelp, '', modelIds, false, true);
  field('defaults', 'autoTier', 'Auto routing tier', 'enum', 'A plain tier locks user/repository overrides. An overridable tier provides a default.', '', ['efficiency', 'balance', 'intelligence', 'unmanaged'], false, true);
  field('defaults', 'fusionTier', 'Fusion effort tier', 'enum', 'Default effort level when model is fusion, most to least restrictive. A plain tier locks it; an overridable tier provides a default. Requires CLI 1.0.104-3, VS Code 1.144.0, or Copilot app 1.1.33-4 or later.', '', ['standard', 'high', 'max', 'unmanaged'], false, true);
  field('defaults', 'permissions.model', 'Legacy default model', 'enum', 'Compatibility fallback only, read when top-level model is absent. Prefer Default model above.', '', modelIds, true);
  field('permissions', 'permissions.disableBypassPermissionsMode', 'Bypass permissions mode', 'enum', 'disable blocks YOLO / allow-all; unmanaged leaves this control unmanaged. This is a string, not a Boolean.', '', ['disable', 'unmanaged'], false, true);
  field('permissions', 'permissions.disableAssistedPermissionsMode', 'Disable assisted permissions', 'boolean', 'true stops users enabling assisted permissions. It does not disable bypass mode.', '', null, false);
  field('permissions', 'permissions.defaultMode', 'Default permission mode', 'enum', 'Default for new sessions. Not a lock: an explicit permitted choice wins and resumed sessions keep their saved mode. Unavailable or blocked modes fall back to manual.', '', ['manual', 'assisted', 'allow-all'], false);
  bool('permissions', 'features.computerUse', 'Computer use', 'False prevents users enabling computer use in CLI and the Copilot app. True leaves the choice to users.');
  ['deny', 'ask', 'allow'].forEach(function (kind) {
    field('permissions', 'permissions.' + kind, kind.charAt(0).toUpperCase() + kind.slice(1) + ' operation rules', 'rules',
      'One rule per line. Shell(...) / Bash(...) / PowerShell(...), Read(...), Edit(...) / Write(...), or Domain(...). An included blank field emits an explicit empty array.',
      kind === 'deny' ? 'Read(~/.ssh/**)\nEdit(//etc/**)' : kind === 'ask' ? 'Shell(git push *)' : 'Shell(npm test *)', null, kind === 'allow', true);
  });
  field('plugins', 'strictKnownMarketplaces', 'Allowed marketplaces', 'marketplaces', 'JSON array of source objects. An included [] blocks all marketplace installs. Omission does not create an allowlist. Sources: github (repo, optional ref/path), git (url, optional ref/path), url (url, optional headers), npm (package), file/directory (path), hostPattern (hostPattern regex), pathPattern (pathPattern regex).',
    '[\n  { "source": "github", "repo": "OWNER/REPO" }\n]', null, false, true);
  field('plugins', 'enabledPlugins', 'Required or blocked plugins', 'plugins', 'JSON map of PLUGIN@MARKETPLACE to true (required) or false (blocked). Team settings can only add plugins to the enterprise baseline.',
    '{\n  "my-plugin@enterprise-plugins": true\n}', null, false);
  field('plugins', 'extraKnownMarketplaces', 'Additional marketplaces', 'extras', 'JSON map of names to {source: {...}, autoUpdate?: true/false}. Source supports github (repo, optional ref/path), git (url, optional ref/path), or directory (path). An explicit autoUpdate value is enforced; omission leaves existing behavior.',
    '{\n  "enterprise-plugins": {\n    "source": { "source": "github", "repo": "OWNER/REPO" },\n    "autoUpdate": true\n  }\n}', null, true, true);
  ['allowedMcpServers', 'deniedMcpServers'].forEach(function (path) {
    field('mcp', path, path === 'allowedMcpServers' ? 'Allowed MCP servers' : 'Denied MCP servers', 'mcp',
      'JSON array. Allowed [] blocks all non-built-in servers; omission allows servers subject to deny rules. Commands match literal argument arrays, not shell command strings. URL patterns support *. Names are case-sensitive.',
      '[\n  { "serverUrl": "https://mcp.example.com/*" },\n  { "serverCommand": ["npx", "-y", "approved-mcp-server"] }\n]', null, false, true);
  });
  [
    ['enabled', 'Require sandbox', 'True requires sandboxing by default. This alone may be declined on unsupported CLI hosts.'],
    ['failIfUnavailable', 'Fail closed', 'True with enabled: true blocks model/tool execution if sandbox policy cannot be enforced. Does not enable sandboxing by itself.'],
    ['allowBypass', 'Allow sandbox bypass', 'False prohibits commands outside the sandbox and session-only opt-out.'],
    ['sandboxMcpServers', 'Sandbox local MCP servers', 'True requires local MCP servers to run in the sandbox; remote servers are not sandboxed locally.'],
    ['sandboxLspServers', 'Sandbox language servers', 'True requires local language servers to run in the sandbox.'],
    ['addCurrentWorkingDirectory', 'Automatic working-directory access', 'False prevents automatic read/write access to the current working directory.'],
    ['auth.git', 'Inject Git credentials', 'False blocks automatic GitHub token injection for Git HTTPS operations.'],
    ['auth.gh', 'Inject GitHub CLI credentials', 'False blocks automatic GitHub token injection for gh operations.'],
    ['allowDevToolAccess', 'Automatic development-tool access', 'False blocks automatic access to tool configs, caches, registries, and toolchains. May break authenticated restores and builds.'],
    ['userPolicy.network.allowOutbound', 'Outbound network access', 'False blocks outbound network access.'],
    ['userPolicy.network.allowLocalNetwork', 'Local network access', 'False restricts local network access. On Windows, combining false with host rules or proxy settings prevents sandboxed commands from starting.'],
    ['userPolicy.seatbelt.keychainAccess', 'macOS Keychain access', 'False prevents sandboxed processes accessing the macOS Keychain. macOS only.']
  ].forEach(function (entry, index) { bool('sandbox', 'sandbox.' + entry[0], entry[1], entry[2], index > 4); });
  field('sandbox', 'sandbox.learningMode', 'Windows access recording', 'enum', 'deny enforces restrictions and records blocked access. The allow value requires native Windows device management and is ignored in managed-settings.json, so this generator does not emit it.', '', ['deny'], true);
  ['readwritePaths', 'readonlyPaths', 'deniedPaths'].forEach(function (name) {
    field('sandbox', 'sandbox.userPolicy.filesystem.' + name, 'Filesystem ' + name, 'paths',
      'One absolute path per line. Grant lists narrow by exact path string; denied paths add denials. An empty grant array removes user grants, not separately assembled temporary/CWD access.', '/absolute/path', null, true);
  });
  ['allowedHosts', 'blockedHosts'].forEach(function (name) {
    field('sandbox', 'sandbox.userPolicy.network.' + name, 'Network ' + name, 'hosts',
      'One hostname or IP per line; no URLs or ports. *.example.com excludes the root for allowedHosts. Blocked domains also block subdomains. Non-empty allowedHosts restricts access; [] does not mean block all. Windows enforcement relies on programs honoring proxy settings.', 'api.github.com\n*.example.com', null, true);
  });
  field('sandbox', 'sandbox.userPolicy.network.proxy.url', 'Upstream HTTP proxy', 'url', 'Proxy URL. Platform support varies; Windows programs must honor proxy settings.', 'http://proxy.example.com:8080', null, true);
  bool('telemetry', 'telemetry.enabled', 'Export telemetry', 'True enables export; false disables it.');
  field('telemetry', 'telemetry.endpoint', 'Collector endpoint', 'url', 'Approved OTLP collector URL. Use HTTPS for credentials and dynamic headers.', 'https://otel-collector.example.com');
  field('telemetry', 'telemetry.protocol', 'Export protocol', 'enum', 'Select a protocol supported by your collector.', '', ['http/json', 'http/protobuf']);
  [
    ['identity', 'Identity', 'GitHub login, operating-system account, and machine name.'],
    ['prompts', 'Prompts', 'User/system/developer prompts and supported model inputs.'],
    ['responses', 'Responses', 'Assistant output and supported reasoning content.'],
    ['toolArguments', 'Tool arguments', 'Raw commands, tool arguments, schemas, and MCP/plugin/hook identifiers.'],
    ['toolOutput', 'Tool output', 'Tool results and execution error details.'],
    ['policyDetail', 'Policy details', 'Unbounded policy detail, including raw filesystem paths.']
  ].forEach(function (entry) {
    bool('telemetry', 'telemetry.capture.' + entry[0], 'Capture ' + entry[1].toLowerCase(), entry[2] + ' Defaults to false; explicit values override legacy captureContent.', entry[0] !== 'identity');
  });
  bool('telemetry', 'telemetry.captureContent', 'Legacy content capture', 'Shorthand for all content classes except identity. Explicit capture classes win.', true);
  bool('telemetry', 'telemetry.lockCaptureContent', 'Lock content capture', 'True prevents local enabling of legacy content classes unless configured in managed telemetry. Does not govern identity.', true);
  field('telemetry', 'telemetry.serviceName', 'Service name', 'text', 'Label attached to the telemetry service.', 'copilot', null, true);
  field('telemetry', 'telemetry.resourceAttributes', 'Resource attributes', 'attributes', 'JSON object of OpenTelemetry resource attributes.', '{ "deployment.environment": "production" }', null, true);
  field('telemetry', 'telemetry.headers', 'Static request headers', 'headers', 'JSON object of literal string header values. Requires endpoint in this telemetry object. Do not enter real secrets on a training site; replace placeholders after download.', '{ "Authorization": "REPLACE_LOCALLY" }', null, true);
  field('telemetry', 'telemetry.headersProvider', 'Dynamic authentication headers (CLI)', 'provider', 'JSON object with executable path, optional literal args array, and optional positive refreshIntervalMs (default 29 minutes), or false to disable. Executable names, absolute or home-relative paths only; workspace-relative paths are rejected. Provider runs from home with a 30-second deadline; stdout must be a JSON map of string headers. Requires an active HTTP exporter; use HTTPS.',
    '{\n  "path": "node",\n  "args": ["/absolute/path/otel-headers.js"],\n  "refreshIntervalMs": 1740000\n}', null, true);
  field('remote', 'remoteControl.mode', 'Remote control mode', 'enum', 'disabled blocks remote control; enabled permits it unrestricted; requireSSO requires authorization for every listed organization.', '', ['disabled', 'requireSSO', 'enabled']);
  field('remote', 'remoteControl.githubDotComOrganizations', 'SSO organizations', 'orgs', 'One GitHub organization login per line. Required for requireSSO.', 'YOUR-ORG');
  bool('remote', 'forceRemoteSettingsRefresh', 'Require fresh server policy at startup', 'True requires a fresh download. Server delivery affects startups after first receipt; file/MDM can enforce from first startup. Policy helper scripts cannot set it.');

  var intros = {
    defaults: 'Configure this if you want every new conversation to start from a consistent, approved model for cost, quality, or compliance. Skip it if your AI model policies already limit choice and users pick sensibly.',
    permissions: 'Configure this to decide which agent operations always need a human, never happen, or run unattended. Skip it only if agents run in disposable environments where mistakes are cheap.',
    plugins: 'Configure this to control where plugins come from and to ship internal plugins to everyone. Skip it if you do not use plugins or accept users installing from any marketplace.',
    mcp: 'Configure this to limit which MCP servers agents can connect to, since each server can read data and run tools. Skip it if you have not adopted MCP or accept user-selected servers.',
    sandbox: 'Configure this to contain agent commands in an operating-system sandbox, limiting damage from mistakes or prompt injection. Skip it until clients meet the minimum versions; sandbox settings block older clients.',
    telemetry: 'Configure this to export OpenTelemetry to your own collector for audit, adoption, and cost visibility. Skip it if you have no approved collector or privacy review for agent data.',
    remote: 'Configure this to govern remote control of local sessions and how strictly clients must fetch fresh policy. Skip it if the defaults suit your users and network conditions.'
  };
  var reasons = {
    'model': ['Standardize the starting model for cost predictability, consistent quality, or because a model passed your security review.', 'Auto already picks a suitable model per task. A locked model can strand users if it is retired or unavailable on their client or plan.'],
    'autoTier': ['Bias Auto toward cheaper models (efficiency) or more capable ones (intelligence) to match budget and task complexity.', 'It has no effect unless Auto is in use. A locked tier stops developers choosing more capable routing for hard problems.'],
    'permissions.model': ['Supports older clients that read only this legacy key.', 'Ignored whenever the top-level default model is set. Most enterprises never need it.'],
    'fusionTier': ['Cap or default the effort level Fusion uses, to control cost and latency.', 'It has no effect unless the model is fusion. A locked tier stops developers choosing more effort for hard problems.'],
    'permissions.disableAssistedPermissionsMode': ['Forces explicit approval where you do not want an LLM deciding which requests are safe.', 'Assisted mode reduces approval fatigue and is safer than allow-all; blocking it may push users toward bypass mode unless that is also disabled.'],
    'permissions.defaultMode': ['Start new sessions in a consistent mode, for example assisted or manual, without removing user choice.', 'It is only a default; it does not prevent users picking another permitted mode. Use the disable keys to enforce limits.'],
    'permissions.disableBypassPermissionsMode': ['Stops developers enabling allow-all (YOLO) mode, so agents cannot run commands or edit files without approval.', 'Experienced users lose a fast workflow in disposable environments. Consider allowing team overrides for platform teams.'],
    'features.computerUse': ['False keeps agents from controlling desktop applications, a high-risk capability for unintended actions or data exposure.', 'Leaving the choice to users enables UI automation and testing workflows that cannot be scripted.'],
    'permissions.deny': ['Hard-block operations no agent should ever perform, such as reading SSH keys or editing system files.', 'Users cannot override deny rules. Overly broad patterns break legitimate work.'],
    'permissions.ask': ['Require human approval for sensitive but legitimate operations, such as git push or deployments.', 'Every prompt interrupts the agent. Too many prompts cause approval fatigue and rubber-stamping.'],
    'permissions.allow': ['Pre-approve routine, safe operations such as tests and linting to reduce prompts.', 'Allowed operations run without review. Once any rule exists, unmatched operations require approval, so an incomplete list can add prompts.'],
    'strictKnownMarketplaces': ['Restrict plugin installs to vetted sources, reducing supply-chain risk.', 'Every new source needs a policy change, and an empty list blocks all marketplace installs.'],
    'enabledPlugins': ['Ship required internal plugins to everyone, or block specific plugins.', 'Required plugins load in every session. Blocking individual plugins is weaker than a marketplace allowlist.'],
    'extraKnownMarketplaces': ['Make your internal marketplace available everywhere without manual setup.', 'Unnecessary if you do not run a marketplace or users add marketplaces themselves.'],
    'allowedMcpServers': ['Only approved MCP servers can run, limiting data access and tool sprawl.', 'Every new server needs a policy change, an empty list blocks all non-built-in servers, and cloud agent does not enforce it.'],
    'deniedMcpServers': ['Block specific risky servers while leaving others available.', 'Deny lists are reactive and servers can be renamed or re-hosted. Prefer an allowlist for strict environments.'],
    'sandbox.enabled': ['Run agent commands in an operating-system sandbox, limiting damage from mistakes or prompt injection.', 'Raises minimum client versions and can break tools that need broad filesystem or network access.'],
    'sandbox.failIfUnavailable': ['Guarantees agents never run unsandboxed: execution stops if the sandbox cannot be enforced.', 'Users on unsupported hosts or older clients are blocked entirely.'],
    'sandbox.allowBypass': ['False removes the escape hatch, so commands cannot run outside the sandbox.', 'Builds that need access the sandbox denies will fail until the policy is changed.'],
    'sandbox.sandboxMcpServers': ['Contains local MCP servers, which run third-party code with the user\'s permissions.', 'Servers that need broad filesystem, keychain, or network access may fail.'],
    'sandbox.sandboxLspServers': ['Contains language servers, which execute project code and toolchains.', 'Language servers that need toolchain caches or network access may break.'],
    'sandbox.addCurrentWorkingDirectory': ['False makes project-folder access an explicit grant instead of automatic.', 'Agents almost always need the working directory, so most tasks will need manual grants.'],
    'sandbox.auth.git': ['False keeps the GitHub token out of sandboxed Git operations, limiting what a compromised command can push.', 'Agents cannot clone private repositories or push over HTTPS from the sandbox.'],
    'sandbox.auth.gh': ['False keeps the GitHub token away from GitHub CLI calls in the sandbox.', 'Agent workflows that open pull requests or read issues through gh stop working.'],
    'sandbox.allowDevToolAccess': ['False blocks access to tool configs, caches, and registries that can hold credentials.', 'Authenticated package restores and builds commonly break.'],
    'sandbox.userPolicy.network.allowOutbound': ['False prevents sandboxed commands exfiltrating data or downloading untrusted code.', 'Package installs, API calls, and most builds need outbound access. Allowed hosts give finer control.'],
    'sandbox.userPolicy.network.allowLocalNetwork': ['False blocks sandboxed access to internal services and cloud metadata endpoints.', 'Local databases, dev servers, and containers become unreachable.'],
    'sandbox.userPolicy.seatbelt.keychainAccess': ['False keeps sandboxed processes away from stored macOS credentials.', 'Tools that read signing certificates or credentials from Keychain fail.'],
    'sandbox.learningMode': ['Records blocked access on Windows so you can tune the policy from real usage.', 'Only useful while tuning a Windows sandbox policy.'],
    'sandbox.userPolicy.filesystem.readwritePaths': ['Limit which directories agents may write beyond the defaults.', 'Matching is by exact path string, so missing paths break builds.'],
    'sandbox.userPolicy.filesystem.readonlyPaths': ['Let agents read reference material without being able to change it.', 'Unnecessary if the defaults already cover what agents need.'],
    'sandbox.userPolicy.filesystem.deniedPaths': ['Explicitly hide sensitive directories such as credentials or customer data.', 'Denials are absolute; users cannot grant access back.'],
    'sandbox.userPolicy.network.allowedHosts': ['Allow only approved hosts, such as package registries and GitHub.', 'You must maintain a complete list; missed hosts break installs. An empty list does not block everything.'],
    'sandbox.userPolicy.network.blockedHosts': ['Block specific risky domains and their subdomains.', 'Easy to evade through alternate domains. Allowed hosts are stronger.'],
    'sandbox.userPolicy.network.proxy.url': ['Route sandboxed traffic through your inspection proxy for logging and filtering.', 'Programs that ignore proxy settings bypass it, especially on Windows.'],
    'telemetry.enabled': ['Export OpenTelemetry for audit, adoption, and cost visibility in your own observability stack.', 'You must run and secure a collector, and the data can be personal and need privacy review.'],
    'telemetry.endpoint': ['Points export at your approved collector.', 'Only needed when telemetry export is enabled.'],
    'telemetry.protocol': ['Match the OTLP protocol your collector supports.', 'Leave it unset if your collector accepts the client default.'],
    'telemetry.capture.identity': ['Attribute activity to people for audit and incident response.', 'This is personal data and may need privacy or works-council approval.'],
    'telemetry.capture.prompts': ['Investigate misuse or prompt injection with full prompt history.', 'Prompts often contain source code, secrets, and personal data.'],
    'telemetry.capture.responses': ['Audit what the model actually generated.', 'Responses can contain proprietary code and greatly increase storage volume.'],
    'telemetry.capture.toolArguments': ['See exactly which commands and tools agents ran.', 'Commands can include tokens, secrets, and file paths.'],
    'telemetry.capture.toolOutput': ['Debug failures and investigate incidents with tool results.', 'Output can contain file contents, credentials, and customer data.'],
    'telemetry.capture.policyDetail': ['Understand exactly why a policy blocked an action.', 'Raw filesystem paths can reveal usernames and project names.'],
    'telemetry.captureContent': ['One switch for clients that do not support fine-grained capture classes.', 'Captures every content class at once. Prefer the explicit capture settings.'],
    'telemetry.lockCaptureContent': ['Prevents users enabling content capture locally.', 'Only matters if local telemetry configuration is a concern.'],
    'telemetry.serviceName': ['Distinguish Copilot telemetry in a shared collector.', 'The default name suits most deployments.'],
    'telemetry.resourceAttributes': ['Tag telemetry with environment, region, or business unit for filtering.', 'Optional metadata; skip it if your collector already enriches data.'],
    'telemetry.headers': ['Authenticate to collectors that need a static token or tenant header.', 'Static secrets in a distributed file are hard to rotate. Prefer dynamic headers.'],
    'telemetry.headersProvider': ['Fetch short-lived credentials at runtime instead of distributing static secrets.', 'CLI only, and you must distribute and maintain the helper executable.'],
    'remoteControl.mode': ['Decide whether local sessions can be steered remotely; requireSSO ties access to your organizations.', 'Disabling removes a convenient way to monitor and steer long-running agents.'],
    'remoteControl.githubDotComOrganizations': ['Lists the organizations whose SSO authorization remote control requires.', 'Only needed with requireSSO.'],
    'forceRemoteSettingsRefresh': ['Clients always start with the latest policy, closing the gap after a policy change.', 'Restricts or blocks use when the device is offline at startup.']
  };
  groups.forEach(function (group) { group.intro = intros[group.id]; });
  fields.forEach(function (def) { def.why = reasons[def.path][0]; def.whyNot = reasons[def.path][1]; });

  function object(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
  function assert(condition, message) {
    if (!condition) { throw new Error(message); }
  }
  function onlyKeys(value, allowed) {
    assert(Object.keys(value).every(function (key) { return allowed.indexOf(key) !== -1; }), 'Contains an unsupported property. Allowed: ' + allowed.join(', ') + '.');
  }
  function strings(value) {
    return Array.isArray(value) && value.every(function (item) { return typeof item === 'string' && item.trim().length > 0; });
  }
  function stringMap(value) {
    return object(value) && Object.keys(value).every(function (key) { return typeof value[key] === 'string'; });
  }
  function httpUrl(value) {
    try { var url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:'; }
    catch (error) { return false; }
  }
  function host(value) {
    if (value === '*') { return true; }
    if (value.indexOf(':') !== -1) {
      try {
        var address = value.replace(/^\[|\]$/g, '');
        return new URL('http://[' + address + ']/').hostname.length > 0;
      } catch (error) { return false; }
    }
    return !/[\s/:?#@]/.test(value) &&
      /^(?:\*\.)?[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(value);
  }
  function source(value, strict) {
    assert(object(value), 'Each marketplace source must be an object.');
    var required = { github: 'repo', git: 'url', directory: 'path' };
    if (strict) {
      Object.assign(required, { url: 'url', npm: 'package', file: 'path', hostPattern: 'hostPattern', pathPattern: 'pathPattern' });
    }
    assert(Object.hasOwn(required, value.source), 'Unsupported marketplace source type.');
    var key = required[value.source];
    var allowed = ['source', key];
    if (value.source === 'github' || value.source === 'git') { allowed.push('ref', 'path'); }
    if (value.source === 'url') { allowed.push('headers'); }
    onlyKeys(value, allowed);
    assert(typeof value[key] === 'string' && value[key].trim(), 'Source requires a non-empty ' + key + '.');
    if (value.source === 'github') { assert(/^[^/\s]+\/[^/\s]+$/.test(value.repo), 'GitHub repo must use OWNER/REPO format.'); }
    if (value.source === 'url') { assert(httpUrl(value.url), 'URL marketplace sources require an HTTP(S) URL.'); }
    ['ref', 'path'].forEach(function (name) {
      if (Object.hasOwn(value, name)) { assert(typeof value[name] === 'string' && value[name].trim(), name + ' must be a non-empty string.'); }
    });
    if (Object.hasOwn(value, 'headers')) { assert(stringMap(value.headers), 'Source headers must map names to strings.'); }
    if (value.source === 'hostPattern' || value.source === 'pathPattern') {
      try { new RegExp(value[key]); } catch (error) { throw new Error(key + ' must be a valid regular expression.'); }
    }
  }
  function parse(def, raw) {
    if (def.type === 'boolean') {
      assert(raw === 'true' || raw === 'false', 'Choose true or false.');
      return raw === 'true';
    }
    if (def.type === 'enum') {
      assert(def.options.indexOf(raw) !== -1, 'Choose a documented value.');
      return raw;
    }
    if (['rules', 'paths', 'hosts', 'orgs'].indexOf(def.type) !== -1) {
      var lines = raw.split(/\r?\n/).map(function (line) { return line.trim(); }).filter(Boolean);
      lines.forEach(function (line) {
        if (def.type === 'rules') { assert(/^(Shell|Bash|PowerShell|Read|Edit|Write|Domain)\([\s\S]+\)$/.test(line), 'Use a documented selector, for example Shell(git push *).'); }
        if (def.type === 'paths') { assert(/^(\/|[a-zA-Z]:[\\/]|\\\\)/.test(line), 'Sandbox paths must be absolute.'); }
        if (def.type === 'hosts') { assert(host(line), 'Enter hostnames or IP addresses, without URLs or ports.'); }
        if (def.type === 'orgs') { assert(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/.test(line) && line.length <= 39, 'Enter valid organization logins, not URLs.'); }
      });
      return lines;
    }
    if (def.type === 'text' || def.type === 'url') {
      assert(raw.trim().length > 0, 'Enter a value or uncheck Include.');
      if (def.type === 'url') { assert(httpUrl(raw.trim()), 'Enter an HTTP or HTTPS URL.'); }
      return raw.trim();
    }
    var value;
    try { value = JSON.parse(raw); } catch (error) { throw new Error('Enter valid JSON: ' + error.message); }
    if (def.type === 'marketplaces' || def.type === 'mcp') {
      assert(Array.isArray(value), 'Use a JSON array; [] is an explicit empty list.');
      value.forEach(function (entry) {
        if (def.type === 'marketplaces') { source(entry, true); return; }
        assert(object(entry) && Object.keys(entry).length === 1, 'Each MCP matcher must have exactly one property.');
        onlyKeys(entry, ['serverName', 'serverUrl', 'serverCommand']);
        if (Object.hasOwn(entry, 'serverCommand')) { assert(strings(entry.serverCommand) && entry.serverCommand.length > 0, 'serverCommand must be a non-empty string array.'); }
        if (Object.hasOwn(entry, 'serverUrl')) { assert(typeof entry.serverUrl === 'string' && httpUrl(entry.serverUrl), 'serverUrl must be an HTTP(S) URL pattern.'); }
        if (Object.hasOwn(entry, 'serverName')) { assert(typeof entry.serverName === 'string' && /^[\w./-]+$/.test(entry.serverName), 'serverName must contain only letters, numbers, _, ., /, and -.'); }
      });
    } else if (def.type === 'provider') {
      assert(value === false || object(value), 'Use false or a provider object.');
      if (value !== false) {
        onlyKeys(value, ['path', 'args', 'refreshIntervalMs']);
        assert(typeof value.path === 'string' && value.path.trim() && !/\s/.test(value.path.trim().split(/[\\/]/)[0]) && !/^\.\.?([\\/]|$)/.test(value.path), 'Provider path must be an executable name, absolute path, or ~/ path, not a shell command.');
        assert(!/[\\/]/.test(value.path) || /^(\/|~\/|[a-zA-Z]:[\\/]|\\\\)/.test(value.path), 'Workspace-relative provider paths are not supported.');
        if (Object.hasOwn(value, 'args')) { assert(Array.isArray(value.args) && value.args.every(function (arg) { return typeof arg === 'string'; }), 'Provider args must be a string array.'); }
        if (Object.hasOwn(value, 'refreshIntervalMs')) { assert(Number.isSafeInteger(value.refreshIntervalMs) && value.refreshIntervalMs > 0, 'refreshIntervalMs must be a positive integer.'); }
      }
    } else {
      assert(object(value), 'Use a JSON object.');
      if (def.type === 'headers') { assert(stringMap(value), 'Header values must be strings.'); }
      if (def.type === 'attributes') {
        assert(Object.values(value).every(function (attribute) {
          var values = Array.isArray(attribute) ? attribute : [attribute];
          return values.every(function (item) { return ['string', 'number', 'boolean'].indexOf(typeof item) !== -1 && (typeof item !== 'number' || Number.isFinite(item)); }) &&
            (values.length === 0 || values.every(function (item) { return typeof item === typeof values[0]; }));
        }), 'Attributes must be strings, numbers, booleans, or homogeneous arrays of these.');
      }
      if (def.type === 'plugins') {
        assert(Object.keys(value).every(function (key) { return /^[^@\s]+@[^@\s]+$/.test(key) && typeof value[key] === 'boolean'; }), 'Plugins must use PLUGIN@MARKETPLACE keys and Boolean values.');
      }
      if (def.type === 'extras') {
        Object.values(value).forEach(function (entry) {
          assert(object(entry), 'Each marketplace must be an object.');
          onlyKeys(entry, ['source', 'autoUpdate']);
          source(entry.source, false);
          if (Object.hasOwn(entry, 'autoUpdate')) { assert(typeof entry.autoUpdate === 'boolean', 'autoUpdate must be a Boolean.'); }
        });
      }
    }
    return value;
  }
  function setPath(settings, path, value) {
    var parts = path.split('.');
    var target = settings;
    parts.slice(0, -1).forEach(function (part) {
      if (!Object.hasOwn(target, part)) { target[part] = {}; }
      target = target[part];
    });
    target[parts[parts.length - 1]] = value;
  }
  function build(entries, sandboxOverride) {
    var settings = {};
    var errors = [];
    var warnings = [];
    var plain = {};
    fields.forEach(function (def) {
      var entry = entries[def.path];
      if (!entry || !entry.include) { return; }
      try {
        var value = parse(def, entry.raw);
        setPath(plain, def.path, value);
        setPath(settings, def.path, def.overridable && entry.override ? { overridable: value } : value);
      } catch (error) { errors.push({ path: def.path, message: error.message }); }
    });
    if (plain.remoteControl && plain.remoteControl.mode === 'requireSSO' &&
      (!plain.remoteControl.githubDotComOrganizations || !plain.remoteControl.githubDotComOrganizations.length)) {
      errors.push({ path: 'remoteControl.githubDotComOrganizations', message: 'requireSSO needs at least one organization.' });
    }
    if (plain.remoteControl && plain.remoteControl.githubDotComOrganizations && !plain.remoteControl.mode) {
      errors.push({ path: 'remoteControl.mode', message: 'Include a remote control mode for these organizations.' });
    }
    if (plain.telemetry && plain.telemetry.headers && !plain.telemetry.endpoint) {
      errors.push({ path: 'telemetry.endpoint', message: 'Static headers require endpoint in the same telemetry object.' });
    }
    if (plain.telemetry && (plain.telemetry.headers || plain.telemetry.headersProvider) &&
      plain.telemetry.endpoint && !plain.telemetry.endpoint.startsWith('https://')) {
      errors.push({ path: 'telemetry.endpoint', message: 'Use HTTPS when configuring authentication headers to avoid plaintext credentials.' });
    }
    if (plain.model && plain.permissions && plain.permissions.model) {
      warnings.push('Top-level model takes precedence; the legacy permissions.model value will be ignored.');
    }
    if (plain.autoTier && (plain.model || plain.permissions && plain.permissions.model || 'auto') !== 'auto') {
      warnings.push('Auto tier applies only when users switch to auto; it does not select auto for them.');
    }
    if (plain.fusionTier && (plain.model || plain.permissions && plain.permissions.model) !== 'fusion') {
      warnings.push('Fusion tier applies only when the model is fusion; it does not select Fusion for users.');
    }
    if (plain.sandbox) {
      warnings.push('Sandbox settings activate minimum client-version requirements. Pilot before enterprise deployment; unsupported clients are blocked.');
      if (plain.sandbox.failIfUnavailable && !plain.sandbox.enabled) { warnings.push('Fail closed does not enable sandboxing. Include sandbox.enabled: true for a mandatory sandbox.'); }
      if (sandboxOverride) { settings.sandbox = { overridable: settings.sandbox }; }
    }
    if (Object.hasOwn(plain, 'allowedMcpServers') && !plain.allowedMcpServers.length) { warnings.push('Allowed MCP servers is empty: all non-built-in MCP servers will be blocked.'); }
    if (Object.hasOwn(plain, 'strictKnownMarketplaces') && !plain.strictKnownMarketplaces.length) { warnings.push('Allowed marketplaces is empty: all marketplace plugin installations will be blocked.'); }
    if (plain.telemetry && (plain.telemetry.captureContent || Object.values(plain.telemetry.capture || {}).some(Boolean))) {
      warnings.push('Telemetry capture is enabled. Review privacy, retention, and collector access before deployment.');
    }
    if (plain.forceRemoteSettingsRefresh) { warnings.push('Fresh policy at startup requires network access. Server delivery only enforces this after first receipt.'); }
    return { settings: settings, errors: errors, warnings: warnings };
  }

  var api = { groups: groups, fields: fields, build: build, parse: parse, modelCatalog: modelCatalog };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; }
  if (!root.document) { return; }
  var document = root.document;
  var form = document.getElementById('settings-form');
  if (!form) { return; }
  var controls = {};
  var areas = {};
  var steps = [];
  var stepList = document.getElementById('wizard-steps');
  var back = document.getElementById('wizard-back');
  var next = document.getElementById('wizard-next');
  var position = document.getElementById('wizard-position');
  var review = document.getElementById('wizard-review');
  var current = 0;
  function node(tag, text, className) {
    var element = document.createElement(tag);
    if (text) { element.textContent = text; }
    if (className) { element.className = className; }
    return element;
  }
  function stepTitle(group) { return group.title.replace(/^\d+\.\s*/, ''); }
  function addStep(id, title, section) {
    var heading = section.querySelector('h2');
    heading.tabIndex = -1;
    section.classList.add('wizard-step');
    section.setAttribute('aria-labelledby', heading.id = 'wizard-heading-' + id);
    var item = node('li');
    var button = node('button', title, 'wizard-step-button');
    button.type = 'button';
    button.setAttribute('data-step', id);
    item.appendChild(button);
    stepList.appendChild(item);
    var step = { id: id, section: section, item: item, button: button };
    button.addEventListener('click', function () { show(visible().indexOf(step), true); });
    steps.push(step);
  }
  function visible() {
    return steps.filter(function (step) { return !areas[step.id] || areas[step.id].checked; });
  }
  function show(index, focus) {
    var list = visible();
    current = Math.max(0, Math.min(index, list.length - 1));
    steps.forEach(function (step) {
      var active = step === list[current];
      var shown = list.indexOf(step) !== -1;
      step.section.hidden = !active;
      step.item.hidden = !shown;
      step.item.classList.toggle('wizard-step-done', shown && list.indexOf(step) < current);
      if (active) { step.button.setAttribute('aria-current', 'step'); } else { step.button.removeAttribute('aria-current'); }
    });
    back.disabled = current === 0;
    next.hidden = current === list.length - 1;
    next.textContent = current === list.length - 2 ? 'Review settings' : 'Next';
    var label = 'Step ' + (current + 1) + ' of ' + list.length + ': ' + list[current].button.textContent;
    if (position.textContent !== label) { position.textContent = label; }
    if (focus) { list[current].section.querySelector('h2').focus(); }
  }
  function goTo(id, focus) {
    var list = visible();
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { show(i, focus); return true; } }
    return false;
  }

  var welcome = node('section');
  welcome.appendChild(node('h2', 'Welcome to managed settings setup'));
  welcome.appendChild(node('p', 'This wizard walks you through each area of an enterprise managed-settings.json file. For every setting it explains why you would or would not manage it. Nothing is included until you choose Include, so skipping a setting leaves user and client defaults in place.'));
  var notice = node('p', '', 'settings-notice');
  notice.appendChild(node('strong', 'Omitted is not empty. '));
  notice.appendChild(document.createTextNode('Unincluded settings are absent from the output. Included blank lists produce [], and empty MCP or marketplace allowlists intentionally block everything.'));
  welcome.appendChild(notice);
  var areaSet = node('fieldset', '', 'wizard-areas');
  areaSet.appendChild(node('legend', 'Which areas do you want to configure?'));
  areaSet.appendChild(node('p', 'Clear an area to skip its step. Settings in skipped areas are left out of the file.', 'settings-help'));
  groups.forEach(function (group) {
    var label = node('label', '', 'settings-include');
    var box = node('input');
    box.type = 'checkbox';
    box.id = 'wizard-area-' + group.id;
    box.checked = box.defaultChecked = true;
    label.appendChild(box);
    label.appendChild(document.createTextNode(' ' + stepTitle(group)));
    areaSet.appendChild(label);
    areas[group.id] = box;
  });
  welcome.appendChild(areaSet);
  form.appendChild(welcome);
  addStep('welcome', 'Welcome', welcome);

  groups.forEach(function (group) {
    var section = node('section');
    section.appendChild(node('h2', stepTitle(group)));
    var should = node('div', '', 'wizard-intro');
    should.appendChild(node('strong', 'Should you configure this? '));
    should.appendChild(document.createTextNode(group.intro));
    section.appendChild(should);
    section.appendChild(node('p', group.help, 'settings-help'));
    var sourceLink = node('a', 'Official ' + stepTitle(group).toLowerCase() + ' reference');
    var anchors = { defaults: 'model', permissions: 'permissions', plugins: 'strictknownmarketplaces', mcp: 'allowedmcpservers', sandbox: 'sandbox', telemetry: 'telemetry', remote: 'remotecontrol' };
    sourceLink.href = reference + '#' + anchors[group.id];
    section.appendChild(sourceLink);
    var advanced = node('details', '', 'settings-advanced');
    advanced.appendChild(node('summary', 'Advanced ' + stepTitle(group).toLowerCase() + ' settings'));
    if (group.id === 'sandbox') {
      var wrapLabel = node('label', '', 'settings-include');
      var wrap = node('input');
      wrap.type = 'checkbox';
      wrap.id = 'sandbox-overridable';
      wrapLabel.appendChild(wrap);
      wrapLabel.appendChild(document.createTextNode(' Allow team overrides for the entire sandbox object'));
      advanced.appendChild(wrapLabel);
      advanced.appendChild(node('p', 'Team files replace the whole wrapped sandbox default. Include every restriction the team must retain.', 'settings-help'));
    }
    fields.filter(function (def) { return def.group === group.id; }).forEach(function (def) {
      var id = 'setting-' + def.path.replace(/\./g, '-');
      var card = node('div', '', 'settings-field');
      var label = node('label', def.label, 'settings-label');
      label.htmlFor = id;
      card.appendChild(label);
      card.appendChild(node('code', def.path, 'settings-key'));
      var why = node('div', '', 'settings-reasons');
      [['Why you would set it', def.why], ['Why you might not', def.whyNot]].forEach(function (reason) {
        var block = node('div');
        block.appendChild(node('strong', reason[0]));
        block.appendChild(node('p', reason[1]));
        why.appendChild(block);
      });
      card.appendChild(why);
      var includeLabel = node('label', '', 'settings-include');
      var include = node('input');
      include.type = 'checkbox';
      include.id = id + '-include';
      includeLabel.appendChild(include);
      includeLabel.appendChild(document.createTextNode(' Include ' + def.label.toLowerCase()));
      card.appendChild(includeLabel);
      var help = node('p', def.help, 'settings-help');
      help.id = id + '-help';
      card.appendChild(help);
      var input;
      if (def.type === 'boolean' || def.type === 'enum') {
        input = node('select');
        if (def.options === modelIds) {
          modelCatalog.forEach(function (provider) {
            var optgroup = node('optgroup');
            optgroup.label = provider.provider;
            provider.models.forEach(function (model) {
              var option = node('option', model[1] + ' (' + model[0] + ')');
              option.value = model[0];
              optgroup.appendChild(option);
            });
            input.appendChild(optgroup);
          });
        } else {
          (def.type === 'boolean' ? ['true', 'false'] : def.options).forEach(function (value) {
            var option = node('option', value);
            option.value = value;
            input.appendChild(option);
          });
        }
      } else {
        input = node(def.type === 'text' || def.type === 'url' ? 'input' : 'textarea');
        if (input.tagName === 'TEXTAREA') { input.rows = 5; }
        else { input.type = 'text'; }
        input.placeholder = def.example || '';
        input.spellcheck = false;
        input.autocomplete = 'off';
      }
      input.id = id;
      input.disabled = true;
      input.setAttribute('aria-describedby', help.id + ' ' + id + '-error');
      card.appendChild(input);
      var override;
      if (def.overridable) {
        var overrideLabel = node('label', '', 'settings-include settings-help');
        override = node('input');
        override.type = 'checkbox';
        override.disabled = true;
        overrideLabel.appendChild(override);
        overrideLabel.appendChild(document.createTextNode(' Allow enterprise team overrides'));
        card.appendChild(overrideLabel);
      }
      var error = node('p', '', 'settings-error');
      error.id = id + '-error';
      card.appendChild(error);
      controls[def.path] = { def: def, include: include, input: input, override: override, error: error, help: help, card: card };
      include.addEventListener('change', function () {
        input.disabled = !include.checked;
        if (override) { override.disabled = !include.checked; }
      });
      (def.advanced ? advanced : section).appendChild(card);
    });
    if (advanced.children.length > 1) { section.appendChild(advanced); }
    form.appendChild(section);
    addStep(group.id, stepTitle(group), section);
  });
  form.appendChild(review);
  addStep('review', 'Review and finish', review);

  var output = document.getElementById('settings-output');
  var status = document.getElementById('settings-status');
  var feedback = document.getElementById('settings-feedback');
  var issues = document.getElementById('settings-issues');
  var summary = document.getElementById('settings-summary');
  var copy = document.getElementById('settings-copy');
  var download = document.getElementById('settings-download');
  var latest;
  function reveal(path) {
    var control = controls[path];
    goTo(control.def.group, false);
    var ancestor = control.input.parentElement;
    while (ancestor && ancestor !== form) {
      if (ancestor.tagName === 'DETAILS') { ancestor.open = true; }
      ancestor = ancestor.parentElement;
    }
    control.include.focus();
  }
  function update() {
    var entries = {};
    Object.keys(controls).forEach(function (path) {
      var control = controls[path];
      entries[path] = { include: control.include.checked && areas[control.def.group].checked, raw: control.input.value, override: control.override && control.override.checked };
      control.error.textContent = '';
      control.input.removeAttribute('aria-invalid');
    });
    latest = build(entries, document.getElementById('sandbox-overridable').checked && areas.sandbox.checked);
    issues.replaceChildren();
    latest.errors.forEach(function (error) {
      controls[error.path].error.textContent = error.message;
      controls[error.path].input.setAttribute('aria-invalid', 'true');
      var item = node('li');
      var link = node('a', error.path + ': ' + error.message);
      link.href = '#' + controls[error.path].input.id;
      link.addEventListener('click', function (event) {
        event.preventDefault();
        reveal(error.path);
      });
      item.appendChild(link);
      issues.appendChild(item);
    });
    latest.warnings.forEach(function (warning) { issues.appendChild(node('li', warning)); });
    summary.replaceChildren();
    groups.forEach(function (group) {
      if (!areas[group.id].checked) { return; }
      var chosen = fields.filter(function (def) { return def.group === group.id && entries[def.path].include; });
      var item = node('li');
      item.appendChild(node('strong', stepTitle(group) + ': '));
      item.appendChild(document.createTextNode(chosen.length ? chosen.map(function (def) { return def.label; }).join(', ') + ' ' : 'nothing included (left unmanaged) '));
      var edit = node('button', 'Edit', 'wizard-edit');
      edit.type = 'button';
      edit.setAttribute('aria-label', 'Edit ' + stepTitle(group).toLowerCase());
      edit.addEventListener('click', function () { goTo(group.id, true); });
      item.appendChild(edit);
      summary.appendChild(item);
    });
    copy.disabled = download.disabled = latest.errors.length > 0;
    output.value = latest.errors.length ? '' : JSON.stringify(latest.settings, null, 2) + '\n';
    status.textContent = latest.errors.length ? 'Fix ' + latest.errors.length + ' error(s) before copying or downloading. Output is withheld to avoid a partial policy.' :
      Object.keys(latest.settings).length + ' top-level setting(s) configured. Review warnings and validate in GitHub before deployment.';
    feedback.textContent = '';
    show(visible().indexOf(steps.filter(function (step) { return !step.section.hidden; })[0] || steps[0]), false);
  }
  form.addEventListener('submit', function (event) { event.preventDefault(); });
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  back.addEventListener('click', function () { show(current - 1, true); });
  next.addEventListener('click', function () { show(current + 1, true); });
  document.getElementById('settings-reset').addEventListener('click', function () {
    form.reset();
    Object.values(controls).forEach(function (control) {
      control.include.disabled = false;
      control.input.disabled = true;
      if (control.override) { control.override.disabled = true; }
    });
    update();
    feedback.textContent = 'All settings cleared. No enterprise policy was changed.';
  });
  copy.addEventListener('click', async function () {
    if (latest.errors.length) { return; }
    try {
      if (!root.navigator.clipboard) { throw new Error('Clipboard unavailable'); }
      await root.navigator.clipboard.writeText(output.value);
      feedback.textContent = 'JSON copied. Review it before deploying.';
    } catch (error) {
      output.focus();
      output.select();
      feedback.textContent = 'Clipboard access failed. The JSON is selected; use your browser copy command.';
    }
  });
  download.addEventListener('click', function () {
    if (latest.errors.length) { return; }
    var url = URL.createObjectURL(new Blob([output.value], { type: 'application/json' }));
    var link = node('a');
    link.href = url;
    link.download = 'managed-settings.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    root.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    feedback.textContent = 'Download requested: managed-settings.json. Nothing has been deployed.';
  });
  document.getElementById('settings-workspace').hidden = false;
  document.getElementById('settings-loading').hidden = true;
  show(0, false);
  update();
})(typeof window !== 'undefined' ? window : globalThis);

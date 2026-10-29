const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fields, groups, build, parse, modelCatalog } = require('../../docs/assets/js/managed-settings.js');

const entry = (raw, override = false) => ({ include: true, raw, override });
const def = path => fields.find(field => field.path === path);

test('all documented top-level settings and nested controls are represented', () => {
  assert.equal(groups.length, 7);
  assert.equal(new Set(fields.map(field => field.path)).size, fields.length);
  assert.deepEqual([...new Set(fields.map(field => field.path.split('.')[0]))].sort(), [
    'allowedMcpServers', 'autoTier', 'deniedMcpServers', 'enabledPlugins',
    'extraKnownMarketplaces', 'features', 'forceRemoteSettingsRefresh', 'fusionTier',
    'model', 'permissions', 'remoteControl', 'sandbox', 'strictKnownMarketplaces', 'telemetry'
  ].sort());
  for (const path of [
    'permissions.model', 'permissions.defaultMode', 'permissions.disableAssistedPermissionsMode',
    'sandbox.learningMode', 'sandbox.auth.git', 'sandbox.auth.gh',
    'sandbox.userPolicy.network.proxy.url', 'sandbox.userPolicy.seatbelt.keychainAccess',
    'telemetry.headersProvider', ...['identity', 'prompts', 'responses', 'toolArguments',
      'toolOutput', 'policyDetail'].map(key => `telemetry.capture.${key}`)
  ]) assert.ok(def(path), path);
});

test('every wizard step and setting explains why to use it or not', () => {
  for (const group of groups) assert.ok(group.intro && group.intro.length > 40, group.id);
  for (const field of fields) {
    assert.ok(field.why && field.why.length > 20, `${field.path} why`);
    assert.ok(field.whyNot && field.whyNot.length > 10, `${field.path} whyNot`);
  }
});

test('model fields are dropdowns of documented model identifiers', () => {
  const ids = modelCatalog.flatMap(group => group.models.map(model => model[0]));
  assert.equal(ids[0], 'auto');
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^[a-z0-9][a-z0-9.-]*$/);
  for (const path of ['model', 'permissions.model']) {
    assert.equal(def(path).type, 'enum');
    assert.equal(parse(def(path), 'claude-sonnet-5.5'), 'claude-sonnet-5.5');
    assert.throws(() => parse(def(path), 'Claude Sonnet 5.5'));
  }
});

test('included autoTier is preserved with a fixed default model and reports its applicability', () => {
  const fixedModel = build({ model: entry('gpt-5.6-sol'), autoTier: entry('balance') });
  assert.deepEqual(fixedModel.settings, { model: 'gpt-5.6-sol', autoTier: 'balance' });
  assert.ok(fixedModel.warnings.some(warning => /switch to auto/.test(warning)));
  assert.deepEqual(build({ 'permissions.model': entry('gpt-5.6-sol'), autoTier: entry('balance') }).settings,
    { permissions: { model: 'gpt-5.6-sol' }, autoTier: 'balance' });
  assert.deepEqual(build({ model: entry('auto'), autoTier: entry('balance') }).settings, { model: 'auto', autoTier: 'balance' });
  assert.deepEqual(build({ autoTier: entry('balance') }).settings, { autoTier: 'balance' });
  const overridable = build({ model: entry('gpt-5.6-sol', true), autoTier: entry('balance') });
  assert.deepEqual(overridable.settings, { model: { overridable: 'gpt-5.6-sol' }, autoTier: 'balance' });
  assert.ok(overridable.warnings.some(warning => /switch to auto/.test(warning)));
});

test('nothing configured yields {}, including stale values in unchecked fields', () => {
  assert.deepEqual(build({}).settings, {});
  assert.deepEqual(build({ model: { include: false, raw: 'auto' } }).settings, {});
});

test('Fusion effort and permission defaults preserve their documented types and choices', () => {
  for (const tier of ['standard', 'high', 'max', 'unmanaged']) {
    assert.deepEqual(build({ fusionTier: entry(tier) }).settings, { fusionTier: tier });
    assert.deepEqual(build({ fusionTier: entry(tier, true) }).settings,
      { fusionTier: { overridable: tier } });
  }
  for (const mode of ['manual', 'assisted', 'allow-all']) {
    assert.deepEqual(build({
      'permissions.defaultMode': entry(mode),
      'permissions.disableAssistedPermissionsMode': entry('false')
    }).settings, { permissions: { defaultMode: mode, disableAssistedPermissionsMode: false } });
  }
  assert.deepEqual(build({ 'permissions.disableAssistedPermissionsMode': entry('true') }).settings,
    { permissions: { disableAssistedPermissionsMode: true } });
  assert.throws(() => parse(def('fusionTier'), 'invalid'));
  assert.throws(() => parse(def('permissions.defaultMode'), 'invalid'));
});

test('empty included arrays and objects are preserved, not omitted', () => {
  const result = build({
    allowedMcpServers: entry('[]'),
    strictKnownMarketplaces: entry('[]'),
    'permissions.allow': entry(''),
    enabledPlugins: entry('{}')
  });
  assert.deepEqual(result.settings, {
    permissions: { allow: [] }, enabledPlugins: {},
    strictKnownMarketplaces: [], allowedMcpServers: []
  });
  assert.equal(result.errors.length, 0);
  assert.equal(result.warnings.length, 2);
});

test('Boolean false, disable string, and nested objects have exact JSON types', () => {
  const result = build({
    'features.computerUse': entry('false'),
    'permissions.disableBypassPermissionsMode': entry('disable'),
    'sandbox.enabled': entry('true'),
    'sandbox.auth.git': entry('false'),
    'sandbox.userPolicy.network.allowOutbound': entry('false'),
    'permissions.deny': entry(' Read(~/.ssh/**)\r\n\nShell(rm -rf *) ')
  });
  assert.equal(result.errors.length, 0);
  assert.equal(result.settings.features.computerUse, false);
  assert.equal(result.settings.permissions.disableBypassPermissionsMode, 'disable');
  assert.deepEqual(result.settings.permissions.deny, ['Read(~/.ssh/**)', 'Shell(rm -rf *)']);
  assert.deepEqual(result.settings.sandbox, {
    enabled: true, auth: { git: false }, userPolicy: { network: { allowOutbound: false } }
  });
});

test('overrides wrap eligible keys and the entire sandbox only', () => {
  const result = build({
    model: entry('auto', true),
    'permissions.ask': entry('Shell(git push *)', true),
    'sandbox.enabled': entry('true', true),
    'sandbox.allowBypass': entry('false'),
    allowedMcpServers: entry('[]', true)
  }, true);
  assert.equal(result.errors.length, 0);
  assert.deepEqual(result.settings.sandbox, { overridable: { enabled: true, allowBypass: false } });
  assert.deepEqual(result.settings.model, { overridable: 'auto' });
  assert.deepEqual(result.settings.permissions.ask, { overridable: ['Shell(git push *)'] });
  assert.deepEqual(result.settings.allowedMcpServers, { overridable: [] });
  assert.ok(!Object.hasOwn(build({}, true).settings, 'sandbox'));
});

test('every documented marketplace source and optional field is accepted', () => {
  const sources = [
    { source: 'github', repo: 'OWNER/REPO', ref: 'main', path: 'plugins' },
    { source: 'git', url: 'git@github.com:OWNER/REPO.git', ref: 'v1', path: 'plugins' },
    { source: 'url', url: 'https://example.com/plugins', headers: { Authorization: 'PLACEHOLDER' } },
    { source: 'npm', package: '@example/plugins' },
    { source: 'file', path: '/opt/marketplace.json' },
    { source: 'directory', path: '/opt/plugins' },
    { source: 'hostPattern', hostPattern: '^example\\.com$' },
    { source: 'pathPattern', pathPattern: '^/opt/' }
  ];
  assert.deepEqual(parse(def('strictKnownMarketplaces'), JSON.stringify(sources)), sources);
  for (const source of sources.filter(source => ['github', 'git', 'directory'].includes(source.source))) {
    const map = { approved: { source, autoUpdate: false } };
    assert.deepEqual(parse(def('extraKnownMarketplaces'), JSON.stringify(map)), map);
  }
});

test('MCP matcher identity and array shape are checked', () => {
  const matchers = [
    { serverName: 'microsoft/playwright-mcp' },
    { serverUrl: 'https://*.example.com/*' },
    { serverCommand: ['npx', '-y', 'my-server'] }
  ];
  assert.deepEqual(parse(def('allowedMcpServers'), JSON.stringify(matchers)), matchers);
  for (const raw of ['{}', '[{}]', '[{"serverName":"bad name"}]',
    '[{"serverCommand":"npx server"}]', '[{"serverCommand":[]}]',
    '[{"serverName":"a","serverUrl":"https://example.com"}]',
    '[{"serverUrl":"javascript:alert(1)"}]']) {
    assert.throws(() => parse(def('allowedMcpServers'), raw), raw);
  }
});

test('invalid marketplace and plugin shapes are rejected', () => {
  for (const [path, raw] of [
    ['strictKnownMarketplaces', '[{"source":"github","repo":"missing-owner"}]'],
    ['strictKnownMarketplaces', '[{"source":"hostPattern","hostPattern":"["}]'],
    ['strictKnownMarketplaces', '[{"source":"url","url":"bad"}]'],
    ['extraKnownMarketplaces', '{"x":{"source":{"source":"npm","package":"x"}}}'],
    ['extraKnownMarketplaces', '{"x":{"source":{"source":"github","repo":"a/b"},"autoUpdate":"true"}}'],
    ['enabledPlugins', '{"p@m":"true"}'],
    ['enabledPlugins', '{"plugin":true}'],
    ['telemetry.headers', '{"Authorization":42}'],
    ['telemetry.resourceAttributes', '{"invalid":null}'],
    ['telemetry.resourceAttributes', '{"invalid":["mixed",1]}']
  ]) assert.throws(() => parse(def(path), raw), path);
});

test('permission selectors, paths, hosts, and organization logins are checked', () => {
  for (const selector of ['Shell(x)', 'Bash(x)', 'PowerShell(x)', 'Read(/src/**)', 'Edit(//etc/**)', 'Write(/x)', 'Domain(*.example.com)']) {
    assert.deepEqual(parse(def('permissions.deny'), selector), [selector]);
  }
  assert.deepEqual(parse(def('sandbox.userPolicy.filesystem.readonlyPaths'), '/opt/a\nC:\\source\n\\\\host\\share'), ['/opt/a', 'C:\\source', '\\\\host\\share']);
  assert.deepEqual(parse(def('sandbox.userPolicy.network.allowedHosts'), '*\n*.example.com\n127.0.0.1\n::1\n[::1]'), ['*', '*.example.com', '127.0.0.1', '::1', '[::1]']);
  for (const [path, raw] of [
    ['permissions.ask', 'git push *'],
    ['permissions.ask', 'Shell()'],
    ['sandbox.userPolicy.filesystem.readonlyPaths', '~/relative'],
    ['sandbox.userPolicy.network.allowedHosts', 'https://example.com'],
    ['sandbox.userPolicy.network.allowedHosts', 'example.com:8080'],
    ['sandbox.userPolicy.network.allowedHosts', 'a:123'],
    ['remoteControl.githubDotComOrganizations', 'https://github.com/org']
  ]) assert.throws(() => parse(def(path), raw), `${path}: ${raw}`);
});

test('remote SSO and static header dependencies produce actionable errors', () => {
  assert.equal(build({ 'remoteControl.mode': entry('requireSSO') }).errors[0].path, 'remoteControl.githubDotComOrganizations');
  assert.equal(build({
    'remoteControl.mode': entry('requireSSO'),
    'remoteControl.githubDotComOrganizations': entry('org-one\norg-two')
  }).errors.length, 0);
  assert.equal(build({ 'telemetry.headers': entry('{}') }).errors[0].path, 'telemetry.endpoint');
  assert.equal(build({
    'telemetry.headers': entry('{"Authorization":"PLACEHOLDER"}'),
    'telemetry.endpoint': entry('http://example.com')
  }).errors.length, 1);
});

test('dynamic headers support false and all documented provider fields', () => {
  assert.equal(parse(def('telemetry.headersProvider'), 'false'), false);
  for (const path of ['node', '/opt/helper', '~/bin/helper', 'C:\\Program Files\\helper.exe']) {
    const provider = { path, args: ['', '--literal'], refreshIntervalMs: 1740000 };
    assert.deepEqual(parse(def('telemetry.headersProvider'), JSON.stringify(provider)), provider);
  }
  for (const provider of [
    { path: './helper' }, { path: 'bin/helper' }, { path: 'node script.js' },
    { path: 'node', args: 'script.js' }, { path: 'node', refreshIntervalMs: -1 },
    { path: 'node', unsupported: true }
  ]) assert.throws(() => parse(def('telemetry.headersProvider'), JSON.stringify(provider)));
});

test('Windows learning allow is not emitted and Boolean typos do not silently coerce', () => {
  assert.equal(build({ 'sandbox.learningMode': entry('allow') }).errors.length, 1);
  assert.equal(build({ 'sandbox.enabled': entry('yes') }).errors.length, 1);
});

test('all example values parse and serialize without raw HTML interpretation', () => {
  for (const field of fields) {
    const raw = field.type === 'boolean' ? 'false' : field.type === 'enum' ? field.options[0] : field.example;
    assert.doesNotThrow(() => parse(field, raw), field.path);
  }
  const result = build({ 'telemetry.serviceName': entry('</textarea><script>alert(1)</script>') });
  assert.equal(JSON.parse(JSON.stringify(result.settings)).telemetry.serviceName, '</textarea><script>alert(1)</script>');
});

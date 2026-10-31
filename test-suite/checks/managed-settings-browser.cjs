const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const { fields, groups } = require('../../docs/assets/js/managed-settings.js');

const base = process.env.SETTINGS_TEST_URL || 'http://127.0.0.1:4173/copilot-governance-training';
const themes = ['auto', 'light', 'dark', 'dark-dimmed', 'light-high-contrast', 'dark-high-contrast'];
const id = path => '#setting-' + path.replace(/\./g, '-');

async function main() {
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    const errors = [];
    let openPullRequests = [{ number: 1 }];
    await page.route('https://api.github.com/repos/**/pulls?state=open&per_page=1', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(openPullRequests)
      }));
    page.on('pageerror', error => errors.push(error.message));
    assert.ok((await page.goto(`${base}/sections/managed-settings-generator/`)).ok());
    const banner = page.locator('#open-pr-banner');
    await banner.waitFor({ state: 'visible' });
    assert.equal(await banner.locator('a').getAttribute('href'),
      'https://github.com/beardofedu/copilot-governance-training/pulls');
    const noPullsResponse = page.waitForResponse(response => response.url().includes('/pulls?state=open'));
    openPullRequests = [];
    await page.reload();
    await noPullsResponse;
    assert.ok(await banner.isHidden());
    await page.locator('#settings-workspace').waitFor({ state: 'visible' });
    const output = async () => JSON.parse(await page.locator('#settings-output').inputValue());
    assert.deepEqual(await output(), {});
    assert.equal(await page.locator('.settings-field').count(), fields.length);
    const steps = page.locator('#wizard-steps button');
    assert.equal(await steps.count(), groups.length + 2);
    assert.equal(await page.locator('#wizard-steps [aria-current="step"]').getAttribute('data-step'), 'welcome');
    assert.ok(await page.locator('#wizard-back').isDisabled());
    await page.locator('#wizard-next').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'wizard-heading-defaults');
    assert.match(await page.locator('#wizard-position').textContent(), /Step 2 of 9/);
    assert.ok(await page.locator(id('model')).isVisible());
    assert.ok(!(await page.locator(id('sandbox.enabled')).isVisible()));
    assert.match(await page.locator(id('model')).locator('..').locator('.settings-reasons').textContent(), /Why you would set it.*Why you might not/s);
    await page.locator('#wizard-back').click();
    assert.equal(await page.locator('#wizard-steps [aria-current="step"]').getAttribute('data-step'), 'welcome');
    for (let i = 0; i < groups.length; i++) await page.locator('#wizard-next').click();
    assert.equal(await page.locator('#wizard-next').textContent(), 'Review settings');
    await page.locator('#wizard-next').click();
    assert.ok(await page.locator('#wizard-next').isHidden());
    assert.ok(await page.locator('#settings-copy').isVisible());
    const goTo = step => page.locator(`#wizard-steps [data-step="${step}"]`).click();

    async function configure(path, value, override = false) {
      const selector = id(path);
      await goTo(fields.find(field => field.path === path).group);
      await page.locator(selector).evaluate(element => {
        let ancestor = element.parentElement;
        while (ancestor) {
          if (ancestor.tagName === 'DETAILS') ancestor.open = true;
          ancestor = ancestor.parentElement;
        }
      });
      await page.locator(selector + '-include').check();
      const element = page.locator(selector);
      if (await element.evaluate(node => node.tagName === 'SELECT')) await element.selectOption(value);
      else await element.fill(value);
      if (override) await element.locator('..').getByLabel('Allow enterprise team overrides').check();
    }

    await configure('model', 'auto', true);
    await configure('autoTier', 'balance');
    await configure('permissions.disableBypassPermissionsMode', 'disable');
    await configure('features.computerUse', 'false');
    await configure('permissions.deny', 'Read(~/.ssh/**)\nShell(rm -rf *)');
    await configure('strictKnownMarketplaces', '[]');
    await configure('allowedMcpServers', '[{"serverUrl":"https://*.example.com/*"}]');
    await configure('sandbox.enabled', 'true');
    await configure('sandbox.allowBypass', 'false');
    await page.locator('#sandbox-overridable').locator('..').locator('..').locator('summary').click();
    await page.locator('#sandbox-overridable').check();
    await configure('telemetry.enabled', 'true');
    await configure('telemetry.endpoint', 'https://otel.example.com');
    await configure('telemetry.capture.identity', 'true');
    await configure('remoteControl.mode', 'requireSSO');
    assert.equal(await page.locator('#settings-output').inputValue(), '');
    assert.ok(await page.locator('#settings-copy').isDisabled());
    await configure('remoteControl.githubDotComOrganizations', 'my-org');
    const expected = {
      model: { overridable: 'auto' }, autoTier: 'balance',
      permissions: { disableBypassPermissionsMode: 'disable', deny: ['Read(~/.ssh/**)', 'Shell(rm -rf *)'] },
      features: { computerUse: false }, strictKnownMarketplaces: [],
      allowedMcpServers: [{ serverUrl: 'https://*.example.com/*' }],
      sandbox: { overridable: { enabled: true, allowBypass: false } },
      telemetry: { enabled: true, endpoint: 'https://otel.example.com', capture: { identity: true } },
      remoteControl: { mode: 'requireSSO', githubDotComOrganizations: ['my-org'] }
    };
    assert.deepEqual(await output(), expected);

    await goTo('welcome');
    await page.locator('#wizard-area-telemetry').uncheck();
    assert.ok(await page.locator('#wizard-steps [data-step="telemetry"]').isHidden());
    assert.ok(!Object.hasOwn(await output(), 'telemetry'));
    await page.locator('#wizard-area-telemetry').check();
    assert.deepEqual(await output(), expected);
    await goTo('review');
    assert.match(await page.locator('#settings-summary').textContent(), /Conversation defaults: Default model, Auto routing tier/);
    await page.locator('#settings-copy').click();
    assert.deepEqual(JSON.parse(await page.evaluate(() => navigator.clipboard.readText())), expected);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#settings-download').click()
    ]);
    assert.equal(download.suggestedFilename(), 'managed-settings.json');
    assert.deepEqual(JSON.parse(await fs.readFile(await download.path(), 'utf8')), expected);

    await configure('allowedMcpServers', '[{"serverUrl":"https://x","serverName":"x"}]');
    assert.ok(await page.locator('#settings-copy').isDisabled());
    assert.ok(await page.locator('#settings-download').isDisabled());
    assert.equal(await page.locator('#settings-output').inputValue(), '');
    assert.equal(await page.locator(id('allowedMcpServers')).getAttribute('aria-invalid'), 'true');
    await goTo('review');
    await page.locator('#settings-issues a').first().click();
    assert.equal(await page.locator('#wizard-steps [aria-current="step"]').getAttribute('data-step'), 'mcp');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'setting-allowedMcpServers-include');
    await configure('allowedMcpServers', '[]');
    assert.deepEqual((await output()).allowedMcpServers, []);
    await page.locator(id('allowedMcpServers') + '-include').uncheck();
    assert.ok(!Object.hasOwn(await output(), 'allowedMcpServers'));

    // Exercise all advanced controls and full-shape serialization in the real DOM.
    await goTo('review');
    await page.locator('#settings-reset').click();
    for (const field of fields) {
      const value = field.path === 'remoteControl.mode' ? 'requireSSO' :
        field.type === 'boolean' ? 'false' : field.type === 'enum' ? field.options[0] : field.example;
      await configure(field.path, value);
    }
    assert.ok(!(await page.locator('#settings-copy').isDisabled()));
    const complete = await output();
    assert.equal(complete.telemetry.headersProvider.refreshIntervalMs, 1740000);
    assert.equal(complete.sandbox.learningMode, 'deny');
    assert.ok(complete.extraKnownMarketplaces['enterprise-plugins'].source);
    for (const theme of themes) {
      await page.locator('html').evaluate((html, value) => html.setAttribute('data-theme', value), theme);
      for (const step of ['welcome', ...groups.map(group => group.id), 'review']) {
        await goTo(step);
        await page.locator('.settings-advanced').evaluateAll(details => details.forEach(element => { element.open = true; }));
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
        assert.deepEqual(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], `${theme} ${step}`);
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    for (const step of ['welcome', ...groups.map(group => group.id), 'review']) {
      await goTo(step);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `No horizontal overflow on mobile: ${step}`);
    }
    await page.locator('#settings-reset').click();
    assert.deepEqual(await output(), {});
    assert.ok(await page.locator(id('model')).isDisabled());
    assert.equal(await page.locator(id('model') + ' optgroup[label="Anthropic"] option[value="claude-opus-5.5"]').count(), 1);
    await configure('model', 'gpt-6.1-sol');
    assert.equal((await output()).model, 'gpt-6.1-sol');
    assert.ok(!(await page.locator(id('autoTier') + '-include').isDisabled()));
    await configure('autoTier', 'balance');
    assert.deepEqual(await output(), { model: 'gpt-6.1-sol', autoTier: 'balance' });
    assert.match(await page.locator('#settings-issues').textContent(), /Auto tier applies only when users switch to auto/);
    await page.locator(id('model') + '-include').uncheck();
    await configure('telemetry.serviceName', '</textarea><script>window.injected=true</script>');
    assert.equal(await page.evaluate(() => window.injected), undefined);
    assert.equal((await output()).telemetry.serviceName, '</textarea><script>window.injected=true</script>');
    await goTo('review');
    await page.locator('#settings-copy').evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    });
    await page.locator('#settings-copy').click();
    assert.match(await page.locator('#settings-feedback').textContent(), /Clipboard access failed/);
    assert.equal(await page.locator('#settings-output').evaluate(element => element.selectionEnd - element.selectionStart), (await page.locator('#settings-output').inputValue()).length);
    assert.deepEqual(errors, []);

    const noScript = await browser.newContext({ javaScriptEnabled: false });
    const fallback = await noScript.newPage();
    await fallback.goto(`${base}/sections/managed-settings-generator/`);
    await fallback.locator('noscript p').waitFor({ state: 'visible' });
    assert.match(await fallback.locator('noscript p').textContent(), /This generator requires JavaScript/);
    assert.ok(await fallback.locator('#settings-workspace').isHidden());
    await noScript.close();
    await context.close();
    console.log(`Generator browser checks passed: wizard navigation, ${fields.length} controls, copy/download, invalid states, ${themes.length} themes, mobile, no-JS, clipboard fallback.`);
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });

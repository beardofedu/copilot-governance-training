const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;

const baseUrl = "http://127.0.0.1:4173/copilot-governance-training";
const siteDirectory = process.env.SITE_DIRECTORY || path.join(process.cwd(), "_site");
const themes = [
  { label: "auto (system light)", value: "auto", colorScheme: "light" },
  { label: "auto (system dark)", value: "auto", colorScheme: "dark" },
  { label: "light", value: "light", colorScheme: "light" },
  { label: "dark", value: "dark", colorScheme: "dark" },
  { label: "dark-dimmed", value: "dark-dimmed", colorScheme: "dark" },
  { label: "light-high-contrast", value: "light-high-contrast", colorScheme: "light" },
  { label: "dark-high-contrast", value: "dark-high-contrast", colorScheme: "dark" },
];
const sectionsDirectory = path.join(siteDirectory, "sections");
const pages = ["/", "/changelog/"];

for (const entry of fs.readdirSync(sectionsDirectory, { withFileTypes: true })) {
  if (
    entry.isDirectory() &&
    fs.existsSync(path.join(sectionsDirectory, entry.name, "index.html"))
  ) {
    pages.push(`/sections/${entry.name}/`);
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  let failureCount = 0;

  try {
    for (const theme of themes) {
      const context = await browser.newContext({ colorScheme: theme.colorScheme });
      await context.addInitScript((selectedTheme) => {
        localStorage.setItem("cgt-theme", selectedTheme);
      }, theme.value);

      for (const route of pages) {
        const page = await context.newPage();
        const response = await page.goto(`${baseUrl}${route}`, {
          waitUntil: "networkidle",
        });
        if (!response || !response.ok()) {
          throw new Error(`${route} returned ${response?.status() ?? "no response"}`);
        }

        const activeTheme = await page.locator("html").getAttribute("data-theme");
        if (activeTheme !== theme.value) {
          throw new Error(`${route} did not apply the ${theme.label} theme`);
        }

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        if (results.violations.length > 0) {
          failureCount += results.violations.length;
          console.error(`Accessibility violations on ${route} (${theme.label}):`);
          for (const violation of results.violations) {
            console.error(`- ${violation.id}: ${violation.help}`);
            for (const node of violation.nodes) {
              console.error(`  ${node.target.join(", ")} — ${node.failureSummary}`);
            }
          }
        }
        await page.close();
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (failureCount > 0) {
    throw new Error(`Found ${failureCount} accessibility violation(s).`);
  }
  console.log(`Accessibility checks passed for ${pages.length} pages in ${themes.length} theme configurations.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

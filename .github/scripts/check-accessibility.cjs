const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;

const baseUrl = "http://127.0.0.1:4173/awesome-copilot-governance";
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
      await context.route("https://api.github.com/repos/**/pulls?state=open&per_page=1", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([{ number: 1 }]),
        }),
      );

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
        await page.locator("#open-pr-banner").waitFor({ state: "visible" });

        if (route === "/" && theme === themes[0]) {
          await page.emulateMedia({ reducedMotion: "reduce" });
          const headingTransition = await page.locator(".heading-anchor").first().evaluate(
            (element) => getComputedStyle(element).transitionDuration
          );
          if (headingTransition !== "0s") {
            throw new Error("Heading permalinks still animate with reduced motion enabled");
          }

          await page.keyboard.press("Tab");
          if (await page.evaluate(() => document.activeElement.className) !== "skip-link") {
            throw new Error("The first keyboard stop is not the skip link");
          }
          const skipLinkBounds = await page.locator(".skip-link").evaluate((element) => {
            const bounds = element.getBoundingClientRect();
            return { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height };
          });
          if (skipLinkBounds.left < 0 || skipLinkBounds.top < 0 ||
              skipLinkBounds.width === 0 || skipLinkBounds.height === 0) {
            throw new Error("The focused skip link is not visible");
          }
          await page.keyboard.press("Enter");
          await page.waitForFunction(() => document.activeElement.id === "content");

          const searchToggle = page.locator(".search-toggle");
          await searchToggle.click();
          await page.waitForFunction(() => document.activeElement.id === "search-input");
          await page.keyboard.press("Escape");
          await page.waitForFunction(() => document.activeElement.classList.contains("search-toggle"));
        }

        if (route === "/") {
          const title = page.locator(".site-title");
          const normalColor = await title.evaluate((element) => getComputedStyle(element).color);
          await title.hover();
          const hoverColor = await title.evaluate((element) => getComputedStyle(element).color);
          await page.mouse.move(0, 0);
          await title.focus();
          const focusColor = await title.evaluate((element) => getComputedStyle(element).color);
          if (hoverColor !== normalColor || focusColor !== normalColor) {
            throw new Error(`Site title loses its color on hover or focus in ${theme.label}`);
          }
          await title.blur();
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

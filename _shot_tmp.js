const { chromium } = require("playwright-core");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const page = await browser.newPage({ viewport: { width: 900, height: 700 }, deviceScaleFactor: 3 });
  await page.goto("file:///" + path.resolve("_isotest.html").replace(/\\/g, "/"), { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: "isotest.png", fullPage: true });
  await browser.close();
})();

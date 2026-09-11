const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'pw-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

const BASE = 'http://127.0.0.1:8100';
const CHROME_PATH = 'C:\\Users\\user pc\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    executablePath: CHROME_PATH,
  });

  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  console.log(`📸 Taking screenshot of ${BASE}...`);
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT, 'matches-layout.png'), fullPage: true });

  console.log('✅ Done! Check matches-layout.png');
  await browser.close();
})();

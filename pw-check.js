const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, 'pw-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

// Use 127.0.0.1 to avoid Node IPv6 localhost resolution issues
const BASE = 'http://127.0.0.1:8100';
const CHROME_PATH = 'C:\\Users\\user pc\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe';

const EMAIL = 'chidi@dinanwuye.com';
const PASS  = 'Password123!';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300,
    executablePath: CHROME_PATH,
  });

  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    storageState: undefined,
  });
  const page = await ctx.newPage();

  console.log(`⏳ Waiting for ${BASE} to be ready...`);
  
  let retries = 5;
  while (retries > 0) {
    try {
      await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 5000 });
      console.log('✅ Server is up!');
      break;
    } catch (err) {
      console.log(`Server not ready yet, retrying... (${retries} left)`);
      retries--;
      await page.waitForTimeout(2000);
    }
  }

  if (retries === 0) {
    console.log('Failed to reach local server.');
    await browser.close();
    return;
  }

  // ── 1. Landing page ──────────────────────────────────────────────
  console.log('📸 1. Landing page...');
  await page.waitForTimeout(2000);
  
  // ── 2. Auth page ─────────────────────────────────────────────────
  console.log('🔐 2. Clicking to /auth...');
  await page.getByText('I Already Have an Account').click();
  await page.waitForTimeout(2000);

  const emailInput = page.locator('input[placeholder="Email or phone (+234...)"]');
  const passInput  = page.locator('input[placeholder="Password"]');
  
  if (await emailInput.count() === 0) {
    console.log('⚠️  Auth form not visible — exiting');
    await browser.close();
    return;
  }

  await emailInput.fill(EMAIL);
  await passInput.fill(PASS);
  await page.waitForTimeout(600);

  // ── 3. Login ──────────────────────────────────────────────────────
  console.log('🚀 3. Submitting login... waiting up to 90s for cold start');
  await page.locator('button[type="submit"]').click();

  try {
    await page.waitForURL((url) => !url.href.includes('/auth'), { timeout: 90000 });
  } catch (e) {
    console.log('⚠️  Login timed out — taking screenshot and exiting', e);
    await page.screenshot({ path: path.join(OUT, '03-login-timeout-local.png'), fullPage: true });
    await browser.close();
    return;
  }

  await page.waitForTimeout(2500);
  console.log('✅ Logged in — now at:', page.url());

  // ── 4. Matches page ───────────────────────────────────────────────
  console.log('💕 4. Matches page...');
  await page.evaluate(() => window.history.pushState({}, '', '/matches'));
  await page.evaluate(() => window.dispatchEvent(new Event('popstate')));
  
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(OUT, '05-matches-top-local.png'), fullPage: true });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, '06-matches-bottom-local.png'), fullPage: true });

  console.log('\n✅ All done! Screenshots saved locally.');
  await browser.close();
})();

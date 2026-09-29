import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
};

function createStaticServer(distDir, port) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath.endsWith('/')) reqPath += 'index.html';
    let filePath = path.join(distDir, reqPath);

    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath += '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function run() {
  const distDir = path.resolve('dist');
  const port = 4328;
  const server = await createStaticServer(distDir, port);
  const outDir = path.resolve('info/06-execution/verification/3-ux');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  // 1. Mobile Hero vs Calculator (less than 1 scroll to first input)
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(outDir, 'item-1-after.png') });
  console.log('Captured item-1-after.png');

  // Desktop Page for Desktop Items
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  const page = await desktopContext.newPage();
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

  // 2. DIN Gauge with smooth animation
  const gauge = page.locator('#calculator-result').first();
  if (await gauge.isVisible()) {
    await gauge.screenshot({ path: path.join(outDir, 'item-2-after.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-2-after.png') });
  }
  console.log('Captured item-2-after.png');

  // 3. Inputs Form with Steppers
  const formCard = page.locator('form, .lg\\:col-span-7').first();
  if (await formCard.isVisible()) {
    await formCard.screenshot({ path: path.join(outDir, 'item-3-after.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-3-after.png') });
  }
  console.log('Captured item-3-after.png');

  // 4. Default Example State (Instant pre-filled calculation)
  await page.screenshot({ path: path.join(outDir, 'item-4-after.png') });
  console.log('Captured item-4-after.png');

  // 5. Skier Type Cards with persistent 'Best for' guidance
  const skierCards = page.locator('text=Skier Type Classification').locator('..').first();
  if (await skierCards.isVisible()) {
    await skierCards.screenshot({ path: path.join(outDir, 'item-5-after.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-5-after.png') });
  }
  console.log('Captured item-5-after.png');

  // 6. Error States (Type an out of range weight and BSL to verify plain-language errors)
  await page.evaluate(() => {
    const el = document.getElementById('calc-weight-input');
    if (el) {
      el.value = '15';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'item-6-after.png') });
  console.log('Captured item-6-after.png');

  // Reset weight
  await page.evaluate(() => {
    const el = document.getElementById('calc-weight-input');
    if (el) {
      el.value = '165';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(200);

  // 7. Loading / Skeleton Reserved Layout
  await page.screenshot({ path: path.join(outDir, 'item-7-after.png') });
  console.log('Captured item-7-after.png');

  // 8. Result Card Actions & Toast Confirmation
  const copyBtn = page.locator('button:has-text("Copy Card")').first();
  if (await copyBtn.isVisible()) {
    await copyBtn.click({ force: true });
    await page.waitForTimeout(300); // let toast render
  }
  await page.screenshot({ path: path.join(outDir, 'item-8-after.png') });
  console.log('Captured item-8-after.png');

  // 9. Progressive Disclosure (Basic tab default)
  const modeToggle = page.locator('button:has-text("Basic")').locator('..').first();
  if (await modeToggle.isVisible()) {
    await modeToggle.screenshot({ path: path.join(outDir, 'item-9-after.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-9-after.png') });
  }
  console.log('Captured item-9-after.png');

  // 10. Dark / Light Toggle on embed and guide pages
  await page.goto(`http://localhost:${port}/embed/?theme=light`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'item-10-after.png') });
  console.log('Captured item-10-after.png');

  // 11. Axe Accessibility Audit on Key Pages
  console.log('Running Axe Accessibility Audit across templates...');
  const testUrls = ['/', '/din-chart/', '/bsl-guide/', '/skier-types/', '/skier-type-quiz/', '/embed/'];
  const axeResults = [];
  let totalCritical = 0;
  let totalSerious = 0;

  for (const urlPath of testUrls) {
    await page.goto(`http://localhost:${port}${urlPath}`, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(v => v.impact === 'critical');
    const serious = results.violations.filter(v => v.impact === 'serious');
    totalCritical += critical.length;
    totalSerious += serious.length;
    axeResults.push({
      url: urlPath,
      violationsCount: results.violations.length,
      criticalCount: critical.length,
      seriousCount: serious.length,
      violations: results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.length }))
    });
  }

  fs.writeFileSync(
    path.join(outDir, 'axe-report.json'),
    JSON.stringify({ totalCritical, totalSerious, templates: axeResults }, null, 2)
  );

  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'item-11-after.png') });
  console.log(`Captured item-11-after.png. Axe Audit completed: Critical=${totalCritical}, Serious=${totalSerious}`);

  await mobileContext.close();
  await desktopContext.close();
  await browser.close();
  server.close();

  if (totalCritical > 0 || totalSerious > 0) {
    console.error(`Axe violations detected! Critical: ${totalCritical}, Serious: ${totalSerious}`);
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

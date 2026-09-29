import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

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
  const port = 4327;
  const server = await createStaticServer(distDir, port);
  const outDir = path.resolve('info/06-execution/verification/3-ux');
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile Hero vs Calculator
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(outDir, 'item-1-before.png') });
  console.log('Captured item-1-before.png');

  // Desktop Page for Desktop Items
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 850 } });
  const page = await desktopContext.newPage();
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

  // 2. DIN Gauge
  const gauge = page.locator('#calculator-result').first();
  if (await gauge.isVisible()) {
    await gauge.screenshot({ path: path.join(outDir, 'item-2-before.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-2-before.png') });
  }
  console.log('Captured item-2-before.png');

  // 3. Inputs Form
  const formCard = page.locator('form, .lg\\:col-span-7').first();
  if (await formCard.isVisible()) {
    await formCard.screenshot({ path: path.join(outDir, 'item-3-before.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-3-before.png') });
  }
  console.log('Captured item-3-before.png');

  // 4. Empty / Default State
  await page.screenshot({ path: path.join(outDir, 'item-4-before.png') });
  console.log('Captured item-4-before.png');

  // 5. Skier Type Cards
  const skierSection = page.locator('text=Skier Type Classification').locator('..').first();
  if (await skierSection.isVisible()) {
    await skierSection.screenshot({ path: path.join(outDir, 'item-5-before.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-5-before.png') });
  }
  console.log('Captured item-5-before.png');

  // 6. Error States
  await page.screenshot({ path: path.join(outDir, 'item-6-before.png') });
  console.log('Captured item-6-before.png');

  // 7. Loading / Skeleton
  await page.screenshot({ path: path.join(outDir, 'item-7-before.png') });
  console.log('Captured item-7-before.png');

  // 8. Result Card Actions (Copy / Print buttons)
  if (await gauge.isVisible()) {
    await gauge.screenshot({ path: path.join(outDir, 'item-8-before.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-8-before.png') });
  }
  console.log('Captured item-8-before.png');

  // 9. Basic vs Advanced Tabs
  const modeToggle = page.locator('button:has-text("Basic")').locator('..').first();
  if (await modeToggle.isVisible()) {
    await modeToggle.screenshot({ path: path.join(outDir, 'item-9-before.png') });
  } else {
    await page.screenshot({ path: path.join(outDir, 'item-9-before.png') });
  }
  console.log('Captured item-9-before.png');

  // 10. Dark / Light Toggle on Guide Page
  await page.goto(`http://localhost:${port}/bsl-guide/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'item-10-before.png') });
  console.log('Captured item-10-before.png');

  // 11. Axe Audit Before
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, 'item-11-before.png') });
  console.log('Captured item-11-before.png');

  await mobileContext.close();
  await desktopContext.close();
  await browser.close();
  server.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

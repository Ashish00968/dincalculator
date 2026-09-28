import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
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
  const port = 4322; // Use port 4322 to avoid any port conflicts
  const server = await createStaticServer(distDir, port);
  console.log(`Server running at http://localhost:${port}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  console.log(`Navigating to http://localhost:${port}/...`);
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

  // Give client-side island time to hydrate
  await page.waitForTimeout(1000);

  // Take full screenshot for debugging if needed
  const traceBtn = page.locator('button:has-text("Calculation Trace")');
  const count = await traceBtn.count();
  console.log('Calculation trace button count:', count);

  if (count > 0) {
    await traceBtn.first().click();
    await page.waitForTimeout(500);

    const outputPath = path.resolve('info/06-execution/verification/2.3-trace-visual/after.png');
    const resultCard = page.locator('#calculator-result').first();
    if (await resultCard.isVisible()) {
      await resultCard.screenshot({ path: outputPath });
    } else {
      await page.screenshot({ path: outputPath, fullPage: false });
    }
    console.log(`Captured trace after image: ${outputPath}`);
  } else {
    console.log('Button not found, saving debug screenshot');
    await page.screenshot({ path: 'info/06-execution/verification/2.3-trace-visual/debug.png' });
  }

  await browser.close();
  server.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

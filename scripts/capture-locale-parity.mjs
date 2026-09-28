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

const TARGETS = [
  { locale: 'en', page: 'home', path: '/', label: 'English Home' },
  { locale: 'en', page: 'chart', path: '/din-chart/', label: 'English DIN Chart' },
  { locale: 'de', page: 'home', path: '/de/', label: 'German Home' },
  { locale: 'de', page: 'chart', path: '/de/din-chart/', label: 'German DIN Chart' },
  { locale: 'fr', page: 'home', path: '/fr/', label: 'French Home' },
  { locale: 'fr', page: 'chart', path: '/fr/din-chart/', label: 'French DIN Chart' },
  { locale: 'it', page: 'home', path: '/it/', label: 'Italian Home' },
  { locale: 'it', page: 'chart', path: '/it/din-chart/', label: 'Italian DIN Chart' },
];

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: '390px', width: 390, height: 844 },
];

async function run() {
  const distDir = path.resolve('dist');
  const port = 4325;
  const server = await createStaticServer(distDir, port);
  console.log(`Server running at http://localhost:${port}`);

  const browser = await chromium.launch({ headless: true });
  const outDir = path.resolve('info/06-execution/verification/2.5-locale-parity');

  for (const t of TARGETS) {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      const url = `http://localhost:${port}${t.path}`;
      console.log(`Capturing ${t.locale}-${t.page}-${vp.name}...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const filename = `${t.locale}-${t.page}-${vp.name}.png`;
      const filePath = path.join(outDir, filename);
      await page.screenshot({ path: filePath, fullPage: false });
      await context.close();
    }
  }

  await browser.close();
  server.close();
  console.log('All 16 locale parity screenshots captured successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

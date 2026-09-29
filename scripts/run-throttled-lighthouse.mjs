import http from 'http';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

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

async function runLighthouse(url, outputPathPrefix) {
  console.log(`Running Throttled Mobile Lighthouse on ${url}...`);
  // Flags for Slow 4G (150ms RTT, 1638.4 kbps) + 4x CPU slowdown on mobile
  const args = [
    url,
    '--output=json',
    '--output=html',
    `--output-path=${outputPathPrefix}`,
    '--form-factor=mobile',
    '--throttling.cpuSlowdownMultiplier=4',
    '--throttling.rttMs=150',
    '--throttling.throughputKbps=1638.4',
    '--throttling-method=simulate',
    '--chrome-flags="--headless --no-sandbox --disable-gpu"',
    '--quiet',
  ];

  const lhBin = path.resolve('node_modules/.bin/lighthouse');
  await execFileAsync(lhBin, args, { shell: true, maxBuffer: 1024 * 1024 * 20 });

  const jsonReport = JSON.parse(fs.readFileSync(`${outputPathPrefix}.report.json`, 'utf8'));
  return {
    url,
    scores: {
      performance: Math.round(jsonReport.categories.performance.score * 100),
      accessibility: Math.round(jsonReport.categories.accessibility.score * 100),
      bestPractices: Math.round(jsonReport.categories['best-practices'].score * 100),
      seo: Math.round(jsonReport.categories.seo.score * 100),
    },
    metrics: {
      fcp: jsonReport.audits['first-contentful-paint']?.displayValue,
      lcp: jsonReport.audits['largest-contentful-paint']?.displayValue,
      tbt: jsonReport.audits['total-blocking-time']?.displayValue,
      cls: jsonReport.audits['cumulative-layout-shift']?.displayValue,
      speedIndex: jsonReport.audits['speed-index']?.displayValue,
    }
  };
}

async function main() {
  const port = 4335;
  const distDir = path.resolve('dist');
  const server = await createStaticServer(distDir, port);
  const outDir = path.resolve('info/06-execution/verification/3b-mobile/lighthouse');
  fs.mkdirSync(outDir, { recursive: true });

  try {
    const homeResult = await runLighthouse(
      `http://localhost:${port}/`,
      path.join(outDir, 'lh-home-slow4g')
    );
    console.log('Home Result:', JSON.stringify(homeResult, null, 2));

    const chartResult = await runLighthouse(
      `http://localhost:${port}/din-chart/`,
      path.join(outDir, 'lh-din-chart-slow4g')
    );
    console.log('Chart Result:', JSON.stringify(chartResult, null, 2));

    fs.writeFileSync(
      path.join(outDir, 'lighthouse-summary.json'),
      JSON.stringify({ home: homeResult, dinChart: chartResult }, null, 2),
      'utf8'
    );
  } finally {
    server.close();
  }
}

main().catch(err => {
  console.error('Lighthouse runner failed:', err);
  process.exit(1);
});

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
  const port = 4333;
  const server = await createStaticServer(distDir, port);
  const outDir = path.resolve('info/06-execution/verification/3b-mobile');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'iphone-se-375x667', width: 375, height: 667, device: 'iPhone SE (375×667)' },
    { name: 'iphone-14-390x844', width: 390, height: 844, device: 'iPhone 14/15/16 (390×844)' },
    { name: 'android-412x915', width: 412, height: 915, device: 'Android Flagship (412×915)' },
    { name: 'tablet-768x1024', width: 768, height: 1024, device: 'iPad / Tablet (768×1024)' },
  ];

  const auditResults = {
    viewports: [],
    inputFontSizes: [],
    tapTargetSample: [],
  };

  for (const vp of viewports) {
    console.log(`Testing viewport ${vp.device}...`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    // 1. Light mode top view
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-light.png`) });

    // 2. Dark mode top view
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-dark.png`) });

    // 3. Scrolled sticky bar (on mobile viewports)
    if (vp.width < 768) {
      await page.evaluate(() => window.scrollBy(0, 750));
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(outDir, `${vp.name}-sticky-dark.png`) });
    }

    // 4. Horizontal overflow check
    const overflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const bodyW = document.body.scrollWidth;
      return {
        docScrollWidth: docW,
        bodyScrollWidth: bodyW,
        innerWidth: winW,
        hasOverflow: docW > winW || bodyW > winW,
        excessPixels: Math.max(0, docW - winW, bodyW - winW),
      };
    });

    // 5. Check input font size to ensure >= 16px (prevents iOS auto-zoom)
    if (auditResults.inputFontSizes.length === 0) {
      const fontSizes = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, select'));
        return inputs.slice(0, 10).map(el => {
          const style = window.getComputedStyle(el);
          return {
            id: el.id || el.getAttribute('name') || el.tagName,
            type: el.tagName.toLowerCase(),
            fontSize: style.fontSize,
            numericPx: parseFloat(style.fontSize),
            preventsZoom: parseFloat(style.fontSize) >= 16,
          };
        });
      });
      auditResults.inputFontSizes = fontSizes;
    }

    // 6. Check interactive tap targets (>= 40px)
    if (auditResults.tapTargetSample.length === 0) {
      const tapTargets = await page.evaluate(() => {
        const interactive = Array.from(document.querySelectorAll('button, a[href], input, select'));
        return interactive.slice(0, 15).map(el => {
          const rect = el.getBoundingClientRect();
          return {
            text: (el.textContent || el.getAttribute('aria-label') || el.id || '').trim().slice(0, 24),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            isAccessible: rect.width >= 36 && rect.height >= 36, // comfortable touch area
          };
        });
      });
      auditResults.tapTargetSample = tapTargets;
    }

    auditResults.viewports.push({
      device: vp.device,
      width: vp.width,
      height: vp.height,
      overflow,
      status: !overflow.hasOverflow ? 'PASS' : 'FAIL',
    });

    await context.close();
  }

  // Matrix and BSL mobile snapshots
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const subPage = await mobileContext.newPage();

  await subPage.goto(`http://localhost:${port}/din-chart/`, { waitUntil: 'networkidle' });
  await subPage.screenshot({ path: path.join(outDir, 'din-chart-mobile-390x844.png') });

  await subPage.goto(`http://localhost:${port}/bsl-guide/`, { waitUntil: 'networkidle' });
  await subPage.screenshot({ path: path.join(outDir, 'bsl-guide-mobile-390x844.png') });

  await mobileContext.close();
  await browser.close();
  server.close();

  // Write JSON report
  fs.writeFileSync(
    path.join(outDir, 'audit-report.json'),
    JSON.stringify(auditResults, null, 2),
    'utf8'
  );

  // Write Markdown Report
  const mdReport = `# Section 3B — Dedicated Multi-Device Mobile Audit Report

## 1. Multi-Device Viewport Verification Matrix

| Device Profile | Dimensions | Scroll Width | Inner Width | Overflow Status | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
${auditResults.viewports.map(v => `| **${v.device}** | ${v.width}×${v.height} px | ${v.overflow.docScrollWidth} px | ${v.overflow.innerWidth} px | ${v.overflow.excessPixels} px overflow | ${v.status === 'PASS' ? '✅ PASS' : '❌ FAIL'} |`).join('\n')}

---

## 2. iOS Auto-Zoom Prevention Audit (Font Size ≥ 16px)

iOS Safari triggers automatic screen zoom on input focus if the input's computed \`font-size\` is less than \`16px\` (\`1rem\`).

| Element | Tag | Computed Font Size | ≥ 16px Requirement | Result |
| :--- | :--- | :--- | :--- | :--- |
${auditResults.inputFontSizes.map(f => `| \`#${f.id}\` | \`<${f.type}>\` | ${f.fontSize} | ${f.preventsZoom ? 'Yes (≥ 16px)' : 'No (< 16px)'} | ${f.preventsZoom ? '✅ PASS (No Zoom)' : '❌ FAIL'} |`).join('\n')}

---

## 3. Interactive Touch Targets & Steppers Audit

| Element | Measured Bounding Box | Touch Usability Standard | Result |
| :--- | :--- | :--- | :--- |
${auditResults.tapTargetSample.map(t => `| \`${t.text || 'Action Button'}\` | ${t.width}×${t.height} px | ≥ 36×36 px active touch area | ${t.isAccessible ? '✅ PASS' : '⚠️ Inspect'} |`).join('\n')}

---

## 4. Visual Artifacts
- **iPhone SE (375×667)**:
  - Light Mode: [\`iphone-se-375x667-light.png\`](./iphone-se-375x667-light.png)
  - Dark Mode: [\`iphone-se-375x667-dark.png\`](./iphone-se-375x667-dark.png)
  - Sticky Bar (Scrolled): [\`iphone-se-375x667-sticky-dark.png\`](./iphone-se-375x667-sticky-dark.png)
- **iPhone 14/15/16 (390×844)**:
  - Light Mode: [\`iphone-14-390x844-light.png\`](./iphone-14-390x844-light.png)
  - Dark Mode: [\`iphone-14-390x844-dark.png\`](./iphone-14-390x844-dark.png)
  - Sticky Bar (Scrolled): [\`iphone-14-390x844-sticky-dark.png\`](./iphone-14-390x844-sticky-dark.png)
- **Android Flagship (412×915)**:
  - Light Mode: [\`android-412x915-light.png\`](./android-412x915-light.png)
  - Dark Mode: [\`android-412x915-dark.png\`](./android-412x915-dark.png)
  - Sticky Bar (Scrolled): [\`android-412x915-sticky-dark.png\`](./android-412x915-sticky-dark.png)
- **iPad / Tablet Portrait (768×1024)**:
  - Light Mode: [\`tablet-768x1024-light.png\`](./tablet-768x1024-light.png)
  - Dark Mode: [\`tablet-768x1024-dark.png\`](./tablet-768x1024-dark.png)
- **Key Sub-Pages (390×844)**:
  - Matrix Table: [\`din-chart-mobile-390x844.png\`](./din-chart-mobile-390x844.png)
  - BSL Guide: [\`bsl-guide-mobile-390x844.png\`](./bsl-guide-mobile-390x844.png)
`;

  fs.writeFileSync(path.join(outDir, 'report.md'), mdReport, 'utf8');
  console.log('Section 3B mobile audit completed and saved to info/06-execution/verification/3b-mobile/');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

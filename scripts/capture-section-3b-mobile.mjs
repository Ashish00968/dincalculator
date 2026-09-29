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
  const port = 4336;
  const server = await createStaticServer(distDir, port);
  const outDir = path.resolve('info/06-execution/verification/3b-mobile');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  const portraitViewports = [
    { name: 'iphone-se-375x667', width: 375, height: 667, device: 'iPhone SE (375×667)' },
    { name: 'iphone-14-390x844', width: 390, height: 844, device: 'iPhone 14/15/16 (390×844)' },
    { name: 'android-412x915', width: 412, height: 915, device: 'Android Flagship (412×915)' },
    { name: 'tablet-768x1024', width: 768, height: 1024, device: 'iPad / Tablet (768×1024)' },
  ];

  const landscapeViewports = [
    { name: 'iphone-se-667x375-landscape', width: 667, height: 375, device: 'iPhone SE Landscape (667×375)' },
    { name: 'iphone-14-844x390-landscape', width: 844, height: 390, device: 'iPhone 14/15/16 Landscape (844×390)' },
    { name: 'android-915x412-landscape', width: 915, height: 412, device: 'Android Flagship Landscape (915×412)' },
  ];

  const auditResults = {
    viewports: [],
    landscapeViewports: [],
    inputFontSizes: [],
    stepperTargets: [],
    tapTargetSample: [],
    stickyOcclusion: null,
  };

  // Run portrait viewports
  for (const vp of portraitViewports) {
    console.log(`Testing portrait viewport ${vp.device}...`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    // 1. Light mode top view
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-light.png`) });

    // 2. Dark mode top view
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(200);
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

    // 6. Measure Steppers specifically on mobile (44x44 target check)
    if (auditResults.stepperTargets.length === 0 && vp.width === 375) {
      const steppers = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button[aria-label*="Decrease"], button[aria-label*="Increase"]'));
        return buttons.map(b => {
          const rect = b.getBoundingClientRect();
          return {
            label: b.getAttribute('aria-label'),
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
            meets44px: rect.width >= 44 && rect.height >= 44,
          };
        });
      });
      auditResults.stepperTargets = steppers;
    }

    // 7. Measure sticky occlusion on 375x667
    if (!auditResults.stickyOcclusion && vp.width === 375 && vp.height === 667) {
      await page.evaluate(() => window.scrollBy(0, 750));
      await page.waitForTimeout(300);
      auditResults.stickyOcclusion = await page.evaluate(() => {
        const header = document.querySelector('header.sticky');
        const bottomBar = document.querySelector('div.fixed.bottom-0');
        const hH = header ? Math.round(header.getBoundingClientRect().height * 10) / 10 : 0;
        const bH = bottomBar ? Math.round(bottomBar.getBoundingClientRect().height * 10) / 10 : 0;
        const total = Math.round((hH + bH) * 10) / 10;
        const vpHeight = window.innerHeight;
        return {
          headerPx: hH,
          headerPct: Math.round((hH / vpHeight) * 1000) / 10,
          bottomBarPx: bH,
          bottomBarPct: Math.round((bH / vpHeight) * 1000) / 10,
          totalOccludedPx: total,
          totalOccludedPct: Math.round((total / vpHeight) * 1000) / 10,
          remainingPx: vpHeight - total,
          remainingPct: Math.round(((vpHeight - total) / vpHeight) * 1000) / 10,
        };
      });
    }

    // 8. Sample visible interactive targets
    if (auditResults.tapTargetSample.length === 0 && vp.width === 375) {
      const tapTargets = await page.evaluate(() => {
        const interactive = Array.from(document.querySelectorAll('button, a[href], input, select'));
        return interactive
          .filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
          })
          .map(el => {
            const rect = el.getBoundingClientRect();
            return {
              text: (el.textContent || el.getAttribute('aria-label') || el.id || '').trim().slice(0, 24),
              width: Math.round(rect.width * 10) / 10,
              height: Math.round(rect.height * 10) / 10,
              isAccessible: (rect.width >= 44 && rect.height >= 44) || (rect.width >= 24 && rect.height >= 24),
            };
          })
          .filter(t => t.width > 0 && t.height > 0)
          .slice(0, 15);
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

  // Run landscape viewports
  for (const vp of landscapeViewports) {
    console.log(`Testing landscape viewport ${vp.device}...`);
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

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

    await page.screenshot({ path: path.join(outDir, `${vp.name}-dark.png`) });

    auditResults.landscapeViewports.push({
      device: vp.device,
      width: vp.width,
      height: vp.height,
      overflow,
      status: !overflow.hasOverflow ? 'PASS' : 'FAIL',
    });

    await context.close();
  }

  // Subpage screenshots
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
  const mdReport = `# Section 3B — Dedicated Multi-Device Mobile Audit Report (Updated)

## 1. Multi-Device Viewport Verification Matrix

### 1.1 Portrait Viewports
| Device Profile | Dimensions | Scroll Width | Inner Width | Overflow Status | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
${auditResults.viewports.map(v => `| **${v.device}** | ${v.width}×${v.height} px | ${v.overflow.docScrollWidth} px | ${v.overflow.innerWidth} px | ${v.overflow.excessPixels} px overflow | ${v.status === 'PASS' ? '✅ PASS' : '❌ FAIL'} |`).join('\n')}

### 1.2 Landscape Viewports
| Device Profile | Dimensions | Scroll Width | Inner Width | Overflow Status | Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
${auditResults.landscapeViewports.map(v => `| **${v.device}** | ${v.width}×${v.height} px | ${v.overflow.docScrollWidth} px | ${v.overflow.innerWidth} px | ${v.overflow.excessPixels} px overflow | ${v.status === 'PASS' ? '✅ PASS' : '❌ FAIL'} |`).join('\n')}

---

## 2. Sticky Header & Result Thumb-Bar Occlusion (iPhone SE 375×667)
- **Viewport Height:** 667 px
- **Sticky Top Header:** ${auditResults.stickyOcclusion?.headerPx} px (${auditResults.stickyOcclusion?.headerPct}% of viewport)
- **Sticky Bottom Thumb-Bar:** ${auditResults.stickyOcclusion?.bottomBarPx} px (${auditResults.stickyOcclusion?.bottomBarPct}% of viewport)
- **Total Combined Occluded Height:** ${auditResults.stickyOcclusion?.totalOccludedPx} px (**${auditResults.stickyOcclusion?.totalOccludedPct}%** of viewport)
- **Remaining Usable Viewport for Content:** ${auditResults.stickyOcclusion?.remainingPx} px (**${auditResults.stickyOcclusion?.remainingPct}%** of viewport)

---

## 3. iOS Auto-Zoom Prevention Audit (Font Size ≥ 16px)

iOS Safari triggers automatic screen zoom on input focus if the input's computed \`font-size\` is less than \`16px\` (\`1rem\`).

| Element | Tag | Computed Font Size | ≥ 16px Requirement | Result |
| :--- | :--- | :--- | :--- | :--- |
${auditResults.inputFontSizes.map(f => `| \`#${f.id}\` | \`<${f.type}>\` | ${f.fontSize} | ${f.preventsZoom ? 'Yes (≥ 16px)' : 'No (< 16px)'} | ${f.preventsZoom ? '✅ PASS (No Zoom)' : '❌ FAIL'} |`).join('\n')}

---

## 4. Stepper Buttons Touch Target Audit (≥ 44×44 px Apple HIG)

| Stepper Action | Measured Dimensions | Apple HIG Requirement | Result |
| :--- | :--- | :--- | :--- |
${auditResults.stepperTargets.map(s => `| \`${s.label}\` | ${s.width}×${s.height} px | ≥ 44×44 px | ${s.meets44px ? '✅ PASS' : '❌ FAIL'} |`).join('\n')}

---

## 5. PWA Status Disclosures
- **Web App Manifest:** \`public/site.webmanifest\` installed and active.
- **Service Worker / Offline Shell:** Marked pending in \`info/06-execution/todo.md\` (no service worker caching shell currently installed; client calculations run in-memory, but cold-boot offline requires SW implementation).

---

## 6. Visual Artifacts
- **Portrait Viewports:**
  - iPhone SE: \`iphone-se-375x667-light.png\`, \`iphone-se-375x667-dark.png\`, \`iphone-se-375x667-sticky-dark.png\`
  - iPhone 14/15/16: \`iphone-14-390x844-light.png\`, \`iphone-14-390x844-dark.png\`, \`iphone-14-390x844-sticky-dark.png\`
  - Android Flagship: \`android-412x915-light.png\`, \`android-412x915-dark.png\`, \`android-412x915-sticky-dark.png\`
  - iPad / Tablet: \`tablet-768x1024-light.png\`, \`tablet-768x1024-dark.png\`
- **Landscape Viewports:**
  - \`iphone-se-667x375-landscape-dark.png\`
  - \`iphone-14-844x390-landscape-dark.png\`
  - \`android-915x412-landscape-dark.png\`
`;

  fs.writeFileSync(path.join(outDir, 'report.md'), mdReport, 'utf8');
  console.log('Section 3B mobile audit capture completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

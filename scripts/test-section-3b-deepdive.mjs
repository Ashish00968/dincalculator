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
  const port = 4334;
  const server = await createStaticServer(distDir, port);
  const outDir = path.resolve('info/06-execution/verification/3b-mobile');
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  console.log('=== 1. LANDSCAPE VIEWPORT AUDIT ===');
  const landscapeViewports = [
    { name: 'iphone-se-667x375-landscape', width: 667, height: 375, device: 'iPhone SE Landscape (667×375)' },
    { name: 'iphone-14-844x390-landscape', width: 844, height: 390, device: 'iPhone 14/15/16 Landscape (844×390)' },
    { name: 'android-915x412-landscape', width: 915, height: 412, device: 'Android Flagship Landscape (915×412)' },
  ];

  const landscapeResults = [];

  for (const vp of landscapeViewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

    // Measure overflow
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

    // Capture screenshot in landscape (light and dark)
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-light.png`) });

    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-dark.png`) });

    // Scrolled view
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(outDir, `${vp.name}-scrolled-dark.png`) });

    landscapeResults.push({
      device: vp.device,
      width: vp.width,
      height: vp.height,
      overflow,
      status: !overflow.hasOverflow ? 'PASS' : 'FAIL',
    });

    await context.close();
  }

  console.log('=== 2. STICKY HEADER + RESULT BAR VIEWPORT HEIGHT MEASUREMENT ===');
  // Measure on iPhone SE Portrait (375x667)
  const seContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const sePage = await seContext.newPage();
  await sePage.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

  // Scroll down so sticky bottom bar and sticky top header are both active
  await sePage.evaluate(() => window.scrollBy(0, 600));
  await sePage.waitForTimeout(400);

  const stickyMetricsPortrait = await sePage.evaluate(() => {
    const header = document.querySelector('header.sticky');
    const bottomBar = document.querySelector('div.fixed.bottom-0');
    
    const headerRect = header ? header.getBoundingClientRect() : null;
    const bottomBarRect = bottomBar ? bottomBar.getBoundingClientRect() : null;
    const vpHeight = window.innerHeight;
    const vpWidth = window.innerWidth;

    const headerH = headerRect ? Math.round(headerRect.height * 10) / 10 : 0;
    const bottomBarH = bottomBarRect ? Math.round(bottomBarRect.height * 10) / 10 : 0;
    const combinedH = Math.round((headerH + bottomBarH) * 10) / 10;
    const combinedPct = Math.round((combinedH / vpHeight) * 1000) / 10;
    const remainingH = vpHeight - combinedH;
    const remainingPct = Math.round((remainingH / vpHeight) * 1000) / 10;

    return {
      viewport: { width: vpWidth, height: vpHeight },
      header: {
        selector: 'header.sticky',
        heightPx: headerH,
        percentOfViewport: Math.round((headerH / vpHeight) * 1000) / 10,
        rect: headerRect,
      },
      bottomBar: {
        selector: 'div.fixed.bottom-0',
        heightPx: bottomBarH,
        percentOfViewport: Math.round((bottomBarH / vpHeight) * 1000) / 10,
        rect: bottomBarRect,
      },
      combined: {
        totalOccludedPx: combinedH,
        totalOccludedPercent: combinedPct,
        remainingViewportPx: remainingH,
        remainingViewportPercent: remainingPct,
      }
    };
  });

  // Measure also on iPhone SE Landscape (667x375)
  await sePage.setViewportSize({ width: 667, height: 375 });
  await sePage.evaluate(() => window.scrollBy(0, 600));
  await sePage.waitForTimeout(300);

  const stickyMetricsLandscape = await sePage.evaluate(() => {
    const header = document.querySelector('header.sticky');
    const bottomBar = document.querySelector('div.fixed.bottom-0');
    
    const headerRect = header ? header.getBoundingClientRect() : null;
    const bottomBarRect = bottomBar ? bottomBar.getBoundingClientRect() : null;
    const vpHeight = window.innerHeight;
    const vpWidth = window.innerWidth;

    const headerH = headerRect ? Math.round(headerRect.height * 10) / 10 : 0;
    const bottomBarH = bottomBarRect ? Math.round(bottomBarRect.height * 10) / 10 : 0;
    const combinedH = Math.round((headerH + bottomBarH) * 10) / 10;
    const combinedPct = Math.round((combinedH / vpHeight) * 1000) / 10;
    const remainingH = vpHeight - combinedH;
    const remainingPct = Math.round((remainingH / vpHeight) * 1000) / 10;

    return {
      viewport: { width: vpWidth, height: vpHeight },
      header: {
        heightPx: headerH,
        percentOfViewport: Math.round((headerH / vpHeight) * 1000) / 10,
      },
      bottomBar: {
        heightPx: bottomBarH,
        percentOfViewport: Math.round((bottomBarH / vpHeight) * 1000) / 10,
      },
      combined: {
        totalOccludedPx: combinedH,
        totalOccludedPercent: combinedPct,
        remainingViewportPx: remainingH,
        remainingViewportPercent: remainingPct,
      }
    };
  });

  await seContext.close();

  console.log('=== 3. SITE-WIDE TOUCH-TARGET AUDIT ===');
  const pagesToAudit = [
    { name: 'Home (/)', path: '/' },
    { name: 'DIN Chart (/din-chart/)', path: '/din-chart/' },
    { name: 'BSL Guide (/bsl-guide/)', path: '/bsl-guide/' },
    { name: 'Skier Types (/skier-types/)', path: '/skier-types/' },
    { name: 'About (/about/)', path: '/about/' },
    { name: 'Terms (/terms/)', path: '/terms/' },
    { name: 'Contact (/contact/)', path: '/contact/' },
    { name: 'Methodology (/methodology/)', path: '/methodology/' },
    { name: 'Kids DIN Chart (/kids-din-chart/)', path: '/kids-din-chart/' },
    { name: 'Skier Type Quiz (/skier-type-quiz/)', path: '/skier-type-quiz/' },
  ];

  const touchAuditContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const touchPage = await touchAuditContext.newPage();
  const siteTouchResults = [];

  for (const p of pagesToAudit) {
    await touchPage.goto(`http://localhost:${port}${p.path}`, { waitUntil: 'networkidle' });
    const pageTargets = await touchPage.evaluate((pageTitle) => {
      // Find all interactive elements
      const elements = Array.from(document.querySelectorAll('a[href], button, input, select, textarea, summary, [role="button"], [tabindex="0"]'));
      
      const results = [];
      for (const el of elements) {
        // Check if visible
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
          continue;
        }
        const rect = el.getBoundingClientRect();
        // Ignore 0x0 or off-screen hidden elements
        if (rect.width === 0 && rect.height === 0) continue;

        const text = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || el.id || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 30);
        const w = Math.round(rect.width * 10) / 10;
        const h = Math.round(rect.height * 10) / 10;
        
        // WCAG standards:
        // Level AAA / Apple HIG: >= 44x44
        // Level AA SC 2.5.8 (Target Size Minimum): >= 24x24 px (or inline text link)
        const isInlineText = el.tagName === 'A' && (style.display === 'inline' || el.closest('p, li, dd, blockquote'));
        const meetsAppleHig = w >= 44 && h >= 44;
        const meetsWcag22Minimum = (w >= 24 && h >= 24) || isInlineText;

        results.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          role: el.getAttribute('role') || null,
          text,
          width: w,
          height: h,
          isInlineText,
          meetsAppleHig,
          meetsWcag22Minimum,
        });
      }
      return {
        page: pageTitle,
        totalInteractive: results.length,
        items: results,
      };
    }, p.name);

    siteTouchResults.push(pageTargets);
  }
  await touchAuditContext.close();

  console.log('=== 4. PWA OFFLINE TOGGLE AUDIT ===');
  const pwaContext = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const pwaPage = await pwaContext.newPage();

  // Step A: Load page online
  await pwaPage.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });

  // Check service worker registrations in browser
  const swRegistrations = await pwaPage.evaluate(async () => {
    if (!('serviceWorker' in navigator)) {
      return { supported: false, registrations: [] };
    }
    const regs = await navigator.serviceWorker.getRegistrations();
    return {
      supported: true,
      count: regs.length,
      registrations: regs.map(r => ({
        scope: r.scope,
        active: !!r.active,
        installing: !!r.installing,
        waiting: !!r.waiting,
      }))
    };
  });

  // Step B: Test client-side interactivity while online
  const initialDin = await pwaPage.$eval('#calculator-result', el => el ? el.innerText : '').catch(() => '');

  // Step C: Toggle network offline
  await pwaContext.setOffline(true);
  console.log('Browser context set to OFFLINE.');

  // Step D: Test if client-side calculator still functions offline
  let offlineCalculationWorks = false;
  let offlineDinResult = '';
  try {
    // Fill new weight to verify calculation
    const weightInput = await pwaPage.$('#calc-weight-input');
    if (weightInput) {
      await weightInput.fill('85');
      await pwaPage.waitForTimeout(300);
      offlineDinResult = await pwaPage.$eval('#calculator-result', el => el ? el.innerText : '').catch(() => '');
      offlineCalculationWorks = true;
    }
  } catch (e) {
    offlineCalculationWorks = false;
  }

  // Step E: Test offline page reload / navigation
  let offlineReloadSucceeded = false;
  let offlineReloadError = null;
  try {
    await pwaPage.reload({ waitUntil: 'networkidle', timeout: 3000 });
    offlineReloadSucceeded = true;
  } catch (err) {
    offlineReloadSucceeded = false;
    offlineReloadError = err.message;
  }

  await pwaContext.close();

  const pwaReport = {
    serviceWorker: swRegistrations,
    offlineInteractiveCalculation: {
      works: offlineCalculationWorks,
      dinResultBefore: initialDin ? 'Active' : 'Empty',
      dinResultAfterInput: offlineDinResult ? 'Updated' : 'Unchanged',
      description: 'Calculator engine runs in-memory JavaScript without network calls once initial bundle is loaded.',
    },
    offlineReloadOrNavigation: {
      succeeded: offlineReloadSucceeded,
      errorMessage: offlineReloadError,
      technicalReality: swRegistrations.count === 0 
        ? 'FAILED: No Service Worker is registered to intercept fetch requests or serve precached HTML shells. Browser reports net::ERR_INTERNET_DISCONNECTED.'
        : 'Service worker handled offline request.',
    },
  };

  await browser.close();
  server.close();

  // Save full audit data to JSON
  const fullData = {
    timestamp: new Date().toISOString(),
    landscapeViewports: landscapeResults,
    stickyMetrics: {
      portrait_375x667: stickyMetricsPortrait,
      landscape_667x375: stickyMetricsLandscape,
    },
    touchTargets: siteTouchResults,
    pwaOffline: pwaReport,
  };

  fs.writeFileSync(
    path.join(outDir, 'mobile-deep-dive-results.json'),
    JSON.stringify(fullData, null, 2),
    'utf8'
  );

  console.log('Mobile deep dive audit completed successfully!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

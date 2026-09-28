#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_DOMAIN = 'https://dincalculatorpro.com';

if (!fs.existsSync(DIST_DIR)) {
  console.error(`Error: dist directory does not exist at ${DIST_DIR}. Run "astro build" first.`);
  process.exit(1);
}

// Find all HTML files recursively in dist/
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(DIST_DIR);
console.log(`Scanning ${htmlFiles.length} HTML files in dist/ for SEO compliance...\n`);

const failures = [];
const pageData = new Map();

// Helper to derive expected path from file path
function getRoutePath(filePath) {
  const rel = path.relative(DIST_DIR, filePath);
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404/';
  if (rel === '500.html') return '/500/';
  if (rel.endsWith('/index.html')) {
    return '/' + rel.slice(0, -'/index.html'.length) + '/';
  }
  return '/' + rel;
}

// Pass 1: Parse all pages
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const route = getRoutePath(file);
  const isErrorPage = route === '/404/' || route === '/500/';

  // 1. <title>
  const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // 2. meta description
  const metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                        content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : null;

  // 3. <h1>
  const h1Matches = [...content.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1Count = h1Matches.length;

  // 4. canonical
  const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i) ||
                        content.match(/<link\s+href=["']([^"']*)["']\s+rel=["']canonical["']/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

  // 5. og:image
  const ogImageMatch = content.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']*)["']/i) ||
                       content.match(/<meta\s+content=["']([^"']*)["']\s+property=["']og:image["']/i);
  const ogImage = ogImageMatch ? ogImageMatch[1].trim() : null;

  // 6. hreflang
  const hreflangMatches = [...content.matchAll(/<link\s+rel=["']alternate["']\s+hreflang=["']([^"']*)["']\s+href=["']([^"']*)["']/gi)];
  const alternates = new Map();
  for (const m of hreflangMatches) {
    alternates.set(m[1].toLowerCase(), m[2]);
  }

  // 7. internal links
  const linkMatches = [...content.matchAll(/<a\s+[^>]*href=["']([^"']*)["']/gi)];
  const internalLinks = [];
  for (const m of linkMatches) {
    const href = m[1].trim();
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }
    if (href.startsWith('http://') || (href.startsWith('https://') && !href.startsWith(BASE_DOMAIN))) {
      continue; // External
    }
    // Static asset files are exempt from trailing slash requirement
    const isAsset = /\.(png|jpe?g|webp|svg|ico|webmanifest|xml|txt|pdf|css|js)$/i.test(href.split('?')[0]);
    if (!isAsset) {
      internalLinks.push(href);
    }
  }

  pageData.set(route, {
    file,
    route,
    title,
    metaDesc,
    h1Count,
    canonical,
    ogImage,
    alternates,
    internalLinks,
    isErrorPage
  });
}

// Pass 2: Validate rules per page
for (const [route, data] of pageData.entries()) {
  const issues = [];

  // Check 1: <title>
  if (!data.title) {
    issues.push('Missing <title>');
  } else if (data.title.length > 65) {
    issues.push(`Title too long (${data.title.length} chars > 65): "${data.title.slice(0, 45)}..."`);
  }

  // Check 2: Meta description
  if (!data.metaDesc) {
    issues.push('Missing meta description');
  } else if (data.metaDesc.length < 110 || data.metaDesc.length > 165) {
    issues.push(`Meta description length outside 110-165 chars (${data.metaDesc.length} chars)`);
  }

  // Check 3: Exactly one <h1>
  if (data.h1Count === 0) {
    issues.push('Missing <h1>');
  } else if (data.h1Count > 1) {
    issues.push(`Multiple <h1> tags (${data.h1Count})`);
  }

  // Check 4: Self-referencing canonical ending in '/'
  const expectedCanonical = BASE_DOMAIN + route;
  if (!data.canonical) {
    issues.push('Missing canonical tag');
  } else {
    if (!data.canonical.endsWith('/')) {
      issues.push(`Canonical does not end with '/': ${data.canonical}`);
    }
    if (data.canonical !== expectedCanonical) {
      issues.push(`Canonical not self-referencing. Expected ${expectedCanonical}, got ${data.canonical}`);
    }
  }

  // Check 5: og:image ending in .svg
  if (data.ogImage && data.ogImage.endsWith('.svg')) {
    issues.push(`og:image ends in .svg: ${data.ogImage}`);
  }

  // Check 6: Internal links without trailing slash
  const badLinks = data.internalLinks.filter(href => {
    const clean = href.split('?')[0].split('#')[0];
    return !clean.endsWith('/');
  });
  if (badLinks.length > 0) {
    const sample = badLinks.slice(0, 3).join(', ');
    issues.push(`Internal links without trailing slash (${badLinks.length}): ${sample}`);
  }

  // Check 7: Reciprocal hreflang
  for (const [lang, altHref] of data.alternates.entries()) {
    if (lang === 'x-default') continue;
    try {
      const altUrl = new URL(altHref);
      const altRoute = altUrl.pathname;
      const targetPage = pageData.get(altRoute);
      if (!targetPage) {
        issues.push(`Hreflang points to non-existent route: ${altHref} (${lang})`);
      } else {
        // Find if targetPage has reciprocal link back to this page
        let reciprocal = false;
        for (const [tLang, tHref] of targetPage.alternates.entries()) {
          const tUrl = new URL(tHref);
          if (tUrl.pathname === route) {
            reciprocal = true;
            break;
          }
        }
        if (!reciprocal) {
          issues.push(`Hreflang link to ${altHref} is not reciprocal`);
        }
      }
    } catch {
      issues.push(`Invalid hreflang URL: ${altHref}`);
    }
  }

  if (issues.length > 0) {
    failures.push({
      route,
      issues
    });
  }
}

// Print results table
if (failures.length > 0) {
  console.log(`\n❌ SEO Checks Failed on ${failures.length} of ${htmlFiles.length} pages:`);
  console.log('='.repeat(100));
  for (const f of failures) {
    console.log(`\n📄 URL: ${f.route}`);
    for (const issue of f.issues) {
      console.log(`   - ⚠️  ${issue}`);
    }
  }
  console.log('\n' + '='.repeat(100));
  console.log(`Total pages with issues: ${failures.length}`);
  console.log(`Summary of known audit issues to be addressed in Phases 1-3.`);
  process.exit(1);
} else {
  console.log(`\n✅ All ${htmlFiles.length} pages passed SEO compliance checks!`);
  process.exit(0);
}

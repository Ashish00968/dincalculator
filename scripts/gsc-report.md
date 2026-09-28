# Weekly Google Search Console (GSC) Reporting Guide

This document details the standard operating procedure for the weekly 30-minute SEO, indexing, and traffic monitoring routine for `dincalculatorpro.com`.

---

## 1. Human Weekly Export Workflow (Every Monday, ~15 mins)

### Step 1: Open Google Search Console
Log in to [Google Search Console](https://search.google.com/search-console) and ensure the domain property `dincalculatorpro.com` is selected.

### Step 2: Export Performance Data
1. Navigate to **Performance** &rarr; **Search results**.
2. Set date filter:
   - Mode: **Compare**
   - Filter: **Compare last 7 days to previous period** (or **Last 7 days** if comparison is noisy).
   - Search type: **Web**.
3. In the top-right corner, click **Export** &rarr; **Download CSV**.
4. Create a new directory in your local workspace:
   ```bash
   mkdir -p info/06-execution/reports/YYYY-MM-DD/
   ```
   *(Example: `info/06-execution/reports/2026-10-05/`)*
5. Extract the downloaded ZIP and copy `Queries.csv`, `Pages.csv`, `Countries.csv`, and `Devices.csv` into this directory.

### Step 3: Inspect Indexing Health
1. Navigate to **Indexing** &rarr; **Pages**.
2. Review the list of reasons why pages are "Not indexed":
   - **Page with redirect**: Verify that legacy URLs like `/iso-11088-chart/` redirect with 301.
   - **Excluded by 'noindex' tag**: Verify that only non-Tier-1 languages (`es`, `sv`, `no`, etc.) and `/embed/` are marked noindex.
   - Check for unexpected 404s, 500s, or "Discovered - currently not indexed".

### Step 4: Check Links (Referring Domains)
1. Navigate to **Links**.
2. Note any new domains listed under **Top linking sites**.
3. Cross-reference new links with `info/06-execution/outreach.csv` and mark their status as `linked`.

### Step 5: Check Core Web Vitals & Experience
1. Navigate to **Experience** &rarr; **Core Web Vitals**.
2. Confirm that 100% of URLs remain in the green "Good" band for both Mobile and Desktop (LCP < 2.5s, CLS < 0.1, INP < 200ms).

---

## 2. Agent Weekly Analysis Prompt

Once the CSVs are placed in `info/06-execution/reports/YYYY-MM-DD/`, run this prompt with your coding assistant:

```text
WEEKLY REVIEW. Read the newest CSVs in info/06-execution/reports/. Compare with last week.
Produce info/06-execution/reports/YYYY-MM-DD/summary.md:
1. Performance Metrics: Clicks, impressions, CTR, average position (and WoW delta).
2. Opportunity List: Queries gaining impressions (>= 3) but ranking with position > 10.
3. CTR Optimization Candidates: Pages with substantial impressions but CTR < 1% (respecting the 4-week rule).
4. Content Gaps: Relevant skiing queries where no matching authoritative page currently exists.
5. Indexing Issues: Any crawl, redirect, or coverage anomalies.
6. Authority / Links: New referring domains detected.
7. CWV Status: Core Web Vitals status.
8. Action Plan: Recommend at most 3 specific actions for next week, ordered by impact vs. effort. Do NOT propose changing any title or H1 modified in the last 4 weeks. Update todo.md.
```

---

## 3. Strict Operating Rules

> [!IMPORTANT]
> **The 4-Week Title / Metadata Rule**: Never modify a title tag, meta description, or H1 that has been altered within the previous 4 weeks. Search engine algorithms need 2 to 4 weeks to establish baseline click-through performance. Rapid oscillation destroys search rankings.

- **Check `changelog-seo.md` First**: Before making any metadata adjustments, consult `info/06-execution/changelog-seo.md` to verify the last modification date.
- **Log Every SEO Edit**: Any change to titles, metas, H1s, or canonicals must be logged in `info/06-execution/changelog-seo.md`.
- **Zero Spam**: Never purchase backlinks, engage in automated forum spam, or build doorway pages.

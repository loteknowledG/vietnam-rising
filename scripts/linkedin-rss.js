#!/usr/bin/env node
/*
 Playwright-based LinkedIn job search -> RSS exporter

 Usage:
  LINKEDIN_EMAIL=you@example.com LINKEDIN_PASS=secret SEARCH_URL="https://www.linkedin.com/jobs/search/?keywords=software%20engineer&location=Vietnam" node scripts/linkedin-rss.js

 Notes:
 - This script requires Playwright and its browsers installed: `npm install playwright` and `npx playwright install`.
 - Storing credentials in env vars is recommended. Cookies are saved to `.auth/cookies.json` for reuse.
 - Run locally only and accept responsibility for complying with LinkedIn terms.
*/

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const EMAIL = process.env.LINKEDIN_EMAIL;
const PASS = process.env.LINKEDIN_PASS;
const SEARCH_URL = process.env.SEARCH_URL || process.env.SEARCH || 'https://www.linkedin.com/jobs';
const OUT = process.env.OUT || path.resolve(process.cwd(), 'feed.xml');
const COOKIE_DIR = path.resolve(process.cwd(), '.auth');
const COOKIE_FILE = path.join(COOKIE_DIR, 'cookies.json');

if (!EMAIL || !PASS) {
  console.error('Missing LINKEDIN_EMAIL or LINKEDIN_PASS environment variables.');
  process.exit(2);
}

async function saveCookies(context) {
  try {
    const cookies = await context.cookies();
    await fs.promises.mkdir(COOKIE_DIR, { recursive: true });
    await fs.promises.writeFile(COOKIE_FILE, JSON.stringify(cookies, null, 2));
  } catch (e) {
    console.warn('Could not save cookies:', e.message);
  }
}

async function loadCookies(context) {
  try {
    if (fs.existsSync(COOKIE_FILE)) {
      const data = await fs.promises.readFile(COOKIE_FILE, 'utf8');
      const cookies = JSON.parse(data);
      await context.addCookies(cookies);
      return true;
    }
  } catch (e) {
    console.warn('Could not load cookies:', e.message);
  }
  return false;
}

function toRss(items, title, link) {
  const now = new Date().toUTCString();
  const channelTitle = `LinkedIn Jobs: ${title || ''}`.trim();
  const itemsXml = items.map(i => `  <item>\n    <title>${escapeXml(i.title || '')}</title>\n    <link>${escapeXml(i.link || '')}</link>\n    <description>${escapeXml(i.description || (i.company || ''))}</description>\n    <pubDate>${escapeXml(i.pubDate || now)}</pubDate>\n  </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>${escapeXml(channelTitle)}</title>\n  <link>${escapeXml(link || SEARCH_URL)}</link>\n  <description>LinkedIn job search export</description>\n  <lastBuildDate>${now}</lastBuildDate>\n${itemsXml}\n</channel>\n</rss>`;
}

function escapeXml(str) {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function scrape() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Try load cookies to reuse session
  await loadCookies(context);

  const page = await context.newPage();

  // If not logged in, perform login
  await page.goto('https://www.linkedin.com/login', { waitUntil: 'networkidle' });
  if (page.url().includes('/login')) {
    await page.fill('input#username', EMAIL);
    await page.fill('input#password', PASS);
    await Promise.all([
      page.click('button[type=submit]'),
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
    ]);
  }

  // Navigate to search URL
  await page.goto(SEARCH_URL, { waitUntil: 'networkidle' });

  // attempt to select job result nodes via multiple selector fallbacks
  const selectors = [
    'ul.jobs-search__results-list li',
    '.jobs-search-results__list-item',
    'a.base-card__full-link',
    'div.job-card-container__link'
  ];

  let nodes = [];
  for (const sel of selectors) {
    nodes = await page.$$(sel);
    if (nodes && nodes.length > 0) break;
  }

  const items = [];
  for (const node of nodes.slice(0, 40)) {
    try {
      const title = (await node.$eval('h3, .base-search-card__title, .job-card-list__title', n => n.innerText.trim()).catch(() => null)) || '';
      const company = (await node.$eval('.base-search-card__subtitle, .job-card-container__company-name, .job-card-list__company-name', n => n.innerText.trim()).catch(() => null)) || '';
      const link = (await node.$eval('a, .base-card__full-link', n => n.href).catch(() => null)) || '';
      const location = (await node.$eval('.job-search-card__location, .job-card-container__metadata-item', n => n.innerText.trim()).catch(() => null)) || '';
      const snippet = (await node.$eval('.job-card-list__snippet, .job-description, p', n => n.innerText.trim()).catch(() => null)) || '';
      items.push({ title, company: company + (location ? ' — ' + location : ''), link, description: snippet, pubDate: new Date().toUTCString() });
    } catch (e) {
      continue;
    }
  }

  // Save cookies for next run
  await saveCookies(context);
  await browser.close();

  const rss = toRss(items, '', SEARCH_URL);
  await fs.promises.writeFile(OUT, rss, 'utf8');
  console.log('Wrote', OUT, 'with', items.length, 'items');
}

scrape().catch(err => {
  console.error('Error during scrape:', err);
  process.exit(1);
});

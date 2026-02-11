#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';

const cwd = process.cwd();

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  let files = [];
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(await walk(full));
    else if (e.isFile() && e.name.endsWith('.xml')) files.push(full);
  }
  return files;
}

function decodeEntities(s) {
  return s.replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .trim();
}

function normalizeUrl(raw) {
  const stripParams = new Set([
    'trackingId', 'refId', 'trk', 'eBP', 'alternateChannel', 'originalSubdomain', 'currentJobId'
  ]);
  let s = decodeEntities(raw);
  try {
    const u = new URL(s);
    // Remove known tracking params and utm_* params
    for (const key of Array.from(u.searchParams.keys())) {
      if (stripParams.has(key) || key.startsWith('utm_')) u.searchParams.delete(key);
    }
    // Rebuild without empty search
    return u.origin + u.pathname + (u.searchParams.toString() ? `?${u.searchParams.toString()}` : '') + (u.hash || '');
  } catch (err) {
    return s;
  }
}

async function extractFromFile(file) {
  const content = await fs.readFile(file, 'utf8');
  const items = [];

  // Channel-level link (first <link> after <channel>)
  const channelMatch = content.match(/<channel>[\s\S]*?<link>(.*?)<\/link>/i);
  const channelLink = channelMatch ? decodeEntities(channelMatch[1]) : null;

  // Item links
  const itemRe = /<item>[\s\S]*?<link>(.*?)<\/link>[\s\S]*?<\/item>/gi;
  let m;
  while ((m = itemRe.exec(content)) !== null) {
    items.push(decodeEntities(m[1]));
  }

  // Fallback: any <link> tags (avoid duplicating channel link)
  const allLinkRe = /<link>(.*?)<\/link>/gi;
  const extra = [];
  while ((m = allLinkRe.exec(content)) !== null) {
    const v = decodeEntities(m[1]);
    if (v && v !== channelLink && !items.includes(v)) extra.push(v);
  }

  return { channelLink, links: Array.from(new Set(items.concat(extra))) };
}

async function main() {
  const xmlFiles = await walk(cwd);
  if (!xmlFiles.length) {
    console.log('No XML files found.');
    process.exit(0);
  }

  const files = {};
  const all = new Set();

  for (const f of xmlFiles) {
    try {
      const rel = path.relative(cwd, f).replaceAll('\\\\', '/');
      const { channelLink, links } = await extractFromFile(f);
      files[rel] = { channelLink: channelLink ? normalizeUrl(channelLink) : null, rawLinks: links };
      for (const l of links) all.add(normalizeUrl(l));
    } catch (err) {
      console.error('Error reading', f, err.message);
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    files,
    links: Array.from(all).sort()
  };

  await fs.mkdir(path.join(cwd, 'data'), { recursive: true });
  const outPath = path.join(cwd, 'data', 'job-links.json');
  await fs.writeFile(outPath, JSON.stringify(out, null, 2), 'utf8');
  console.log(`Wrote ${out.links.length} unique links to ${outPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const targets = JSON.parse(fs.readFileSync(path.resolve('scripts/targets.json'), 'utf8'));

function escapeXml(str){
  return str.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":"&apos;"})[c]);
}

async function snapshot(url){
  // Prefer the new headless mode and try to use a local Chrome if available to avoid
  // Puppeteer/Chromium version mismatches in environments where the bundled
  // Chromium isn't installed.
  const possiblePaths = [];
  if (process.env.CHROME_PATH) possiblePaths.push(process.env.CHROME_PATH);
  // common Windows install locations
  possiblePaths.push('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe');
  possiblePaths.push('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe');

  let executablePath;
  for (const p of possiblePaths) {
    if (!p) continue;
    try { if (fs.existsSync(p)) { executablePath = p; break; } } catch(e){}
  }

  const launchOpts = {
    headless: 'new',
    args: ['--no-sandbox','--disable-setuid-sandbox']
  };
  if (executablePath) launchOpts.executablePath = executablePath;

  const browser = await puppeteer.launch(launchOpts);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  const title = await page.title();
  const desc = await page.$eval('meta[name="description"]', el => el.getAttribute('content')).catch(()=>'');
  await browser.close();
  return { url, title, description: desc };
}

async function main(){
  const items = [];
  for(const url of targets){
    try{
      process.stdout.write(`Fetching ${url}... `);
      const data = await snapshot(url);
      process.stdout.write('ok\n');
      items.push(data);
    }catch(err){
      console.error(`failed ${url}:`, err.message || err);
    }
  }

  const now = new Date().toUTCString();
  const rssItems = items.map(it=>`<item>\n<title>${escapeXml(it.title)}</title>\n<link>${escapeXml(it.url)}</link>\n<description>${escapeXml(it.description||it.title)}</description>\n<pubDate>${now}</pubDate>\n</item>`).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Auto-generated Feed</title>\n<link>https://your-site.example/</link>\n<description>Generated feed</description>\n<lastBuildDate>${now}</lastBuildDate>\n${rssItems}\n</channel>\n</rss>`;

  fs.writeFileSync('feed.xml', rss, 'utf8');
  console.log('Wrote feed.xml');
}

main().catch(err=>{ console.error(err); process.exit(1); });

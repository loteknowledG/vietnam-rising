#!/usr/bin/env node
/*
  scripts/update-jobs.js

  Convenience wrapper to update job feeds and regenerate `data/job-links.json`.
  - If LINKEDIN_EMAIL + LINKEDIN_PASS are present, runs the Playwright LinkedIn scraper first.
  - Otherwise skips the scraper and runs `extract-job-links` to rebuild link index from existing XML files.
  - Exit code is non-zero on failure.

  Usage examples:
    # run extractor only
    node scripts/update-jobs.js

    # run scraper (requires credentials in env)
    LINKEDIN_EMAIL=you@example.com LINKEDIN_PASS=secret node scripts/update-jobs.js

    # force scraper without credentials (not recommended)
    RUN_SCRAPER=1 node scripts/update-jobs.js
*/

import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'

function run(command, args, opts = {}) {
  return new Promise((resolve, reject) => {
    // Avoid `shell: true` on Windows because node executable path may contain spaces.
    const cp = spawn(command, args, { stdio: 'inherit', shell: false, ...opts })
    cp.on('error', reject)
    cp.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${command} ${args.join(' ')} exited ${code}`))))
  })
}

async function main() {
  const cwd = process.cwd()
  const linkedinEmail = process.env.LINKEDIN_EMAIL
  const linkedinPass = process.env.LINKEDIN_PASS
  const runScraperFlag = process.env.RUN_SCRAPER === '1'

  const scraperAvailable = linkedinEmail && linkedinPass

  try {
    if (scraperAvailable || runScraperFlag) {
      console.log('\n=> Running LinkedIn RSS scraper (scripts/linkedin-rss.js)')
      // This may require Playwright browsers installed and valid credentials
      await run(process.execPath, [path.join(cwd, 'scripts', 'linkedin-rss.js')], { env: process.env })
    } else {
      console.log('\n=> Skipping scraper (set LINKEDIN_EMAIL & LINKEDIN_PASS to enable)')
    }

    console.log('\n=> Rebuilding job-links index (scripts/extract-job-links.js)')
    await run(process.execPath, [path.join(cwd, 'scripts', 'extract-job-links.js')])
    // --- New: fetch configured RSS feeds and cache them under public/rss ---
    try {
      const feedsDataPath = path.join(cwd, 'product', 'sections', 'hcmc-hub', 'data.json')
      const feedsText = await fs.promises.readFile(feedsDataPath, 'utf8')
      const feedDataRaw = JSON.parse(feedsText)
      const feedUrls = (feedDataRaw?.feedUrls) ?? []

      if (feedUrls.length > 0) {
        const outDir = path.join(cwd, 'public', 'rss')
        await fs.promises.mkdir(outDir, { recursive: true })

        const localFiles = []
        for (let i = 0; i < feedUrls.length; i++) {
          const url = feedUrls[i]
          try {
            const filename = `hcmc-${i + 1}.xml`
            const outPath = path.join(outDir, filename)

            if (typeof url === 'string' && url.startsWith('/')) {
              // Local repo file (served by dev server at same path) — copy directly.
              const localPath = path.join(cwd, url.replace(/^\//, ''))
              console.log(`=> Copying local feed ${localPath} -> ${outPath}`)
              const exists = await fs.promises.stat(localPath).then(() => true).catch(() => false)
              if (!exists) {
                console.warn(`  - local feed not found: ${localPath}`)
                continue
              }
              const txt = await fs.promises.readFile(localPath, 'utf8')
              await fs.promises.writeFile(outPath, txt, 'utf8')
              localFiles.push(`/rss/${filename}`)
              console.log(`  - cached local feed to public/rss/${filename}`)
              continue
            }

            console.log(`=> Fetching feed ${url}`)
            const res = await fetch(url)
            if (!res.ok) {
              console.warn(`  - feed fetch failed: ${res.status} ${res.statusText}`)
              continue
            }
            const text = await res.text()
            await fs.promises.writeFile(outPath, text, 'utf8')
            localFiles.push(`/rss/${filename}`)
            console.log(`  - cached to public/rss/${filename}`)
          } catch (err) {
            console.warn('  - failed to fetch or copy feed', url, err.message)
          }
        }

        if (localFiles.length > 0) {
          await fs.promises.writeFile(path.join(outDir, 'feeds.json'), JSON.stringify(localFiles, null, 2), 'utf8')
          console.log('  - wrote public/rss/feeds.json')

          // --- Build persisted jobs JSON from cached RSS files (one per city/feed group) ---
          try {
            const jobsOutPath = path.join(cwd, 'public', 'data', 'live-jobs.json')
            await fs.promises.mkdir(path.dirname(jobsOutPath), { recursive: true })

            const allJobs = []
            for (const f of localFiles) {
              // localFiles entries are URLs like `/rss/hcmc-1.xml` — try multiple candidate paths
              const candidate1 = path.join(cwd, f.replace(/^[\\/]/, ''))
              const candidate2 = path.join(cwd, 'public', f.replace(/^\/+/, ''))
              const filePath = (await fs.promises.stat(candidate1).then(() => candidate1).catch(() => null)) || (await fs.promises.stat(candidate2).then(() => candidate2).catch(() => null))

              if (!filePath) {
                console.warn(`  - cached RSS file missing for parsing: ${f}`)
                continue
              }

              const xml = await fs.promises.readFile(filePath, 'utf8')

              // simple regex-based parse of <item> blocks (title, link, pubDate, description)
              const itemRe = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?(?:<pubDate>([\s\S]*?)<\/pubDate>)?[\s\S]*?(?:<description>([\s\S]*?)<\/description>)?[\s\S]*?<\/item>/gi
              let m
              while ((m = itemRe.exec(xml)) !== null) {
                const title = (m[1] || '').replace(/\s+/g, ' ').trim()
                const link = (m[2] || '').replace(/\s+/g, ' ').trim()
                const pubDate = (m[3] || '').trim()
                const description = (m[4] || '').trim()

                allJobs.push({
                  id: `persist-${Math.abs((link + title).split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0))}`,
                  title,
                  company: 'Unknown',
                  location: '',
                  postedDate: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                  platformId: 'linkedin',
                  sourceUrl: link,
                  details: description,
                  city: 'hcmc'
                })
              }
            }

            // dedupe by sourceUrl, newest-first
            const seen = new Set()
            const deduped = allJobs
              .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
              .filter((j) => {
                if (!j.sourceUrl) return false
                if (seen.has(j.sourceUrl)) return false
                seen.add(j.sourceUrl)
                return true
              })

            await fs.promises.writeFile(jobsOutPath, JSON.stringify(deduped, null, 2), 'utf8')
            console.log('  - wrote persisted jobs to public/data/live-jobs.json')
          } catch (err) {
            console.warn('  - failed to build persisted jobs JSON:', err.message)
          }
        }
      }
    } catch (err) {
      console.warn('Failed to cache RSS feeds locally:', err.message)
    }
    console.log('\n✅ update-jobs completed — job-links.json regenerated')
  } catch (err) {
    console.error('\n❌ update-jobs failed:', err.message)
    process.exit(1)
  }
}

main()

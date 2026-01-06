import type { City, Job } from '@/../product/sections/hcmc-hub/types'

const DEFAULT_VIBES = [
    'High-Trust Product Team',
    'Fast-Moving Startup',
    'Enterprise Delivery',
    'Design-Led Engineering',
    'Async Remote-First',
    'High-Performance Systems',
    'Developer Experience Focus',
    'Customer-Obsessed Squad'
] as const

function getTextContent(parent: Element, selector: string): string {
    const el = parent.querySelector(selector)
    return (el?.textContent ?? '').trim()
}

function stableHash(input: string): number {
    // Simple deterministic hash for UI-only derived fields.
    let hash = 0
    for (let i = 0; i < input.length; i++) {
        hash = (hash * 31 + input.charCodeAt(i)) | 0
    }
    return Math.abs(hash)
}

function formatPostedDate(pubDate: string): string {
    const dt = new Date(pubDate)
    if (Number.isNaN(dt.getTime())) return pubDate

    return dt.toLocaleDateString(undefined, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function extractCompanyAndRole(rawTitle: string): { company: string; title: string; locationFromTitle?: string } {
    const title = rawTitle.replace(/\s+/g, ' ').trim()

    // Common LinkedIn RSS pattern: "Company hiring Role in Location"
    const hiringMatch = title.match(/^(.*?)\s+hiring\s+(.*?)\s+in\s+(.*)$/i)
    if (hiringMatch) {
        return {
            company: hiringMatch[1].trim(),
            title: hiringMatch[2].trim(),
            locationFromTitle: hiringMatch[3].trim()
        }
    }

    // Fallback: try "Role at Company" (less common)
    const atMatch = title.match(/^(.*?)\s+at\s+(.*?)$/i)
    if (atMatch) {
        return {
            company: atMatch[2].trim(),
            title: atMatch[1].trim()
        }
    }

    // Fallback: try "Role - Company" or "Role | Company" patterns
    const dashMatch = title.match(/^(.*?)\s+[-•|]\s+(.*?)$/)
    if (dashMatch) {
        return {
            company: dashMatch[2].trim(),
            title: dashMatch[1].trim()
        }
    }

    return {
        company: 'Unknown',
        title
    }
}

function normalizeLocation(candidate: string): string {
    const cleaned = candidate.replace(/\s+/g, ' ').trim()

    // Keep it simple for the UI card.
    if (/ho chi minh/i.test(cleaned) || /hcmc/i.test(cleaned)) return 'Ho Chi Minh City'

    // Strip common suffixes to avoid overly long labels.
    return cleaned
        .replace(/\s+Metropolitan Area$/i, '')
        .replace(/\s*,\s*Vietnam$/i, '')
        .slice(0, 48)
}

function isLikelyItviecJobUrl(url: string): boolean {
    try {
        const u = new URL(url)
        if (u.hostname !== 'itviec.com') return false
        if (!u.pathname.startsWith('/it-jobs/')) return false

        // Job pages tend to end with a numeric ID suffix (e.g. "...-5235").
        return /-\d{3,6}$/.test(u.pathname)
    } catch {
        return false
    }
}

function inferPlatformId(feedUrl: string): Job['platformId'] {
    try {
        const u = new URL(feedUrl)
        if (u.hostname.includes('rss.app')) {
            // Best-effort: infer from common sources in feed URLs.
            // ITViec RSS.app feeds often point at itviec.com in <channel><link>.
            return 'linkedin'
        }
    } catch {
        // ignore
    }

    return 'linkedin'
}

export async function fetchTopJobsFromRssFeed(params: {
    feedUrl: string
    city: City
    maxJobs?: number
    platformId?: Job['platformId']
}): Promise<Job[]> {
    const { feedUrl, city, maxJobs = city.totalFloors, platformId = inferPlatformId(feedUrl) } = params

    // Note: RSS.app may not send permissive CORS headers in all environments.
    // In that case, this will throw and callers should fall back to sample data.
    const res = await fetch(feedUrl, {
        method: 'GET',
        headers: {
            Accept: 'application/rss+xml, application/xml, text/xml'
        }
    })

    if (!res.ok) {
        throw new Error(`RSS fetch failed: ${res.status} ${res.statusText}`)
    }

    const xmlText = await res.text()
    const doc = new DOMParser().parseFromString(xmlText, 'text/xml')

    const parserError = doc.querySelector('parsererror')
    if (parserError) {
        throw new Error('RSS parse failed: invalid XML')
    }

    const itemEls = Array.from(doc.querySelectorAll('channel > item'))

    const rawItems = itemEls
        .map((itemEl) => {
            const guid = getTextContent(itemEl, 'guid')
            const title = getTextContent(itemEl, 'title')
            const link = getTextContent(itemEl, 'link')
            const pubDate = getTextContent(itemEl, 'pubDate')

            return { guid, title, link, pubDate }
        })
        .filter((it) => it.title && it.link)

    // If this is an ITViec feed, drop non-job links (tag pages, category pages, etc.).
    const filteredItems = feedUrl.includes('rss.app')
        ? rawItems.filter((it) => {
              if (it.link.includes('itviec.com')) return isLikelyItviecJobUrl(it.link)
              return true
          })
        : rawItems

    // Sort newest first using pubDate when available.
    filteredItems.sort((a, b) => {
        const ta = new Date(a.pubDate).getTime()
        const tb = new Date(b.pubDate).getTime()
        if (Number.isNaN(ta) && Number.isNaN(tb)) return 0
        if (Number.isNaN(ta)) return 1
        if (Number.isNaN(tb)) return -1
        return tb - ta
    })

    const selected = filteredItems.slice(0, maxJobs)

    return selected.map((item, idx) => {
        const parsed = extractCompanyAndRole(item.title)
        const idSeed = item.guid || item.link || item.title
        const hash = stableHash(idSeed)
        const vibe = DEFAULT_VIBES[hash % DEFAULT_VIBES.length]
        const occupancy = `${70 + (hash % 29)}%`

        // Floors descend from top to bottom.
        const floorNumber = Math.max(1, city.totalFloors - idx)

        const location = normalizeLocation(parsed.locationFromTitle ?? city.name)

        return {
            id: `rss-${hash}-${idx}`,
            title: parsed.title,
            company: parsed.company,
            salary: 'Competitive',
            location,
            postedDate: formatPostedDate(item.pubDate),
            platformId,
            floorNumber,
            officeAttributes: {
                vibe,
                occupancy
            },
            sourceUrl: item.link
        } satisfies Job
    })
}

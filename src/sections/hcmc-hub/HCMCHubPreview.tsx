import data from '@/../product/sections/hcmc-hub/data.json'
import type { Job, City, Platform } from '@/../product/sections/hcmc-hub/types'
import { fetchTopJobsFromRssFeed } from '@/lib/rss-jobs'
import { HCMCHub } from './components/HCMCHub'
import { useEffect, useMemo, useState } from 'react'

/**
 * HCMC Hub Preview
 * Feeds sample data into the HCMCHub component for Design OS.
 */
export default function HCMCHubPreview() {
    // Cast data since it's imported from JSON
    const cityData = data.city as unknown as City
    const platformsData = data.platforms as unknown as Platform[]

    // Start with an empty live job list — we'll load persisted + live RSS and then merge.
    const [jobsData, setJobsData] = useState<Job[]>(() => [])
    const [persistedJobs, setPersistedJobs] = useState<Job[]>(() => [])
    const [liveFeedJobs, setLiveFeedJobs] = useState<Job[]>(() => [])

    // Load persisted server-side jobs (written by `update-jobs`) so data survives reloads.
    useEffect(() => {
        let cancelled = false
        fetch('/data/live-jobs.json')
            .then((res) => {
                if (!res.ok) throw new Error('no persisted jobs')
                return res.json()
            })
            .then((list: any[]) => {
                if (cancelled) return
                if (!Array.isArray(list)) return
                const cityJobs = list.filter((j) => j.city === (cityData.id ?? 'hcmc')) as Job[]
                if (cityJobs.length) {
                    // keep newest first and cap to queueSize
                    cityJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
                    const capped = cityJobs.slice(0, cityData.queueSize ?? 25)
                    setPersistedJobs(capped)
                }
            })
            .catch(() => {
                // no persisted jobs — continue with live fetch logic
            })

        return () => {
            cancelled = true
        }
    }, [cityData])

    // Start with feeds declared in product data, but allow a runtime-local cache at /rss/feeds.json
    const defaultFeedUrls = (data as any).feedUrls || [
        'https://rss.app/feeds/3NRkGwpUDJrBFayN.xml',
        'https://rss.app/feeds/DAwks5mDooZBAfIF.xml',
        'https://rss.app/feeds/m91YmYkroZd5nKEU.xml'
    ]

    const [feedUrlsState, setFeedUrlsState] = useState<string[]>(() => defaultFeedUrls)

    // If a local cached feed index exists (written by `update-jobs`), prefer those local files.
    useEffect(() => {
        let cancelled = false
        fetch('/rss/feeds.json')
            .then((res) => {
                if (!res.ok) throw new Error('no local cache')
                return res.json()
            })
            .then((list: string[]) => {
                if (cancelled) return
                if (Array.isArray(list) && list.length) setFeedUrlsState(list)
            })
            .catch(() => {
                // no-op; keep defaultFeedUrls
            })

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        const queueLimit = cityData.queueSize ?? 25
        const perFeedFetchLimit = Math.min(cityData.totalFloors, queueLimit)

        // Fetch from multiple feeds in parallel (limit how many items we request per feed)
        Promise.all(
            feedUrlsState.map((feedUrl) =>
                fetchTopJobsFromRssFeed({
                    feedUrl,
                    city: cityData,
                    maxJobs: perFeedFetchLimit,
                    platformId: 'itviec'
                }).catch((err) => {
                    console.warn(`Failed to fetch from ${feedUrl}:`, err)
                    return []
                })
            )
        )
            .then((feedResults) => {
                if (cancelled) return

                        // Combine all feeds and deduplicate by sourceUrl
                const allJobs = feedResults.flat()
                const seenUrls = new Set<string>()
                const uniqueJobs = allJobs.filter((job) => {
                    if (seenUrls.has(job.sourceUrl)) return false
                    seenUrls.add(job.sourceUrl)
                    return true
                })

                if (uniqueJobs.length === 0) return

                // Enforce per-feed fetch limit and reassign floor numbers for the fetched set.
                const selected = uniqueJobs.slice(0, Math.min(cityData.totalFloors, queueLimit))
                const fetchedWithFloors = selected.map((job, idx) => ({
                    ...job,
                    floorNumber: Math.max(1, cityData.totalFloors - idx)
                }))

                // Update live feed jobs state — persistedJobs is kept separate.
                setLiveFeedJobs(fetchedWithFloors)

                // merged list will be computed in the merge effect (persistedJobs + liveFeedJobs)
                // but update immediately as well for responsiveness.
                const mergedImmediate = (() => {
                    const byUrl = new Map<string, typeof fetchedWithFloors[number]>()

                    // prefer live/fetched items on duplicates
                    for (const j of fetchedWithFloors) {
                        if (j.sourceUrl) byUrl.set(j.sourceUrl, j)
                    }
                    for (const j of persistedJobs) {
                        if (j.sourceUrl && !byUrl.has(j.sourceUrl)) byUrl.set(j.sourceUrl, j)
                    }

                    const merged = Array.from(byUrl.values())
                    merged.sort((a, b) => (Date.parse(b.postedDate || '') || 0) - (Date.parse(a.postedDate || '') || 0))
                    const trimmed = merged.slice(0, Math.min(cityData.totalFloors, queueLimit))
                    return trimmed.map((job, idx) => ({ ...job, floorNumber: Math.max(1, cityData.totalFloors - idx) }))
                })()

                setJobsData(mergedImmediate)
            })
            .catch((err) => {
                // RSS feeds can fail in-browser due to CORS or network issues — do not inject sample data.
                console.warn('Failed to load live RSS jobs; keeping current live list (no sample fallback).', err)
            })

        return () => {
            cancelled = true
        }
    }, [feedUrlsState, cityData, persistedJobs])

    // Merge persisted + live feed jobs whenever either source changes.
    useEffect(() => {
        const queueLimit = cityData.queueSize ?? 25
        const byUrl = new Map<string, Job>()

        // prefer liveFeedJobs over persistedJobs when duplicates occur
        for (const j of liveFeedJobs) {
            if (j.sourceUrl) byUrl.set(j.sourceUrl, j)
        }
        for (const j of persistedJobs) {
            if (j.sourceUrl && !byUrl.has(j.sourceUrl)) byUrl.set(j.sourceUrl, j)
        }

        const merged = Array.from(byUrl.values())
        merged.sort((a, b) => (Date.parse(b.postedDate || '') || 0) - (Date.parse(a.postedDate || '') || 0))
        const trimmed = merged.slice(0, Math.min(cityData.totalFloors, queueLimit))

        // reassign floor numbers
        const withFloors = trimmed.map((job, idx) => ({ ...job, floorNumber: Math.max(1, cityData.totalFloors - idx) }))
        setJobsData(withFloors)
    }, [persistedJobs, liveFeedJobs, cityData])

    return (
        <HCMCHub
            city={cityData}
            jobs={jobsData}
            platforms={platformsData}
            persistedJobsCount={persistedJobs.length}
            liveJobsCount={liveFeedJobs.length}
            onViewSource={(url) => {
                console.log('Navigate to source:', url)
                window.open(url, '_blank')
            }}
            onFloorReached={(floor) => {
                console.log('User reached floor:', floor)
            }}
        />
    )
}

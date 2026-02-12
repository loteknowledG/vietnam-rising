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

    // Start with an empty live job list — do NOT use sample data as a visual fallback.
    const [jobsData, setJobsData] = useState<Job[]>(() => [])

    const feedUrls = useMemo(
        () => [
            'https://rss.app/feeds/3NRkGwpUDJrBFayN.xml',
            'https://rss.app/feeds/DAwks5mDooZBAfIF.xml',
            'https://rss.app/feeds/m91YmYkroZd5nKEU.xml'
        ],
        []
    )

    useEffect(() => {
        let cancelled = false

        // Fetch from multiple feeds in parallel
        Promise.all(
            feedUrls.map((feedUrl) =>
                fetchTopJobsFromRssFeed({
                    feedUrl,
                    city: cityData,
                    maxJobs: cityData.totalFloors,
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

                // Use only live RSS results (newest first). Do not inject sample data.
                const selected = uniqueJobs.slice(0, cityData.totalFloors)

                // Reassign floor numbers so newest appear at the top floors.
                const withFloors = selected.map((job, idx) => ({
                    ...job,
                    floorNumber: Math.max(1, cityData.totalFloors - idx)
                }))

                setJobsData(withFloors)
            })
            .catch((err) => {
                // RSS feeds can fail in-browser due to CORS or network issues — do not inject sample data.
                console.warn('Failed to load live RSS jobs; keeping current live list (no sample fallback).', err)
            })

        return () => {
            cancelled = true
        }
    }, [feedUrls, cityData, fallbackJobsData])

    return (
        <HCMCHub
            city={cityData}
            jobs={jobsData}
            platforms={platformsData}
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

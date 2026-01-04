import data from '@/../product/sections/danang-hub/data.json'
import type { Job, City, Platform } from '@/../product/sections/danang-hub/types'
import { DaNangHub } from './components/DaNangHub'

/**
 * Da Nang Hub Preview
 * Feeds sample data into the DaNangHub component for Design OS.
 */
export default function DaNangHubPreview() {
    console.log('RAW DATA IMPORT:', data)
    console.log('DATA TYPE:', typeof data)
    console.log('DATA KEYS:', data ? Object.keys(data) : 'NO DATA')

    const cityData = data.city as unknown as City
    const jobsData = data.jobs as unknown as Job[]
    const platformsData = data.platforms as unknown as Platform[]

    console.log('Da Nang Hub Data:', {
        city: cityData,
        jobsCount: jobsData?.length || 0,
        jobs: jobsData
    })

    return (
        <DaNangHub
            city={cityData}
            jobs={jobsData}
            platforms={platformsData}
            onViewSource={(url) => {
                console.log('Navigate to Da Nang source:', url)
                window.open(url, '_blank')
            }}
            onFloorReached={(floor) => {
                console.log('Da Nang floor reached:', floor)
            }}
        />
    )
}

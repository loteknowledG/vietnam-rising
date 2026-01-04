import data from '@/../product/sections/hanoi-hub/data.json'
import type { Job, City, Platform } from '@/../product/sections/hanoi-hub/types'
import { HanoiHub } from './components/HanoiHub'

/**
 * Hanoi Hub Preview
 * Feeds sample data into the HanoiHub component for Design OS.
 */
export default function HanoiHubPreview() {
    const cityData = data.city as unknown as City
    const jobsData = data.jobs as unknown as Job[]
    const platformsData = data.platforms as unknown as Platform[]

    return (
        <HanoiHub
            city={cityData}
            jobs={jobsData}
            platforms={platformsData}
            onViewSource={(url) => {
                console.log('Navigate to Hanoi source:', url)
                window.open(url, '_blank')
            }}
            onFloorReached={(floor) => {
                console.log('Hanoi floor reached:', floor)
            }}
        />
    )
}

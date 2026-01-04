import data from '@/../product/sections/hcmc-hub/data.json'
import type { Job, City, Platform } from '@/../product/sections/hcmc-hub/types'
import { HCMCHub } from './components/HCMCHub'

/**
 * HCMC Hub Preview
 * Feeds sample data into the HCMCHub component for Design OS.
 */
export default function HCMCHubPreview() {
    // Cast data since it's imported from JSON
    const cityData = data.city as unknown as City
    const jobsData = data.jobs as unknown as Job[]
    const platformsData = data.platforms as unknown as Platform[]

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

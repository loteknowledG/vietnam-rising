/**
 * Da Nang Hub Data Model
 * Represents the city, job listings, and platforms for the Da Nang tech scene.
 */

export interface City {
    id: string
    name: string
    skyscraper: string
    totalFloors: number
    ascentSpeed: 'slow' | 'standard' | 'fast'
}

export interface Platform {
    id: string
    name: string
    url: string
}

export interface Job {
    id: string
    title: string
    company: string
    salary: string
    location: string
    postedDate: string
    platformId: string
    floorNumber: number
    officeAttributes: {
        vibe: string
        occupancy: string
    }
    sourceUrl: string
}

export interface DaNangHubProps {
    city: City
    jobs: Job[]
    platforms: Platform[]
    onViewSource: (url: string) => void
    onFloorReached?: (floor: number) => void
}

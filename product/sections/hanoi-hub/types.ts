/**
 * Hanoi Hub Data Types
 * Generated for 'Vietnam Rising' design portfolio
 */

export interface OfficeAttributes {
    /** The atmospheric style of the office */
    vibe: string
    /** Placeholder for future occupancy visualization */
    occupancy: string
}

export interface Platform {
    /** Source ID (linkedin, itviec) */
    id: string
    /** Source display name */
    name: string
    /** Primary source URL */
    url: string
}

export interface City {
    /** City unique identifier */
    id: string
    /** City name for display */
    name: string
    /** The specific skyscraper used for the ascent animation (Landmark 72) */
    skyscraper: string
    /** Total height in floors */
    totalFloors: number
    /** Suggested scroll speed indicator */
    ascentSpeed: 'slow' | 'standard' | 'fast'
}

export interface Job {
    /** Unique listing identifier */
    id: string
    /** Professional role title */
    title: string
    /** Hiring company name */
    company: string
    /** Currency formatted salary range */
    salary: string
    /** Area/District within the city */
    location: string
    /** ISO date string or formatted date */
    postedDate: string
    /** Corresponding Platform ID */
    platformId: string
    /** The specific building floor where this job 'slides in' during ascent */
    floorNumber: number
    /** Portfolio-specific attributes for future visualization */
    officeAttributes: OfficeAttributes
    /** Direct link to the source posting */
    sourceUrl: string
}

export interface HanoiHubProps {
    /** Metadata for the Hanoi city and Landmark 72 */
    city: City
    /** Aggregated React developer jobs */
    jobs: Job[]
    /** Available job platforms */
    platforms: Platform[]
    /** Called when a user clicks 'View Job' */
    onViewSource?: (url: string) => void
    /** Called when the user scrolls past a new floor threshold */
    onFloorReached?: (floor: number) => void
}

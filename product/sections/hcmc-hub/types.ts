/**
 * HCMC Hub Data Types
 * Generated for 'Vietnam Rising' design portfolio
 */

// =============================================================================
// Data Types
// =============================================================================

export interface OfficeAttributes {
    /** The atmospheric style of the office (e.g., 'High-Tech Collaboration') */
    vibe: string
    /** Placeholder for future occupancy visualization (e.g., '85%' or 'Full') */
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
    /** The specific skyscraper used for the descent animation */
    skyscraper: string
    /** Total height in floors */
    totalFloors: number
    /** Suggested scroll speed indicator */
    descentSpeed: 'slow' | 'standard' | 'fast'
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
    /** The specific building floor where this job 'slides in' */
    floorNumber: number
    /** Portfolio-specific attributes for future visualization */
    officeAttributes: OfficeAttributes
    /** Direct link to the source posting */
    sourceUrl: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface HCMCHubProps {
    /** Metadata for the HCMC city and Landmark 81 */
    city: City
    /** Aggregated React developer jobs */
    jobs: Job[]
    /** Available job platforms for filtering/icons */
    platforms: Platform[]
    /** Called when a user clicks 'View Job' to navigate to the source */
    onViewSource?: (url: string) => void
    /** Called when the user scrolls past a new floor threshold */
    onFloorReached?: (floor: number) => void
}

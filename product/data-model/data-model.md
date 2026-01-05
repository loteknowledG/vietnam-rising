# Data Model

## Entities

### City
A major Vietnamese tech hub (HCMC, Hanoi, or Da Nang). It serves as the primary container for job listings and holds city-specific metadata like the iconic skyscraper used for parallax backgrounds.

### Job
A specific tech listing (e.g., React Developer) scraped from an external platform. It contains details like title, company name, and location.

### Platform
The originating source of the job data (e.g., LinkedIn, ITViec), used for attribution, branding, and external linking to the original job post.

## Relationships

- City has many Job
- Job belongs to City
- Platform has many Job
- Job belongs to Platform

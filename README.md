# Vietnam Job Board — Design OS Playground

This repository is a design-first job board showcasing listings for Vietnam's three major cities: Hanoi, Da Nang, and Ho Chi Minh City.

- **Cities:** Hanoi, Da Nang, Ho Chi Minh City
- **Visuals:** Each city's page uses a CSS-drawn silhouette of that city's tallest skyscraper as a background image, creating a bold backdrop for listings.
- **Design:** Neubrutal aesthetic — heavy edges, high-contrast blocks, and tactile UI elements.
- **Data collection:** Job listings are screen-scraped from public job sites using Puppeteer (headless Chromium).
- **Scraper hosting:** Scraping jobs run as containerized services on Google Cloud Run.

The project includes pre-generated XML feed files (for example `ho-chi-minh-city-metropolitan-area.xml`) used by the local previews and components under `src/sections/`.

Quick start (development):

```powershell
pnpm install
pnpm dev
```

If you want the scrapers to run, see the `cloud-functions` folder and the Puppeteer scripts; those are intended to be deployed to Google Cloud Run as containerized jobs.

Live preview: https://loteknowledg.github.io/vietnam-rising-design-os/#/hcmc

https://loteknowledg.github.io/vietnam-rising-design-os/#/hcmc

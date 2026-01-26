# Vietnam Job Board — Design OS Playground

This repository is a design-first job board showcasing listings for Vietnam's three major cities: Hanoi, Da Nang, and Ho Chi Minh City.

- **Cities:** Hanoi, Da Nang, Ho Chi Minh City
- **Visuals:** Each city's page uses a CSS-drawn silhouette of that city's tallest skyscraper as a background image, creating a bold backdrop for listings.
- **Design:** Neubrutal aesthetic — heavy edges, high-contrast blocks, and tactile UI elements.
- **Data collection:** Job listings are screen-scraped from public job sites using Puppeteer (headless Chromium).
- **Scraper hosting:** Scraping jobs run as containerized services on Google Cloud Run.

The project includes pre-generated XML feed files (for example `ho-chi-minh-city-metropolitan-area.xml`) used by the local previews and components under `src/sections/`.

Quick start (development):

# Vietnam Job Board — Design OS Playground

This repository is a design-first job board showcasing listings for Vietnam's three major cities: Hanoi, Da Nang, and Ho Chi Minh City.

- **Cities:** Hanoi, Da Nang, Ho Chi Minh City
- **Visuals:** Each city's page uses a CSS-drawn silhouette of that city's tallest skyscraper as a background image, creating a bold backdrop for listings.
- **Design:** Neubrutal aesthetic — heavy edges, high-contrast blocks, and tactile UI elements.
- **Data collection:** Job listings are screen-scraped from public job sites using Playwright (headless Chromium).
- **Scraper hosting:** Scraping jobs are intended to run as local scripts or containerized jobs in CI/cloud.

The project includes pre-generated XML feed files (for example `ho-chi-minh-city-metropolitan-area.xml`) used by the local previews and components under `src/sections/`.

Quick start (development):

```powershell
pnpm install
pnpm dev
```

If you want the scrapers to run, see `tools/linkedin-scraper` (Playwright) or the `cloud-functions` folder for previous Puppeteer experiments. The scrapers are typically run locally or in CI and write static XML/RSS files that the site consumes.

Live preview: https://loteknowledg.github.io/vietnam-rising-design-os/#/hcmc

## Jamstack workflow

This site uses a simple Jamstack workflow to produce and publish static job listing pages:

- Scraping: a Playwright-based scraper (located in `tools/linkedin-scraper`) collects job listings and writes static XML/RSS files (for example `ho-chi-minh-city-metropolitan-area.xml`).
- Commit-based publishing: the generated XML files are committed to the repository. A push to `main` triggers a GitHub Actions workflow that builds the site and publishes the `dist` folder to GitHub Pages (see `.github/workflows/deploy-pages.yml`).
- Local-first: run the scraper locally, inspect the generated XML, then commit and push to update the public site without any server-side rendering.

Security & hygiene

- Do not commit runtime browser profiles or credentials. The repository ignores the scraper runtime artifacts (`tools/linkedin-scraper/.auth`, `*.pma`, `cookies.json`) — keep them local and out of source control.
- For scheduled runs, execute the Playwright job in a trusted CI or cloud environment and commit only the generated static output.

This approach keeps the public site static, easy to host (GitHub Pages), and simple to update by changing committed files.

## Automating with GitHub Actions

You can fully automate scraping, committing generated feeds, and publishing the static site with GitHub Actions. Below is a concise overview of recommended patterns and an example workflow snippet you can adapt.

Patterns
- Scheduled scraper + commit: run the Playwright scraper on a schedule (cron), write XML/RSS files into the repo, commit and push the changes. A push to `main` then triggers the Pages build-and-deploy workflow.
- Split responsibilities: run scraping in one workflow and publishing in another. This avoids long-running singular jobs and keeps logs focused.
- Credentials & secrets: store any required credentials or personal access tokens (PAT) in repository secrets (Settings → Secrets). Do NOT commit credentials to the repo.

Important notes
- Triggering: commits pushed with the `GITHUB_TOKEN` will generally NOT trigger other workflows. If you want the push produced by the scraper to immediately trigger the Pages workflow, use a PAT stored in a secret (e.g. `PERSONAL_TOKEN`) when pushing changes.
- Commit hygiene: avoid committing browser profiles or session cookies. Keep those files in `.gitignore` (the repo already ignores `tools/linkedin-scraper/.auth`, `*.pma`, and `cookies.json`).
- Legal and rate limits: respect site terms of service and rate limits. If scheduling frequent scrapes, add appropriate delays and monitor for blocking.


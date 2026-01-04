# Application Shell Specification

## Overview
The application shell for **Vietnam Rising** uses a bold, neo-brutalist top navigation layout. It is designed to maximize the vertical space for city-specific skyscraper parallax effects while providing clear, high-contrast navigation between the HCMC, Hanoi, and Da Nang hubs.

## Navigation Structure
- **HCMC** → HCMC Hub
- **Hanoi** → Hanoi Hub
- **Da Nang** → Da Nang Hub

## User Menu
- **Location:** Top right of the header.
- **Contents:** Avatar (placeholder), user name ("Portfolio Visitor"), and a "Hire Me" call-to-action button (replaces logout).

## Layout Pattern
- **Top Navigation:** A permanent header with a stark 2px black border and vibrant lime activity indicators.
- **Content Area:** Full-width container with no horizontal padding to allow parallax backgrounds to bleed to the edges.

## Responsive Behavior
- **Desktop:** Full horizontal navigation bar.
- **Tablet:** Navigation bar persists, but labels may be shortened.
- **Mobile:** Navigation collapses into a bold, full-screen hamburger menu or a persistent bottom bar for quick city switching.

## Design Notes
- **Borders:** All elements use 2px solid black borders.
- **Shadows:** Hard "brutalist" shadows (stone-900) on the header and buttons.
- **Active State:** Active city link features a solid lime background and inverted text.

# Hanoi Hub Specification

## Overview
The Hanoi Hub features an immersive "ascent" through Landmark 72. In contrast to HCMC’s descent, users start at the ground lobby and "climb" the floors as they scroll, with Hanoi-based React developer listings sliding in to build the tower upwards, reflecting the capital's growing tech influence.

## User Flows
- **The Ascent**: User enters at the bottom (ground level). Scrolling down (visually moving "up" the tower) triggers lateral "slide-in" animations where jobs snap into place as structural floors of the building.
- **Job Discovery**: User browses a chronological list (most recent first) of Hanoi-specific React developer roles.
- **Source Link-out**: User clicks "View Job" on a listing to open the original posting on LinkedIn or ITViec in a new tab.

## UI Requirements
- **Landmark 72 Skeleton**: A vertical anchor that builds *upwards* as the user scrolls, creating a sense of progression and scale.
- **Amber/Gold Accents**: A distinct color palette (Amber-400) to distinguish the capital city from HCMC's Lime, used for activity indicators and status badges.
- **Floor-Fit Slide Animation**: Jobs slide in from the side and align with the building's architecture as the user scrolls.
- **Neo-Brutalist HUD**: Fixed city-specific stats and meta-data displayed in a high-contrast style.

## Configuration
- shell: true

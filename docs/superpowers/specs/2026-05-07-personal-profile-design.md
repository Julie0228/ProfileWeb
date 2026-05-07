# Personal Profile Web - Design Spec

**Date:** 2026-05-07
**Status:** Approved

## Overview

A single-page personal profile website built with React + TypeScript + Vite. The page features a fixed top navigation bar that switches between three sections — a business-card style home, a resume timeline, and a project gallery — all within one page without route navigation.

## Tech Stack

- React 18+ with TypeScript
- Vite as build tool
- Pure CSS for styling (no UI framework)
- No router library (single-page tab switching via state)

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root: nav state + section rendering
├── data/
│   ├── profile.ts            # Name, bio, avatar, social links
│   ├── resume.ts             # Education, experience, skills
│   └── projects.ts           # Project entries
├── sections/
│   ├── HomeSection.tsx       # Business card view
│   ├── ResumeSection.tsx     # Timeline + skills view
│   └── ProjectsSection.tsx   # Card grid view
├── components/
│   ├── NavBar.tsx            # Fixed top tab bar
│   ├── Avatar.tsx            # Profile photo
│   ├── SocialLinks.tsx       # Social link icons
│   ├── Timeline.tsx          # Timeline entries
│   ├── SkillBar.tsx          # Animated skill bar
│   └── ProjectCard.tsx       # Project card
└── styles/
    └── global.css            # Global styles + CSS variables
```

## Architecture

### Data Flow

```
profile.ts ──► HomeSection
resume.ts  ──► ResumeSection ──► Timeline, SkillBar
projects.ts ──► ProjectsSection ──► ProjectCard
```

All content is defined in TypeScript data files under `src/data/`. Components are pure presentational — they receive data via props. This makes content updates trivial: edit a data file, no component changes needed.

### Navigation

NavBar holds a `tab` state (`"home" | "resume" | "projects"`). Clicking a tab updates the state. App.tsx conditionally renders the matching section with a CSS fade transition (~300ms opacity). No URL routing.

## Component Specs

### NavBar
- Fixed to viewport top, z-index above content
- Frosted glass background: `backdrop-filter: blur(8px)` + semi-transparent bg
- Active tab indicator: underline/highlight bar, CSS transition on position change
- On scroll past 20px: add subtle box-shadow
- Responsive: hamburger menu on screens < 768px

### HomeSection
- Centered vertically and horizontally, large whitespace
- Entrance animation: avatar scales in (0→1), name fades up, bio fades in, social links appear — each staggered ~150ms
- Avatar: circular, ~120px, with subtle border
- SocialLinks: row of icon links (GitHub, LinkedIn, email, etc.)

### ResumeSection
- Timeline component: left rail (vertical line + dots) + right content cards
- Entries sorted reverse-chronological
- Scroll-triggered entrance: each entry slides in from left/right alternately
- SkillBar: horizontal bar, fills from 0→target% on first scroll into view, CSS transition on width

### ProjectsSection
- CSS Grid card layout: 1 col mobile, 2 cols tablet, 3 cols desktop
- ProjectCard: image/placeholder, title, description, tech stack tags, links
- Hover: translateY(-4px) + box-shadow deepen, ~200ms transition
- Click card: navigate to external project URL

### Footer
- At page bottom, centered text
- Copyright notice + social link icons

## Visual Design

### Colors
- Background: `#ffffff`
- Text primary: `#1a1a2e`
- Text secondary: `#6b7280`
- Accent: `#3b82f6` (blue)
- Accent gradient: `#3b82f6` → `#8b5cf6`

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- Headings: bold, larger sizes
- Body: 16px base, 1.6 line-height

### Spacing
- Section padding: 80px vertical, 24px horizontal
- Max content width: 960px centered
- Card gaps: 24px

### Motion
- Section switch: opacity 0↔1, 300ms ease
- Scroll entrances: translateY(20px)→0 + opacity 0→1, 400ms ease, using Intersection Observer
- Hover lifts: 200ms ease

## Error Handling & Edge Cases

- Avatar image load failure: show initials fallback in a colored circle
- Empty data arrays: show a friendly placeholder message ("No projects yet" etc.)
- Long text in cards: truncate with ellipsis after 3 lines
- Skill percentage out of range: clamp to 0-100

## Testing Strategy

- Unit tests for data validation (skills 0-100, required fields)
- Component render tests (snapshot + presence of key elements)
- Edge case tests (empty data, missing avatar, long text)

## Future Considerations (Out of Scope)

- Dark mode toggle
- i18n / multi-language support
- CMS-backed content
- Blog section

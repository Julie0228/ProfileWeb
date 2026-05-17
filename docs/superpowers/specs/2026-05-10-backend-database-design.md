# ProfileWeb Backend - Design Spec

**Date:** 2026-05-10
**Status:** Approved

## Overview

Add an Express + SQLite backend to persist profile data. Currently data is stored in browser localStorage and falls back to hardcoded defaults — changes made via the admin panel are lost when switching browsers or clearing cache. The backend replaces localStorage as the source of truth.

## Tech Stack

- **Runtime**: Node.js + tsx (TypeScript execution)
- **Server**: Express 5
- **Database**: SQLite via better-sqlite3 (synchronous API)
- **Testing**: Vitest + supertest

## Architecture

```
React SPA (Vite:5173) --/api/*--> Express (:3001) --SQL--> SQLite (file)
                     <-- proxy --
```

- Vite dev server proxies `/api/*` to Express during development
- Express serves JSON REST API, no HTML rendering
- SQLite database stored as single file: `server/data/profile.db`
- Database auto-seeded from `src/data/*.ts` defaults on first run

## Database Schema (5 tables)

```sql
-- Singleton: always exactly one row
CREATE TABLE profile (
  id          INTEGER PRIMARY KEY CHECK (id = 1),
  name        TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL DEFAULT '',
  bio         TEXT NOT NULL DEFAULT '',
  avatarUrl   TEXT NOT NULL DEFAULT '',
  socialLinks TEXT NOT NULL DEFAULT '[]'   -- JSON array
);

CREATE TABLE resume (id INTEGER PRIMARY KEY CHECK (id = 1));

-- Education + Experience (type discriminator)
CREATE TABLE timeline_entries (
  id          TEXT PRIMARY KEY,
  resume_id   INTEGER NOT NULL DEFAULT 1 REFERENCES resume(id),
  type        TEXT NOT NULL CHECK (type IN ('education', 'experience')),
  title       TEXT NOT NULL DEFAULT '',
  subtitle    TEXT NOT NULL DEFAULT '',
  date        TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Skills (level clamped 0-100)
CREATE TABLE skills (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  resume_id  INTEGER NOT NULL DEFAULT 1 REFERENCES resume(id),
  name       TEXT NOT NULL DEFAULT '',
  level      INTEGER NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Projects
CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  techStack   TEXT NOT NULL DEFAULT '[]',  -- JSON array
  imageUrl    TEXT NOT NULL DEFAULT '',
  githubUrl   TEXT NOT NULL DEFAULT '',
  liveUrl     TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Games
CREATE TABLE games (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  coverUrl    TEXT NOT NULL DEFAULT '',
  playUrl     TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0
);
```

## API Design

| Method | Path         | Request Body   | Response        |
|--------|------------- |----------------|-----------------|
| GET    | /api/profile | —              | ProfileData     |
| PUT    | /api/profile | ProfileData    | ProfileData     |
| GET    | /api/resume  | —              | ResumeData      |
| PUT    | /api/resume  | ResumeData     | ResumeData      |
| GET    | /api/projects| —              | ProjectEntry[]  |
| PUT    | /api/projects| ProjectEntry[] | ProjectEntry[]  |
| GET    | /api/games   | —              | GameEntry[]     |
| PUT    | /api/games   | GameEntry[]    | GameEntry[]     |

All JSON. PUT uses full-replace semantics. Errors return `{ error: string }` with 500.

## Data Flow

```
App mount
  → DataProvider renders with default data (instant)
  → useEffect: fetch all 4 API endpoints
  → Success: update state with real data
  → Failure: keep defaults, set error

Admin save
  → AdminPage calls updateProfile(formData)
  → await fetch(PUT /api/profile)
  → update local state

Reset
  → PUT all defaults to API → update local state to defaults
```

## Dev Workflow

```bash
npm run dev:all    # Vite:5173 + Express:3001 concurrently
npm test           # Frontend tests (Vitest + jsdom)
npm run test:server # Backend tests (Vitest + supertest, node)
```

## Out of Scope

- Authentication / authorization
- File uploads (avatar stays as URL)
- Migration system
- Production deployment

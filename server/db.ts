import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { seed } from './seed';

let db: Database.Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  avatarUrl TEXT NOT NULL DEFAULT '',
  socialLinks TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS resume (
  id INTEGER PRIMARY KEY CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS timeline_entries (
  id TEXT PRIMARY KEY,
  resume_id INTEGER NOT NULL DEFAULT 1 REFERENCES resume(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('education', 'experience')),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  resume_id INTEGER NOT NULL DEFAULT 1 REFERENCES resume(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  level INTEGER NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  techStack TEXT NOT NULL DEFAULT '[]',
  imageUrl TEXT NOT NULL DEFAULT '',
  githubUrl TEXT NOT NULL DEFAULT '',
  liveUrl TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS games (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  coverUrl TEXT NOT NULL DEFAULT '',
  playUrl TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0
);
`;

function getDbPath(): string {
  const envPath = process.env.DB_PATH;
  if (envPath) return envPath;

  const dataDir = resolve(import.meta.dirname, 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  return resolve(dataDir, 'profile.db');
}

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = getDbPath();
  db = new Database(dbPath);

  if (dbPath !== ':memory:') {
    db.pragma('journal_mode = WAL');
  }

  db.exec(SCHEMA);

  const row = db.prepare('SELECT COUNT(*) as c FROM profile').get() as { c: number };
  if (row.c === 0) {
    seed(db);
  }

  return db;
}

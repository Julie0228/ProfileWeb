import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ProfileData } from '../data/profile';
import type { ResumeData } from '../data/resume';
import type { ProjectEntry } from '../data/projects';
import type { GameEntry } from '../data/games';
import { profile as defaultProfile } from '../data/profile';
import { resume as defaultResume } from '../data/resume';
import { projects as defaultProjects } from '../data/projects';
import { games as defaultGames } from '../data/games';

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

interface DataContextType {
  profile: ProfileData;
  resume: ResumeData;
  projects: ProjectEntry[];
  games: GameEntry[];
  loading: boolean;
  error: string | null;
  updateProfile: (data: ProfileData) => Promise<void>;
  updateResume: (data: ResumeData) => Promise<void>;
  updateProjects: (data: ProjectEntry[]) => Promise<void>;
  updateGames: (data: GameEntry[]) => Promise<void>;
  resetAll: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [projects, setProjects] = useState<ProjectEntry[]>(defaultProjects);
  const [games, setGames] = useState<GameEntry[]>(defaultGames);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchJson<ProfileData>('/profile'),
      fetchJson<ResumeData>('/resume'),
      fetchJson<ProjectEntry[]>('/projects'),
      fetchJson<GameEntry[]>('/games'),
    ])
      .then(([p, r, proj, g]) => {
        setProfile(p);
        setResume(r);
        setProjects(proj);
        setGames(g);
        setLoading(false);
      })
      .catch((err: Error) => {
        console.error('Failed to load data from API:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const updateProfile = useCallback(async (data: ProfileData) => {
    await fetchJson('/profile', { method: 'PUT', body: JSON.stringify(data) });
    setProfile(data);
  }, []);

  const updateResume = useCallback(async (data: ResumeData) => {
    await fetchJson('/resume', { method: 'PUT', body: JSON.stringify(data) });
    setResume(data);
  }, []);

  const updateProjects = useCallback(async (data: ProjectEntry[]) => {
    await fetchJson('/projects', { method: 'PUT', body: JSON.stringify(data) });
    setProjects(data);
  }, []);

  const updateGames = useCallback(async (data: GameEntry[]) => {
    await fetchJson('/games', { method: 'PUT', body: JSON.stringify(data) });
    setGames(data);
  }, []);

  const resetAll = useCallback(async () => {
    await Promise.all([
      fetchJson('/profile', { method: 'PUT', body: JSON.stringify(defaultProfile) }),
      fetchJson('/resume', { method: 'PUT', body: JSON.stringify(defaultResume) }),
      fetchJson('/projects', { method: 'PUT', body: JSON.stringify(defaultProjects) }),
      fetchJson('/games', { method: 'PUT', body: JSON.stringify(defaultGames) }),
    ]);
    setProfile(defaultProfile);
    setResume(defaultResume);
    setProjects(defaultProjects);
    setGames(defaultGames);
  }, []);

  return (
    <DataContext.Provider
      value={{ profile, resume, projects, games, loading, error, updateProfile, updateResume, updateProjects, updateGames, resetAll }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

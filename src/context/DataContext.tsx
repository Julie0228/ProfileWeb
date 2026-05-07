import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ProfileData } from '../data/profile';
import type { ResumeData } from '../data/resume';
import type { ProjectEntry } from '../data/projects';
import { profile as defaultProfile } from '../data/profile';
import { resume as defaultResume } from '../data/resume';
import { projects as defaultProjects } from '../data/projects';

const STORAGE_KEY = 'profileweb-data';

interface StoredData {
  profile: ProfileData;
  resume: ResumeData;
  projects: ProjectEntry[];
}

function loadData(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<StoredData>;
      return {
        profile: { ...defaultProfile, ...saved.profile },
        resume: { ...defaultResume, ...saved.resume },
        projects: saved.projects ?? defaultProjects,
      };
    }
  } catch { /* ignore corrupt data */ }
  return { profile: defaultProfile, resume: defaultResume, projects: defaultProjects };
}

function saveData(data: StoredData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface DataContextType {
  profile: ProfileData;
  resume: ResumeData;
  projects: ProjectEntry[];
  updateProfile: (data: ProfileData) => void;
  updateResume: (data: ResumeData) => void;
  updateProjects: (data: ProjectEntry[]) => void;
  resetAll: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoredData>(loadData);

  const updateProfile = useCallback((profile: ProfileData) => {
    setData((prev) => {
      const next = { ...prev, profile };
      saveData(next);
      return next;
    });
  }, []);

  const updateResume = useCallback((resume: ResumeData) => {
    setData((prev) => {
      const next = { ...prev, resume };
      saveData(next);
      return next;
    });
  }, []);

  const updateProjects = useCallback((projects: ProjectEntry[]) => {
    setData((prev) => {
      const next = { ...prev, projects };
      saveData(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData({ profile: defaultProfile, resume: defaultResume, projects: defaultProjects });
  }, []);

  return (
    <DataContext.Provider value={{ ...data, updateProfile, updateResume, updateProjects, resetAll }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

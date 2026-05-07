import { useState, useRef, useCallback, useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import type { TabKey } from '../components/NavBar';
import { HomeSection } from '../sections/HomeSection';
import { ResumeSection } from '../sections/ResumeSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { GamesSection } from '../sections/GamesSection';
import { useData } from '../context/DataContext';
import { games as defaultGames } from '../data/games';

const TAB_ORDER: Record<TabKey, number> = { home: 0, resume: 1, projects: 2, games: 3 };

export function MainPage() {
  const { profile, resume, projects } = useData();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [animClass, setAnimClass] = useState('');
  const prevIndex = useRef(0);

  const games = defaultGames;

  const handleTabChange = useCallback((tab: TabKey) => {
    const newIndex = TAB_ORDER[tab];
    setAnimClass(newIndex > prevIndex.current ? 'slide-in-right' : 'slide-in-left');
    prevIndex.current = newIndex;
    setActiveTab(tab);
  }, []);

  const TAB_TITLES: Record<TabKey, string> = {
    home: `${profile.name} - 个人主页`,
    resume: `简历 - ${profile.name}`,
    projects: `项目 - ${profile.name}`,
    games: `游戏 - ${profile.name}`,
  };

  useEffect(() => {
    document.title = TAB_TITLES[activeTab];
  }, [activeTab, profile.name]);

  const renderSection = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection data={profile} isActive={true} />;
      case 'resume':
        return <ResumeSection data={resume} isActive={true} />;
      case 'projects':
        return <ProjectsSection data={projects} isActive={true} />;
      case 'games':
        return <GamesSection data={games} isActive={true} />;
    }
  };

  return (
    <>
      <NavBar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="app-main">
        <div key={activeTab} className={`section-slide ${animClass}`}>
          {renderSection()}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

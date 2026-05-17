import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import type { TabKey } from '../components/NavBar';
import { HomeSection } from '../sections/HomeSection';
import { ResumeSection } from '../sections/ResumeSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { GamesSection } from '../sections/GamesSection';
import { NewsSection } from '../sections/NewsSection';
import { useData } from '../context/DataContext';

const TAB_ORDER: Record<TabKey, number> = { home: 0, news: 1, personal: 2, games: 3 };

export function MainPage() {
  const { profile, resume, projects, games } = useData();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: TabKey = tabParam === 'games' ? 'games' : tabParam === 'news' ? 'news' : tabParam === 'personal' ? 'personal' : (tabParam === 'resume' || tabParam === 'projects') ? 'personal' : 'home';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [animClass, setAnimClass] = useState('');
  const prevIndex = useRef(0);

  const handleTabChange = useCallback((tab: TabKey) => {
    const newIndex = TAB_ORDER[tab];
    setAnimClass(newIndex > prevIndex.current ? 'slide-in-right' : 'slide-in-left');
    prevIndex.current = newIndex;
    setActiveTab(tab);
  }, []);

  const TAB_TITLES: Record<TabKey, string> = {
    home: `${profile.name} - 个人主页`,
    personal: `个人信息 - ${profile.name}`,
    games: `游戏 - ${profile.name}`,
    news: `新闻 - ${profile.name}`,
  };

  useEffect(() => {
    document.title = TAB_TITLES[activeTab];
  }, [activeTab, profile.name]);

  const renderSection = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection data={profile} isActive={true} />;
      case 'personal':
        return (
          <>
            <ResumeSection data={resume} isActive={true} />
            <hr className="section-divider" />
            <ProjectsSection data={projects} isActive={true} />
          </>
        );
      case 'games':
        return <GamesSection data={games} isActive={true} />;
      case 'news':
        return <NewsSection isActive={true} />;
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

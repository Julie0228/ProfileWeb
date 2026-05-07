import { useState, useRef, useCallback } from 'react';
import { StarryBackground } from './components/StarryBackground';
import { NavBar } from './components/NavBar';
import type { TabKey } from './components/NavBar';
import { HomeSection } from './sections/HomeSection';
import { ResumeSection } from './sections/ResumeSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { profile } from './data/profile';
import { resume } from './data/resume';
import { projects } from './data/projects';
import './styles/global.css';

const TAB_ORDER: Record<TabKey, number> = { home: 0, resume: 1, projects: 2 };

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [animClass, setAnimClass] = useState('');
  const prevIndex = useRef(0);

  const handleTabChange = useCallback((tab: TabKey) => {
    const newIndex = TAB_ORDER[tab];
    setAnimClass(newIndex > prevIndex.current ? 'slide-in-right' : 'slide-in-left');
    prevIndex.current = newIndex;
    setActiveTab(tab);
  }, []);

  const renderSection = () => {
    switch (activeTab) {
      case 'home':
        return <HomeSection data={profile} isActive={true} />;
      case 'resume':
        return <ResumeSection data={resume} isActive={true} />;
      case 'projects':
        return <ProjectsSection data={projects} isActive={true} />;
    }
  };

  return (
    <>
      <StarryBackground />
      <div className="app">
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
    </div>
    </>
  );
}

export default App;

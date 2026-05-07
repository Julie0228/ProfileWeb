import { useState } from 'react';
import { NavBar } from './components/NavBar';
import type { TabKey } from './components/NavBar';
import { HomeSection } from './sections/HomeSection';
import { ResumeSection } from './sections/ResumeSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { profile } from './data/profile';
import { resume } from './data/resume';
import { projects } from './data/projects';
import './styles/global.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');

  return (
    <div className="app">
      <NavBar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="app-main">
        {activeTab === 'home' && <HomeSection data={profile} isActive={true} />}
        {activeTab === 'resume' && <ResumeSection data={resume} isActive={true} />}
        {activeTab === 'projects' && <ProjectsSection data={projects} isActive={true} />}
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';

const TABS = [
  { key: 'home', label: '首页' },
  { key: 'news', label: '新闻' },
  { key: 'personal', label: '个人信息' },
  { key: 'games', label: '游戏' },
] as const;

export type TabKey = (typeof TABS)[number]['key'];

interface NavBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function NavBar({ activeTab, onTabChange }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation">
      <div className="navbar-inner container">
        <span className="navbar-brand">Profile</span>
        <ul className="navbar-tabs">
          {TABS.map((tab) => (
            <li key={tab.key}>
              <button
                className={`navbar-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => onTabChange(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

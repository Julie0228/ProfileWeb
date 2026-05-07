const TABS = [
  { key: 'home', label: '首页' },
  { key: 'resume', label: '简历' },
  { key: 'projects', label: '项目' },
] as const;

export type TabKey = (typeof TABS)[number]['key'];

interface NavBarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function NavBar({ activeTab, onTabChange }: NavBarProps) {
  return (
    <nav className="navbar" role="navigation">
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

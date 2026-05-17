import { useEffect, useState } from 'react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceName: string;
  url: string;
  date: string;
}

const NEWS_TABS = [
  { id: 'tech', label: '科技' },
  { id: 'finance', label: '财经' },
  { id: 'digital', label: '数码' },
  { id: 'society', label: '民生' },
  { id: 'entertainment', label: '娱乐' },
];

const SOURCE_COLORS: Record<string, string> = {
  sspai: '#d94f4f',
  ithome: '#e03e2d',
  infoq: '#0071bc',
  '36kr': '#4776e6',
  huxiu: '#f16147',
  ifanr: '#40a9ff',
  dgtle: '#52c41a',
  v2ex: '#778087',
  'sina-society': '#e67e22',
  'sina-ent': '#e91e63',
};

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - d.getTime());
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return `${Math.max(1, Math.floor(diffMs / (1000 * 60)))} 分钟前`;
  if (diffH < 24) return `${diffH} 小时前`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD} 天前`;
  return d.toLocaleDateString('zh-CN');
}

export function NewsSection({ isActive }: { isActive: boolean }) {
  const [activeTab, setActiveTab] = useState('tech');
  const [news, setNews] = useState<Record<string, NewsItem[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  useEffect(() => {
    NEWS_TABS.forEach((tab) => {
      if (news[tab.id] || loading[tab.id]) return;

      setLoading((prev) => ({ ...prev, [tab.id]: true }));
      fetch(`/api/news/${tab.id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: NewsItem[]) => {
          setNews((prev) => ({ ...prev, [tab.id]: data }));
          setLoading((prev) => ({ ...prev, [tab.id]: false }));
        })
        .catch((err: Error) => {
          setError((prev) => ({ ...prev, [tab.id]: err.message }));
          setLoading((prev) => ({ ...prev, [tab.id]: false }));
        });
    });
  }, []);

  const currentNews = news[activeTab] || [];
  const currentLoading = loading[activeTab];
  const currentError = error[activeTab];
  const currentLabel = NEWS_TABS.find((t) => t.id === activeTab)?.label || activeTab;

  return (
    <section className={`section news-section section-fade ${isActive ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">新闻</h2>

        <nav className="news-subtabs">
          {NEWS_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`news-subtab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {news[tab.id] && news[tab.id].length > 0 && (
                <span className="news-subtab-count">{news[tab.id].length}</span>
              )}
            </button>
          ))}
        </nav>

        <p className="news-subtitle">聚合自多个热门站点 · 每日 9:00 / 12:00 / 18:00 刷新</p>

        {currentLoading && <p className="news-loading">加载中...</p>}

        {currentError && <p className="news-error">加载失败 ({currentError})</p>}

        {!currentLoading && !currentError && currentNews.length === 0 && (
          <p className="news-empty">{currentLabel}栏目暂未接入源</p>
        )}

        {!currentLoading && currentNews.length > 0 && (
          <div className="news-list">
            {currentNews.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-card"
              >
                <div className="news-card-header">
                  <span
                    className="news-source"
                    style={{ background: SOURCE_COLORS[item.source] || '#666' }}
                  >
                    {item.sourceName}
                  </span>
                  <span className="news-date">{formatDate(item.date)}</span>
                </div>
                <h3 className="news-title">{item.title}</h3>
                {item.summary && (
                  <p className="news-summary">{item.summary}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

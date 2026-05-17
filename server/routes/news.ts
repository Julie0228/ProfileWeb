import { Router } from 'express';
import Parser from 'rss-parser';

const router = Router();
const parser = new Parser();

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceName: string;
  url: string;
  date: string;
}

interface RssSource {
  type: 'rss';
  name: string;
  key: string;
  url: string;
}

interface SinaSource {
  type: 'sina';
  name: string;
  key: string;
  lid: number;
}

type NewsSource = RssSource | SinaSource;

interface NewsCategory {
  id: string;
  label: string;
  sources: NewsSource[];
}

const CATEGORIES: NewsCategory[] = [
  {
    id: 'tech',
    label: '科技',
    sources: [
      { type: 'rss', name: '少数派', key: 'sspai', url: 'https://sspai.com/feed' },
      { type: 'rss', name: 'IT之家', key: 'ithome', url: 'https://www.ithome.com/rss/' },
      { type: 'rss', name: 'InfoQ', key: 'infoq', url: 'https://www.infoq.cn/feed' },
    ],
  },
  {
    id: 'finance',
    label: '财经',
    sources: [
      { type: 'rss', name: '36氪', key: '36kr', url: 'https://36kr.com/feed' },
      { type: 'rss', name: '虎嗅', key: 'huxiu', url: 'https://www.huxiu.com/rss/0.xml' },
    ],
  },
  {
    id: 'digital',
    label: '数码',
    sources: [
      { type: 'rss', name: '爱范儿', key: 'ifanr', url: 'https://www.ifanr.com/feed' },
    ],
  },
  {
    id: 'society',
    label: '民生',
    sources: [
      { type: 'sina', name: '新浪新闻', key: 'sina-society', lid: 2510 },
    ],
  },
  {
    id: 'entertainment',
    label: '娱乐',
    sources: [
      { type: 'sina', name: '新浪娱乐', key: 'sina-ent', lid: 2513 },
    ],
  },
];

const REFRESH_HOURS = [9, 12, 18];

const cacheMap = new Map<string, { data: NewsItem[]; time: number }>();
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

// --- helpers ---

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').replace(/\s+/g, ' ').trim();
}

function fixRssDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  // Some Chinese RSS feeds label CST as GMT; if the parsed date
  // is in the future, it's likely CST → shift back 8 hours
  if (d.getTime() > now.getTime()) {
    return new Date(d.getTime() - 8 * 60 * 60 * 1000).toISOString();
  }
  return d.toISOString();
}

async function fetchRSS(name: string, key: string, url: string): Promise<NewsItem[]> {
  const feed = await parser.parseURL(url);
  return (feed.items || []).slice(0, 8).map((item) => ({
    id: `${key}-${item.guid || item.link || Math.random()}`,
    title: item.title || '',
    summary: stripHtml(item.contentSnippet || item.content || item.summary || '').slice(0, 200),
    source: key,
    sourceName: name,
    url: item.link || '',
    date: item.pubDate ? fixRssDate(item.pubDate) : (item.isoDate ? fixRssDate(item.isoDate) : new Date().toISOString()),
  }));
}

async function fetchSina(name: string, key: string, lid: number): Promise<NewsItem[]> {
  const url = `https://feed.mix.sina.com.cn/api/roll/get?pageid=153&lid=${lid}&num=20`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  const json = await res.json() as {
    result?: { data?: Array<{
      title?: string; url?: string; wapurl?: string;
      ctime?: string; intro?: string; wapsummary?: string;
    }> };
  };
  const items = json.result?.data || [];
  return items.slice(0, 20).map((item) => ({
    id: `${key}-${item.url || Math.random()}`,
    title: item.title || '',
    summary: stripHtml(item.intro || item.wapsummary || '').slice(0, 200),
    source: key,
    sourceName: name,
    url: item.url || item.wapurl || '',
    date: new Date(Number(item.ctime) * 1000).toISOString(),
  }));
}

async function fetchSource(src: NewsSource): Promise<NewsItem[]> {
  if (src.type === 'rss') {
    return fetchRSS(src.name, src.key, src.url);
  }
  if (src.type === 'sina') {
    return fetchSina(src.name, src.key, src.lid);
  }
  return [];
}

async function fetchCategory(category: NewsCategory): Promise<NewsItem[]> {
  const promises = category.sources.map(fetchSource);
  const results = await Promise.allSettled(promises);
  const allItems: NewsItem[] = [];
  results.forEach((r) => {
    if (r.status === 'fulfilled') allItems.push(...r.value);
  });

  allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const seen = new Set<string>();
  const deduped: NewsItem[] = [];
  for (const item of allItems) {
    const hash = item.title.slice(0, 40);
    if (!seen.has(hash)) {
      seen.add(hash);
      deduped.push(item);
    }
  }

  return deduped.slice(0, 25);
}

// --- cache & scheduler ---

async function refreshAll(): Promise<void> {
  for (const cat of CATEGORIES) {
    if (cat.sources.length === 0) continue;
    try {
      const items = await fetchCategory(cat);
      cacheMap.set(cat.id, { data: items, time: Date.now() });
      console.log(`[news:${cat.id}] ${items.length} items`);
    } catch (err) {
      console.error(`[news:${cat.id}] refresh failed:`, err);
    }
  }
}

function nextRefreshTime(): number {
  const now = new Date();
  const currentHour = now.getHours();
  let nextHour = REFRESH_HOURS.find((h) => h > currentHour);
  if (nextHour === undefined) nextHour = REFRESH_HOURS[0];

  const next = new Date(now);
  next.setHours(nextHour, 0, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime();
}

function scheduleNextRefresh(): void {
  if (refreshTimer) clearTimeout(refreshTimer);
  const delay = nextRefreshTime() - Date.now();
  const nextDate = new Date(nextRefreshTime());
  console.log(`[news] Next refresh at ${nextDate.toLocaleTimeString('zh-CN')}`);
  refreshTimer = setTimeout(() => {
    refreshAll().then(scheduleNextRefresh);
  }, delay);
}

refreshAll().then(scheduleNextRefresh);

// --- routes ---

router.get('/:category', (req, res) => {
  const { category } = req.params;
  const cat = CATEGORIES.find((c) => c.id === category);
  if (!cat) return res.status(404).json({ error: 'Unknown category' });

  if (cat.sources.length === 0) {
    return res.json([]);
  }

  const cached = cacheMap.get(category);
  if (cached) return res.json(cached.data);
  res.status(503).json({ error: 'Not yet loaded' });
});

export default router;

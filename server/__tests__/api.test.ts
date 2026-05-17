import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type { ProfileData } from '../../src/data/profile';
import type { ResumeData } from '../../src/data/resume';
import type { ProjectEntry } from '../../src/data/projects';
import type { GameEntry } from '../../src/data/games';

// Lazy import to ensure env is set before DB init
let app: ReturnType<typeof import('express').default>;

beforeEach(async () => {
  // Clear singleton so each test gets fresh DB
  vi.resetModules();
  delete process.env.DB_PATH;
  process.env.DB_PATH = ':memory:';
  const mod = await import('../index');
  app = mod.default;
});

describe('GET /api/profile', () => {
  it('returns default profile with expected fields', async () => {
    const res = await request(app).get('/api/profile');
    expect(res.status).toBe(200);
    const body = res.body as ProfileData;
    expect(body.name).toBe('张三');
    expect(body.title).toBe('全栈开发工程师');
    expect(Array.isArray(body.socialLinks)).toBe(true);
    expect(body.socialLinks.length).toBeGreaterThan(0);
  });
});

describe('PUT /api/profile', () => {
  it('updates profile and returns updated data', async () => {
    const updated: ProfileData = {
      name: '李四',
      title: '后端工程师',
      bio: '专注后端开发',
      avatarUrl: '/new-avatar.jpg',
      socialLinks: [{ platform: 'GitHub', url: 'https://github.com/test', icon: '🐙' }],
    };

    const res = await request(app).put('/api/profile').send(updated);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('李四');
    expect(res.body.title).toBe('后端工程师');
    expect(res.body.socialLinks).toHaveLength(1);

    // Verify GET returns updated data
    const getRes = await request(app).get('/api/profile');
    expect(getRes.body.name).toBe('李四');
  });
});

describe('GET /api/resume', () => {
  it('returns resume with education, experience, and skills', async () => {
    const res = await request(app).get('/api/resume');
    expect(res.status).toBe(200);
    const body = res.body as ResumeData;
    expect(Array.isArray(body.education)).toBe(true);
    expect(Array.isArray(body.experience)).toBe(true);
    expect(Array.isArray(body.skills)).toBe(true);
    expect(body.skills.length).toBeGreaterThan(0);
    expect(body.skills[0].level).toBeGreaterThanOrEqual(0);
    expect(body.skills[0].level).toBeLessThanOrEqual(100);
  });
});

describe('PUT /api/resume', () => {
  it('replaces resume data', async () => {
    const updated: ResumeData = {
      education: [
        { id: 'e1', title: '新学历', subtitle: '新学校', date: '2020-2024', description: '新描述' },
      ],
      experience: [],
      skills: [{ name: 'Go', level: 80 }],
    };

    const res = await request(app).put('/api/resume').send(updated);
    expect(res.status).toBe(200);
    expect(res.body.education).toHaveLength(1);
    expect(res.body.education[0].title).toBe('新学历');
    expect(res.body.skills).toHaveLength(1);
    expect(res.body.skills[0].name).toBe('Go');

    const getRes = await request(app).get('/api/resume');
    expect(getRes.body.education).toHaveLength(1);
    expect(getRes.body.skills[0].name).toBe('Go');
  });
});

describe('GET /api/projects', () => {
  it('returns project list', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    const body = res.body as ProjectEntry[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(Array.isArray(body[0].techStack)).toBe(true);
  });
});

describe('PUT /api/projects', () => {
  it('replaces project list', async () => {
    const updated: ProjectEntry[] = [
      {
        id: 'p1',
        name: '新项目',
        description: '新项目描述',
        techStack: ['Go', 'SQLite'],
        imageUrl: '',
        githubUrl: 'https://github.com/test',
        liveUrl: '',
      },
    ];

    const res = await request(app).put('/api/projects').send(updated);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('新项目');
    expect(res.body[0].techStack).toEqual(['Go', 'SQLite']);

    const getRes = await request(app).get('/api/projects');
    expect(getRes.body).toHaveLength(1);
  });

  it('accepts empty array', async () => {
    const res = await request(app).put('/api/projects').send([]);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);

    const getRes = await request(app).get('/api/projects');
    expect(getRes.body).toHaveLength(0);
  });
});

describe('GET /api/games', () => {
  it('returns game list', async () => {
    const res = await request(app).get('/api/games');
    expect(res.status).toBe(200);
    const body = res.body as GameEntry[];
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0].playUrl).toBeTruthy();
  });
});

describe('PUT /api/games', () => {
  it('replaces game list', async () => {
    const updated: GameEntry[] = [
      {
        id: 'g1',
        name: '新游戏',
        description: '新游戏描述',
        coverUrl: '/cover.png',
        playUrl: '/play',
      },
    ];

    const res = await request(app).put('/api/games').send(updated);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('新游戏');

    const getRes = await request(app).get('/api/games');
    expect(getRes.body).toHaveLength(1);
  });
});

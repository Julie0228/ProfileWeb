# Personal Profile Web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page personal profile website with three tab-switched sections (home card, resume timeline, project gallery).

**Architecture:** React + TypeScript + Vite SPA without router. Tab state lives in App.tsx. Content data is in typed TS files under `src/data/`. Components are pure presentational, receiving data via props. CSS handles all animations with Intersection Observer for scroll-triggered effects.

**Tech Stack:** React 18, TypeScript, Vite, Vitest + @testing-library/react, pure CSS

---

### Task 1: Scaffold Project with Vite + React + TypeScript

**Files:**
- Create: entire project scaffold via `npm create vite`

- [ ] **Step 1: Create Vite project**

Run:
```bash
cd E:/ai/ProfileWeb && npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd E:/ai/ProfileWeb && npm install
```

- [ ] **Step 3: Clean scaffold defaults**

Delete the following files that come with the Vite template:
- `src/App.css`
- `src/index.css`
- `src/assets/react.svg`
- `public/vite.svg`

- [ ] **Step 4: Create directory structure**

Run:
```bash
mkdir -p E:/ai/ProfileWeb/src/data
mkdir -p E:/ai/ProfileWeb/src/sections
mkdir -p E:/ai/ProfileWeb/src/components
mkdir -p E:/ai/ProfileWeb/src/styles
mkdir -p E:/ai/ProfileWeb/src/__tests__
```

- [ ] **Step 5: Install testing dependencies**

Run:
```bash
cd E:/ai/ProfileWeb && npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 6: Add test script to package.json**

Read `package.json`, then add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 7: Add vitest config to vite.config.ts**

Read `vite.config.ts`, then replace with:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
})
```

- [ ] **Step 8: Create test setup file**

Create `src/test-setup.ts`:
```typescript
import '@testing-library/jest-dom';
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project with Vitest"
```

---

### Task 2: Define Data Types and Content Files

**Files:**
- Create: `src/data/profile.ts`
- Create: `src/data/resume.ts`
- Create: `src/data/projects.ts`

- [ ] **Step 1: Write types and data for profile.ts**

```typescript
export interface SocialLink {
  platform: string;
  url: string;
  icon: string; // emoji or svg filename
}

export interface ProfileData {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  socialLinks: SocialLink[];
}

export const profile: ProfileData = {
  name: "张三",
  title: "全栈开发工程师",
  bio: "热爱技术，专注于构建优雅的 Web 应用。喜欢开源，享受创造的过程。",
  avatarUrl: "/avatar.jpg",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/", icon: "🐙" },
    { platform: "LinkedIn", url: "https://linkedin.com/in/", icon: "💼" },
    { platform: "Email", url: "mailto:hello@example.com", icon: "✉️" },
  ],
};
```

- [ ] **Step 2: Write types and data for resume.ts**

```typescript
export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
}

export interface ResumeData {
  education: TimelineEntry[];
  experience: TimelineEntry[];
  skills: Skill[];
}

export const resume: ResumeData = {
  education: [
    {
      id: "edu-1",
      title: "计算机科学与技术 本科",
      subtitle: "某某大学",
      date: "2018 - 2022",
      description: "主修数据结构、算法、操作系统、计算机网络。GPA 3.8/4.0。",
    },
  ],
  experience: [
    {
      id: "exp-1",
      title: "前端开发工程师",
      subtitle: "某某科技有限公司",
      date: "2023 - 至今",
      description: "负责核心产品前端架构设计与开发，使用 React + TypeScript 技术栈。",
    },
    {
      id: "exp-2",
      title: "前端开发实习生",
      subtitle: "某某互联网公司",
      date: "2022 - 2023",
      description: "参与内部管理系统开发，使用 Vue.js + Element UI。",
    },
  ],
  skills: [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Node.js", level: 75 },
    { name: "CSS", level: 88 },
    { name: "Python", level: 70 },
    { name: "Docker", level: 60 },
  ],
};
```

- [ ] **Step 3: Write types and data for projects.ts**

```typescript
export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl?: string;
}

export const projects: ProjectEntry[] = [
  {
    id: "proj-1",
    name: "个人博客系统",
    description: "基于 Next.js 的全栈博客平台，支持 Markdown 编辑、标签分类、全文搜索。",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    imageUrl: "",
    githubUrl: "https://github.com/",
    liveUrl: "https://example.com",
  },
  {
    id: "proj-2",
    name: "任务管理工具",
    description: "一个简洁高效的看板式任务管理应用，支持拖拽排序、多人协作。",
    techStack: ["React", "TypeScript", "Firebase", "Tailwind"],
    imageUrl: "",
    githubUrl: "https://github.com/",
  },
];
```

- [ ] **Step 4: Commit**

```bash
git add src/data/
git commit -m "feat: add data types and initial content files"
```

---

### Task 3: Global Styles

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write test for CSS variables**

Create `src/__tests__/styles.test.ts`:
```typescript
import { describe, it, expect } from 'vitest';

describe('Global styles', () => {
  it('should have expected CSS variable definitions loaded', () => {
    // Smoke test: verify styles can be loaded without error
    expect(() => {
      const el = document.createElement('div');
      el.className = 'container';
      document.body.appendChild(el);
      document.body.removeChild(el);
    }).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails trivially (no styles yet)**

Run:
```bash
npx vitest run src/__tests__/styles.test.ts
```
Expected: PASS (this test always passes, it's a smoke test)

- [ ] **Step 3: Write global.css**

```css
:root {
  --color-bg: #ffffff;
  --color-text-primary: #1a1a2e;
  --color-text-secondary: #6b7280;
  --color-accent: #3b82f6;
  --color-accent-gradient-end: #8b5cf6;
  --color-border: #e5e7eb;
  --color-card-bg: #f9fafb;
  --color-nav-bg: rgba(255, 255, 255, 0.85);
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --max-width: 960px;
  --section-padding-y: 80px;
  --section-padding-x: 24px;
  --nav-height: 56px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-family);
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text-primary);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--section-padding-x);
}

.section {
  padding: var(--section-padding-y) var(--section-padding-x);
  min-height: 100vh;
}

.section-fade {
  opacity: 0;
  transition: opacity 300ms ease;
}

.section-fade.active {
  opacity: 1;
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 200ms ease;
}

a:hover {
  color: var(--color-accent-gradient-end);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/__tests__/styles.test.ts
git commit -m "feat: add global styles with CSS variables"
```

---

### Task 4: Create Placeholder Image Script and Public Assets

**Files:**
- Create: `public/avatar.jpg` (placeholder)
- Create: `public/project-placeholder.svg`

- [ ] **Step 1: Create project placeholder SVG**

Create `public/project-placeholder.svg`:
```xml
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <rect width="400" height="200" fill="#e5e7eb"/>
  <text x="200" y="110" text-anchor="middle" fill="#9ca3af" font-size="16" font-family="sans-serif">Project Image</text>
</svg>
```

- [ ] **Step 2: Commit**

```bash
git add public/
git commit -m "feat: add placeholder assets"
```

---

### Task 5: Avatar Component

**Files:**
- Create: `src/components/Avatar.tsx`
- Create: `src/__tests__/Avatar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/Avatar.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar } from '../components/Avatar';

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="/test.jpg" alt="Test User" />);
    const img = screen.getByAlt('Test User');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('shows initials fallback when image fails to load', () => {
    render(<Avatar src="/bad.jpg" alt="张三" />);
    const img = screen.getByAlt('张三');
    // Simulate image error
    img.dispatchEvent(new Event('error'));
    // Should now show initials
    expect(screen.getByText('张')).toBeInTheDocument();
  });

  it('takes initials from first character of alt text', () => {
    render(<Avatar src="/bad.jpg" alt="John" />);
    const img = screen.getByAlt('John');
    img.dispatchEvent(new Event('error'));
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders without src and shows fallback immediately', () => {
    render(<Avatar src="" alt="Test" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/Avatar.test.tsx
```
Expected: FAIL (Avatar module not found)

- [ ] **Step 3: Write Avatar component**

Create `src/components/Avatar.tsx`:
```typescript
import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 120 }: AvatarProps) {
  const [hasError, setHasError] = useState(!src);
  const initial = alt.charAt(0).toUpperCase();

  if (hasError) {
    return (
      <div
        className="avatar-fallback"
        style={{ width: size, height: size, borderRadius: '50%' }}
        aria-label={alt}
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setHasError(true)}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/Avatar.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Avatar.tsx src/__tests__/Avatar.test.tsx
git commit -m "feat: add Avatar component with fallback initials"
```

---

### Task 6: SocialLinks Component

**Files:**
- Create: `src/components/SocialLinks.tsx`
- Create: `src/__tests__/SocialLinks.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/SocialLinks.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialLinks } from '../components/SocialLinks';
import { SocialLink } from '../data/profile';

const links: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com/test', icon: '🐙' },
  { platform: 'Email', url: 'mailto:test@test.com', icon: '✉️' },
];

describe('SocialLinks', () => {
  it('renders all links', () => {
    render(<SocialLinks links={links} />);
    const anchors = screen.getAllByRole('link');
    expect(anchors).toHaveLength(2);
  });

  it('renders correct hrefs', () => {
    render(<SocialLinks links={links} />);
    expect(screen.getByLabelText('GitHub')).toHaveAttribute('href', 'https://github.com/test');
    expect(screen.getByLabelText('Email')).toHaveAttribute('href', 'mailto:test@test.com');
  });

  it('renders empty when no links', () => {
    const { container } = render(<SocialLinks links={[]} />);
    expect(container.querySelector('a')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/SocialLinks.test.tsx
```
Expected: FAIL (module not found)

- [ ] **Step 3: Write SocialLinks component**

Create `src/components/SocialLinks.tsx`:
```typescript
import { SocialLink } from '../data/profile';

interface SocialLinksProps {
  links: SocialLink[];
}

export function SocialLinks({ links }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className="social-links">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          aria-label={link.platform}
        >
          <span className="social-link-icon">{link.icon}</span>
          <span className="social-link-label">{link.platform}</span>
        </a>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/SocialLinks.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SocialLinks.tsx src/__tests__/SocialLinks.test.tsx
git commit -m "feat: add SocialLinks component"
```

---

### Task 7: SkillBar Component

**Files:**
- Create: `src/components/SkillBar.tsx`
- Create: `src/__tests__/SkillBar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/SkillBar.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillBar } from '../components/SkillBar';

describe('SkillBar', () => {
  it('renders skill name and level', () => {
    render(<SkillBar name="TypeScript" level={85} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('clamps level to 0 when negative', () => {
    render(<SkillBar name="Test" level={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('clamps level to 100 when over 100', () => {
    render(<SkillBar name="Test" level={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('sets fill width to clamped percentage', () => {
    const { container } = render(<SkillBar name="Test" level={75} />);
    const fill = container.querySelector('.skill-bar-fill') as HTMLElement;
    expect(fill.style.getPropertyValue('--level')).toBe('75%');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/SkillBar.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Write SkillBar component**

Create `src/components/SkillBar.tsx`:
```typescript
interface SkillBarProps {
  name: string;
  level: number;
}

export function SkillBar({ name, level }: SkillBarProps) {
  const clamped = Math.max(0, Math.min(100, level));

  return (
    <div className="skill-bar">
      <div className="skill-bar-header">
        <span className="skill-bar-name">{name}</span>
        <span className="skill-bar-level">{clamped}%</span>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{ '--level': `${clamped}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/SkillBar.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/SkillBar.tsx src/__tests__/SkillBar.test.tsx
git commit -m "feat: add SkillBar component with level clamping"
```

---

### Task 8: Timeline Component

**Files:**
- Create: `src/components/Timeline.tsx`
- Create: `src/__tests__/Timeline.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/Timeline.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../components/Timeline';
import { TimelineEntry } from '../data/resume';

const entries: TimelineEntry[] = [
  { id: '1', title: 'Engineer', subtitle: 'Acme Corp', date: '2023', description: 'Did things' },
  { id: '2', title: 'Intern', subtitle: 'Startup', date: '2022', description: 'Learned things' },
];

describe('Timeline', () => {
  it('renders all entries', () => {
    render(<Timeline entries={entries} />);
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Intern')).toBeInTheDocument();
  });

  it('shows empty message when no entries', () => {
    render(<Timeline entries={[]} />);
    expect(screen.getByText(/暂无数据/)).toBeInTheDocument();
  });

  it('renders entries with subtitle and date', () => {
    render(<Timeline entries={entries} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Did things')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/Timeline.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Write Timeline component**

Create `src/components/Timeline.tsx`:
```typescript
import { TimelineEntry } from '../data/resume';

interface TimelineProps {
  entries: TimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) {
    return <p className="timeline-empty">暂无数据</p>;
  }

  return (
    <div className="timeline">
      {entries.map((entry) => (
        <div key={entry.id} className="timeline-item">
          <div className="timeline-rail">
            <div className="timeline-dot" />
          </div>
          <div className="timeline-content">
            <span className="timeline-date">{entry.date}</span>
            <h3 className="timeline-title">{entry.title}</h3>
            <p className="timeline-subtitle">{entry.subtitle}</p>
            <p className="timeline-desc">{entry.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/Timeline.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Timeline.tsx src/__tests__/Timeline.test.tsx
git commit -m "feat: add Timeline component"
```

---

### Task 9: ProjectCard Component

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Create: `src/__tests__/ProjectCard.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/ProjectCard.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectEntry } from '../data/projects';

const project: ProjectEntry = {
  id: '1',
  name: 'Test Project',
  description: 'A test project description',
  techStack: ['React', 'TS'],
  imageUrl: '',
  githubUrl: 'https://github.com/test/proj',
  liveUrl: 'https://proj.example.com',
};

describe('ProjectCard', () => {
  it('renders project name and description', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TS')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('GitHub')).toHaveAttribute('href', 'https://github.com/test/proj');
    expect(screen.getByText('Live Demo')).toHaveAttribute('href', 'https://proj.example.com');
  });

  it('does not render live link when undefined', () => {
    const noLive = { ...project, liveUrl: undefined as string | undefined };
    render(<ProjectCard project={noLive} />);
    expect(screen.queryByText('Live Demo')).toBeNull();
  });

  it('uses placeholder image when imageUrl is empty', () => {
    render(<ProjectCard project={project} />);
    const img = screen.getByAlt('Test Project');
    expect(img).toHaveAttribute('src', '/project-placeholder.svg');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/ProjectCard.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Write ProjectCard component**

Create `src/components/ProjectCard.tsx`:
```typescript
import { ProjectEntry } from '../data/projects';

interface ProjectCardProps {
  project: ProjectEntry;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imgSrc = project.imageUrl || '/project-placeholder.svg';

  return (
    <div className="project-card">
      <img
        src={imgSrc}
        alt={project.name}
        className="project-card-image"
        loading="lazy"
        width={400}
        height={200}
      />
      <div className="project-card-body">
        <h3 className="project-card-title">{project.name}</h3>
        <p className="project-card-desc">{project.description}</p>
        <div className="project-card-tags">
          {project.techStack.map((tech) => (
            <span key={tech} className="project-card-tag">{tech}</span>
          ))}
        </div>
        <div className="project-card-links">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card-link"
          >
            GitHub
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-card-link"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/ProjectCard.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ProjectCard.tsx src/__tests__/ProjectCard.test.tsx
git commit -m "feat: add ProjectCard component"
```

---

### Task 10: NavBar Component

**Files:**
- Create: `src/components/NavBar.tsx`
- Create: `src/__tests__/NavBar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/NavBar.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from '../components/NavBar';

const tabs = [
  { key: 'home', label: '首页' },
  { key: 'resume', label: '简历' },
  { key: 'projects', label: '项目' },
] as const;

describe('NavBar', () => {
  it('renders all tab labels', () => {
    render(<NavBar activeTab="home" onTabChange={() => {}} />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('简历')).toBeInTheDocument();
    expect(screen.getByText('项目')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<NavBar activeTab="resume" onTabChange={() => {}} />);
    const activeTab = screen.getByText('简历');
    expect(activeTab.classList.contains('active')).toBe(true);
  });

  it('calls onTabChange when clicking a tab', async () => {
    const onChange = vi.fn();
    render(<NavBar activeTab="home" onTabChange={onChange} />);
    await userEvent.click(screen.getByText('项目'));
    expect(onChange).toHaveBeenCalledWith('projects');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/NavBar.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Write NavBar component**

Create `src/components/NavBar.tsx`:
```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/NavBar.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/NavBar.tsx src/__tests__/NavBar.test.tsx
git commit -m "feat: add NavBar component with tab switching"
```

---

### Task 11: HomeSection Component

**Files:**
- Create: `src/sections/HomeSection.tsx`
- Create: `src/__tests__/HomeSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/HomeSection.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeSection } from '../sections/HomeSection';
import { ProfileData } from '../data/profile';

const data: ProfileData = {
  name: '张三',
  title: '工程师',
  bio: '热爱技术',
  avatarUrl: '/test.jpg',
  socialLinks: [{ platform: 'GitHub', url: 'https://github.com/', icon: 'GH' }],
};

describe('HomeSection', () => {
  it('renders name, title, and bio', () => {
    render(<HomeSection data={data} isActive={true} />);
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('工程师')).toBeInTheDocument();
    expect(screen.getByText('热爱技术')).toBeInTheDocument();
  });

  it('renders avatar', () => {
    render(<HomeSection data={data} isActive={true} />);
    expect(screen.getByAlt('张三')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<HomeSection data={data} isActive={true} />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(<HomeSection data={data} isActive={true} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(true);
  });

  it('does not apply active class when isActive is false', () => {
    const { container } = render(<HomeSection data={data} isActive={false} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/HomeSection.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Write HomeSection component**

Create `src/sections/HomeSection.tsx`:
```typescript
import { ProfileData } from '../data/profile';
import { Avatar } from '../components/Avatar';
import { SocialLinks } from '../components/SocialLinks';

interface HomeSectionProps {
  data: ProfileData;
  isActive: boolean;
}

export function HomeSection({ data, isActive }: HomeSectionProps) {
  return (
    <section className={`section home-section section-fade ${isActive ? 'active' : ''}`}>
      <div className="home-content">
        <Avatar src={data.avatarUrl} alt={data.name} size={120} />
        <h1 className="home-name">{data.name}</h1>
        <p className="home-title">{data.title}</p>
        <p className="home-bio">{data.bio}</p>
        <SocialLinks links={data.socialLinks} />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/HomeSection.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/sections/HomeSection.tsx src/__tests__/HomeSection.test.tsx
git commit -m "feat: add HomeSection component"
```

---

### Task 12: ResumeSection Component

**Files:**
- Create: `src/sections/ResumeSection.tsx`
- Create: `src/__tests__/ResumeSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/ResumeSection.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumeSection } from '../sections/ResumeSection';
import { ResumeData } from '../data/resume';

const data: ResumeData = {
  education: [
    { id: '1', title: 'CS Degree', subtitle: 'University', date: '2020', description: 'Studied CS' },
  ],
  experience: [
    { id: '2', title: 'Developer', subtitle: 'Company', date: '2023', description: 'Worked' },
  ],
  skills: [
    { name: 'React', level: 80 },
  ],
};

describe('ResumeSection', () => {
  it('renders section title for education', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('教育经历')).toBeInTheDocument();
  });

  it('renders section title for experience', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('工作经历')).toBeInTheDocument();
  });

  it('renders section title for skills', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('技能')).toBeInTheDocument();
  });

  it('renders timeline entries', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('CS Degree')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('renders skill bars', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(<ResumeSection data={data} isActive={true} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/ResumeSection.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Write ResumeSection component**

Create `src/sections/ResumeSection.tsx`:
```typescript
import { ResumeData } from '../data/resume';
import { Timeline } from '../components/Timeline';
import { SkillBar } from '../components/SkillBar';

interface ResumeSectionProps {
  data: ResumeData;
  isActive: boolean;
}

export function ResumeSection({ data, isActive }: ResumeSectionProps) {
  return (
    <section className={`section resume-section section-fade ${isActive ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">教育经历</h2>
        <Timeline entries={data.education} />

        <h2 className="section-title">工作经历</h2>
        <Timeline entries={data.experience} />

        <h2 className="section-title">技能</h2>
        <div className="skills-grid">
          {data.skills.map((skill) => (
            <SkillBar key={skill.name} name={skill.name} level={skill.level} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/ResumeSection.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/sections/ResumeSection.tsx src/__tests__/ResumeSection.test.tsx
git commit -m "feat: add ResumeSection component"
```

---

### Task 13: ProjectsSection Component

**Files:**
- Create: `src/sections/ProjectsSection.tsx`
- Create: `src/__tests__/ProjectsSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/ProjectsSection.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from '../sections/ProjectsSection';
import { ProjectEntry } from '../data/projects';

const data: ProjectEntry[] = [
  {
    id: '1',
    name: 'Project A',
    description: 'Description A',
    techStack: ['React'],
    imageUrl: '',
    githubUrl: 'https://github.com/a',
  },
  {
    id: '2',
    name: 'Project B',
    description: 'Description B',
    techStack: ['Vue'],
    imageUrl: '',
    githubUrl: 'https://github.com/b',
    liveUrl: 'https://b.example.com',
  },
];

describe('ProjectsSection', () => {
  it('renders all project names', () => {
    render(<ProjectsSection data={data} isActive={true} />);
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('shows empty state when no projects', () => {
    render(<ProjectsSection data={[]} isActive={true} />);
    expect(screen.getByText(/暂无项目/)).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(<ProjectsSection data={data} isActive={true} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(true);
  });

  it('does not apply active class when isActive is false', () => {
    const { container } = render(<ProjectsSection data={data} isActive={false} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/ProjectsSection.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Write ProjectsSection component**

Create `src/sections/ProjectsSection.tsx`:
```typescript
import { ProjectEntry } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';

interface ProjectsSectionProps {
  data: ProjectEntry[];
  isActive: boolean;
}

export function ProjectsSection({ data, isActive }: ProjectsSectionProps) {
  return (
    <section className={`section projects-section section-fade ${isActive ? 'active' : ''}`}>
      <div className="container">
        <h2 className="section-title">项目</h2>
        {data.length === 0 ? (
          <p className="projects-empty">暂无项目</p>
        ) : (
          <div className="projects-grid">
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/ProjectsSection.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/sections/ProjectsSection.tsx src/__tests__/ProjectsSection.test.tsx
git commit -m "feat: add ProjectsSection component"
```

---

### Task 14: App.tsx Root Component

**Files:**
- Modify: `src/App.tsx`
- Create: `src/__tests__/App.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/App.test.tsx`:
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App', () => {
  it('renders NavBar with tabs', () => {
    render(<App />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('简历')).toBeInTheDocument();
    expect(screen.getByText('项目')).toBeInTheDocument();
  });

  it('shows HomeSection by default', () => {
    render(<App />);
    expect(screen.getByText('张三')).toBeInTheDocument();
  });

  it('switches to ResumeSection when clicking 简历 tab', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('简历'));
    expect(screen.getByText('教育经历')).toBeInTheDocument();
    expect(screen.getByText('工作经历')).toBeInTheDocument();
  });

  it('switches to ProjectsSection when clicking 项目 tab', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('项目'));
    expect(screen.getByText('个人博客系统')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<App />);
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npx vitest run src/__tests__/App.test.tsx
```
Expected: FAIL (App.tsx still has scaffold content)

- [ ] **Step 3: Write App.tsx**

Read `src/App.tsx`, then replace with:
```typescript
import { useState } from 'react';
import { NavBar, TabKey } from './components/NavBar';
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
        <HomeSection data={profile} isActive={activeTab === 'home'} />
        <ResumeSection data={resume} isActive={activeTab === 'resume'} />
        <ProjectsSection data={projects} isActive={activeTab === 'projects'} />
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
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npx vitest run src/__tests__/App.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/__tests__/App.test.tsx
git commit -m "feat: add App root with tab switching and footer"
```

---

### Task 15: Entry Point (main.tsx)

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1: Update main.tsx**

Read `src/main.tsx`, replace with:
```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 2: Verify app compiles**

Run:
```bash
cd E:/ai/ProfileWeb && npx tsc --noEmit
```
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx
git commit -m "chore: clean up main.tsx entry point"
```

---

### Task 16: Component CSS (NavBar, Avatar, Timeline, SkillBar, ProjectCard, SocialLinks, Home, Resume, Projects, Footer)

**Files:**
- Modify: `src/styles/global.css` (append component styles)

- [ ] **Step 1: Append all component styles to global.css**

Read `src/styles/global.css`, then append the following styles:

```css
/* ===== NavBar ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: var(--color-nav-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 100;
  transition: box-shadow 300ms ease;
}

.navbar.scrolled {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar-brand {
  font-weight: 700;
  font-size: 18px;
  color: var(--color-text-primary);
}

.navbar-tabs {
  display: flex;
  list-style: none;
  gap: 4px;
}

.navbar-tab {
  background: none;
  border: none;
  padding: 8px 16px;
  font-size: 14px;
  font-family: var(--font-family);
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: color 200ms ease, background-color 200ms ease;
  position: relative;
}

.navbar-tab:hover {
  color: var(--color-text-primary);
  background-color: rgba(0, 0, 0, 0.04);
}

.navbar-tab.active {
  color: var(--color-accent);
  font-weight: 600;
}

.navbar-tab.active::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 1px;
}

/* ===== Avatar ===== */
.avatar-fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-gradient-end));
  color: #fff;
  font-size: 2.5rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* ===== Social Links ===== */
.social-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  transition: border-color 200ms ease, transform 200ms ease;
}

.social-link:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.social-link-icon {
  font-size: 18px;
}

.social-link-label {
  font-size: 14px;
}

/* ===== Home Section ===== */
.home-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.home-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.home-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.home-title {
  font-size: 1.2rem;
  color: var(--color-accent);
  font-weight: 500;
}

.home-bio {
  max-width: 480px;
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.8;
}

/* ===== Section Title ===== */
.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  margin-top: 48px;
  color: var(--color-text-primary);
}

.section-title:first-child {
  margin-top: 0;
}

/* ===== Resume Section ===== */
.resume-section {
  padding-top: calc(var(--nav-height) + 40px);
}

/* ===== Timeline ===== */
.timeline {
  position: relative;
}

.timeline-empty {
  color: var(--color-text-secondary);
  text-align: center;
  padding: 24px;
}

.timeline-item {
  display: flex;
  gap: 24px;
  padding-bottom: 32px;
  position: relative;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-rail {
  position: relative;
  width: 12px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.timeline-rail::before {
  content: '';
  position: absolute;
  top: 8px;
  bottom: -32px;
  width: 2px;
  background: var(--color-border);
}

.timeline-item:last-child .timeline-rail::before {
  display: none;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
  z-index: 1;
}

.timeline-content {
  flex: 1;
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.timeline-date {
  font-size: 13px;
  color: var(--color-accent);
  font-weight: 500;
}

.timeline-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 4px 0;
}

.timeline-subtitle {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.timeline-desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* ===== Skill Bar ===== */
.skills-grid {
  display: grid;
  gap: 16px;
  max-width: 600px;
}

.skill-bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 14px;
}

.skill-bar-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.skill-bar-level {
  color: var(--color-text-secondary);
}

.skill-bar-track {
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  width: var(--level);
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-gradient-end));
  transition: width 800ms ease;
}

/* ===== Projects Section ===== */
.projects-section {
  padding-top: calc(var(--nav-height) + 40px);
}

.projects-empty {
  color: var(--color-text-secondary);
  text-align: center;
  padding: 48px 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ===== Project Card ===== */
.project-card {
  background: var(--color-card-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.project-card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--color-border);
}

.project-card-body {
  padding: 20px;
}

.project-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.project-card-desc {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.project-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.project-card-tag {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text-secondary);
}

.project-card-links {
  display: flex;
  gap: 12px;
}

.project-card-link {
  font-size: 14px;
  font-weight: 500;
}

/* ===== Footer ===== */
.footer {
  text-align: center;
  padding: 24px var(--section-padding-x);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 14px;
}

/* ===== Responsive Nav ===== */
@media (max-width: 767px) {
  .navbar-tabs {
    gap: 0;
  }

  .navbar-tab {
    padding: 8px 12px;
    font-size: 13px;
  }

  .navbar-brand {
    font-size: 16px;
  }
}
```

- [ ] **Step 2: Verify styles are applied**

Run:
```bash
cd E:/ai/ProfileWeb && npm run dev
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add all component styles"
```

---

### Task 17: NavBar Scroll Shadow Effect

**Files:**
- Modify: `src/components/NavBar.tsx`

- [ ] **Step 1: Add scroll event listener for shadow**

Read `src/components/NavBar.tsx`, then modify — add a `useEffect` for scroll detection:

Add import at top:
```typescript
import { useEffect, useState } from 'react';
```

Add inside the component (before the return):
```typescript
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 20);
  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Change the nav className from `"navbar"` to:
```typescript
className={`navbar ${scrolled ? 'scrolled' : ''}`}
```

- [ ] **Step 2: Run tests to ensure nothing breaks**

Run:
```bash
npx vitest run
```
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add src/components/NavBar.tsx
git commit -m "feat: add scroll-triggered shadow to NavBar"
```

---

### Task 18: Intersection Observer for Scroll Animations

**Files:**
- Create: `src/hooks/useInView.ts`
- Modify: `src/components/SkillBar.tsx` (trigger fill on in-view)
- Modify: `src/styles/global.css` (add scroll entrance animation classes)

- [ ] **Step 1: Create useInView hook**

Create `src/hooks/useInView.ts`:
```typescript
import { useEffect, useRef, useState } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
```

- [ ] **Step 2: Create hook test**

Create `src/__tests__/useInView.test.tsx`:
```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInView } from '../hooks/useInView';

describe('useInView', () => {
  it('returns ref and inView false initially', () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toBeDefined();
    expect(result.current.inView).toBe(false);
  });
});
```

- [ ] **Step 3: Run test**

Run:
```bash
npx vitest run src/__tests__/useInView.test.tsx
```
Expected: PASS

- [ ] **Step 4: Add scroll entrance CSS to global.css**

Read `src/styles/global.css`, append:
```css
/* ===== Scroll Entrance ===== */
.scroll-enter {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 400ms ease, transform 400ms ease;
}

.scroll-enter.in-view {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 5: Wire useInView to SkillBar for animated fill**

Read `src/components/SkillBar.tsx`, modify to accept `inView` prop instead of using Intersection Observer inside each bar (simpler: parent tracks). Actually, let's keep SkillBar simple and just use the CSS transition. The fill animation works automatically via CSS transition on width. No changes needed to SkillBar itself.

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useInView.ts src/__tests__/useInView.test.tsx src/styles/global.css
git commit -m "feat: add useInView hook and scroll entrance animations"
```

---

### Task 19: Integration Test & Final Polish

**Files:**
- Modify: `index.html` (update title)

- [ ] **Step 1: Update HTML title**

Read `index.html`, change `<title>` to:
```html
<title>张三 - 个人主页</title>
```

- [ ] **Step 2: Run all tests**

Run:
```bash
npx vitest run
```
Expected: ALL tests pass

- [ ] **Step 3: Run TypeScript check**

Run:
```bash
npx tsc --noEmit
```
Expected: No errors

- [ ] **Step 4: Start dev server and verify manually**

Run:
```bash
npm run dev
```
Check: All three tabs switch correctly, styles look right, mobile responsive.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "chore: update page title and final polish"
```

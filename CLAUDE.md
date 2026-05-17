# ProfileWeb

个人展示网站，支持后台编辑和三个小游戏。

## 技术栈

- **前端**: React 19 + TypeScript 6 + Vite 8
- **后端**: Express 5 + better-sqlite3 (SQLite)
- **测试**: Vitest + @testing-library/react (前端 jsdom), supertest (后端 node)
- **数据库**: SQLite 单文件 `server/data/profile.db`，首次自动从 `src/data/*.ts` 默认值建表种子

## 项目结构

```
src/
  data/          类型定义 + 硬编码默认值（同时用于 DB 种子）
  context/       DataContext — 从 API 加载数据，提供 CRUD 方法
  components/    可复用组件 (NavBar, Avatar, SkillBar, Timeline, ProjectCard, GameCard, StarryBackground, SocialLinks)
  sections/      首页各栏目组件 (HomeSection, ResumeSection, ProjectsSection, GamesSection)
  pages/         页面级组件 (MainPage, AdminPage, SnakeGame, MinesweeperGame, SchulteGame)
  styles/        全局 CSS (暗色主题，CSS 自定义属性)
server/
  index.ts       Express 入口
  db.ts          SQLite 连接 + schema + 自动种子
  seed.ts        从 src/data 默认值写入初始数据
  routes/        四个 REST 资源：profile, resume, projects, games
  __tests__/     API 测试
```

## 核心约定

- **数据流**: 前端首次渲染用默认值 → `useEffect` GET 四个 API → 覆盖为真实数据 → 失败则保持默认值
- **API 风格**: JSON only，PUT 全量替换语义，错误返回 `{ error: string }` + 500
- **路由**: 首页 `/`（4个 tab: home/resume/projects/games），管理 `/admin`（4个编辑子 tab），游戏 `/game/snake|minesweeper|schulte`
- **暗色主题**: 所有颜色通过 `--color-*` CSS 变量控制，不写死色值
- **管理后台**: 数据编辑后调 PUT API + 更新 Context 本地状态；拖拽排序后保存
- **全局 CLAUDE.md 规则**: 先想后做、简单优先、精准修改（不重构无关代码）、目标驱动验证

## 常用命令

```bash
npm run dev:all    # 前端 :5173 + 后端 :3001 并行启动
npm test           # 前端测试
npm run test:server # 后端 API 测试
```

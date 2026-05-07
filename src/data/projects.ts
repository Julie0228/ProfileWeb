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

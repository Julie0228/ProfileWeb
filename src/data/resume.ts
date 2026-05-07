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

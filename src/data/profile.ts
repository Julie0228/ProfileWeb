export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
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

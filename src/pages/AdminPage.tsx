import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { ProfileData, SocialLink } from '../data/profile';
import type { ResumeData, TimelineEntry, Skill } from '../data/resume';
import type { ProjectEntry } from '../data/projects';

type AdminTab = 'profile' | 'resume' | 'projects';

const ADMIN_TABS = [
  { key: 'profile' as const, label: '个人信息' },
  { key: 'resume' as const, label: '简历' },
  { key: 'projects' as const, label: '项目' },
];

export function AdminPage() {
  const { profile, resume, projects, updateProfile, updateResume, updateProjects, resetAll } = useData();
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = `管理 - ${profile.name}`;
  }, [profile.name]);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>管理后台</h1>
        <div className="admin-header-actions">
          <span className={`admin-saved ${saved ? 'visible' : ''}`}>已保存</span>
          <a href="/" className="admin-back-link">← 返回主页</a>
        </div>
      </header>

      <nav className="admin-tabs">
        {ADMIN_TABS.map((t) => (
          <button
            key={t.key}
            className={`admin-tab ${activeTab === t.key ? 'active' : ''}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="admin-content">
        {activeTab === 'profile' && (
          <ProfileEditor
            data={profile}
            onSave={(d) => { updateProfile(d); flashSaved(); }}
          />
        )}
        {activeTab === 'resume' && (
          <ResumeEditor
            data={resume}
            onSave={(d) => { updateResume(d); flashSaved(); }}
          />
        )}
        {activeTab === 'projects' && (
          <ProjectsEditor
            data={projects}
            onSave={(d) => { updateProjects(d); flashSaved(); }}
          />
        )}
      </div>

      <footer className="admin-footer">
        <button className="btn-danger" onClick={() => { resetAll(); flashSaved(); }}>
          恢复默认数据
        </button>
      </footer>
    </div>
  );
}

/* ===== Profile Editor ===== */

function ProfileEditor({ data, onSave }: { data: ProfileData; onSave: (d: ProfileData) => void }) {
  const [form, setForm] = useState<ProfileData>(structuredClone(data));

  const updateField = <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateSocialLink = (idx: number, field: keyof SocialLink, value: string) => {
    setForm((prev) => {
      const links = [...prev.socialLinks];
      links[idx] = { ...links[idx], [field]: value };
      return { ...prev, socialLinks: links };
    });
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: '' }],
    }));
  };

  const removeSocialLink = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }));
  };

  return (
    <div className="editor-section">
      <div className="field">
        <label>姓名</label>
        <input value={form.name} onChange={(e) => updateField('name', e.target.value)} />
      </div>
      <div className="field">
        <label>头衔</label>
        <input value={form.title} onChange={(e) => updateField('title', e.target.value)} />
      </div>
      <div className="field">
        <label>简介</label>
        <textarea value={form.bio} onChange={(e) => updateField('bio', e.target.value)} rows={3} />
      </div>
      <div className="field">
        <label>头像 URL</label>
        <input value={form.avatarUrl} onChange={(e) => updateField('avatarUrl', e.target.value)} />
      </div>

      <h3>社交链接</h3>
      {form.socialLinks.map((link, i) => (
        <div key={i} className="field-row">
          <input
            placeholder="平台"
            value={link.platform}
            onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
          />
          <input
            placeholder="URL"
            value={link.url}
            onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
          />
          <input
            placeholder="图标"
            value={link.icon}
            onChange={(e) => updateSocialLink(i, 'icon', e.target.value)}
          />
          <button className="btn-sm btn-danger" onClick={() => removeSocialLink(i)}>删除</button>
        </div>
      ))}
      <button className="btn-sm" onClick={addSocialLink}>+ 添加链接</button>

      <div className="editor-actions">
        <button className="btn-primary" onClick={() => onSave(form)}>保存</button>
      </div>
    </div>
  );
}

/* ===== Resume Editor ===== */

function ResumeEditor({ data, onSave }: { data: ResumeData; onSave: (d: ResumeData) => void }) {
  const [form, setForm] = useState<ResumeData>(structuredClone(data));

  const updateTimeline = (
    key: 'education' | 'experience',
    idx: number,
    field: keyof TimelineEntry,
    value: string,
  ) => {
    setForm((prev) => {
      const arr = [...prev[key]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [key]: arr };
    });
  };

  const addTimelineEntry = (key: 'education' | 'experience') => {
    setForm((prev) => ({
      ...prev,
      [key]: [...prev[key], { id: crypto.randomUUID(), title: '', subtitle: '', date: '', description: '' }],
    }));
  };

  const removeTimelineEntry = (key: 'education' | 'experience', idx: number) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== idx),
    }));
  };

  const updateSkill = (idx: number, field: keyof Skill, value: string | number) => {
    setForm((prev) => {
      const arr = [...prev.skills];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, skills: arr };
    });
  };

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 50 }],
    }));
  };

  const removeSkill = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== idx),
    }));
  };

  const TimelineSection = ({ title, keyName }: { title: string; keyName: 'education' | 'experience' }) => (
    <div className="editor-subsection">
      <h3>{title}</h3>
      {form[keyName].map((entry, i) => (
        <div key={entry.id || i} className="editor-card">
          <input
            placeholder="标题"
            value={entry.title}
            onChange={(e) => updateTimeline(keyName, i, 'title', e.target.value)}
          />
          <input
            placeholder="副标题（学校/公司）"
            value={entry.subtitle}
            onChange={(e) => updateTimeline(keyName, i, 'subtitle', e.target.value)}
          />
          <input
            placeholder="日期"
            value={entry.date}
            onChange={(e) => updateTimeline(keyName, i, 'date', e.target.value)}
          />
          <textarea
            placeholder="描述"
            value={entry.description}
            onChange={(e) => updateTimeline(keyName, i, 'description', e.target.value)}
            rows={2}
          />
          <button className="btn-sm btn-danger" onClick={() => removeTimelineEntry(keyName, i)}>删除</button>
        </div>
      ))}
      <button className="btn-sm" onClick={() => addTimelineEntry(keyName)}>+ 添加</button>
    </div>
  );

  return (
    <div className="editor-section">
      <TimelineSection title="教育经历" keyName="education" />
      <TimelineSection title="工作经历" keyName="experience" />

      <div className="editor-subsection">
        <h3>技能</h3>
        {form.skills.map((skill, i) => (
          <div key={i} className="field-row">
            <input
              placeholder="技能名"
              value={skill.name}
              onChange={(e) => updateSkill(i, 'name', e.target.value)}
            />
            <input
              type="number"
              min={0}
              max={100}
              placeholder="熟练度"
              value={skill.level}
              onChange={(e) => updateSkill(i, 'level', Number(e.target.value))}
              style={{ width: 80 }}
            />
            <button className="btn-sm btn-danger" onClick={() => removeSkill(i)}>删除</button>
          </div>
        ))}
        <button className="btn-sm" onClick={addSkill}>+ 添加技能</button>
      </div>

      <div className="editor-actions">
        <button className="btn-primary" onClick={() => onSave(form)}>保存</button>
      </div>
    </div>
  );
}

/* ===== Projects Editor ===== */

function ProjectsEditor({ data, onSave }: { data: ProjectEntry[]; onSave: (d: ProjectEntry[]) => void }) {
  const [form, setForm] = useState<ProjectEntry[]>(structuredClone(data));

  const updateProject = (idx: number, field: keyof ProjectEntry, value: string | string[]) => {
    setForm((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });
  };

  const updateTechStack = (idx: number, value: string) => {
    setForm((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], techStack: value.split(',').map((s) => s.trim()).filter(Boolean) };
      return arr;
    });
  };

  const addProject = () => {
    setForm((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        description: '',
        techStack: [],
        imageUrl: '',
        githubUrl: '',
        liveUrl: '',
      },
    ]);
  };

  const removeProject = (idx: number) => {
    setForm((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="editor-section">
      {form.map((proj, i) => (
        <div key={proj.id || i} className="editor-card">
          <input
            placeholder="项目名称"
            value={proj.name}
            onChange={(e) => updateProject(i, 'name', e.target.value)}
          />
          <textarea
            placeholder="描述"
            value={proj.description}
            onChange={(e) => updateProject(i, 'description', e.target.value)}
            rows={2}
          />
          <input
            placeholder="技术栈（逗号分隔）"
            value={proj.techStack.join(', ')}
            onChange={(e) => updateTechStack(i, e.target.value)}
          />
          <input
            placeholder="图片 URL"
            value={proj.imageUrl}
            onChange={(e) => updateProject(i, 'imageUrl', e.target.value)}
          />
          <input
            placeholder="GitHub URL"
            value={proj.githubUrl}
            onChange={(e) => updateProject(i, 'githubUrl', e.target.value)}
          />
          <input
            placeholder="在线地址（可选）"
            value={proj.liveUrl ?? ''}
            onChange={(e) => updateProject(i, 'liveUrl', e.target.value || undefined as unknown as string)}
          />
          <button className="btn-sm btn-danger" onClick={() => removeProject(i)}>删除项目</button>
        </div>
      ))}
      <button className="btn-sm" onClick={addProject}>+ 添加项目</button>

      <div className="editor-actions">
        <button className="btn-primary" onClick={() => onSave(form)}>保存</button>
      </div>
    </div>
  );
}

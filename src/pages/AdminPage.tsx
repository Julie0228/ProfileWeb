import { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import type { ProfileData, SocialLink } from '../data/profile';
import type { ResumeData, TimelineEntry, Skill } from '../data/resume';
import type { ProjectEntry } from '../data/projects';
import type { GameEntry } from '../data/games';

type AdminTab = 'profile' | 'personal' | 'games';

const ADMIN_TABS = [
  { key: 'profile' as const, label: '基本信息' },
  { key: 'personal' as const, label: '经历与项目' },
  { key: 'games' as const, label: '游戏' },
];

export function AdminPage() {
  const { profile, resume, projects, games, updateProfile, updateResume, updateProjects, updateGames, resetAll } = useData();
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
            onSave={async (d) => { await updateProfile(d); flashSaved(); }}
          />
        )}
        {activeTab === 'personal' && (
          <>
            <ResumeEditor
              data={resume}
              onSave={async (d) => { await updateResume(d); flashSaved(); }}
            />
            <hr style={{ borderColor: 'var(--color-border)', margin: '32px 0' }} />
            <ProjectsEditor
              data={projects}
              onSave={async (d) => { await updateProjects(d); flashSaved(); }}
            />
          </>
        )}
        {activeTab === 'games' && (
          <GamesEditor
            data={games}
            onSave={async (d) => { await updateGames(d); flashSaved(); }}
          />
        )}
      </div>

      <footer className="admin-footer">
        <button className="btn-danger" onClick={async () => { if (window.confirm('确定要恢复默认数据吗？当前所有修改将丢失。')) { await resetAll(); flashSaved(); } }}>
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
        {form.avatarUrl && (
          <img
            src={form.avatarUrl}
            alt="头像预览"
            style={{ maxWidth: 120, marginTop: 8, borderRadius: '50%', aspectRatio: '1', objectFit: 'cover' }}
          />
        )}
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
  const dragItem = useRef<{ type: 'education' | 'experience' | 'skill'; index: number } | null>(null);
  const dragCounter = useRef(0);

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

  // Drag-and-drop handlers
  const handleDragStart = (type: 'education' | 'experience' | 'skill', index: number, e: React.DragEvent) => {
    dragItem.current = { type, index };
    e.dataTransfer.effectAllowed = 'move';
    const el = e.currentTarget as HTMLElement;
    requestAnimationFrame(() => el.classList.add('dragging'));
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove('dragging');
    dragItem.current = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    (e.currentTarget as HTMLElement).classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      (e.currentTarget as HTMLElement).classList.remove('drag-over');
      dragCounter.current = 0;
    }
  };

  const handleDrop = (type: 'education' | 'experience' | 'skill', targetIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove('drag-over');
    dragCounter.current = 0;

    if (!dragItem.current) return;
    const { type: sourceType, index: sourceIndex } = dragItem.current;
    if (sourceType !== type || sourceIndex === targetIndex) return;

    if (type === 'education' || type === 'experience') {
      setForm((prev) => {
        const arr = [...prev[type]];
        const [moved] = arr.splice(sourceIndex, 1);
        arr.splice(targetIndex, 0, moved);
        return { ...prev, [type]: arr };
      });
    } else {
      setForm((prev) => {
        const arr = [...prev.skills];
        const [moved] = arr.splice(sourceIndex, 1);
        arr.splice(targetIndex, 0, moved);
        return { ...prev, skills: arr };
      });
    }

    dragItem.current = null;
  };

  return (
    <div className="editor-section">
      {(['education', 'experience'] as const).map((keyName) => (
        <div className="editor-subsection" key={keyName}>
          <h3>{keyName === 'education' ? '教育经历' : '工作经历'}</h3>
          <p className="drag-hint">拖拽卡片可调整顺序</p>
          {form[keyName].map((entry, i) => (
            <div
              key={entry.id || i}
              className="editor-card draggable-card"
              draggable
              onDragStart={(e) => handleDragStart(keyName, i, e)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(keyName, i, e)}
            >
              <span className="drag-handle" title="拖拽排序">⋮⋮</span>
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
      ))}

      <div className="editor-subsection">
        <h3>技能</h3>
        <p className="drag-hint">拖拽技能行可调整顺序</p>
        {form.skills.map((skill, i) => (
          <div
            key={i}
            className="field-row draggable-card"
            draggable
            onDragStart={(e) => handleDragStart('skill', i, e)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop('skill', i, e)}
          >
            <span className="drag-handle" title="拖拽排序">⋮⋮</span>
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
          {proj.imageUrl && (
            <img
              src={proj.imageUrl}
              alt={proj.name}
              style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }}
            />
          )}
          <input
            placeholder="GitHub URL"
            value={proj.githubUrl}
            onChange={(e) => updateProject(i, 'githubUrl', e.target.value)}
          />
          <input
            placeholder="在线地址（可选）"
            value={proj.liveUrl ?? ''}
            onChange={(e) => updateProject(i, 'liveUrl', e.target.value || (undefined as unknown as string))}
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

/* ===== Games Editor ===== */

function GamesEditor({ data, onSave }: { data: GameEntry[]; onSave: (d: GameEntry[]) => void }) {
  const [form, setForm] = useState<GameEntry[]>(structuredClone(data));

  const updateGame = (idx: number, field: keyof GameEntry, value: string) => {
    setForm((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });
  };

  return (
    <div className="editor-section">
      {form.map((game, i) => (
        <div key={game.id} className="editor-card">
          <input
            placeholder="游戏名称"
            value={game.name}
            onChange={(e) => updateGame(i, 'name', e.target.value)}
          />
          <textarea
            placeholder="描述"
            value={game.description}
            onChange={(e) => updateGame(i, 'description', e.target.value)}
            rows={2}
          />
          <div className="field">
            <label>封面图片 URL</label>
            <input
              placeholder="例如 /贪吃蛇.png"
              value={game.coverUrl}
              onChange={(e) => updateGame(i, 'coverUrl', e.target.value)}
            />
          </div>
          {game.coverUrl && (
            <img
              src={game.coverUrl}
              alt={game.name}
              className="game-cover-preview"
              style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }}
            />
          )}
        </div>
      ))}

      <div className="editor-actions">
        <button className="btn-primary" onClick={() => onSave(form)}>保存</button>
      </div>
    </div>
  );
}

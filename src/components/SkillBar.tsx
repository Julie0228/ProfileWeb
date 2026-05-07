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

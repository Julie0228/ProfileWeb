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

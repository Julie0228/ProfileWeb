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

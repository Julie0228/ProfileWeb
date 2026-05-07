import type { ProjectEntry } from '../data/projects';

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

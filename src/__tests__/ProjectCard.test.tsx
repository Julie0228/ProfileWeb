import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '../components/ProjectCard';
import type { ProjectEntry } from '../data/projects';

const project: ProjectEntry = {
  id: '1',
  name: 'Test Project',
  description: 'A test project description',
  techStack: ['React', 'TS'],
  imageUrl: '',
  githubUrl: 'https://github.com/test/proj',
  liveUrl: 'https://proj.example.com',
};

describe('ProjectCard', () => {
  it('renders project name and description', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('A test project description')).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TS')).toBeInTheDocument();
  });

  it('renders links with correct hrefs', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('GitHub')).toHaveAttribute('href', 'https://github.com/test/proj');
    expect(screen.getByText('Live Demo')).toHaveAttribute('href', 'https://proj.example.com');
  });

  it('does not render live link when undefined', () => {
    const noLive = { ...project, liveUrl: undefined as string | undefined };
    render(<ProjectCard project={noLive} />);
    expect(screen.queryByText('Live Demo')).toBeNull();
  });

  it('uses placeholder image when imageUrl is empty', () => {
    render(<ProjectCard project={project} />);
    const img = screen.getByAltText('Test Project');
    expect(img).toHaveAttribute('src', '/project-placeholder.svg');
  });
});

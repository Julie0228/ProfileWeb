import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectsSection } from '../sections/ProjectsSection';
import type { ProjectEntry } from '../data/projects';

const data: ProjectEntry[] = [
  {
    id: '1',
    name: 'Project A',
    description: 'Description A',
    techStack: ['React'],
    imageUrl: '',
    githubUrl: 'https://github.com/a',
  },
  {
    id: '2',
    name: 'Project B',
    description: 'Description B',
    techStack: ['Vue'],
    imageUrl: '',
    githubUrl: 'https://github.com/b',
    liveUrl: 'https://b.example.com',
  },
];

describe('ProjectsSection', () => {
  it('renders all project names', () => {
    render(<ProjectsSection data={data} isActive={true} />);
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('shows empty state when no projects', () => {
    render(<ProjectsSection data={[]} isActive={true} />);
    expect(screen.getByText(/暂无项目/)).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(<ProjectsSection data={data} isActive={true} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(true);
  });

  it('does not apply active class when isActive is false', () => {
    const { container } = render(<ProjectsSection data={data} isActive={false} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(false);
  });
});

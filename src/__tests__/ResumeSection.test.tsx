import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResumeSection } from '../sections/ResumeSection';
import { ResumeData } from '../data/resume';

const data: ResumeData = {
  education: [
    { id: '1', title: 'CS Degree', subtitle: 'University', date: '2020', description: 'Studied CS' },
  ],
  experience: [
    { id: '2', title: 'Developer', subtitle: 'Company', date: '2023', description: 'Worked' },
  ],
  skills: [
    { name: 'React', level: 80 },
  ],
};

describe('ResumeSection', () => {
  it('renders section title for education', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('教育经历')).toBeInTheDocument();
  });

  it('renders section title for experience', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('工作经历')).toBeInTheDocument();
  });

  it('renders section title for skills', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('技能')).toBeInTheDocument();
  });

  it('renders timeline entries', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('CS Degree')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('renders skill bars', () => {
    render(<ResumeSection data={data} isActive={true} />);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(<ResumeSection data={data} isActive={true} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(true);
  });
});

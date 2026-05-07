import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timeline } from '../components/Timeline';
import type { TimelineEntry } from '../data/resume';

const entries: TimelineEntry[] = [
  { id: '1', title: 'Engineer', subtitle: 'Acme Corp', date: '2023', description: 'Did things' },
  { id: '2', title: 'Intern', subtitle: 'Startup', date: '2022', description: 'Learned things' },
];

describe('Timeline', () => {
  it('renders all entries', () => {
    render(<Timeline entries={entries} />);
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Intern')).toBeInTheDocument();
  });

  it('shows empty message when no entries', () => {
    render(<Timeline entries={[]} />);
    expect(screen.getByText(/暂无数据/)).toBeInTheDocument();
  });

  it('renders entries with subtitle and date', () => {
    render(<Timeline entries={entries} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('Did things')).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from '../components/NavBar';

const tabs = [
  { key: 'home', label: '首页' },
  { key: 'resume', label: '简历' },
  { key: 'projects', label: '项目' },
] as const;

describe('NavBar', () => {
  it('renders all tab labels', () => {
    render(<NavBar activeTab="home" onTabChange={() => {}} />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('简历')).toBeInTheDocument();
    expect(screen.getByText('项目')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<NavBar activeTab="resume" onTabChange={() => {}} />);
    const activeTab = screen.getByText('简历');
    expect(activeTab.classList.contains('active')).toBe(true);
  });

  it('calls onTabChange when clicking a tab', async () => {
    const onChange = vi.fn();
    render(<NavBar activeTab="home" onTabChange={onChange} />);
    await userEvent.click(screen.getByText('项目'));
    expect(onChange).toHaveBeenCalledWith('projects');
  });
});

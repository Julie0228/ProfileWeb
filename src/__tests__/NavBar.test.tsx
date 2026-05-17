import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from '../components/NavBar';

describe('NavBar', () => {
  it('renders all tab labels', () => {
    render(<NavBar activeTab="home" onTabChange={() => {}} />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('新闻')).toBeInTheDocument();
    expect(screen.getByText('个人信息')).toBeInTheDocument();
    expect(screen.getByText('游戏')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<NavBar activeTab="personal" onTabChange={() => {}} />);
    const activeTab = screen.getByText('个人信息');
    expect(activeTab.classList.contains('active')).toBe(true);
  });

  it('calls onTabChange when clicking a tab', async () => {
    const onChange = vi.fn();
    render(<NavBar activeTab="home" onTabChange={onChange} />);
    await userEvent.click(screen.getByText('个人信息'));
    expect(onChange).toHaveBeenCalledWith('personal');
  });
});

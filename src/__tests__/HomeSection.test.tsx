import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomeSection } from '../sections/HomeSection';
import { ProfileData } from '../data/profile';

const data: ProfileData = {
  name: '张三',
  title: '工程师',
  bio: '热爱技术',
  avatarUrl: '/test.jpg',
  socialLinks: [{ platform: 'GitHub', url: 'https://github.com/', icon: 'GH' }],
};

describe('HomeSection', () => {
  it('renders name, title, and bio', () => {
    render(<HomeSection data={data} isActive={true} />);
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('工程师')).toBeInTheDocument();
    expect(screen.getByText('热爱技术')).toBeInTheDocument();
  });

  it('renders avatar', () => {
    render(<HomeSection data={data} isActive={true} />);
    expect(screen.getByAltText('张三')).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<HomeSection data={data} isActive={true} />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
  });

  it('applies active class when isActive is true', () => {
    const { container } = render(<HomeSection data={data} isActive={true} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(true);
  });

  it('does not apply active class when isActive is false', () => {
    const { container } = render(<HomeSection data={data} isActive={false} />);
    expect(container.firstElementChild?.classList.contains('active')).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialLinks } from '../components/SocialLinks';
import { SocialLink } from '../data/profile';

const links: SocialLink[] = [
  { platform: 'GitHub', url: 'https://github.com/test', icon: '🐙' },
  { platform: 'Email', url: 'mailto:test@test.com', icon: '✉️' },
];

describe('SocialLinks', () => {
  it('renders all links', () => {
    render(<SocialLinks links={links} />);
    const anchors = screen.getAllByRole('link');
    expect(anchors).toHaveLength(2);
  });

  it('renders correct hrefs', () => {
    render(<SocialLinks links={links} />);
    expect(screen.getByLabelText('GitHub')).toHaveAttribute('href', 'https://github.com/test');
    expect(screen.getByLabelText('Email')).toHaveAttribute('href', 'mailto:test@test.com');
  });

  it('renders empty when no links', () => {
    const { container } = render(<SocialLinks links={[]} />);
    expect(container.querySelector('a')).toBeNull();
  });
});

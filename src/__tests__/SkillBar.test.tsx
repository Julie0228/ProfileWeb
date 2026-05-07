import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkillBar } from '../components/SkillBar';

describe('SkillBar', () => {
  it('renders skill name and level', () => {
    render(<SkillBar name="TypeScript" level={85} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('clamps level to 0 when negative', () => {
    render(<SkillBar name="Test" level={-10} />);
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('clamps level to 100 when over 100', () => {
    render(<SkillBar name="Test" level={150} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('sets fill width to clamped percentage', () => {
    const { container } = render(<SkillBar name="Test" level={75} />);
    const fill = container.querySelector('.skill-bar-fill') as HTMLElement;
    expect(fill.style.getPropertyValue('--level')).toBe('75%');
  });
});

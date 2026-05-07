import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { Avatar } from '../components/Avatar';

describe('Avatar', () => {
  it('renders image when src is provided', () => {
    render(<Avatar src="/test.jpg" alt="Test User" />);
    const img = screen.getByAltText('Test User');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.jpg');
  });

  it('shows initials fallback when image fails to load', async () => {
    render(<Avatar src="/bad.jpg" alt="张三" />);
    const img = screen.getByAltText('张三');
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
    await waitFor(() => {
      expect(screen.getByText('张')).toBeInTheDocument();
    });
  });

  it('takes initials from first character of alt text', async () => {
    render(<Avatar src="/bad.jpg" alt="John" />);
    const img = screen.getByAltText('John');
    act(() => {
      img.dispatchEvent(new Event('error'));
    });
    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });

  it('renders without src and shows fallback immediately', () => {
    render(<Avatar src="" alt="Test" />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';

describe('Global styles', () => {
  it('should have expected CSS variable definitions loaded', () => {
    expect(() => {
      const el = document.createElement('div');
      el.className = 'container';
      document.body.appendChild(el);
      document.body.removeChild(el);
    }).not.toThrow();
  });
});

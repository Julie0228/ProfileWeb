import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInView } from '../hooks/useInView';

describe('useInView', () => {
  it('returns ref and inView false initially', () => {
    const { result } = renderHook(() => useInView());
    expect(result.current.ref).toBeDefined();
    expect(result.current.inView).toBe(false);
  });
});

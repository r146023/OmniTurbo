import { renderHook, act } from '@testing-library/react';

import { omni } from '../../OmniTurbo';
import { useOmni } from '../useOmni';
import { describe, beforeEach, it, expect } from 'vitest';

describe('useOmni', () => {
  beforeEach(() => omni.clear());

  it('returns the value at the given path', () => {
    omni.set('useOmni.user.name', 'Alice');
    const { result } = renderHook(() => useOmni('useOmni.user.name'));
    expect(result.current).toBe('Alice');
  });

  it('updates when the value changes', () => {
    omni.set('useOmni.user.name', 'Alice');
    const { result, rerender } = renderHook(() => useOmni('useOmni.user.name'));
    act(() => {
      omni.set('useOmni.user.name', 'Bob');
    });
    rerender();
    expect(result.current).toBe('Bob');
  });
});
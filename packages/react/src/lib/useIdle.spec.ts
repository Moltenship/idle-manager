import { act, fireEvent, renderHook } from '@testing-library/react';
import { cleanup } from '@testing-library/react';

import { useIdle } from './useIdle';

describe('useIdle hook', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllTimers();
    cleanup();
  });

  it('should be active after event fires', async() => {
    const {result} = renderHook(() => useIdle({ initialState: 'idle' }));
    fireEvent(document, new Event('mousemove'));
    expect(result.current).toBeFalsy();
  });

  it('should be idle if nothing happens', () => {
    const {result} = renderHook(() => useIdle({ initialState: 'active' }));

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBeTruthy();
  });

  it('should become idle after 3000ms', () => {
    const {result} = renderHook(() => useIdle({ initialState: 'active', timeToIdleMs: 3000 }));

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toBeTruthy();
  });

});

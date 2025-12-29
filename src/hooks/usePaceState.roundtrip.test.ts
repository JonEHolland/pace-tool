import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaceState } from './usePaceState';
import { MemoryStorage } from '../utils/storage';

describe('usePaceState - round-trip preservation', () => {
  it('preserves exact value when switching km→mi→km', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
    
    const originalMinutes = result.current.paceMinutes;
    const originalSeconds = result.current.paceSeconds;
    
    act(() => result.current.setUnit('mi'));
    act(() => result.current.setUnit('km'));
    
    expect(result.current.paceMinutes).toBe(originalMinutes);
    expect(result.current.paceSeconds).toBe(originalSeconds);
  });

  it('preserves exact value when switching mi→km→mi', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => usePaceState(8, 0, 'mi', storage));
    
    const originalMinutes = result.current.paceMinutes;
    const originalSeconds = result.current.paceSeconds;
    
    act(() => result.current.setUnit('km'));
    act(() => result.current.setUnit('mi'));
    
    expect(result.current.paceMinutes).toBe(originalMinutes);
    expect(result.current.paceSeconds).toBe(originalSeconds);
  });

  it('preserves exact value through multiple unit switches', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => usePaceState(6, 30, 'km', storage));
    
    const originalMinutes = result.current.paceMinutes;
    const originalSeconds = result.current.paceSeconds;
    
    // Switch back and forth 10 times
    for (let i = 0; i < 10; i++) {
      act(() => result.current.setUnit('mi'));
      act(() => result.current.setUnit('km'));
    }
    
    expect(result.current.paceMinutes).toBe(originalMinutes);
    expect(result.current.paceSeconds).toBe(originalSeconds);
  });

  it('preserves value when user changes pace then switches units', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
    
    // User changes the pace
    act(() => result.current.setPaceMinutes(7));
    act(() => result.current.setPaceSeconds(30));
    
    const minutesAfterChange = result.current.paceMinutes;
    const secondsAfterChange = result.current.paceSeconds;
    
    // Switch units and back
    act(() => result.current.setUnit('mi'));
    act(() => result.current.setUnit('km'));
    
    expect(result.current.paceMinutes).toBe(minutesAfterChange);
    expect(result.current.paceSeconds).toBe(secondsAfterChange);
  });
});

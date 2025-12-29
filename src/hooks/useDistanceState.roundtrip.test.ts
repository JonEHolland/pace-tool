import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDistanceState } from './useDistanceState';
import { MemoryStorage } from '../utils/storage';

describe('useDistanceState - round-trip preservation', () => {
  it('preserves exact value when switching km→mi→km', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
    
    const original = result.current.distance;
    
    act(() => result.current.setUnit('mi'));
    act(() => result.current.setUnit('km'));
    
    expect(result.current.distance).toBe(original);
  });

  it('preserves exact value when switching mi→km→mi', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => useDistanceState(10.0, 'mi', storage));
    
    const original = result.current.distance;
    
    act(() => result.current.setUnit('km'));
    act(() => result.current.setUnit('mi'));
    
    expect(result.current.distance).toBe(original);
  });

  it('preserves exact value through multiple unit switches', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
    
    const original = result.current.distance;
    
    // Switch back and forth 10 times
    for (let i = 0; i < 10; i++) {
      act(() => result.current.setUnit('mi'));
      act(() => result.current.setUnit('km'));
    }
    
    expect(result.current.distance).toBe(original);
  });

  it('preserves value when user changes distance then switches units', () => {
    const storage = new MemoryStorage();
    const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
    
    // User changes the distance
    act(() => result.current.setDistance(10.0));
    
    const valueAfterChange = result.current.distance;
    
    // Switch units and back
    act(() => result.current.setUnit('mi'));
    act(() => result.current.setUnit('km'));
    
    expect(result.current.distance).toBe(valueAfterChange);
  });
});

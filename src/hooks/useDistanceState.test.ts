import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDistanceState } from './useDistanceState';
import { MemoryStorage } from '../utils/storage';

describe('useDistanceState', () => {
  describe('initialization', () => {
    it('uses default values', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      expect(result.current.distance).toBe(5.0);
      expect(result.current.unit).toBe('km');
    });

    it('uses provided values', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(10.0, 'km', storage));
      
      expect(result.current.distance).toBe(10.0);
      expect(result.current.unit).toBe('km');
    });

    it('restores from storage', () => {
      const storage = new MemoryStorage();
      storage.setItem('pace-tool-distance', '25.5');
      storage.setItem('pace-tool-distance-unit', 'km');
      
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      expect(result.current.distance).toBe(25.5);
      expect(result.current.unit).toBe('km');
    });

    it('handles corrupted storage gracefully', () => {
      const storage = new MemoryStorage();
      storage.setItem('pace-tool-distance', 'invalid');
      storage.setItem('pace-tool-distance-unit', 'yards');
      
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      expect(result.current.distance).toBe(5.0);
      expect(result.current.unit).toBe('km');
    });

    it('clamps values below minimum', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(0.005, 'km', storage));
      expect(result.current.distance).toBe(0.01);
    });

    it('clamps values above maximum', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(2000, 'km', storage));
      expect(result.current.distance).toBe(999.99);
    });
  });

  describe('setDistance', () => {
    it('updates distance', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      act(() => result.current.setDistance(10.0));
      
      expect(result.current.distance).toBe(10.0);
    });

    it('clamps values to valid range', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      act(() => result.current.setDistance(0));
      expect(result.current.distance).toBe(0.01);
      
      act(() => result.current.setDistance(10000));
      expect(result.current.distance).toBe(999.99);
    });

    it('persists to storage', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      act(() => result.current.setDistance(15.5));
      
      expect(storage.getItem('pace-tool-distance')).toBe('15.5');
    });
  });

  describe('setUnit', () => {
    it('switches units', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      act(() => result.current.setUnit('mi'));
      
      expect(result.current.unit).toBe('mi');
    });

    it('persists unit to storage', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      act(() => result.current.setUnit('mi'));
      
      expect(storage.getItem('pace-tool-distance-unit')).toBe('mi');
    });
  });

  describe('convertedDistance', () => {
    it('provides opposite unit conversion', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      expect(result.current.convertedUnit).toBe('mi');
      expect(result.current.convertedDistance.value).toBeCloseTo(3.107, 2);
    });
  });

  describe('return value', () => {
    it('has all required properties', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
      
      expect(result.current).toHaveProperty('distance');
      expect(result.current).toHaveProperty('unit');
      expect(result.current).toHaveProperty('convertedDistance');
      expect(result.current).toHaveProperty('convertedUnit');
      expect(result.current).toHaveProperty('setDistance');
      expect(result.current).toHaveProperty('setUnit');
    });
  });
});

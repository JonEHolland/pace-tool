import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePaceState } from './usePaceState';
import { MemoryStorage } from '../utils/storage';

describe('usePaceState', () => {
  describe('initialization', () => {
    it('uses default values', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      expect(result.current.paceMinutes).toBe(5);
      expect(result.current.paceSeconds).toBe(0);
      expect(result.current.unit).toBe('km');
    });

    it('uses provided values', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(7, 30, 'mi', storage));
      
      expect(result.current.paceMinutes).toBe(7);
      expect(result.current.paceSeconds).toBe(30);
      expect(result.current.unit).toBe('mi');
    });

    it('restores from storage', () => {
      const storage = new MemoryStorage();
      storage.setItem('pace-tool-pace-minutes', '6');
      storage.setItem('pace-tool-pace-seconds', '45');
      storage.setItem('pace-tool-pace-unit', 'mi');
      
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      expect(result.current.paceMinutes).toBe(6);
      expect(result.current.paceSeconds).toBe(45);
      expect(result.current.unit).toBe('mi');
    });

    it('handles corrupted storage gracefully', () => {
      const storage = new MemoryStorage();
      storage.setItem('pace-tool-pace-minutes', 'invalid');
      storage.setItem('pace-tool-pace-unit', 'yards');
      
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      expect(result.current.paceMinutes).toBe(5);
      expect(result.current.unit).toBe('km');
    });
  });

  describe('setPaceMinutes', () => {
    it('updates minutes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      act(() => result.current.setPaceMinutes(7));
      
      expect(result.current.paceMinutes).toBe(7);
    });

    it('clamps to valid range', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      act(() => result.current.setPaceMinutes(1));
      expect(result.current.paceMinutes).toBe(2);
      
      act(() => result.current.setPaceMinutes(25));
      expect(result.current.paceMinutes).toBe(20);
    });

    it('persists to storage', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      act(() => result.current.setPaceMinutes(8));
      
      expect(storage.getItem('pace-tool-pace-minutes')).toBe('8');
    });
  });

  describe('setPaceSeconds', () => {
    it('updates seconds', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      act(() => result.current.setPaceSeconds(45));
      
      expect(result.current.paceSeconds).toBe(45);
    });

    it('normalizes overflow to minutes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      act(() => result.current.setPaceSeconds(75));
      
      expect(result.current.paceMinutes).toBe(6);
      expect(result.current.paceSeconds).toBe(15);
    });

    it('clamps to valid range', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(20, 0, 'km', storage));
      
      act(() => result.current.setPaceSeconds(15));
      
      expect(result.current.paceMinutes).toBe(20);
      expect(result.current.paceSeconds).toBe(0);
    });
  });

  describe('setUnit', () => {
    it('switches units', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      act(() => result.current.setUnit('mi'));
      
      expect(result.current.unit).toBe('mi');
    });

    it('persists unit to storage', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      act(() => result.current.setUnit('mi'));
      
      expect(storage.getItem('pace-tool-pace-unit')).toBe('mi');
    });
  });

  describe('convertedPace', () => {
    it('provides opposite unit conversion', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      expect(result.current.convertedUnit).toBe('mi');
      expect(result.current.convertedPace.minutes).toBe(8);
      expect(result.current.convertedPace.seconds).toBe(3);
    });
  });

  describe('return value', () => {
    it('has all required properties', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => usePaceState(5, 0, 'km', storage));
      
      expect(result.current).toHaveProperty('paceMinutes');
      expect(result.current).toHaveProperty('paceSeconds');
      expect(result.current).toHaveProperty('unit');
      expect(result.current).toHaveProperty('convertedPace');
      expect(result.current).toHaveProperty('convertedUnit');
      expect(result.current).toHaveProperty('setPaceMinutes');
      expect(result.current).toHaveProperty('setPaceSeconds');
      expect(result.current).toHaveProperty('setUnit');
    });
  });
});

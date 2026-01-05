import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSplitsState } from './useSplitsState';
import { MemoryStorage } from '../utils/storage';
import '../test-utils';

describe('useSplitsState', () => {
  describe('initialization', () => {
    it('initializes with default values', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      expect(result.current.distanceId).toBe('10k');
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(45);
      expect(result.current.seconds).toBe(0);
      expect(result.current.splitPercent).toBe(0);
      expect(result.current.unit).toBe('km');
      expect(result.current.distanceKm).toBe(10.0);
    });

    it('loads from storage if available', () => {
      const storage = new MemoryStorage();
      storage.setItem('pace-tool-splits-distance', '5k');
      storage.setItem('pace-tool-splits-hours', '0');
      storage.setItem('pace-tool-splits-minutes', '20');
      storage.setItem('pace-tool-splits-seconds', '30');
      storage.setItem('pace-tool-splits-percent', '25');
      storage.setItem('pace-tool-splits-unit', 'mi');

      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      expect(result.current.distanceId).toBe('5k');
      expect(result.current.hours).toBe(0);
      expect(result.current.minutes).toBe(20);
      expect(result.current.seconds).toBe(30);
      expect(result.current.splitPercent).toBe(25);
      expect(result.current.unit).toBe('mi');
    });
  });

  describe('persistence', () => {
    it('persists distance ID changes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setDistanceId('half'));

      expect(storage.getItem('pace-tool-splits-distance')).toBe('half');
    });

    it('persists time changes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setHours(1));
      act(() => result.current.setMinutes(30));
      act(() => result.current.setSeconds(45));

      expect(storage.getItem('pace-tool-splits-hours')).toBe('1');
      expect(storage.getItem('pace-tool-splits-minutes')).toBe('30');
      expect(storage.getItem('pace-tool-splits-seconds')).toBe('45');
    });

    it('persists split percent changes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setSplitPercent(50));

      expect(storage.getItem('pace-tool-splits-percent')).toBe('50');
    });

    it('persists unit changes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setUnit('mi'));

      expect(storage.getItem('pace-tool-splits-unit')).toBe('mi');
    });
  });

  describe('distance mapping', () => {
    it('maps 5k correctly', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('5k', 0, 20, 0, 0, 'km', storage)
      );

      expect(result.current.distanceKm).toBe(5.0);
    });

    it('maps half marathon correctly', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('half', 1, 30, 0, 0, 'km', storage)
      );

      expect(result.current.distanceKm).toBe(21.0975);
    });

    it('maps full marathon correctly', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('full', 3, 0, 0, 0, 'km', storage)
      );

      expect(result.current.distanceKm).toBe(42.195);
    });

    it('updates distance when ID changes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      expect(result.current.distanceKm).toBe(10.0);

      act(() => result.current.setDistanceId('5k'));

      expect(result.current.distanceKm).toBe(5.0);
    });
  });

  describe('splits calculation', () => {
    it('calculates even splits for metric', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      expect(result.current.splits).toHaveLength(10);
      expect(result.current.splits[9].cumulativeSeconds).toBeCloseTo(2700, 0);
    });

    it('recalculates when time changes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      const initialTotal = result.current.splits[9].cumulativeSeconds;

      act(() => result.current.setMinutes(40));

      const newTotal = result.current.splits[9].cumulativeSeconds;
      expect(newTotal).toBeLessThan(initialTotal);
      expect(newTotal).toBeCloseTo(2400, 0);
    });

    it('recalculates when split percent changes', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      const evenFirst = result.current.splits[0].paceSecondsPerKm;
      const evenLast = result.current.splits[9].paceSecondsPerKm;
      expect(evenFirst).toBeCloseTo(evenLast, 0);

      act(() => result.current.setSplitPercent(50));

      const negativeFirst = result.current.splits[0].paceSecondsPerKm;
      const negativeLast = result.current.splits[9].paceSecondsPerKm;
      expect(negativeFirst).toBeGreaterThan(negativeLast);
    });

    it('uses 1km splits for metric unit', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      expect(result.current.splits).toHaveLength(10);
      expect(result.current.splits[0].distanceKm).toBeCloseTo(1.0, 4);
      expect(result.current.splits[1].distanceKm).toBeCloseTo(2.0, 4);
    });

    it('uses 1mi splits for imperial unit', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'mi', storage)
      );

      // 10K = ~6.2 miles, so 6 full miles + partial
      expect(result.current.splits).toHaveLength(7);
      const MILE_IN_KM = 1.60934;
      expect(result.current.splits[0].distanceKm).toBeCloseTo(MILE_IN_KM, 4);
      expect(result.current.splits[1].distanceKm).toBeCloseTo(MILE_IN_KM * 2, 4);
    });
  });

  describe('input clamping', () => {
    it('clamps hours to 0-9', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setHours(-1));
      expect(result.current.hours).toBe(0);

      act(() => result.current.setHours(10));
      expect(result.current.hours).toBe(9);
    });

    it('clamps minutes to 0-59', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setMinutes(-1));
      expect(result.current.minutes).toBe(0);

      act(() => result.current.setMinutes(60));
      expect(result.current.minutes).toBe(59);
    });

    it('clamps seconds to 0-59', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setSeconds(-1));
      expect(result.current.seconds).toBe(0);

      act(() => result.current.setSeconds(60));
      expect(result.current.seconds).toBe(59);
    });

    it('clamps split percent to -100 to 100', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      act(() => result.current.setSplitPercent(-150));
      expect(result.current.splitPercent).toBe(-100);

      act(() => result.current.setSplitPercent(150));
      expect(result.current.splitPercent).toBe(100);
    });
  });

  describe('unit switching', () => {
    it('maintains distance when switching units', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      const kmDistance = result.current.distanceKm;

      act(() => result.current.setUnit('mi'));

      const miDistance = result.current.distanceKm;
      expect(miDistance).toBe(kmDistance);
    });

    it('changes split size when switching units', () => {
      const storage = new MemoryStorage();
      const { result } = renderHook(() => 
        useSplitsState('10k', 0, 45, 0, 0, 'km', storage)
      );

      const kmSplits = result.current.splits.length;

      act(() => result.current.setUnit('mi'));

      const miSplits = result.current.splits.length;
      expect(miSplits).not.toBe(kmSplits);
    });
  });
});


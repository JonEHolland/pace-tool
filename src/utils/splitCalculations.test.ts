import { describe, it, expect } from 'vitest';
import { calculateSplits, formatPace, formatSplitTime } from './splitCalculations';

describe('calculateSplits', () => {
  describe('even splits (splitPercent = 0)', () => {
    it('calculates even splits for 10K', () => {
      const splits = calculateSplits(2700, 10.0, 0, 1.0); // 45:00 for 10K
      
      expect(splits).toHaveLength(10);
      
      // All splits should have same pace (4:30/km = 270 seconds)
      splits.forEach(split => {
        expect(split.paceSecondsPerKm).toBeCloseTo(270, 0);
      });
      
      // Each split should take 4:30
      splits.forEach(split => {
        expect(split.splitTimeSeconds).toBeCloseTo(270, 0);
      });
      
      // Final cumulative time should equal target
      expect(splits[9].cumulativeSeconds).toBeCloseTo(2700, 0);
    });

    it('calculates even splits for 5K', () => {
      const splits = calculateSplits(1200, 5.0, 0, 1.0); // 20:00 for 5K
      
      expect(splits).toHaveLength(5);
      
      // All paces should be 4:00/km = 240 seconds
      splits.forEach(split => {
        expect(split.paceSecondsPerKm).toBeCloseTo(240, 0);
      });
      
      expect(splits[4].cumulativeSeconds).toBeCloseTo(1200, 0);
    });

    it('handles half marathon with partial split', () => {
      const splits = calculateSplits(5400, 21.0975, 0, 1.0); // 90:00 for half
      
      expect(splits).toHaveLength(22); // 21 full km + 0.0975 km
      
      // First 21 splits are full km
      for (let i = 0; i < 21; i++) {
        expect(splits[i].distanceKm).toBeCloseTo(i + 1, 1);
      }
      
      // Last split is partial
      expect(splits[21].distanceKm).toBeCloseTo(21.0975, 4);
      
      // Total time should match target
      expect(splits[21].cumulativeSeconds).toBeCloseTo(5400, 0);
    });
  });

  describe('negative splits (positive splitPercent)', () => {
    it('calculates negative splits with +50 strategy', () => {
      const splits = calculateSplits(2700, 10.0, 50, 1.0);
      
      expect(splits).toHaveLength(10);
      
      // First split should be slower than base
      expect(splits[0].paceSecondsPerKm).toBeGreaterThan(270);
      
      // Last split should be faster than base
      expect(splits[9].paceSecondsPerKm).toBeLessThan(270);
      
      // Pace should decrease (get faster) throughout
      for (let i = 0; i < 9; i++) {
        expect(splits[i].paceSecondsPerKm).toBeGreaterThan(splits[i + 1].paceSecondsPerKm);
      }
      
      // Total time must equal target
      expect(splits[9].cumulativeSeconds).toBeCloseTo(2700, 0);
    });

    it('calculates maximum negative split (+100)', () => {
      const splits = calculateSplits(2700, 10.0, 100, 1.0);
      
      // First split significantly slower than base (270s)
      expect(splits[0].paceSecondsPerKm).toBeGreaterThan(290);
      
      // Last split significantly faster than base
      expect(splits[9].paceSecondsPerKm).toBeLessThan(250);
      
      // Significant difference between first and last
      expect(splits[0].paceSecondsPerKm - splits[9].paceSecondsPerKm).toBeGreaterThan(45);
      
      // Total time preserved
      expect(splits[9].cumulativeSeconds).toBeCloseTo(2700, 0);
    });
  });

  describe('positive splits (negative splitPercent)', () => {
    it('calculates positive splits with -50 strategy', () => {
      const splits = calculateSplits(2700, 10.0, -50, 1.0);
      
      expect(splits).toHaveLength(10);
      
      // First split should be faster than base
      expect(splits[0].paceSecondsPerKm).toBeLessThan(270);
      
      // Last split should be slower than base
      expect(splits[9].paceSecondsPerKm).toBeGreaterThan(270);
      
      // Pace should increase (get slower) throughout
      for (let i = 0; i < 9; i++) {
        expect(splits[i].paceSecondsPerKm).toBeLessThan(splits[i + 1].paceSecondsPerKm);
      }
      
      // Total time must equal target
      expect(splits[9].cumulativeSeconds).toBeCloseTo(2700, 0);
    });
  });

  describe('imperial splits (1 mile)', () => {
    it('calculates splits for 5K with 1 mile increments', () => {
      const MILE_IN_KM = 1.60934;
      const splits = calculateSplits(1200, 5.0, 0, MILE_IN_KM);
      
      // 5K = ~3.1 miles, so 3 full miles + partial
      expect(splits).toHaveLength(4);
      
      // First 3 splits are full miles
      expect(splits[0].distanceKm).toBeCloseTo(MILE_IN_KM, 4);
      expect(splits[1].distanceKm).toBeCloseTo(MILE_IN_KM * 2, 4);
      expect(splits[2].distanceKm).toBeCloseTo(MILE_IN_KM * 3, 4);
      
      // Last split is partial
      expect(splits[3].distanceKm).toBeCloseTo(5.0, 4);
      
      // Total time preserved
      expect(splits[3].cumulativeSeconds).toBeCloseTo(1200, 0);
    });
  });

  describe('edge cases', () => {
    it('returns empty array for zero distance', () => {
      const splits = calculateSplits(1200, 0, 0, 1.0);
      expect(splits).toHaveLength(0);
    });

    it('returns empty array for zero time', () => {
      const splits = calculateSplits(0, 10.0, 0, 1.0);
      expect(splits).toHaveLength(0);
    });

    it('handles very short distance', () => {
      const splits = calculateSplits(180, 0.5, 0, 1.0); // 3:00 for 500m
      expect(splits).toHaveLength(1);
      expect(splits[0].cumulativeSeconds).toBeCloseTo(180, 0);
    });
  });

  describe('cumulative values', () => {
    it('has correct cumulative distances', () => {
      const splits = calculateSplits(2700, 10.0, 0, 1.0);
      
      for (let i = 0; i < 10; i++) {
        expect(splits[i].distanceKm).toBeCloseTo(i + 1, 4);
      }
    });

    it('has monotonically increasing cumulative times', () => {
      const splits = calculateSplits(2700, 10.0, 50, 1.0);
      
      for (let i = 0; i < 9; i++) {
        expect(splits[i + 1].cumulativeSeconds).toBeGreaterThan(splits[i].cumulativeSeconds);
      }
    });
  });
});

describe('formatPace', () => {
  it('formats pace correctly', () => {
    expect(formatPace(270)).toBe('4:30');
    expect(formatPace(240)).toBe('4:00');
    expect(formatPace(305)).toBe('5:05');
    expect(formatPace(359)).toBe('5:59');
  });

  it('handles single digit seconds with padding', () => {
    expect(formatPace(245)).toBe('4:05');
    expect(formatPace(301)).toBe('5:01');
  });

  it('rounds to nearest second', () => {
    expect(formatPace(270.4)).toBe('4:30');
    expect(formatPace(270.6)).toBe('4:31');
  });
});

describe('formatSplitTime', () => {
  it('formats times under 1 hour without hour component', () => {
    expect(formatSplitTime(270)).toBe('4:30');
    expect(formatSplitTime(599)).toBe('9:59');
    expect(formatSplitTime(3599)).toBe('59:59');
  });

  it('formats times over 1 hour with hour component', () => {
    expect(formatSplitTime(3600)).toBe('1:00:00');
    expect(formatSplitTime(3661)).toBe('1:01:01');
    expect(formatSplitTime(7200)).toBe('2:00:00');
  });

  it('pads minutes and seconds correctly', () => {
    expect(formatSplitTime(3605)).toBe('1:00:05');
    expect(formatSplitTime(3665)).toBe('1:01:05');
  });

  it('rounds to nearest second', () => {
    expect(formatSplitTime(270.4)).toBe('4:30');
    expect(formatSplitTime(270.6)).toBe('4:31');
  });
});


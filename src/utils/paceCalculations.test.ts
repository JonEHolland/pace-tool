import { describe, it, expect } from 'vitest';
import { convertPace, paceToSecondsPerKm, clampPace } from './paceCalculations';

describe('paceCalculations', () => {
  describe('convertPace', () => {
    it('returns same pace for same unit', () => {
      expect(convertPace(5, 30, 'km', 'km')).toEqual({ minutes: 5, seconds: 30 });
      expect(convertPace(8, 15, 'mi', 'mi')).toEqual({ minutes: 8, seconds: 15 });
    });

    it('converts km to mi correctly', () => {
      const result = convertPace(5, 0, 'km', 'mi');
      expect(result.minutes).toBe(8);
      expect(result.seconds).toBe(3);
    });

    it('converts mi to km correctly', () => {
      const result = convertPace(8, 0, 'mi', 'km');
      expect(result.minutes).toBe(4);
      expect(result.seconds).toBe(58);
    });

    it('rounds to nearest second', () => {
      const result = convertPace(5, 30, 'km', 'mi');
      expect(result.seconds).toBeGreaterThanOrEqual(0);
      expect(result.seconds).toBeLessThan(60);
    });

    it('handles boundary values', () => {
      const min = convertPace(2, 0, 'km', 'mi');
      expect(min.minutes).toBeGreaterThan(0);
      
      const max = convertPace(20, 0, 'km', 'mi');
      expect(max.minutes).toBeGreaterThan(0);
    });
  });

  describe('paceToSecondsPerKm', () => {
    it('returns total seconds for km unit', () => {
      expect(paceToSecondsPerKm(5, 0, 'km')).toBe(300);
      expect(paceToSecondsPerKm(4, 30, 'km')).toBe(270);
    });

    it('converts mi to seconds per km', () => {
      const result = paceToSecondsPerKm(8, 0, 'mi');
      expect(result).toBeCloseTo(298, 0);
    });

    it('returns positive values', () => {
      expect(paceToSecondsPerKm(5, 0, 'km')).toBeGreaterThan(0);
      expect(paceToSecondsPerKm(5, 0, 'mi')).toBeGreaterThan(0);
    });
  });

  describe('clampPace', () => {
    it('preserves values within range', () => {
      expect(clampPace(5, 30)).toEqual({ minutes: 5, seconds: 30 });
      expect(clampPace(10, 0)).toEqual({ minutes: 10, seconds: 0 });
    });

    it('clamps below minimum to 2:00', () => {
      expect(clampPace(1, 59)).toEqual({ minutes: 2, seconds: 0 });
      expect(clampPace(0, 30)).toEqual({ minutes: 2, seconds: 0 });
    });

    it('clamps above maximum to 20:00', () => {
      expect(clampPace(20, 1)).toEqual({ minutes: 20, seconds: 0 });
      expect(clampPace(25, 30)).toEqual({ minutes: 20, seconds: 0 });
    });

    it('accepts boundary values', () => {
      expect(clampPace(2, 0)).toEqual({ minutes: 2, seconds: 0 });
      expect(clampPace(20, 0)).toEqual({ minutes: 20, seconds: 0 });
    });

    it('normalizes seconds overflow', () => {
      const result = clampPace(5, 70);
      expect(result.minutes * 60 + result.seconds).toBe(370);
    });
  });
});

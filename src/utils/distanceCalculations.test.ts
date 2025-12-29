import { describe, it, expect } from 'vitest';
import { convertDistance, clampDistance } from './distanceCalculations';

describe('distanceCalculations', () => {
  describe('convertDistance', () => {
    it('returns same distance for same unit', () => {
      expect(convertDistance(5.0, 'km', 'km')).toEqual({ value: 5.0 });
      expect(convertDistance(3.11, 'mi', 'mi')).toEqual({ value: 3.11 });
    });

    it('converts km to mi correctly', () => {
      const result = convertDistance(5.0, 'km', 'mi');
      expect(result.value).toBeCloseTo(3.107, 2);
    });

    it('converts mi to km correctly', () => {
      const result = convertDistance(3.11, 'mi', 'km');
      expect(result.value).toBeCloseTo(5.005, 2);
    });

    it('handles precision correctly', () => {
      const result = convertDistance(42.195, 'km', 'mi');
      expect(result.value).toBeCloseTo(26.219, 2);
    });

    it('handles boundary values', () => {
      expect(convertDistance(0.01, 'km', 'mi').value).toBeGreaterThan(0);
      expect(convertDistance(999.99, 'km', 'mi').value).toBeGreaterThan(0);
    });
  });

  describe('clampDistance', () => {
    it('preserves values within range', () => {
      expect(clampDistance(5.0)).toBe(5.0);
      expect(clampDistance(100.5)).toBe(100.5);
    });

    it('clamps below minimum to 0.01', () => {
      expect(clampDistance(0.005)).toBe(0.01);
      expect(clampDistance(0)).toBe(0.01);
      expect(clampDistance(-10)).toBe(0.01);
    });

    it('clamps above maximum to 999.99', () => {
      expect(clampDistance(1000.0)).toBe(999.99);
      expect(clampDistance(10000)).toBe(999.99);
    });

    it('accepts boundary values', () => {
      expect(clampDistance(0.01)).toBe(0.01);
      expect(clampDistance(999.99)).toBe(999.99);
    });

    it('handles special values', () => {
      expect(clampDistance(Infinity)).toBe(999.99);
      expect(clampDistance(-Infinity)).toBe(0.01);
    });
  });
});

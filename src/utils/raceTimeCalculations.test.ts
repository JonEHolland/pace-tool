import { describe, it, expect } from 'vitest';
import { 
  calculateRaceTime, 
  formatRaceTime, 
  calculateAllRaceTimes,
  RACE_DISTANCES
} from './raceTimeCalculations';

describe('raceTimeCalculations', () => {
  describe('RACE_DISTANCES', () => {
    it('contains all standard race distances', () => {
      expect(RACE_DISTANCES).toHaveLength(7);
      
      const ids = RACE_DISTANCES.map(r => r.id);
      expect(ids).toEqual(['5k', '10k', '15k', '10mi', 'half', 'full', '50k']);
    });

    it('has all required properties', () => {
      RACE_DISTANCES.forEach(race => {
        expect(race).toHaveProperty('id');
        expect(race).toHaveProperty('label');
        expect(race).toHaveProperty('distanceKm');
        expect(race).toHaveProperty('distanceMi');
      });
    });

    it('has distances in ascending order', () => {
      for (let i = 1; i < RACE_DISTANCES.length; i++) {
        expect(RACE_DISTANCES[i].distanceKm).toBeGreaterThan(RACE_DISTANCES[i - 1].distanceKm);
      }
    });
  });

  describe('formatRaceTime', () => {
    it('formats times correctly', () => {
      expect(formatRaceTime(0)).toBe('0:00:00');
      expect(formatRaceTime(59)).toBe('0:00:59');
      expect(formatRaceTime(3600)).toBe('1:00:00');
      expect(formatRaceTime(3661)).toBe('1:01:01');
    });

    it('pads minutes and seconds to 2 digits', () => {
      const time = formatRaceTime(305);
      expect(time).toMatch(/^\d+:\d{2}:\d{2}$/);
    });

    it('handles long durations', () => {
      expect(formatRaceTime(36000)).toBe('10:00:00');
    });
  });

  describe('calculateRaceTime', () => {
    it('calculates times correctly', () => {
      expect(calculateRaceTime(300, 5.0)).toBe('0:25:00');
      expect(calculateRaceTime(300, 10.0)).toBe('0:50:00');
      expect(calculateRaceTime(240, 5.0)).toBe('0:20:00');
    });

    it('rounds to nearest second', () => {
      const result = calculateRaceTime(300, 5.5);
      expect(result).toMatch(/^\d+:\d{2}:\d{2}$/);
    });
  });

  describe('calculateAllRaceTimes', () => {
    it('returns times for all races', () => {
      const result = calculateAllRaceTimes(300);
      
      expect(Object.keys(result)).toHaveLength(7);
      expect(result['5k']).toBe('0:25:00');
      expect(result['10k']).toBe('0:50:00');
      expect(result['full']).toBe('3:30:59');
    });

    it('returns progressively longer times', () => {
      const result = calculateAllRaceTimes(300);
      const races = ['5k', '10k', '15k', '10mi', 'half', 'full', '50k'];
      
      for (let i = 1; i < races.length; i++) {
        const prev = timeToSeconds(result[races[i - 1]]);
        const curr = timeToSeconds(result[races[i]]);
        expect(curr).toBeGreaterThan(prev);
      }
    });
  });
});

function timeToSeconds(time: string): number {
  const [h, m, s] = time.split(':').map(Number);
  return h * 3600 + m * 60 + s;
}

// Distance Calculations Utility

import { KM_TO_MILES, MILES_TO_KM, type Unit } from './constants';

// Re-export Unit from constants for backwards compatibility
export type { Unit } from './constants';

export interface ConvertedDistance {
  value: number;
}

// Distance constraints
const MIN_DISTANCE = 0.01;
const MAX_DISTANCE = 999.99;

/**
 * Convert distance from one unit to another
 */
export function convertDistance(
  value: number,
  fromUnit: Unit,
  toUnit: Unit
): ConvertedDistance {
  if (fromUnit === toUnit) {
    return { value };
  }

  const conversionFactor = fromUnit === 'km' ? KM_TO_MILES : MILES_TO_KM;
  const convertedValue = value * conversionFactor;
  
  return {
    value: convertedValue
  };
}

/**
 * Clamp distance value to valid range
 */
export function clampDistance(value: number): number {
  return Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, value));
}


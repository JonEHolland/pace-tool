// Distance Calculations Utility

export type Unit = 'km' | 'mi';

export interface ConvertedDistance {
  value: number;
}

// Conversion constants
const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;

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


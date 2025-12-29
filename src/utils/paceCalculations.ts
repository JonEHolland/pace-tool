// Pace Calculations Utility

export type Unit = 'km' | 'mi';

export interface ConvertedPace {
  minutes: number;
  seconds: number;
}

// Conversion constants
const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1.60934;

/**
 * Convert pace from one unit to another
 * Maintains the same speed, adjusts the pace accordingly
 */
export function convertPace(
  minutes: number,
  seconds: number,
  fromUnit: Unit,
  toUnit: Unit
): ConvertedPace {
  if (fromUnit === toUnit) {
    return { minutes, seconds };
  }

  const totalSeconds = minutes * 60 + seconds;
  const conversionFactor = fromUnit === 'km' ? MILES_TO_KM : KM_TO_MILES;
  const convertedSeconds = totalSeconds * conversionFactor;
  
  // Round to nearest second first, then split into minutes/seconds
  const roundedSeconds = Math.round(convertedSeconds);
  
  return {
    minutes: Math.floor(roundedSeconds / 60),
    seconds: roundedSeconds % 60
  };
}

/**
 * Convert pace to seconds per km (normalized format)
 */
export function paceToSecondsPerKm(
  minutes: number,
  seconds: number,
  unit: Unit
): number {
  const totalSeconds = minutes * 60 + seconds;
  return unit === 'km' ? totalSeconds : totalSeconds / MILES_TO_KM;
}

/**
 * Clamp pace values to valid range
 */
export function clampPace(minutes: number, seconds: number): ConvertedPace {
  let totalSeconds = minutes * 60 + seconds;
  
  // Clamp to 2:00 - 20:00 range
  const minSeconds = 2 * 60; // 2:00
  const maxSeconds = 20 * 60; // 20:00
  
  totalSeconds = Math.max(minSeconds, Math.min(maxSeconds, totalSeconds));
  
  return {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60
  };
}


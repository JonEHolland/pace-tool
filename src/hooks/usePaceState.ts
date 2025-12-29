// Pace State Management Hook

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  type Unit, 
  type ConvertedPace,
  convertPace,
  clampPace
} from '../utils/paceCalculations';

const PACE_MINUTES_STORAGE_KEY = 'pace-tool-pace-minutes';
const PACE_SECONDS_STORAGE_KEY = 'pace-tool-pace-seconds';
const PACE_UNIT_STORAGE_KEY = 'pace-tool-pace-unit';

export interface UsePaceStateReturn {
  // Current state
  paceMinutes: number;
  paceSeconds: number;
  unit: Unit;
  
  // Converted values
  convertedPace: ConvertedPace;
  convertedUnit: Unit;
  
  // Actions
  setPaceMinutes: (minutes: number) => void;
  setPaceSeconds: (seconds: number) => void;
  setUnit: (unit: Unit) => void;
}

export function usePaceState(
  initialMinutes: number = 5,
  initialSeconds: number = 0,
  initialUnit: Unit = 'km'
): UsePaceStateReturn {
  // Initialize from localStorage or defaults
  const [paceMinutes, setPaceMinutesState] = useState(() => {
    const saved = localStorage.getItem(PACE_MINUTES_STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return initialMinutes;
  });

  const [paceSeconds, setPaceSecondsState] = useState(() => {
    const saved = localStorage.getItem(PACE_SECONDS_STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
    return initialSeconds;
  });

  const [unit, setUnitState] = useState<Unit>(() => {
    const saved = localStorage.getItem(PACE_UNIT_STORAGE_KEY);
    return (saved === 'km' || saved === 'mi') ? saved : initialUnit;
  });

  // Persist pace minutes to localStorage
  useEffect(() => {
    localStorage.setItem(PACE_MINUTES_STORAGE_KEY, paceMinutes.toString());
  }, [paceMinutes]);

  // Persist pace seconds to localStorage
  useEffect(() => {
    localStorage.setItem(PACE_SECONDS_STORAGE_KEY, paceSeconds.toString());
  }, [paceSeconds]);

  // Persist unit to localStorage
  useEffect(() => {
    localStorage.setItem(PACE_UNIT_STORAGE_KEY, unit);
  }, [unit]);

  // Set minutes with clamping
  const setPaceMinutes = useCallback((minutes: number) => {
    const clamped = clampPace(minutes, paceSeconds);
    setPaceMinutesState(clamped.minutes);
    setPaceSecondsState(clamped.seconds);
  }, [paceSeconds]);

  // Set seconds with clamping
  const setPaceSeconds = useCallback((seconds: number) => {
    const clamped = clampPace(paceMinutes, seconds);
    setPaceMinutesState(clamped.minutes);
    setPaceSecondsState(clamped.seconds);
  }, [paceMinutes]);

  // Switch unit (maintains same speed, converts pace)
  const setUnit = useCallback((newUnit: Unit) => {
    if (newUnit === unit) return;
    
    const converted = convertPace(paceMinutes, paceSeconds, unit, newUnit);
    setPaceMinutesState(converted.minutes);
    setPaceSecondsState(converted.seconds);
    setUnitState(newUnit);
  }, [paceMinutes, paceSeconds, unit]);

  // Computed values
  const convertedUnit: Unit = unit === 'km' ? 'mi' : 'km';

  const convertedPace = useMemo(
    () => convertPace(paceMinutes, paceSeconds, unit, convertedUnit),
    [paceMinutes, paceSeconds, unit, convertedUnit]
  );

  return {
    paceMinutes,
    paceSeconds,
    unit,
    convertedPace,
    convertedUnit,
    setPaceMinutes,
    setPaceSeconds,
    setUnit
  };
}


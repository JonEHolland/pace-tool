// Pace State Management Hook

import { useState, useCallback, useMemo } from 'react';
import { 
  type Unit, 
  type ConvertedPace,
  convertPace,
  clampPace
} from '../utils/paceCalculations';

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
  const [paceMinutes, setPaceMinutesState] = useState(initialMinutes);
  const [paceSeconds, setPaceSecondsState] = useState(initialSeconds);
  const [unit, setUnitState] = useState<Unit>(initialUnit);

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


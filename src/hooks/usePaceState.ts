// Pace State Management Hook

import { useState, useCallback, useMemo } from 'react';
import { 
  type Unit, 
  type ConvertedPace,
  convertPace, 
  paceToSecondsPerKm,
  formatPace,
  clampPace,
  addSecondsToPace
} from '../utils/paceCalculations';
import { calculateAllRaceTimes } from '../utils/raceTimeCalculations';

export interface PaceState {
  minutes: number;
  seconds: number;
  unit: Unit;
}

export interface UsePaceStateReturn {
  // Current state
  paceMinutes: number;
  paceSeconds: number;
  unit: Unit;
  
  // Formatted values
  currentPaceFormatted: string;
  convertedPace: ConvertedPace;
  convertedPaceFormatted: string;
  convertedUnit: Unit;
  
  // Derived values
  paceSecondsPerKm: number;
  raceTimes: Record<string, string>;
  
  // Actions
  setPaceMinutes: (minutes: number) => void;
  setPaceSeconds: (seconds: number) => void;
  setUnit: (unit: Unit) => void;
  setPace: (minutes: number, seconds: number) => void;
  adjustPaceBySeconds: (deltaSeconds: number) => void;
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

  // Set both minutes and seconds
  const setPace = useCallback((minutes: number, seconds: number) => {
    const clamped = clampPace(minutes, seconds);
    setPaceMinutesState(clamped.minutes);
    setPaceSecondsState(clamped.seconds);
  }, []);

  // Adjust pace by adding/subtracting seconds
  const adjustPaceBySeconds = useCallback((deltaSeconds: number) => {
    const newPace = addSecondsToPace(paceMinutes, paceSeconds, deltaSeconds);
    setPaceMinutesState(newPace.minutes);
    setPaceSecondsState(newPace.seconds);
  }, [paceMinutes, paceSeconds]);

  // Switch unit (maintains same speed, converts pace)
  const setUnit = useCallback((newUnit: Unit) => {
    if (newUnit === unit) return;
    
    const converted = convertPace(paceMinutes, paceSeconds, unit, newUnit);
    setPaceMinutesState(converted.minutes);
    setPaceSecondsState(converted.seconds);
    setUnitState(newUnit);
  }, [paceMinutes, paceSeconds, unit]);

  // Computed values
  const currentPaceFormatted = useMemo(
    () => formatPace(paceMinutes, paceSeconds),
    [paceMinutes, paceSeconds]
  );

  const convertedUnit: Unit = unit === 'km' ? 'mi' : 'km';

  const convertedPace = useMemo(
    () => convertPace(paceMinutes, paceSeconds, unit, convertedUnit),
    [paceMinutes, paceSeconds, unit, convertedUnit]
  );

  const convertedPaceFormatted = useMemo(
    () => formatPace(convertedPace.minutes, convertedPace.seconds),
    [convertedPace]
  );

  const paceSecondsPerKm = useMemo(
    () => paceToSecondsPerKm(paceMinutes, paceSeconds, unit),
    [paceMinutes, paceSeconds, unit]
  );

  const raceTimes = useMemo(
    () => calculateAllRaceTimes(paceSecondsPerKm),
    [paceSecondsPerKm]
  );

  return {
    paceMinutes,
    paceSeconds,
    unit,
    currentPaceFormatted,
    convertedPace,
    convertedPaceFormatted,
    convertedUnit,
    paceSecondsPerKm,
    raceTimes,
    setPaceMinutes,
    setPaceSeconds,
    setUnit,
    setPace,
    adjustPaceBySeconds
  };
}


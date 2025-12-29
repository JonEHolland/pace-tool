// Pace State Management Hook

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  type Unit, 
  type ConvertedPace,
  convertPace,
  clampPace
} from '../utils/paceCalculations';
import { browserStorage, type StorageFacade } from '../utils/storage';

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
  initialUnit: Unit = 'km',
  storage: StorageFacade = browserStorage
): UsePaceStateReturn {
  // Store canonical pace in seconds per km to prevent rounding errors
  const [paceSecondsPerKm, setPaceSecondsPerKm] = useState(() => {
    const savedMinutes = storage.getItem(PACE_MINUTES_STORAGE_KEY);
    const savedSeconds = storage.getItem(PACE_SECONDS_STORAGE_KEY);
    const savedUnit = storage.getItem(PACE_UNIT_STORAGE_KEY);
    
    if (savedMinutes && savedSeconds) {
      const minutes = parseInt(savedMinutes, 10);
      const seconds = parseInt(savedSeconds, 10);
      
      if (!isNaN(minutes) && !isNaN(seconds)) {
        const totalSeconds = minutes * 60 + seconds;
        // Convert to seconds per km if stored in miles
        if (savedUnit === 'mi') {
          return totalSeconds / 1.60934; // MILES_TO_KM
        }
        return totalSeconds;
      }
    }
    
    // Convert initial value to seconds per km
    const totalSeconds = initialMinutes * 60 + initialSeconds;
    if (initialUnit === 'mi') {
      return totalSeconds / 1.60934;
    }
    return totalSeconds;
  });

  const [unit, setUnitState] = useState<Unit>(() => {
    const saved = storage.getItem(PACE_UNIT_STORAGE_KEY);
    return (saved === 'km' || saved === 'mi') ? saved : initialUnit;
  });

  // Calculate display pace from canonical seconds per km
  const { paceMinutes, paceSeconds } = useMemo(() => {
    let displaySeconds = paceSecondsPerKm;
    
    // Convert to miles if needed
    if (unit === 'mi') {
      displaySeconds = paceSecondsPerKm * 1.60934; // MILES_TO_KM
    }
    
    // Round to nearest second
    const rounded = Math.round(displaySeconds);
    
    return {
      paceMinutes: Math.floor(rounded / 60),
      paceSeconds: rounded % 60
    };
  }, [paceSecondsPerKm, unit]);

  // Persist pace to storage (in current unit for compatibility)
  useEffect(() => {
    storage.setItem(PACE_MINUTES_STORAGE_KEY, paceMinutes.toString());
  }, [paceMinutes, storage]);

  useEffect(() => {
    storage.setItem(PACE_SECONDS_STORAGE_KEY, paceSeconds.toString());
  }, [paceSeconds, storage]);

  // Persist unit to storage
  useEffect(() => {
    storage.setItem(PACE_UNIT_STORAGE_KEY, unit);
  }, [unit, storage]);

  // Set minutes with clamping (converts to seconds per km for storage)
  const setPaceMinutes = useCallback((minutes: number) => {
    const clamped = clampPace(minutes, paceSeconds);
    const totalSeconds = clamped.minutes * 60 + clamped.seconds;
    
    if (unit === 'km') {
      setPaceSecondsPerKm(totalSeconds);
    } else {
      // Convert miles to km for canonical storage
      setPaceSecondsPerKm(totalSeconds / 1.60934);
    }
  }, [paceSeconds, unit]);

  // Set seconds with clamping (converts to seconds per km for storage)
  const setPaceSeconds = useCallback((seconds: number) => {
    const clamped = clampPace(paceMinutes, seconds);
    const totalSeconds = clamped.minutes * 60 + clamped.seconds;
    
    if (unit === 'km') {
      setPaceSecondsPerKm(totalSeconds);
    } else {
      // Convert miles to km for canonical storage
      setPaceSecondsPerKm(totalSeconds / 1.60934);
    }
  }, [paceMinutes, unit]);

  // Switch unit (maintains same speed by keeping canonical seconds per km)
  const setUnit = useCallback((newUnit: Unit) => {
    if (newUnit === unit) return;
    // Just switch the unit - paceSecondsPerKm stays the same!
    setUnitState(newUnit);
  }, [unit]);

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


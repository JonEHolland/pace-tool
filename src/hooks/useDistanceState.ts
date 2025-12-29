// Distance State Management Hook

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  type Unit, 
  type ConvertedDistance,
  convertDistance,
  clampDistance
} from '../utils/distanceCalculations';

const DISTANCE_STORAGE_KEY = 'pace-tool-distance';
const DISTANCE_UNIT_STORAGE_KEY = 'pace-tool-distance-unit';

export interface UseDistanceStateReturn {
  // Current state
  distance: number;
  unit: Unit;
  
  // Converted values
  convertedDistance: ConvertedDistance;
  convertedUnit: Unit;
  
  // Actions
  setDistance: (distance: number) => void;
  setUnit: (unit: Unit) => void;
}

export function useDistanceState(
  initialDistance: number = 5.0,
  initialUnit: Unit = 'km'
): UseDistanceStateReturn {
  // Initialize from localStorage or defaults
  const [distance, setDistanceState] = useState(() => {
    const saved = localStorage.getItem(DISTANCE_STORAGE_KEY);
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) {
        return clampDistance(parsed);
      }
    }
    return clampDistance(initialDistance);
  });

  const [unit, setUnitState] = useState<Unit>(() => {
    const saved = localStorage.getItem(DISTANCE_UNIT_STORAGE_KEY);
    return (saved === 'km' || saved === 'mi') ? saved : initialUnit;
  });

  // Persist distance to localStorage
  useEffect(() => {
    localStorage.setItem(DISTANCE_STORAGE_KEY, distance.toString());
  }, [distance]);

  // Persist unit to localStorage
  useEffect(() => {
    localStorage.setItem(DISTANCE_UNIT_STORAGE_KEY, unit);
  }, [unit]);

  // Set distance with clamping
  const setDistance = useCallback((value: number) => {
    const clamped = clampDistance(value);
    setDistanceState(clamped);
  }, []);

  // Switch unit (maintains same physical distance, converts the value)
  const setUnit = useCallback((newUnit: Unit) => {
    if (newUnit === unit) return;
    
    const converted = convertDistance(distance, unit, newUnit);
    setDistanceState(converted.value);
    setUnitState(newUnit);
  }, [distance, unit]);

  // Computed values
  const convertedUnit: Unit = unit === 'km' ? 'mi' : 'km';

  const convertedDistance = useMemo(
    () => convertDistance(distance, unit, convertedUnit),
    [distance, unit, convertedUnit]
  );

  return {
    distance,
    unit,
    convertedDistance,
    convertedUnit,
    setDistance,
    setUnit
  };
}


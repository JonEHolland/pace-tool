// Distance State Management Hook

import { useState, useCallback, useMemo } from 'react';
import { 
  type Unit, 
  type ConvertedDistance,
  convertDistance,
  clampDistance
} from '../utils/distanceCalculations';

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
  const [distance, setDistanceState] = useState(clampDistance(initialDistance));
  const [unit, setUnitState] = useState<Unit>(initialUnit);

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


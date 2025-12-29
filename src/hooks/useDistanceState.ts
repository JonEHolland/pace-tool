// Distance State Management Hook

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  type Unit, 
  type ConvertedDistance,
  convertDistance,
  clampDistance
} from '../utils/distanceCalculations';
import { browserStorage, type StorageFacade } from '../utils/storage';

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
  initialUnit: Unit = 'km',
  storage: StorageFacade = browserStorage
): UseDistanceStateReturn {
  // Store canonical value in km to prevent rounding errors on unit switches
  const [distanceInKm, setDistanceInKm] = useState(() => {
    const saved = storage.getItem(DISTANCE_STORAGE_KEY);
    const savedUnit = storage.getItem(DISTANCE_UNIT_STORAGE_KEY);
    
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) {
        const clamped = clampDistance(parsed);
        // Convert to km if stored value was in miles
        if (savedUnit === 'mi') {
          return convertDistance(clamped, 'mi', 'km').value;
        }
        return clamped;
      }
    }
    
    // Convert initial value to km if needed
    const clamped = clampDistance(initialDistance);
    if (initialUnit === 'mi') {
      return convertDistance(clamped, 'mi', 'km').value;
    }
    return clamped;
  });

  const [unit, setUnitState] = useState<Unit>(() => {
    const saved = storage.getItem(DISTANCE_UNIT_STORAGE_KEY);
    return (saved === 'km' || saved === 'mi') ? saved : initialUnit;
  });

  // Calculate display distance from canonical km value
  const distance = useMemo(() => {
    if (unit === 'km') {
      return distanceInKm;
    }
    return convertDistance(distanceInKm, 'km', 'mi').value;
  }, [distanceInKm, unit]);

  // Persist distance to storage (in current unit for compatibility)
  useEffect(() => {
    storage.setItem(DISTANCE_STORAGE_KEY, distance.toString());
  }, [distance, storage]);

  // Persist unit to storage
  useEffect(() => {
    storage.setItem(DISTANCE_UNIT_STORAGE_KEY, unit);
  }, [unit, storage]);

  // Set distance with clamping (converts to km for storage)
  const setDistance = useCallback((value: number) => {
    const clamped = clampDistance(value);
    if (unit === 'km') {
      setDistanceInKm(clamped);
    } else {
      // Convert miles to km for canonical storage
      const inKm = convertDistance(clamped, 'mi', 'km').value;
      setDistanceInKm(inKm);
    }
  }, [unit]);

  // Switch unit (maintains same physical distance by keeping canonical km value)
  const setUnit = useCallback((newUnit: Unit) => {
    if (newUnit === unit) return;
    // Just switch the unit - distanceInKm stays the same!
    setUnitState(newUnit);
  }, [unit]);

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


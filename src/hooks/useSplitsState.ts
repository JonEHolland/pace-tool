// Splits State Management Hook

import { useState, useCallback, useMemo, useEffect } from 'react';
import { calculateSplits, type Split } from '../utils/splitCalculations';
import { type Unit } from '../utils/paceCalculations';
import { RACE_DISTANCES } from '../utils/raceTimeCalculations';
import { MILES_TO_KM } from '../utils/constants';
import { browserStorage, type StorageFacade } from '../utils/storage';

const SPLITS_DISTANCE_STORAGE_KEY = 'pace-tool-splits-distance';
const SPLITS_HOURS_STORAGE_KEY = 'pace-tool-splits-hours';
const SPLITS_MINUTES_STORAGE_KEY = 'pace-tool-splits-minutes';
const SPLITS_SECONDS_STORAGE_KEY = 'pace-tool-splits-seconds';
const SPLITS_PERCENT_STORAGE_KEY = 'pace-tool-splits-percent';
const SPLITS_UNIT_STORAGE_KEY = 'pace-tool-splits-unit';

export interface UseSplitsStateReturn {
  // Current state
  distanceId: string;
  hours: number;
  minutes: number;
  seconds: number;
  splitPercent: number;
  unit: Unit;
  
  // Computed values
  distanceKm: number;
  splits: Split[];
  
  // Actions
  setDistanceId: (id: string) => void;
  setHours: (hours: number) => void;
  setMinutes: (minutes: number) => void;
  setSeconds: (seconds: number) => void;
  setSplitPercent: (percent: number) => void;
  setUnit: (unit: Unit) => void;
}

export function useSplitsState(
  initialDistanceId: string = '5k',
  initialHours: number = 0,
  initialMinutes: number = 30,
  initialSeconds: number = 0,
  initialSplitPercent: number = 0,
  initialUnit: Unit = 'km',
  storage: StorageFacade = browserStorage
): UseSplitsStateReturn {
  // State
  const [distanceId, setDistanceIdState] = useState(() => {
    const saved = storage.getItem(SPLITS_DISTANCE_STORAGE_KEY);
    return saved || initialDistanceId;
  });

  const [hours, setHoursState] = useState(() => {
    const saved = storage.getItem(SPLITS_HOURS_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : initialHours;
  });

  const [minutes, setMinutesState] = useState(() => {
    const saved = storage.getItem(SPLITS_MINUTES_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : initialMinutes;
  });

  const [seconds, setSecondsState] = useState(() => {
    const saved = storage.getItem(SPLITS_SECONDS_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : initialSeconds;
  });

  const [splitPercent, setSplitPercentState] = useState(() => {
    const saved = storage.getItem(SPLITS_PERCENT_STORAGE_KEY);
    return saved ? parseInt(saved, 10) : initialSplitPercent;
  });

  const [unit, setUnitState] = useState<Unit>(() => {
    const saved = storage.getItem(SPLITS_UNIT_STORAGE_KEY);
    return (saved === 'km' || saved === 'mi') ? saved : initialUnit;
  });

  // Persist to storage
  useEffect(() => {
    storage.setItem(SPLITS_DISTANCE_STORAGE_KEY, distanceId);
  }, [distanceId, storage]);

  useEffect(() => {
    storage.setItem(SPLITS_HOURS_STORAGE_KEY, hours.toString());
  }, [hours, storage]);

  useEffect(() => {
    storage.setItem(SPLITS_MINUTES_STORAGE_KEY, minutes.toString());
  }, [minutes, storage]);

  useEffect(() => {
    storage.setItem(SPLITS_SECONDS_STORAGE_KEY, seconds.toString());
  }, [seconds, storage]);

  useEffect(() => {
    storage.setItem(SPLITS_PERCENT_STORAGE_KEY, splitPercent.toString());
  }, [splitPercent, storage]);

  useEffect(() => {
    storage.setItem(SPLITS_UNIT_STORAGE_KEY, unit);
  }, [unit, storage]);

  // Get distance in km (canonical storage) from shared RACE_DISTANCES
  const distanceKm = useMemo(() => {
    const race = RACE_DISTANCES.find(r => r.id === distanceId);
    return race?.distanceKm ?? 10.0;
  }, [distanceId]);

  // Calculate splits
  const splits = useMemo(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const splitSizeKm = unit === 'mi' ? MILES_TO_KM : 1.0;
    return calculateSplits(totalSeconds, distanceKm, splitPercent, splitSizeKm);
  }, [hours, minutes, seconds, distanceKm, splitPercent, unit]);

  // Actions with clamping
  const setDistanceId = useCallback((id: string) => {
    setDistanceIdState(id);
  }, []);

  const setHours = useCallback((h: number) => {
    setHoursState(Math.max(0, Math.min(9, Math.floor(h))));
  }, []);

  const setMinutes = useCallback((m: number) => {
    setMinutesState(Math.max(0, Math.min(59, Math.floor(m))));
  }, []);

  const setSeconds = useCallback((s: number) => {
    setSecondsState(Math.max(0, Math.min(59, Math.floor(s))));
  }, []);

  const setSplitPercent = useCallback((p: number) => {
    setSplitPercentState(Math.max(-100, Math.min(100, Math.floor(p))));
  }, []);

  const setUnit = useCallback((u: Unit) => {
    setUnitState(u);
  }, []);

  return {
    distanceId,
    hours,
    minutes,
    seconds,
    splitPercent,
    unit,
    distanceKm,
    splits,
    setDistanceId,
    setHours,
    setMinutes,
    setSeconds,
    setSplitPercent,
    setUnit
  };
}


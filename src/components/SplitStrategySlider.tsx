import { useMemo } from 'react';
import styles from './SplitStrategySlider.module.css';
import { type Split, formatPace } from '../utils/splitCalculations';
import { type Unit } from '../utils/paceCalculations';
import { MILES_TO_KM } from '../utils/constants';

interface SplitStrategySliderProps {
  value: number;
  onChange: (value: number) => void;
  splits: Split[];
  unit: Unit;
}

export function SplitStrategySlider({ value, onChange, splits, unit }: SplitStrategySliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  // Calculate fastest, average, slowest paces
  const paceStats = useMemo(() => {
    if (splits.length === 0) {
      return null;
    }

    const paces = splits.map(s => s.paceSecondsPerKm);
    const fastest = Math.min(...paces);
    const slowest = Math.max(...paces);
    const average = paces.reduce((sum, p) => sum + p, 0) / paces.length;

    // Convert to display unit
    const convertPace = (secondsPerKm: number) => {
      return unit === 'mi' ? secondsPerKm * MILES_TO_KM : secondsPerKm;
    };

    return {
      fastest: formatPace(convertPace(fastest)),
      average: formatPace(convertPace(average)),
      slowest: formatPace(convertPace(slowest))
    };
  }, [splits, unit]);

  const unitLabel = unit === 'mi' ? '/mi' : '/km';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.label}>Split Strategy</div>
      </div>
      
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          value={value}
          onChange={handleChange}
          className={styles.slider}
          aria-label="Split strategy"
        />
        <div className={styles.markers}>
          <span className={styles.marker}>Positive</span>
          <span className={styles.marker}>Even</span>
          <span className={styles.marker}>Negative</span>
        </div>
      </div>

      {paceStats && (
        <div className={styles.paceRange}>
          <span className={styles.paceItem}>
            <span className={styles.paceLabel}>Fastest</span>
            <span className={styles.paceValue}>{paceStats.fastest}{unitLabel}</span>
          </span>
          <span className={styles.paceSeparator}>·</span>
          <span className={styles.paceItem}>
            <span className={styles.paceLabel}>Average</span>
            <span className={styles.paceValue}>{paceStats.average}{unitLabel}</span>
          </span>
          <span className={styles.paceSeparator}>·</span>
          <span className={styles.paceItem}>
            <span className={styles.paceLabel}>Slowest</span>
            <span className={styles.paceValue}>{paceStats.slowest}{unitLabel}</span>
          </span>
        </div>
      )}
    </div>
  );
}

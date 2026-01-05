import styles from './SplitsCalculator.module.css';
import { Header } from './Header';
import { DistanceSelector } from './DistanceSelector';
import { TimeInput } from './TimeInput';
import { SplitStrategySlider } from './SplitStrategySlider';
import { UnitToggle } from './UnitToggle';
import { SplitsTable } from './SplitsTable';
import { useSplitsState } from '../hooks/useSplitsState';

export function SplitsCalculator() {
  const {
    distanceId,
    hours,
    minutes,
    seconds,
    splitPercent,
    unit,
    splits,
    setDistanceId,
    setHours,
    setMinutes,
    setSeconds,
    setSplitPercent,
    setUnit
  } = useSplitsState();

  return (
    <div className={styles.page}>
      <Header 
        title="Split Calculator"
        subtitle="Calculate split times for your target race pace"
      />
      
      <DistanceSelector
        selectedId={distanceId}
        onSelect={setDistanceId}
      />

      <TimeInput
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        onHoursChange={setHours}
        onMinutesChange={setMinutes}
        onSecondsChange={setSeconds}
      />

      <SplitStrategySlider
        value={splitPercent}
        onChange={setSplitPercent}
        splits={splits}
        unit={unit}
      />

      <div className={styles.unitToggleWrapper}>
        <UnitToggle
          value={unit}
          onChange={setUnit}
          mode="distance"
        />
      </div>

      <SplitsTable
        splits={splits}
        unit={unit}
      />
    </div>
  );
}


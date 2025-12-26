import styles from './PaceInput.module.css';
import { UnitToggle } from './UnitToggle';
import { WheelPicker } from './WheelPicker';
import { type Unit } from '../utils/paceCalculations';

interface PaceInputProps {
  minutes: number;
  seconds: number;
  unit: Unit;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
  onUnitChange: (unit: Unit) => void;
}

export function PaceInput({
  minutes,
  seconds,
  unit,
  onMinutesChange,
  onSecondsChange,
  onUnitChange
}: PaceInputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.unitToggle}>
        <UnitToggle value={unit} onChange={onUnitChange} />
      </div>
      <WheelPicker
        minutes={minutes}
        seconds={seconds}
        unit={unit}
        onMinutesChange={onMinutesChange}
        onSecondsChange={onSecondsChange}
      />
    </div>
  );
}


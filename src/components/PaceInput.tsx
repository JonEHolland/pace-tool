import styles from './PaceInput.module.css';
import { UnitToggle } from './UnitToggle';
import { WheelPicker, type WheelConfig } from './WheelPicker';
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
  const leftWheel: WheelConfig = {
    min: 2,
    max: 20,
    value: minutes,
    onChange: onMinutesChange
  };

  const rightWheel: WheelConfig = {
    min: 0,
    max: 59,
    value: seconds,
    onChange: onSecondsChange,
    padStart: 2
  };

  return (
    <div className={styles.container}>
      <div className={styles.unitToggle}>
        <UnitToggle value={unit} onChange={onUnitChange} />
      </div>
      <WheelPicker
        leftWheel={leftWheel}
        rightWheel={rightWheel}
        separator=":"
        unit={unit}
      />
    </div>
  );
}


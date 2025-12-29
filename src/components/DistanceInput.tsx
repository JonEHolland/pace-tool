import styles from './DistanceInput.module.css';
import { UnitToggle } from './UnitToggle';
import { DistanceWheelPicker } from './DistanceWheelPicker';
import { type Unit } from '../utils/distanceCalculations';

interface DistanceInputProps {
  distance: number;
  unit: Unit;
  onDistanceChange: (distance: number) => void;
  onUnitChange: (unit: Unit) => void;
}

export function DistanceInput({
  distance,
  unit,
  onDistanceChange,
  onUnitChange
}: DistanceInputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.unitToggle}>
        <UnitToggle value={unit} onChange={onUnitChange} mode="distance" />
      </div>
      <DistanceWheelPicker
        distance={distance}
        unit={unit}
        onDistanceChange={onDistanceChange}
      />
    </div>
  );
}


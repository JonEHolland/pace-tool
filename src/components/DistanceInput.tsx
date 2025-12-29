import styles from './DistanceInput.module.css';
import { UnitToggle } from './UnitToggle';
import { WheelPicker, type WheelConfig } from './WheelPicker';
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
  // Split distance into integer and decimal parts
  const integerPart = Math.floor(distance);
  const decimalPart = Math.round((distance - integerPart) * 100);

  const handleIntegerChange = (newInteger: number) => {
    const newDistance = newInteger + (decimalPart / 100);
    onDistanceChange(newDistance);
  };

  const handleDecimalChange = (newDecimal: number) => {
    const newDistance = integerPart + (newDecimal / 100);
    onDistanceChange(newDistance);
  };

  const leftWheel: WheelConfig = {
    min: 0,
    max: 999,
    value: integerPart,
    onChange: handleIntegerChange
  };

  const rightWheel: WheelConfig = {
    min: 0,
    max: 99,
    value: decimalPart,
    onChange: handleDecimalChange,
    padStart: 2
  };

  return (
    <div className={styles.container}>
      <div className={styles.unitToggle}>
        <UnitToggle value={unit} onChange={onUnitChange} mode="distance" />
      </div>
      <WheelPicker
        leftWheel={leftWheel}
        rightWheel={rightWheel}
        separator="."
        unit={unit}
      />
    </div>
  );
}


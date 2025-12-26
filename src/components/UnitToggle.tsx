import styles from './UnitToggle.module.css';
import { type Unit } from '../utils/paceCalculations';

interface UnitToggleProps {
  value: Unit;
  onChange: (unit: Unit) => void;
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.option} ${value === 'km' ? styles.selected : ''}`}
        onClick={() => onChange('km')}
        aria-label="Minutes per kilometer"
        aria-pressed={value === 'km'}
      >
        min/km
      </button>
      <button
        className={`${styles.option} ${value === 'mi' ? styles.selected : ''}`}
        onClick={() => onChange('mi')}
        aria-label="Minutes per mile"
        aria-pressed={value === 'mi'}
      >
        min/mi
      </button>
    </div>
  );
}


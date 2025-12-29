import styles from './UnitToggle.module.css';
import { type Unit } from '../utils/paceCalculations';

interface UnitToggleProps {
  value: Unit;
  onChange: (unit: Unit) => void;
  mode?: 'pace' | 'distance';
}

export function UnitToggle({ value, onChange, mode = 'pace' }: UnitToggleProps) {
  const labels = mode === 'pace' 
    ? { km: 'min/km', mi: 'min/mi' }
    : { km: 'Kilometers', mi: 'Miles' };
  
  const ariaLabels = mode === 'pace'
    ? { km: 'Minutes per kilometer', mi: 'Minutes per mile' }
    : { km: 'Kilometers', mi: 'Miles' };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.option} ${value === 'km' ? styles.selected : ''}`}
        onClick={() => onChange('km')}
        aria-label={ariaLabels.km}
        aria-pressed={value === 'km'}
      >
        {labels.km}
      </button>
      <button
        className={`${styles.option} ${value === 'mi' ? styles.selected : ''}`}
        onClick={() => onChange('mi')}
        aria-label={ariaLabels.mi}
        aria-pressed={value === 'mi'}
      >
        {labels.mi}
      </button>
    </div>
  );
}


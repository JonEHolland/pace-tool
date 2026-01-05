import styles from './DistanceSelector.module.css';
import { RACE_DISTANCES } from '../utils/raceTimeCalculations';

interface DistanceSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function DistanceSelector({ selectedId, onSelect }: DistanceSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer}>
        {RACE_DISTANCES.map(distance => (
          <button
            key={distance.id}
            className={`${styles.pill} ${selectedId === distance.id ? styles.active : ''}`}
            onClick={() => onSelect(distance.id)}
            aria-label={`Select ${distance.label} distance`}
            aria-pressed={selectedId === distance.id}
          >
            {distance.label}
          </button>
        ))}
      </div>
    </div>
  );
}


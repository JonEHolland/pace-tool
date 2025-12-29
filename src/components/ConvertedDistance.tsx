import styles from './ConvertedDistance.module.css';
import { type Unit } from '../utils/distanceCalculations';

interface ConvertedDistanceProps {
  currentDistance: number;
  currentUnit: Unit;
  convertedDistance: number;
  convertedUnit: Unit;
}

export function ConvertedDistance({ 
  currentDistance,
  currentUnit,
  convertedDistance, 
  convertedUnit 
}: ConvertedDistanceProps) {
  const currentUnitLabel = currentUnit === 'km' ? 'km' : 'mi';
  const convertedUnitLabel = convertedUnit === 'km' ? 'km' : 'mi';
  
  return (
    <div className={styles.container}>
      <span className={styles.label}>Distance</span>
      <div className={styles.distanceRow}>
        <div className={styles.distance}>
          <span className={styles.value}>{currentDistance.toFixed(2)}</span>
          <span className={styles.unit}>{currentUnitLabel}</span>
        </div>
        <span className={styles.equals}>=</span>
        <div className={styles.distance}>
          <span className={styles.value}>{convertedDistance.toFixed(2)}</span>
          <span className={styles.unit}>{convertedUnitLabel}</span>
        </div>
      </div>
    </div>
  );
}


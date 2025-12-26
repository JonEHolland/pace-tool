import styles from './ConvertedPace.module.css';
import { type Unit } from '../utils/paceCalculations';

interface ConvertedPaceProps {
  currentMinutes: number;
  currentSeconds: number;
  currentUnit: Unit;
  convertedMinutes: number;
  convertedSeconds: number;
  convertedUnit: Unit;
}

export function ConvertedPace({ 
  currentMinutes,
  currentSeconds,
  currentUnit,
  convertedMinutes, 
  convertedSeconds, 
  convertedUnit 
}: ConvertedPaceProps) {
  const currentFormattedSeconds = currentSeconds.toString().padStart(2, '0');
  const convertedFormattedSeconds = convertedSeconds.toString().padStart(2, '0');
  const currentUnitLabel = currentUnit === 'km' ? 'min/km' : 'min/mi';
  const convertedUnitLabel = convertedUnit === 'km' ? 'min/km' : 'min/mi';
  
  return (
    <div className={styles.container}>
      <span className={styles.label}>Pace</span>
      <div className={styles.paceRow}>
        <div className={styles.pace}>
          <span className={styles.value}>{currentMinutes}:{currentFormattedSeconds}</span>
          <span className={styles.unit}>{currentUnitLabel}</span>
        </div>
        <span className={styles.equals}>=</span>
        <div className={styles.pace}>
          <span className={styles.value}>{convertedMinutes}:{convertedFormattedSeconds}</span>
          <span className={styles.unit}>{convertedUnitLabel}</span>
        </div>
      </div>
      <div className={styles.hint}>Scroll race times to adjust pace</div>
    </div>
  );
}

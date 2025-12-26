import { useState } from 'react';
import styles from './RaceTimesScroller.module.css';
import { RACE_DISTANCES } from '../utils/raceTimeCalculations';

interface RaceTimesScrollerProps {
  raceTimes: Record<string, string>;
}

export function RaceTimesScroller({ raceTimes }: RaceTimesScrollerProps) {
  const [lastRaceTimes, setLastRaceTimes] = useState(raceTimes);
  const [pulsingRows, setPulsingRows] = useState<Set<string>>(new Set());

  // Detect when race times change and trigger pulse animation
  if (raceTimes !== lastRaceTimes) {
    const changedRows = new Set<string>();
    RACE_DISTANCES.forEach(race => {
      if (raceTimes[race.id] !== lastRaceTimes[race.id]) {
        changedRows.add(race.id);
      }
    });
    
    if (changedRows.size > 0) {
      setPulsingRows(changedRows);
      setTimeout(() => setPulsingRows(new Set()), 300);
    }
    
    setLastRaceTimes(raceTimes);
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Race times</div>
      </div>

      <div className={styles.table}>
        {RACE_DISTANCES.map(race => (
          <div key={race.id} className={styles.row}>
            <div className={styles.raceInfo}>
              <div className={styles.raceName}>{race.label}</div>
              <div className={styles.raceDistance}>{race.distanceNote}</div>
            </div>
            <div className={styles.timeInfo}>
              <div className={`${styles.time} ${pulsingRows.has(race.id) ? 'pulse' : ''}`}>
                {raceTimes[race.id]}
              </div>
              <div className={styles.timeLabel}>finish time</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

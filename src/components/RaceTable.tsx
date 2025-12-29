import styles from './RaceTable.module.css';
import { RACE_DISTANCES, calculateRaceTime, type RaceDistance } from '../utils/raceTimeCalculations';
import { paceToSecondsPerKm, type Unit } from '../utils/paceCalculations';

type RaceTableMode = 'distances' | 'times';

interface RaceTableProps {
  mode: RaceTableMode;
  // Only needed for 'times' mode
  paceMinutes?: number;
  paceSeconds?: number;
  paceUnit?: Unit;
}

export function RaceTable({ mode, paceMinutes, paceSeconds, paceUnit }: RaceTableProps) {
  const title = mode === 'distances' ? 'Common race distances' : 'Race times';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
      </div>

      <div className={styles.table}>
        {RACE_DISTANCES.map(race => (
          <div key={race.id} className={styles.row}>
            {mode === 'distances' 
              ? renderDistanceRow(race)
              : renderTimeRow(race, paceMinutes!, paceSeconds!, paceUnit!)
            }
          </div>
        ))}
      </div>
    </div>
  );
}

// Render functions

function renderDistanceRow(race: RaceDistance) {
  return (
    <>
      <div className={styles.raceName}>{race.label}</div>
      <div className={styles.distances}>
        <div className={styles.distance}>
          <span className={styles.value}>{race.distanceKm.toFixed(1)}</span>
          <span className={styles.unit}>km</span>
        </div>
        <span className={styles.separator}>=</span>
        <div className={styles.distance}>
          <span className={styles.value}>{race.distanceMi.toFixed(2)}</span>
          <span className={styles.unit}>mi</span>
        </div>
      </div>
    </>
  );
}

function renderTimeRow(race: RaceDistance, minutes: number, seconds: number, unit: Unit) {
  const secondsPerKm = paceToSecondsPerKm(minutes, seconds, unit);
  const raceTime = calculateRaceTime(secondsPerKm, race.distanceKm);
  
  return (
    <>
      <div className={styles.raceInfo}>
        <div className={styles.raceName}>{race.label}</div>
        <div className={styles.raceDistance}>
          {race.distanceKm.toFixed(2)} km
        </div>
      </div>
      <div className={styles.timeInfo}>
        <div className={styles.time}>
          {raceTime}
        </div>
        <div className={styles.timeLabel}>finish time</div>
      </div>
    </>
  );
}


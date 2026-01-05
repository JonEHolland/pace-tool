import styles from './SplitsTable.module.css';
import { type Split, formatPace, formatSplitTime } from '../utils/splitCalculations';
import { type Unit } from '../utils/paceCalculations';
import { MILES_TO_KM } from '../utils/constants';

interface SplitsTableProps {
  splits: Split[];
  unit: Unit;
}

export function SplitsTable({ splits, unit }: SplitsTableProps) {
  if (splits.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Split breakdown</div>
        </div>
        <div className={styles.empty}>Enter a target time to see splits</div>
      </div>
    );
  }

  const convertDistance = (km: number): number => {
    return unit === 'mi' ? km / MILES_TO_KM : km;
  };

  const convertPace = (secondsPerKm: number): number => {
    return unit === 'mi' ? secondsPerKm * MILES_TO_KM : secondsPerKm;
  };

  const unitLabel = unit === 'mi' ? 'mi' : 'km';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Split breakdown</div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>#</th>
              <th className={styles.headerCell}>Distance</th>
              <th className={styles.headerCell}>Pace</th>
              <th className={styles.headerCell}>Split</th>
              <th className={styles.headerCell}>Total</th>
            </tr>
          </thead>
          <tbody>
            {splits.map((split) => (
              <tr key={split.splitNumber} className={styles.row}>
                <td className={styles.cell}>{split.splitNumber}</td>
                <td className={styles.cell}>
                  {convertDistance(split.distanceKm).toFixed(unit === 'mi' ? 2 : 1)} {unitLabel}
                </td>
                <td className={styles.cellPace}>
                  {formatPace(convertPace(split.paceSecondsPerKm))}/{unitLabel}
                </td>
                <td className={styles.cell}>
                  {formatSplitTime(split.splitTimeSeconds)}
                </td>
                <td className={styles.cell}>
                  {formatSplitTime(split.cumulativeSeconds)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


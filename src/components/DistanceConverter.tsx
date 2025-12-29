import styles from './DistanceConverter.module.css';
import { DistanceInput } from './DistanceInput';
import { ConvertedDistance } from './ConvertedDistance';
import { RaceTable } from './RaceTable';
import { useDistanceState } from '../hooks/useDistanceState';

export function DistanceConverter() {
  const {
    distance,
    unit,
    convertedDistance,
    convertedUnit,
    setDistance,
    setUnit
  } = useDistanceState(5.0, 'km');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Distance{'\n'}Converter</h1>
        <p className={styles.subtitle}>Convert between kilometers and miles</p>
      </div>
      <DistanceInput
        distance={distance}
        unit={unit}
        onDistanceChange={setDistance}
        onUnitChange={setUnit}
      />
      <ConvertedDistance
        currentDistance={distance}
        currentUnit={unit}
        convertedDistance={convertedDistance.value}
        convertedUnit={convertedUnit}
      />
      <RaceTable mode="distances" />
    </div>
  );
}


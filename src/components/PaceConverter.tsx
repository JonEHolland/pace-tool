import styles from './PaceConverter.module.css';
import { Header } from './Header';
import { PaceInput } from './PaceInput';
import { ConvertedPace } from './ConvertedPace';
import { RaceTable } from './RaceTable';
import { usePaceState } from '../hooks/usePaceState';

export function PaceConverter() {
  const {
    paceMinutes,
    paceSeconds,
    unit,
    convertedPace,
    convertedUnit,
    setPaceMinutes,
    setPaceSeconds,
    setUnit
  } = usePaceState(10, 0, 'mi');

  return (
    <div className={styles.page}>
      <Header />
      <PaceInput
        minutes={paceMinutes}
        seconds={paceSeconds}
        unit={unit}
        onMinutesChange={setPaceMinutes}
        onSecondsChange={setPaceSeconds}
        onUnitChange={setUnit}
      />
      <ConvertedPace
        currentMinutes={paceMinutes}
        currentSeconds={paceSeconds}
        currentUnit={unit}
        convertedMinutes={convertedPace.minutes}
        convertedSeconds={convertedPace.seconds}
        convertedUnit={convertedUnit}
      />
      <RaceTable 
        mode="times"
        paceMinutes={paceMinutes}
        paceSeconds={paceSeconds}
        paceUnit={unit}
      />
    </div>
  );
}


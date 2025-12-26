import styles from './App.module.css';
import { AppBar } from './components/AppBar';
import { Header } from './components/Header';
import { PaceInput } from './components/PaceInput';
import { ConvertedPace } from './components/ConvertedPace';
import { RaceTimesScroller } from './components/RaceTimesScroller';
import { usePaceState } from './hooks/usePaceState';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  
  const {
    paceMinutes,
    paceSeconds,
    unit,
    convertedPace,
    convertedUnit,
    raceTimes,
    setPaceMinutes,
    setPaceSeconds,
    setUnit
  } = usePaceState(10, 0, 'mi');

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <AppBar theme={theme} onToggleTheme={toggleTheme} />
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
        <RaceTimesScroller raceTimes={raceTimes} />
      </div>
    </div>
  );
}

export default App;


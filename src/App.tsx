import { useState, useEffect } from 'react';
import styles from './App.module.css';
import { AppBar } from './components/AppBar';
import { PaceConverter } from './components/PaceConverter';
import { DistanceConverter } from './components/DistanceConverter';
import { BottomNav } from './components/BottomNav';
import { useTheme } from './hooks/useTheme';

type Route = 'pace' | 'distance';

const ROUTE_STORAGE_KEY = 'pace-tool-route';

function App() {
  const { theme, toggleTheme } = useTheme();
  
  // Initialize route from localStorage or default to 'pace'
  const [route, setRoute] = useState<Route>(() => {
    const saved = localStorage.getItem(ROUTE_STORAGE_KEY);
    return (saved === 'pace' || saved === 'distance') ? saved : 'pace';
  });

  // Persist route changes to localStorage
  useEffect(() => {
    localStorage.setItem(ROUTE_STORAGE_KEY, route);
  }, [route]);

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <AppBar theme={theme} onToggleTheme={toggleTheme} />
        {route === 'pace' ? <PaceConverter /> : <DistanceConverter />}
      </div>
      <BottomNav activeRoute={route} onRouteChange={setRoute} />
    </div>
  );
}

export default App;


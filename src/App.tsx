import { useState, useEffect } from 'react';
import styles from './App.module.css';
import { AppBar } from './components/AppBar';
import { PaceConverter } from './components/PaceConverter';
import { DistanceConverter } from './components/DistanceConverter';
import { SplitsCalculator } from './components/SplitsCalculator';
import { BottomNav } from './components/BottomNav';
import { UpdateBanner } from './components/UpdateBanner';
import { useTheme } from './hooks/useTheme';

type Route = 'pace' | 'distance' | 'splits';

const ROUTE_STORAGE_KEY = 'pace-tool-route';

function App() {
  const { theme, toggleTheme } = useTheme();
  
  // Initialize route from localStorage or default to 'pace'
  const [route, setRoute] = useState<Route>(() => {
    const saved = localStorage.getItem(ROUTE_STORAGE_KEY);
    return (saved === 'pace' || saved === 'distance' || saved === 'splits') ? saved : 'pace';
  });

  // Persist route changes to localStorage
  useEffect(() => {
    localStorage.setItem(ROUTE_STORAGE_KEY, route);
  }, [route]);

  const renderContent = () => {
    switch (route) {
      case 'pace':
        return <PaceConverter />;
      case 'distance':
        return <DistanceConverter />;
      case 'splits':
        return <SplitsCalculator />;
      default:
        return <PaceConverter />;
    }
  };

  return (
    <div className={styles.app}>
      <UpdateBanner />
      <div className={styles.container}>
        <AppBar theme={theme} onToggleTheme={toggleTheme} />
        {renderContent()}
      </div>
      <BottomNav activeRoute={route} onRouteChange={setRoute} />
    </div>
  );
}

export default App;


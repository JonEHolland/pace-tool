import styles from './BottomNav.module.css';

type Route = 'pace' | 'distance';

interface BottomNavProps {
  activeRoute: Route;
  onRouteChange: (route: Route) => void;
}

function StopwatchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M10 2H14V4H10V2Z" fill="currentColor"/>
      <path d="M12 2V4" stroke="currentColor" strokeWidth="2"/>
      <path d="M17 5L18.5 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M12 9V13L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function DistanceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M7 8L3 12L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L21 12L17 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
      <circle cx="8.5" cy="12" r="1" fill="currentColor"/>
      <circle cx="15.5" cy="12" r="1" fill="currentColor"/>
    </svg>
  );
}

export function BottomNav({ activeRoute, onRouteChange }: BottomNavProps) {
  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.navItem} ${activeRoute === 'pace' ? styles.active : ''}`}
        onClick={() => onRouteChange('pace')}
        aria-label="Pace Converter"
        aria-current={activeRoute === 'pace' ? 'page' : undefined}
      >
        <StopwatchIcon />
        <span className={styles.label}>Pace</span>
      </button>
      <button
        className={`${styles.navItem} ${activeRoute === 'distance' ? styles.active : ''}`}
        onClick={() => onRouteChange('distance')}
        aria-label="Distance Converter"
        aria-current={activeRoute === 'distance' ? 'page' : undefined}
      >
        <DistanceIcon />
        <span className={styles.label}>Distance</span>
      </button>
    </nav>
  );
}


import styles from './AppBar.module.css';

interface AppBarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function AppBar({ theme, onToggleTheme }: AppBarProps) {
  return (
    <header className={styles.appBar}>
      <button 
        className={styles.themeToggle} 
        onClick={onToggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className={styles.icon}>
          {theme === 'light' ? '🌙' : '☀️'}
        </span>
        <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
      </button>
    </header>
  );
}

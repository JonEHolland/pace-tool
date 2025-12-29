import styles from './Header.module.css';

export function Header() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>Pace{'\n'}Converter</h1>
      <p className={styles.subtitle}>Convert pace between kilometers and miles</p>
    </div>
  );
}


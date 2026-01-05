import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'Pace\nConverter', subtitle = 'Convert pace between kilometers and miles' }: HeaderProps = {}) {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}


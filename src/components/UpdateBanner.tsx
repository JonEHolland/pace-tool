import { useServiceWorkerUpdate } from '../hooks/useServiceWorkerUpdate';
import styles from './UpdateBanner.module.css';

export function UpdateBanner() {
  const { updateAvailable, updateAndReload, dismiss } = useServiceWorkerUpdate();

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.icon}>⚡</div>
        <div className={styles.text}>
          <div className={styles.title}>Update Available</div>
          <div className={styles.subtitle}>New features ready to install</div>
        </div>
      </div>
      <div className={styles.actions}>
        <button 
          className={styles.updateButton}
          onClick={updateAndReload}
          aria-label="Update now"
        >
          Update Now
        </button>
        <button 
          className={styles.dismissButton}
          onClick={dismiss}
          aria-label="Dismiss update notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}


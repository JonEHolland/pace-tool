import styles from './SplitStrategySlider.module.css';

interface SplitStrategySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function SplitStrategySlider({ value, onChange }: SplitStrategySliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.label}>Split Strategy</div>
      </div>
      
      <div className={styles.sliderContainer}>
        <input
          type="range"
          min="-100"
          max="100"
          step="1"
          value={value}
          onChange={handleChange}
          className={styles.slider}
          aria-label="Split strategy"
        />
        <div className={styles.markers}>
          <span className={styles.marker}>Positive</span>
          <span className={styles.marker}>Even</span>
          <span className={styles.marker}>Negative</span>
        </div>
      </div>
    </div>
  );
}


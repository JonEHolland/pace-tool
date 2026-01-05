import styles from './TimeInput.module.css';
import { WheelPicker, type WheelConfig } from './WheelPicker';

interface TimeInputProps {
  hours: number;
  minutes: number;
  seconds: number;
  onHoursChange: (hours: number) => void;
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
}

export function TimeInput({
  hours,
  minutes,
  seconds,
  onHoursChange,
  onMinutesChange,
  onSecondsChange
}: TimeInputProps) {
  const wheels: WheelConfig[] = [
    {
      min: 0,
      max: 9,
      value: hours,
      onChange: onHoursChange,
      padStart: 1
    },
    {
      min: 0,
      max: 59,
      value: minutes,
      onChange: onMinutesChange,
      padStart: 2
    },
    {
      min: 0,
      max: 59,
      value: seconds,
      onChange: onSecondsChange,
      padStart: 2
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.label}>Target Time</div>
      <WheelPicker
        wheels={wheels}
        separator=":"
      />
    </div>
  );
}


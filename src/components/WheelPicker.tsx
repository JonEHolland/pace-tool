import { useRef, useEffect, useCallback, useState } from 'react';
import styles from './WheelPicker.module.css';

interface WheelPickerProps {
  minutes: number;
  seconds: number;
  unit: 'km' | 'mi';
  onMinutesChange: (minutes: number) => void;
  onSecondsChange: (seconds: number) => void;
  minMinutes?: number;
  maxMinutes?: number;
}

export function WheelPicker({
  minutes,
  seconds,
  unit,
  onMinutesChange,
  onSecondsChange,
  minMinutes = 2,
  maxMinutes = 20
}: WheelPickerProps) {
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);
  const minutesTimeoutRef = useRef<number | null>(null);
  const secondsTimeoutRef = useRef<number | null>(null);
  const [handlersEnabled, setHandlersEnabled] = useState(false);

  const minutesArray = Array.from(
    { length: maxMinutes - minMinutes + 1 },
    (_, i) => minMinutes + i
  );
  const secondsArray = Array.from({ length: 60 }, (_, i) => i);

  const ITEM_HEIGHT = 40;

  // Scroll to center a value
  const scrollToCenter = useCallback((
    ref: React.RefObject<HTMLDivElement>,
    index: number,
    smooth: boolean = false
  ) => {
    if (ref.current) {
      // Position = index * height, padding pushes everything down
      ref.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  // Initialize scroll positions - run once on mount
  useEffect(() => {
    const initTimer = setTimeout(() => {
      scrollToCenter(minutesRef, minutes - minMinutes, false);
      scrollToCenter(secondsRef, seconds, false);
      
      // Enable handlers after initialization
      setTimeout(() => {
        setHandlersEnabled(true);
      }, 250);
    }, 100);
    
    return () => clearTimeout(initTimer);
  }, []); // Empty deps - only run on mount

  // Handle minutes scroll
  const handleMinutesScroll = useCallback(() => {
    if (!minutesRef.current || !handlersEnabled) return;

    if (minutesTimeoutRef.current) {
      clearTimeout(minutesTimeoutRef.current);
    }

    minutesTimeoutRef.current = setTimeout(() => {
      if (!minutesRef.current) return;
      
      const scrollTop = minutesRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, minutesArray.length - 1));
      const newMinute = minutesArray[clampedIndex];

      if (newMinute !== minutes) {
        onMinutesChange(newMinute);
      }

      scrollToCenter(minutesRef, clampedIndex, true);
    }, 150);
  }, [handlersEnabled, minutes, minutesArray, onMinutesChange, scrollToCenter]);

  // Handle seconds scroll
  const handleSecondsScroll = useCallback(() => {
    if (!secondsRef.current || !handlersEnabled) return;

    if (secondsTimeoutRef.current) {
      clearTimeout(secondsTimeoutRef.current);
    }

    secondsTimeoutRef.current = setTimeout(() => {
      if (!secondsRef.current) return;
      
      const scrollTop = secondsRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, 59));

      if (clampedIndex !== seconds) {
        onSecondsChange(clampedIndex);
      }

      scrollToCenter(secondsRef, clampedIndex, true);
    }, 150);
  }, [handlersEnabled, seconds, onSecondsChange, scrollToCenter]);

  // Handle clicks
  const handleMinuteClick = (minute: number) => {
    onMinutesChange(minute);
    scrollToCenter(minutesRef, minute - minMinutes, true);
  };

  const handleSecondClick = (second: number) => {
    onSecondsChange(second);
    scrollToCenter(secondsRef, second, true);
  };

  // Only update scroll position when unit changes (not on every value change from scrolling!)
  useEffect(() => {
    if (handlersEnabled && minutesRef.current) {
      scrollToCenter(minutesRef, minutes - minMinutes, true);
    }
    if (handlersEnabled && secondsRef.current) {
      scrollToCenter(secondsRef, seconds, true);
    }
  }, [unit]); // Only unit change triggers this!

  const renderMinuteItem = (minute: number) => {
    const isSelected = minute === minutes;
    const isNear = Math.abs(minute - minutes) === 1;
    
    return (
      <div
        key={minute}
        className={`${styles.wheelItem} ${isSelected ? styles.selected : ''} ${isNear ? styles.near : ''}`}
        onClick={() => handleMinuteClick(minute)}
      >
        {minute}
      </div>
    );
  };

  const renderSecondItem = (second: number) => {
    const isSelected = second === seconds;
    const isNear = Math.abs(second - seconds) === 1;
    
    return (
      <div
        key={second}
        className={`${styles.wheelItem} ${isSelected ? styles.selected : ''} ${isNear ? styles.near : ''}`}
        onClick={() => handleSecondClick(second)}
      >
        {second.toString().padStart(2, '0')}
      </div>
    );
  };

  return (
    <div className={styles.wheelPicker}>
      <div className={styles.highlight} />
      
      <div ref={minutesRef} className={styles.wheel} onScroll={handleMinutesScroll}>
        <div className={styles.wheelInner}>
          {minutesArray.map(renderMinuteItem)}
        </div>
      </div>

      <div className={styles.separator}>:</div>

      <div ref={secondsRef} className={styles.wheel} onScroll={handleSecondsScroll}>
        <div className={styles.wheelInner}>
          {secondsArray.map(renderSecondItem)}
        </div>
      </div>

      <div className={`${styles.fade} ${styles.fadeTop}`} />
      <div className={`${styles.fade} ${styles.fadeBottom}`} />
    </div>
  );
}

import { useRef, useEffect, useCallback, useState } from 'react';
import styles from './WheelPicker.module.css';

export interface WheelConfig {
  min: number;           // Minimum value for wheel
  max: number;           // Maximum value for wheel
  value: number;         // Current selected value
  onChange: (value: number) => void;
  padStart?: number;     // Zero-padding (e.g., 2 for "05")
}

interface WheelPickerProps {
  leftWheel: WheelConfig;
  rightWheel: WheelConfig;
  separator: string;     // "." or ":"
  unit: 'km' | 'mi';     // For unit change effect
}

export function WheelPicker({
  leftWheel,
  rightWheel,
  separator,
  unit
}: WheelPickerProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const leftTimeoutRef = useRef<number | null>(null);
  const rightTimeoutRef = useRef<number | null>(null);
  const [handlersEnabled, setHandlersEnabled] = useState(false);

  const leftArray = Array.from(
    { length: leftWheel.max - leftWheel.min + 1 },
    (_, i) => leftWheel.min + i
  );
  const rightArray = Array.from(
    { length: rightWheel.max - rightWheel.min + 1 },
    (_, i) => rightWheel.min + i
  );

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
      scrollToCenter(leftRef, leftWheel.value - leftWheel.min, false);
      scrollToCenter(rightRef, rightWheel.value - rightWheel.min, false);
      
      // Enable handlers after initialization
      setTimeout(() => {
        setHandlersEnabled(true);
      }, 250);
    }, 100);
    
    return () => clearTimeout(initTimer);
  }, []); // Empty deps - only run on mount

  // Handle left wheel scroll
  const handleLeftScroll = useCallback(() => {
    if (!leftRef.current || !handlersEnabled) return;

    if (leftTimeoutRef.current) {
      clearTimeout(leftTimeoutRef.current);
    }

    leftTimeoutRef.current = setTimeout(() => {
      if (!leftRef.current) return;
      
      const scrollTop = leftRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, leftArray.length - 1));
      const newValue = leftArray[clampedIndex];

      if (newValue !== leftWheel.value) {
        leftWheel.onChange(newValue);
      }

      scrollToCenter(leftRef, clampedIndex, true);
    }, 150);
  }, [handlersEnabled, leftWheel, leftArray, scrollToCenter]);

  // Handle right wheel scroll
  const handleRightScroll = useCallback(() => {
    if (!rightRef.current || !handlersEnabled) return;

    if (rightTimeoutRef.current) {
      clearTimeout(rightTimeoutRef.current);
    }

    rightTimeoutRef.current = setTimeout(() => {
      if (!rightRef.current) return;
      
      const scrollTop = rightRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, rightArray.length - 1));
      const newValue = rightArray[clampedIndex];

      if (newValue !== rightWheel.value) {
        rightWheel.onChange(newValue);
      }

      scrollToCenter(rightRef, clampedIndex, true);
    }, 150);
  }, [handlersEnabled, rightWheel, rightArray, scrollToCenter]);

  // Handle clicks
  const handleLeftClick = (value: number) => {
    leftWheel.onChange(value);
    scrollToCenter(leftRef, value - leftWheel.min, true);
  };

  const handleRightClick = (value: number) => {
    rightWheel.onChange(value);
    scrollToCenter(rightRef, value - rightWheel.min, true);
  };

  // Only update scroll position when unit changes (not on every value change from scrolling!)
  useEffect(() => {
    if (handlersEnabled && leftRef.current) {
      scrollToCenter(leftRef, leftWheel.value - leftWheel.min, true);
    }
    if (handlersEnabled && rightRef.current) {
      scrollToCenter(rightRef, rightWheel.value - rightWheel.min, true);
    }
  }, [unit]); // Only unit change triggers this!

  const renderLeftItem = (value: number) => {
    const isSelected = value === leftWheel.value;
    const isNear = Math.abs(value - leftWheel.value) === 1;
    
    return (
      <div
        key={value}
        className={`${styles.wheelItem} ${isSelected ? styles.selected : ''} ${isNear ? styles.near : ''}`}
        onClick={() => handleLeftClick(value)}
      >
        {leftWheel.padStart ? value.toString().padStart(leftWheel.padStart, '0') : value}
      </div>
    );
  };

  const renderRightItem = (value: number) => {
    const isSelected = value === rightWheel.value;
    const isNear = Math.abs(value - rightWheel.value) === 1;
    
    return (
      <div
        key={value}
        className={`${styles.wheelItem} ${isSelected ? styles.selected : ''} ${isNear ? styles.near : ''}`}
        onClick={() => handleRightClick(value)}
      >
        {rightWheel.padStart ? value.toString().padStart(rightWheel.padStart, '0') : value}
      </div>
    );
  };

  return (
    <div className={styles.wheelPicker}>
      <div className={styles.highlight} />
      
      <div ref={leftRef} className={styles.wheel} onScroll={handleLeftScroll}>
        <div className={styles.wheelInner}>
          {leftArray.map(renderLeftItem)}
        </div>
      </div>

      <div className={styles.separator}>{separator}</div>

      <div ref={rightRef} className={styles.wheel} onScroll={handleRightScroll}>
        <div className={styles.wheelInner}>
          {rightArray.map(renderRightItem)}
        </div>
      </div>

      <div className={`${styles.fade} ${styles.fadeTop}`} />
      <div className={`${styles.fade} ${styles.fadeBottom}`} />
    </div>
  );
}

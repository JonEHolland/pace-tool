import { useRef, useEffect, useCallback, useState } from 'react';
import styles from './DistanceWheelPicker.module.css';

interface DistanceWheelPickerProps {
  distance: number;
  unit: 'km' | 'mi';
  onDistanceChange: (distance: number) => void;
}

export function DistanceWheelPicker({
  distance,
  unit,
  onDistanceChange
}: DistanceWheelPickerProps) {
  const integerRef = useRef<HTMLDivElement>(null);
  const decimalRef = useRef<HTMLDivElement>(null);
  const integerTimeoutRef = useRef<number | null>(null);
  const decimalTimeoutRef = useRef<number | null>(null);
  const [handlersEnabled, setHandlersEnabled] = useState(false);

  // Split distance into integer and decimal parts
  const integerPart = Math.floor(distance);
  const decimalPart = Math.round((distance - integerPart) * 100);

  // Arrays for wheels
  const integerArray = Array.from({ length: 1000 }, (_, i) => i); // 0 to 999
  const decimalArray = Array.from({ length: 100 }, (_, i) => i); // 0 to 99

  const ITEM_HEIGHT = 40;

  // Scroll to center a value
  const scrollToCenter = useCallback((
    ref: React.RefObject<HTMLDivElement>,
    index: number,
    smooth: boolean = false
  ) => {
    if (ref.current) {
      ref.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  // Initialize scroll positions - run once on mount
  useEffect(() => {
    const initTimer = setTimeout(() => {
      scrollToCenter(integerRef, integerPart, false);
      scrollToCenter(decimalRef, decimalPart, false);
      
      // Enable handlers after initialization
      setTimeout(() => {
        setHandlersEnabled(true);
      }, 250);
    }, 100);
    
    return () => clearTimeout(initTimer);
  }, []); // Empty deps - only run on mount

  // Handle integer scroll
  const handleIntegerScroll = useCallback(() => {
    if (!integerRef.current || !handlersEnabled) return;

    if (integerTimeoutRef.current) {
      clearTimeout(integerTimeoutRef.current);
    }

    integerTimeoutRef.current = setTimeout(() => {
      if (!integerRef.current) return;
      
      const scrollTop = integerRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, integerArray.length - 1));
      const newInteger = integerArray[clampedIndex];

      const newDistance = newInteger + (decimalPart / 100);
      if (Math.abs(newDistance - distance) > 0.001) {
        onDistanceChange(newDistance);
      }

      scrollToCenter(integerRef, clampedIndex, true);
    }, 150);
  }, [handlersEnabled, distance, integerArray, decimalPart, onDistanceChange, scrollToCenter]);

  // Handle decimal scroll
  const handleDecimalScroll = useCallback(() => {
    if (!decimalRef.current || !handlersEnabled) return;

    if (decimalTimeoutRef.current) {
      clearTimeout(decimalTimeoutRef.current);
    }

    decimalTimeoutRef.current = setTimeout(() => {
      if (!decimalRef.current) return;
      
      const scrollTop = decimalRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, 99));

      const newDistance = integerPart + (clampedIndex / 100);
      if (Math.abs(newDistance - distance) > 0.001) {
        onDistanceChange(newDistance);
      }

      scrollToCenter(decimalRef, clampedIndex, true);
    }, 150);
  }, [handlersEnabled, distance, integerPart, onDistanceChange, scrollToCenter]);

  // Handle clicks
  const handleIntegerClick = (value: number) => {
    const newDistance = value + (decimalPart / 100);
    onDistanceChange(newDistance);
    scrollToCenter(integerRef, value, true);
  };

  const handleDecimalClick = (value: number) => {
    const newDistance = integerPart + (value / 100);
    onDistanceChange(newDistance);
    scrollToCenter(decimalRef, value, true);
  };

  // Update scroll position when unit changes
  useEffect(() => {
    if (handlersEnabled) {
      if (integerRef.current) {
        scrollToCenter(integerRef, integerPart, true);
      }
      if (decimalRef.current) {
        scrollToCenter(decimalRef, decimalPart, true);
      }
    }
  }, [unit]); // Only unit change triggers this!

  const renderIntegerItem = (value: number) => {
    const isSelected = value === integerPart;
    const isNear = Math.abs(value - integerPart) === 1;
    
    return (
      <div
        key={value}
        className={`${styles.wheelItem} ${isSelected ? styles.selected : ''} ${isNear ? styles.near : ''}`}
        onClick={() => handleIntegerClick(value)}
      >
        {value}
      </div>
    );
  };

  const renderDecimalItem = (value: number) => {
    const isSelected = value === decimalPart;
    const isNear = Math.abs(value - decimalPart) === 1;
    
    return (
      <div
        key={value}
        className={`${styles.wheelItem} ${isSelected ? styles.selected : ''} ${isNear ? styles.near : ''}`}
        onClick={() => handleDecimalClick(value)}
      >
        {value.toString().padStart(2, '0')}
      </div>
    );
  };

  return (
    <div className={styles.wheelPicker}>
      <div className={styles.highlight} />
      
      <div ref={integerRef} className={styles.wheel} onScroll={handleIntegerScroll}>
        <div className={styles.wheelInner}>
          {integerArray.map(renderIntegerItem)}
        </div>
      </div>

      <div className={styles.separator}>.</div>

      <div ref={decimalRef} className={styles.wheel} onScroll={handleDecimalScroll}>
        <div className={styles.wheelInner}>
          {decimalArray.map(renderDecimalItem)}
        </div>
      </div>

      <div className={`${styles.fade} ${styles.fadeTop}`} />
      <div className={`${styles.fade} ${styles.fadeBottom}`} />
    </div>
  );
}


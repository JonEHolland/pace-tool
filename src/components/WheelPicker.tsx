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
  wheels: WheelConfig[];  // Array of wheel configs
  separator: string;      // "." or ":"
  unit?: 'km' | 'mi';     // For unit change effect (optional)
}

export function WheelPicker({
  wheels,
  separator,
  unit
}: WheelPickerProps) {
  const wheelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeoutRefs = useRef<(number | null)[]>([]);
  const [handlersEnabled, setHandlersEnabled] = useState(false);

  const wheelArrays = wheels.map(wheel => 
    Array.from({ length: wheel.max - wheel.min + 1 }, (_, i) => wheel.min + i)
  );

  const ITEM_HEIGHT = 40;

  // Scroll to center a value
  const scrollToCenter = useCallback((
    index: number,
    wheelIndex: number,
    smooth: boolean = false
  ) => {
    const ref = wheelRefs.current[wheelIndex];
    if (ref) {
      ref.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }
  }, []);

  // Initialize scroll positions - run once on mount
  useEffect(() => {
    const initTimer = setTimeout(() => {
      wheels.forEach((wheel, i) => {
        scrollToCenter(wheel.value - wheel.min, i, false);
      });
      
      // Enable handlers after initialization
      setTimeout(() => {
        setHandlersEnabled(true);
      }, 250);
    }, 100);
    
    return () => clearTimeout(initTimer);
  }, []); // Empty deps - only run on mount

  // Handle wheel scroll
  const handleWheelScroll = useCallback((wheelIndex: number) => {
    return () => {
      const ref = wheelRefs.current[wheelIndex];
      if (!ref || !handlersEnabled) return;

      if (timeoutRefs.current[wheelIndex]) {
        clearTimeout(timeoutRefs.current[wheelIndex]!);
      }

      timeoutRefs.current[wheelIndex] = setTimeout(() => {
        if (!ref) return;
        
        const scrollTop = ref.scrollTop;
        const index = Math.round(scrollTop / ITEM_HEIGHT);
        const wheelArray = wheelArrays[wheelIndex];
        const wheel = wheels[wheelIndex];
        const clampedIndex = Math.max(0, Math.min(index, wheelArray.length - 1));
        const newValue = wheelArray[clampedIndex];

        if (newValue !== wheel.value) {
          wheel.onChange(newValue);
        }

        scrollToCenter(clampedIndex, wheelIndex, true);
      }, 150);
    };
  }, [handlersEnabled, wheels, wheelArrays, scrollToCenter]);

  // Handle clicks
  const handleWheelClick = (value: number, wheelIndex: number) => {
    const wheel = wheels[wheelIndex];
    wheel.onChange(value);
    scrollToCenter(value - wheel.min, wheelIndex, true);
  };

  // Only update scroll position when unit changes (not on every value change from scrolling!)
  useEffect(() => {
    if (handlersEnabled && unit) {
      wheels.forEach((wheel, i) => {
        scrollToCenter(wheel.value - wheel.min, i, true);
      });
    }
  }, [unit]); // Only unit change triggers this!

  const renderWheelItem = (value: number, wheelIndex: number) => {
    const wheel = wheels[wheelIndex];
    const isSelected = value === wheel.value;
    const isNear = Math.abs(value - wheel.value) === 1;
    
    return (
      <div
        key={value}
        className={`${styles.wheelItem} ${isSelected ? styles.selected : ''} ${isNear ? styles.near : ''}`}
        onClick={() => handleWheelClick(value, wheelIndex)}
      >
        {wheel.padStart ? value.toString().padStart(wheel.padStart, '0') : value}
      </div>
    );
  };

  return (
    <div className={styles.wheelPicker}>
      <div className={styles.highlight} />
      
      {wheels.map((_, wheelIndex) => (
        <div key={wheelIndex} style={{ display: 'contents' }}>
          <div 
            ref={el => wheelRefs.current[wheelIndex] = el} 
            className={styles.wheel} 
            onScroll={handleWheelScroll(wheelIndex)}
          >
            <div className={styles.wheelInner}>
              {wheelArrays[wheelIndex].map(value => renderWheelItem(value, wheelIndex))}
            </div>
          </div>
          
          {wheelIndex < wheels.length - 1 && (
            <div className={styles.separator}>{separator}</div>
          )}
        </div>
      ))}

      <div className={`${styles.fade} ${styles.fadeTop}`} />
      <div className={`${styles.fade} ${styles.fadeBottom}`} />
    </div>
  );
}

// Scroll to Pace Hook

import { useRef, useCallback, useEffect } from 'react';

interface UseScrollPaceOptions {
  onPaceChange: (deltaSeconds: number) => void;
  scrollSensitivity?: number; // pixels per second of pace change
  snapDelay?: number; // ms to wait before snapping
}

export function useScrollPace({
  onPaceChange,
  scrollSensitivity = 10, // 10px scroll = 1 second pace change
  snapDelay = 300
}: UseScrollPaceOptions) {
  const lastScrollY = useRef<number>(0);
  const scrollTimeout = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const currentScrollY = event.currentTarget.scrollTop;
      
      // Calculate delta
      const delta = currentScrollY - lastScrollY.current;
      
      if (Math.abs(delta) > 0) {
        isScrolling.current = true;
        
        // Convert scroll delta to pace seconds delta
        // Scrolling down (positive delta) = slower pace (positive seconds)
        // Scrolling up (negative delta) = faster pace (negative seconds)
        const paceSecondsDelta = Math.round(delta / scrollSensitivity);
        
        if (paceSecondsDelta !== 0) {
          onPaceChange(paceSecondsDelta);
          lastScrollY.current = currentScrollY;
        }
      }

      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Set new timeout for scroll end
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
        // Snap to nearest second is handled by the pace state itself
      }, snapDelay);
    },
    [onPaceChange, scrollSensitivity, snapDelay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return {
    handleScroll,
    isScrolling: isScrolling.current
  };
}


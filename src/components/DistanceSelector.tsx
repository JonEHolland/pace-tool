import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './DistanceSelector.module.css';
import { RACE_DISTANCES } from '../utils/raceTimeCalculations';

interface DistanceSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function DistanceSelector({ selectedId, onSelect }: DistanceSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to show/hide fade indicators
  const updateScrollIndicators = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  // Scroll selected pill into center view
  const scrollToCenter = useCallback((id: string, smooth = true) => {
    const container = scrollContainerRef.current;
    const pill = pillRefs.current.get(id);
    if (!container || !pill) return;

    const containerRect = container.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    
    // Calculate offset to center the pill
    const pillCenter = pillRect.left + pillRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const scrollOffset = pillCenter - containerCenter;

    container.scrollBy({
      left: scrollOffset,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, []);

  // Center selected pill on mount and when selection changes
  useEffect(() => {
    // Small delay to ensure pills are rendered
    const timer = setTimeout(() => {
      scrollToCenter(selectedId, false);
      updateScrollIndicators();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Update scroll indicators on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollIndicators, { passive: true });
    // Initial check
    updateScrollIndicators();
    
    // Also check on resize
    window.addEventListener('resize', updateScrollIndicators);

    return () => {
      container.removeEventListener('scroll', updateScrollIndicators);
      window.removeEventListener('resize', updateScrollIndicators);
    };
  }, [updateScrollIndicators]);

  const handleSelect = (id: string) => {
    onSelect(id);
    scrollToCenter(id, true);
  };

  return (
    <div className={styles.container}>
      {/* Left fade indicator */}
      <div className={`${styles.fade} ${styles.fadeLeft} ${canScrollLeft ? styles.visible : ''}`} />
      
      <div 
        ref={scrollContainerRef}
        className={styles.scrollContainer}
      >
        {RACE_DISTANCES.map(distance => (
          <button
            key={distance.id}
            ref={(el) => {
              if (el) pillRefs.current.set(distance.id, el);
            }}
            className={`${styles.pill} ${selectedId === distance.id ? styles.active : ''}`}
            onClick={() => handleSelect(distance.id)}
            aria-label={`Select ${distance.label} distance`}
            aria-pressed={selectedId === distance.id}
          >
            {distance.label}
          </button>
        ))}
      </div>

      {/* Right fade indicator */}
      <div className={`${styles.fade} ${styles.fadeRight} ${canScrollRight ? styles.visible : ''}`} />
    </div>
  );
}

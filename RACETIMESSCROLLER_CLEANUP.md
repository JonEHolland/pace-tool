# RaceTimesScroller Dead Code Cleanup

## Issue Found

The `RaceTimesScroller` component contained **completely unused pulse animation code**.

### Dead Code Removed

**Before (55 lines):**
```tsx
import { useState } from 'react';

export function RaceTimesScroller({ raceTimes }: RaceTimesScrollerProps) {
  const [lastRaceTimes, setLastRaceTimes] = useState(raceTimes);
  const [pulsingRows, setPulsingRows] = useState<Set<string>>(new Set());

  // Detect when race times change and trigger pulse animation
  if (raceTimes !== lastRaceTimes) {
    const changedRows = new Set<string>();
    RACE_DISTANCES.forEach(race => {
      if (raceTimes[race.id] !== lastRaceTimes[race.id]) {
        changedRows.add(race.id);
      }
    });
    
    if (changedRows.size > 0) {
      setPulsingRows(changedRows);
      setTimeout(() => setPulsingRows(new Set()), 300);
    }
    
    setLastRaceTimes(raceTimes);
  }
  
  // ... then uses: pulsingRows.has(race.id) ? 'pulse' : ''
}
```

**After (29 lines):**
```tsx
// No imports from 'react', no state, no animation logic
export function RaceTimesScroller({ raceTimes }: RaceTimesScrollerProps) {
  return (
    // ... simple render with no pulse class
  );
}
```

### Why It Was Dead Code

1. ❌ **No CSS for `.pulse` class** - The component added `'pulse'` string to className, but no `.pulse` CSS existed
2. ❌ **No animation keyframes** - No `@keyframes` defined anywhere
3. ❌ **Unused state** - `lastRaceTimes` and `pulsingRows` state never did anything visible
4. ❌ **Wasted re-renders** - Change detection logic caused unnecessary renders for no effect

### Code Removed

- ❌ `useState` import from React
- ❌ `lastRaceTimes` state (tracks previous race times)
- ❌ `pulsingRows` state (Set of IDs to pulse)
- ❌ 14 lines of change detection logic
- ❌ Conditional `'pulse'` class application
- ❌ `setTimeout` for clearing pulse after 300ms

### Benefits

- ✅ **47% smaller component** (55 → 29 lines)
- ✅ **Simpler logic** - Pure presentation component
- ✅ **Better performance** - No state updates, no timeouts
- ✅ **Smaller bundle** - 178.40 kB (was 178.60 kB)
- ✅ **No unnecessary re-renders**

### Build Verification

**Before Cleanup:**
```
dist/index.html  178.60 kB │ gzip: 54.48 kB
```

**After Cleanup:**
```
dist/index.html  178.40 kB │ gzip: 54.39 kB
```

**Savings:** 200 bytes uncompressed, 90 bytes gzipped

### Component Purpose

The component is now correctly a **simple presentational component** that:
- Displays race distances (5K, 10K, Half Marathon, Marathon)
- Shows calculated finish times based on current pace
- No animations, no state, no side effects

---

**Cleanup Date:** December 28, 2025
**Status:** ✅ Complete - All dead animation code removed


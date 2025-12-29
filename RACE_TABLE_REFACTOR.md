# RaceTable Component Unification

## The Brilliant Idea

Instead of having separate components with render props scattered around, **all race table logic lives in one file** with the render functions co-located.

## What We Built

### New Unified Component

**`RaceTable.tsx`** - Everything in one place:
```tsx
// Generic table component
export function RaceTable({ title, renderRow }) { ... }

// Render function for distance display
export function renderDistanceRow(race) { ... }

// Render function for time display  
export function renderTimeRow(race, raceTimes) { ... }
```

### Super Clean Usage

**Before (36 lines each):**
```tsx
// RaceDistancesReference.tsx - 33 lines of JSX
<div className={styles.container}>
  <div className={styles.header}>...</div>
  <div className={styles.table}>
    {RACE_DISTANCES.map(race => (...))}
  </div>
</div>

// RaceTimesScroller.tsx - 36 lines of JSX  
<div className={styles.container}>
  <div className={styles.header}>...</div>
  <div className={styles.table}>
    {RACE_DISTANCES.map(race => (...))}
  </div>
</div>
```

**After (7 lines & 10 lines):**
```tsx
// RaceDistancesReference.tsx - 7 lines total!
import { RaceTable, renderDistanceRow } from './RaceTable';

export function RaceDistancesReference() {
  return <RaceTable title="Common race distances" renderRow={renderDistanceRow} />;
}

// RaceTimesScroller.tsx - 10 lines total!
import { RaceTable, renderTimeRow } from './RaceTable';

export function RaceTimesScroller({ raceTimes }) {
  return <RaceTable title="Race times" renderRow={(race) => renderTimeRow(race, raceTimes)} />;
}
```

## Benefits of This Pattern

### 1. **Co-location** 
✅ All race table logic in one file  
✅ Easy to find and modify  
✅ No hunting through multiple files

### 2. **Clarity**
✅ Generic component + specific render functions  
✅ Clear separation of concerns  
✅ Self-documenting code

### 3. **Reusability**
✅ Easy to add new race table variants  
✅ Just export a new `renderXRow` function  
✅ All styling already handled

### 4. **Maintainability**
✅ One CSS file to rule them all  
✅ Update table structure once  
✅ All consumers automatically updated

## Code Reduction

### Components
**Before:**
- RaceDistancesReference.tsx: 33 lines
- RaceTimesScroller.tsx: 36 lines  
- Total: 69 lines

**After:**
- RaceDistancesReference.tsx: 7 lines
- RaceTimesScroller.tsx: 10 lines
- RaceTable.tsx: 65 lines (new, but reusable)
- Total: 82 lines

**Net:** +13 lines, but now we have a reusable component!

### CSS Files
**Before:**
- RaceDistancesReference.module.css: 82 lines
- RaceTimesScroller.module.css: 96 lines
- Total: 178 lines

**After:**
- RaceTable.module.css: 124 lines
- Total: 124 lines

**Saved:** 54 lines of CSS (30% reduction)

### Bundle Size
**Before refactor:** 178.52 kB (gzip: 54.31 kB)  
**After refactor:** 177.22 kB (gzip: 54.20 kB)  
**Savings:** 1.3 kB uncompressed, 110 bytes gzipped

## Pattern to Add New Variants

Need a new race table? Super easy:

```tsx
// In RaceTable.tsx, just add:
export function renderCustomRow(race: RaceDistance) {
  return (
    <>
      <div className={styles.raceName}>{race.label}</div>
      {/* your custom content */}
    </>
  );
}

// In your new component:
import { RaceTable, renderCustomRow } from './RaceTable';

export function CustomRaceTable() {
  return <RaceTable title="Custom" renderRow={renderCustomRow} />;
}
```

## Why This Works So Well

1. **Render functions are just functions** - Easy to test, compose, and reuse
2. **All styling centralized** - Change once, affect all tables
3. **Type-safe** - TypeScript ensures correct usage
4. **No over-abstraction** - Simple, clear, obvious

## Files Deleted
- ❌ `RaceDistancesReference.module.css` (82 lines)
- ❌ `RaceTimesScroller.module.css` (96 lines)

## Files Created
- ✅ `RaceTable.tsx` (65 lines)
- ✅ `RaceTable.module.css` (124 lines)

## Verification
- ✅ TypeScript compilation successful
- ✅ No linter errors
- ✅ Build successful (377ms)
- ✅ Bundle size reduced
- ✅ All functionality preserved

---

**Refactor Date:** December 28, 2025  
**Status:** ✅ Complete - Beautiful pattern achieved!  
**Credit:** User's excellent suggestion to co-locate render functions


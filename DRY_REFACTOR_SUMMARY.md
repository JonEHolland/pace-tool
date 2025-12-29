# DRY Refactoring - Race Components

## Problem Identified

Two components were maintaining **duplicate race distance data**:

### Before Refactoring

**RaceDistancesReference.tsx:**
```typescript
const COMMON_RACES: RaceDistance[] = [
  { name: '5K', km: 5.0, mi: 3.11 },
  { name: '10K', km: 10.0, mi: 6.21 },
  { name: '15K', km: 15.0, mi: 9.32 },
  { name: 'Half Marathon', km: 21.1, mi: 13.11 },
  { name: 'Marathon', km: 42.2, mi: 26.22 },
  { name: '50K', km: 50.0, mi: 31.07 }
];
```

**raceTimeCalculations.ts:**
```typescript
export const RACE_DISTANCES: RaceDistance[] = [
  { id: '5k', label: '5K', distanceKm: 5.0, distanceNote: '5.00 km' },
  { id: '10k', label: '10K', distanceKm: 10.0, distanceNote: '10.00 km' },
  { id: 'half', label: 'Half', distanceKm: 21.0975, distanceNote: '21.10 km' },
  { id: 'full', label: 'Marathon', distanceKm: 42.195, distanceNote: '42.20 km' }
];
```

### Issues

1. ❌ **Duplicate data** - Two different arrays of race distances
2. ❌ **Inconsistent structure** - Different field names and shapes
3. ❌ **Missing races** - `RACE_DISTANCES` was missing 15K and 50K
4. ❌ **Inconsistent precision** - Different decimal places for km
5. ❌ **Computed field** - `distanceNote` was just formatted km

## Solution: Single Source of Truth

### After Refactoring

**raceTimeCalculations.ts** (unified data source):
```typescript
export interface RaceDistance {
  id: string;
  label: string;
  distanceKm: number;
  distanceMi: number;
}

export const RACE_DISTANCES: RaceDistance[] = [
  { id: '5k', label: '5K', distanceKm: 5.0, distanceMi: 3.11 },
  { id: '10k', label: '10K', distanceKm: 10.0, distanceMi: 6.21 },
  { id: '15k', label: '15K', distanceKm: 15.0, distanceMi: 9.32 },
  { id: 'half', label: 'Half Marathon', distanceKm: 21.0975, distanceMi: 13.11 },
  { id: 'full', label: 'Marathon', distanceKm: 42.195, distanceMi: 26.22 },
  { id: '50k', label: '50K', distanceKm: 50.0, distanceMi: 31.07 }
];
```

### Changes Made

#### 1. **raceTimeCalculations.ts**
- ✅ Added `distanceMi` field to interface
- ✅ Removed `distanceNote` field (computed at render time)
- ✅ Added missing races: 15K, 50K
- ✅ Updated label: "Half" → "Half Marathon"
- ✅ Made it the single source of truth

#### 2. **RaceDistancesReference.tsx**
- ✅ Removed local `COMMON_RACES` array (27 lines deleted)
- ✅ Removed duplicate `RaceDistance` interface
- ✅ Now imports `RACE_DISTANCES` from utils
- ✅ Updated to use unified field names

**Before (47 lines)** → **After (28 lines)** = **40% smaller**

#### 3. **RaceTimesScroller.tsx**
- ✅ Removed dependency on `distanceNote` field
- ✅ Computes display format at render time: `{race.distanceKm.toFixed(2)} km`
- ✅ Now shows all 6 races (was 4, now includes 15K and 50K)

## Benefits

### Code Quality
- ✅ **DRY principle** - Single source of truth for race data
- ✅ **Consistency** - Both components use identical data
- ✅ **Maintainability** - Update race data in one place
- ✅ **Type safety** - Shared interface prevents mismatches

### Component Improvements
- ✅ **RaceTimesScroller** now shows 6 races (was 4)
- ✅ **RaceDistancesReference** reduced by 40%
- ✅ Both components automatically stay in sync

### Bundle Size
**Before:** 178.40 kB  
**After:** 178.33 kB  
**Savings:** 70 bytes (removed duplicate data)

## Future Enhancement Opportunities

While this refactoring unifies the data, we could further DRY the components:

### Potential Shared Component Structure

Both components share similar patterns:
- Container with header and title
- Table with rows
- Race name/label display
- Similar CSS structure

**Could create:**
- `<RaceTable>` - Shared table container
- `<RaceRow>` - Shared row layout
- Pass render props for custom content

**However**, the components are different enough that forcing them into a shared component might reduce clarity. Current approach strikes a good balance:
- ✅ Shared data (unified)
- ✅ Independent presentation (clear purpose)
- ✅ Similar but not identical styling (appropriate for each use case)

## Verification

- ✅ TypeScript compilation successful
- ✅ No linter errors
- ✅ Build successful (375ms)
- ✅ All 6 races display correctly in both components
- ✅ Race time calculations work for all distances

---

**Refactor Date:** December 28, 2025  
**Status:** ✅ Complete - DRY principle applied successfully


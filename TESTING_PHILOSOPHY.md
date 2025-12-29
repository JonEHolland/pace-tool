# Testing Philosophy

## Overview

This document describes the testing approach for the pace-tool application, emphasizing proper software design patterns and test isolation through dependency injection.

## Core Principles

### 1. Dependency Injection Over Mocking

**The Problem**: Tight coupling to global dependencies (like `localStorage`) makes code hard to test and violates the Dependency Inversion Principle.

**The Solution**: Inject dependencies explicitly, making them testable without global mocks.

```typescript
// ❌ BAD - Tightly coupled to localStorage
export function useDistanceState(initialDistance: number) {
  const [distance, setDistance] = useState(() => {
    return localStorage.getItem('distance') || initialDistance;
  });
  // ...
}

// ✅ GOOD - Depends on abstraction, injectable for testing
export function useDistanceState(
  initialDistance: number,
  storage: StorageFacade = browserStorage
) {
  const [distance, setDistance] = useState(() => {
    return storage.getItem('distance') || initialDistance;
  });
  // ...
}
```

**Benefits**:
- ✅ Each test gets its own isolated storage instance
- ✅ No global state or mocking required
- ✅ Tests can run in parallel without interference
- ✅ Dependencies are explicit and swappable
- ✅ Easier to reason about and maintain

### 2. Test Behavior, Not Implementation

Tests should verify **what** the system does, not **how** it does it:

- ✅ Assert on observable outputs and state changes
- ✅ Test user-facing behavior and APIs
- ❌ Don't test internal implementation details
- ❌ Don't probe deep into private state

### 3. True Test Isolation

All tests must be completely isolated:

- ✅ Each test creates its own dependencies (e.g., `new MemoryStorage()`)
- ✅ Tests can run in any order
- ✅ Tests can run in parallel
- ❌ Never rely on global setup/teardown
- ❌ Never share state between tests

### 4. Appropriate Assertions for Context

Different types of tests require different assertion strategies:

#### Utility Functions
Use `toBeCloseTo()` to acknowledge floating-point precision limits:

```typescript
it('converts km to mi correctly', () => {
  const result = convertPace(5, 0, 'km', 'mi');
  expect(result.minutes).toBe(8);
  expect(result.seconds).toBe(3);
});
```

#### Hook Round-Trip Tests
Use `toBe()` for exact equality to validate canonical storage:

```typescript
it('preserves exact value when switching km→mi→km', () => {
  const storage = new MemoryStorage();
  const { result } = renderHook(() => useDistanceState(5.0, 'km', storage));
  const original = result.current.distance;
  
  act(() => result.current.setUnit('mi'));
  act(() => result.current.setUnit('km'));
  
  expect(result.current.distance).toBe(original); // Exact equality!
});
```

## Architecture

### Storage Facade

```typescript
// src/utils/storage.ts
export interface StorageFacade {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

// Production: uses browser localStorage
export const browserStorage: StorageFacade = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  // ...
};

// Testing: in-memory, isolated storage
export class MemoryStorage implements StorageFacade {
  private store: Map<string, string> = new Map();
  // ...
}
```

### Hook Signature

```typescript
export function useDistanceState(
  initialDistance: number = 5.0,
  initialUnit: Unit = 'km',
  storage: StorageFacade = browserStorage  // ← Injectable dependency
): UseDistanceStateReturn {
  // Hook uses storage instead of localStorage directly
  const saved = storage.getItem(DISTANCE_STORAGE_KEY);
  // ...
}
```

### Test Pattern

```typescript
describe('useDistanceState', () => {
  it('persists to storage', () => {
    const storage = new MemoryStorage();  // ← Fresh instance per test
    const { result } = renderHook(() => 
      useDistanceState(5.0, 'km', storage)  // ← Inject test dependency
    );
    
    act(() => result.current.setDistance(15.5));
    
    expect(storage.getItem('pace-tool-distance')).toBe('15.5');
  });
});
```

## Test Structure

### Utility Tests (`src/utils/*.test.ts`)
- Test core calculation logic
- Verify clamping behavior
- Use `toBeCloseTo()` for floating-point comparisons
- Keep tests simple and behavior-focused

### Hook Tests (`src/hooks/*.test.ts`)
- Create isolated `MemoryStorage` instance per test
- Test initialization, persistence, and state updates
- Verify storage integration via the facade
- Focus on the hook's public API

### Round-Trip Tests (`src/hooks/*.roundtrip.test.ts`)
- Dedicated tests for unit conversion precision
- Use exact equality (`toBe()`) to ensure no precision loss
- Validate canonical storage without probing internals

### Test Setup (`src/test-utils.ts`)

Minimal global setup - no localStorage mocking needed:

```typescript
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## What We Don't Test

- Service Worker functionality
- UI components without complex logic
- Theme hooks
- Entry point (`main.tsx`)

## Anti-Patterns to Avoid

### ❌ Tight Coupling to Global Dependencies

```typescript
// BAD - Can't test without global mocking
function useData() {
  const value = localStorage.getItem('key');
  // ...
}
```

### ❌ Global Mocking

```typescript
// BAD - Global state shared across tests
beforeEach(() => {
  localStorage.clear();
});
```

### ❌ Sharing Dependencies Between Tests

```typescript
// BAD - Tests interfere with each other
const sharedStorage = new MemoryStorage();

it('test 1', () => {
  const { result } = renderHook(() => useDistanceState(5, 'km', sharedStorage));
  // ...
});

it('test 2', () => {
  // Uses same storage as test 1! 💥
  const { result } = renderHook(() => useDistanceState(10, 'km', sharedStorage));
  // ...
});
```

## Running Tests

```bash
# Run all tests (parallel by default)
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Parallel Execution

Tests run in parallel with 2-4 threads:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    pool: 'threads',
    minThreads: 2,
    maxThreads: 4,
  }
});
```

## Design Feedback from Tests

**If tests are hard to write, the design needs improvement.**

The original global `localStorage` mocking was a code smell indicating:
- ❌ Tight coupling to browser APIs
- ❌ Hidden dependencies
- ❌ Difficult to isolate tests
- ❌ Can't run tests in parallel

The solution was **not** better mocking, but **better design**:
- ✅ Explicit dependencies via parameters
- ✅ Depend on abstractions (`StorageFacade`)
- ✅ Easy to test with `MemoryStorage`
- ✅ Can swap implementations (IndexedDB, sessionStorage, etc.)

## Summary

The testing approach prioritizes:
1. **Proper Design**: Dependency injection, explicit dependencies, interface segregation
2. **Clarity**: Tests are easy to read and understand
3. **Isolation**: Each test is completely independent
4. **Robustness**: Tests catch real bugs without false positives
5. **Maintainability**: Tests don't break when refactoring internals
6. **Efficiency**: Comprehensive coverage with parallel execution

**Total**: 68 tests in ~540 lines, fully isolated, running in parallel.

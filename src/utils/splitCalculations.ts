// Split Calculations Utility

export interface Split {
  splitNumber: number;       // 1, 2, 3...
  distanceKm: number;        // Cumulative distance (1.0, 2.0, 3.0...)
  paceSecondsPerKm: number;  // Pace for THIS split
  splitTimeSeconds: number;  // Time for THIS split
  cumulativeSeconds: number; // Total time up to this split
}

/**
 * Calculate splits with linear pace progression
 * 
 * @param targetTimeSeconds - Total target time in seconds
 * @param distanceKm - Total distance in kilometers
 * @param splitPercent - Split strategy from -100 to +100
 *   +100 = maximum negative split (start slow, finish fast)
 *   0 = even splits
 *   -100 = maximum positive split (start fast, finish slow)
 * @param splitSizeKm - Size of each split in km (1.0 for 1km, 1.60934 for 1mi)
 * @returns Array of split data
 */
export function calculateSplits(
  targetTimeSeconds: number,
  distanceKm: number,
  splitPercent: number,
  splitSizeKm: number = 1.0
): Split[] {
  if (targetTimeSeconds <= 0 || distanceKm <= 0) {
    return [];
  }

  // Calculate base pace
  const baseSecondsPerKm = targetTimeSeconds / distanceKm;

  // Determine how many full splits + potential partial
  const numFullSplits = Math.floor(distanceKm / splitSizeKm);
  const remainderKm = distanceKm - (numFullSplits * splitSizeKm);
  const totalSplits = remainderKm > 0 ? numFullSplits + 1 : numFullSplits;

  // Maximum pace variance at extremes (20% slower/faster)
  const maxVariance = 0.20;

  // Calculate target pace for each split based on progression
  const targetPaces: number[] = [];
  for (let i = 0; i < totalSplits; i++) {
    // Progression factor: -0.5 at start, +0.5 at end
    const factor = -0.5 + ((i + 0.5) / totalSplits);
    
    // Apply split strategy
    // Positive splitPercent = negative split = start slow, finish fast
    // So positive factor (end) should have faster pace (lower seconds)
    const paceAdjustment = factor * maxVariance * (splitPercent / 100);
    const targetPace = baseSecondsPerKm * (1 - paceAdjustment);
    targetPaces.push(targetPace);
  }

  // Calculate theoretical times
  let theoreticalTotal = 0;
  for (let i = 0; i < totalSplits; i++) {
    const splitDist = (i === totalSplits - 1 && remainderKm > 0) ? remainderKm : splitSizeKm;
    theoreticalTotal += targetPaces[i] * splitDist;
  }

  // Adjust paces proportionally to match target time exactly
  const adjustmentFactor = targetTimeSeconds / theoreticalTotal;
  const adjustedPaces = targetPaces.map(pace => pace * adjustmentFactor);

  // Build splits array
  const splits: Split[] = [];
  let cumulativeDistance = 0;
  let cumulativeTime = 0;

  for (let i = 0; i < totalSplits; i++) {
    const isLastSplit = i === totalSplits - 1;
    const splitDist = (isLastSplit && remainderKm > 0) ? remainderKm : splitSizeKm;
    
    cumulativeDistance += splitDist;
    const splitTime = adjustedPaces[i] * splitDist;
    cumulativeTime += splitTime;

    splits.push({
      splitNumber: i + 1,
      distanceKm: cumulativeDistance,
      paceSecondsPerKm: adjustedPaces[i],
      splitTimeSeconds: splitTime,
      cumulativeSeconds: cumulativeTime
    });
  }

  return splits;
}

/**
 * Format pace in mm:ss format
 */
export function formatPace(secondsPerKm: number): string {
  const totalSeconds = Math.round(secondsPerKm);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format time in H:MM:SS or MM:SS format
 */
export function formatSplitTime(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const hours = Math.floor(rounded / 3600);
  const minutes = Math.floor((rounded % 3600) / 60);
  const seconds = rounded % 60;

  if (hours > 0) {
    const mm = minutes.toString().padStart(2, '0');
    const ss = seconds.toString().padStart(2, '0');
    return `${hours}:${mm}:${ss}`;
  } else {
    const ss = seconds.toString().padStart(2, '0');
    return `${minutes}:${ss}`;
  }
}


// Race Time Calculations Utility

export interface RaceDistance {
  id: string;
  label: string;
  distanceKm: number;
  distanceNote: string;
}

export const RACE_DISTANCES: RaceDistance[] = [
  { id: '5k', label: '5K', distanceKm: 5.0, distanceNote: '5.00 km' },
  { id: '10k', label: '10K', distanceKm: 10.0, distanceNote: '10.00 km' },
  { id: 'half', label: 'Half', distanceKm: 21.0975, distanceNote: '21.10 km' },
  { id: 'full', label: 'Marathon', distanceKm: 42.195, distanceNote: '42.20 km' }
];

/**
 * Calculate race finish time given pace (in seconds per km) and distance
 */
export function calculateRaceTime(
  paceSecondsPerKm: number,
  distanceKm: number
): string {
  const totalSeconds = Math.round(paceSecondsPerKm * distanceKm);
  return formatRaceTime(totalSeconds);
}

/**
 * Format time in H:MM:SS format
 */
export function formatRaceTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return `${hours}:${mm}:${ss}`;
}

/**
 * Calculate all race times for a given pace
 */
export function calculateAllRaceTimes(paceSecondsPerKm: number): Record<string, string> {
  const raceTimes: Record<string, string> = {};
  
  for (const race of RACE_DISTANCES) {
    raceTimes[race.id] = calculateRaceTime(paceSecondsPerKm, race.distanceKm);
  }
  
  return raceTimes;
}


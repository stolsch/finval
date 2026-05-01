/**
 * Computes timeliness score based on data age and max acceptable age.
 */
export function getTimelinessScore(ageSeconds: number, maxAgeSeconds: number): number {
  if (maxAgeSeconds <= 0) {
    return 0;
  }
  if (ageSeconds <= 0) {
    return 1;
  }
  if (ageSeconds >= maxAgeSeconds) {
    return 0;
  }
  return 1 - ageSeconds / maxAgeSeconds;
}

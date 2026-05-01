/**
 * Computes consistency score from total checks and failed checks.
 */
export function getConsistencyScore(totalChecks: number, failedChecks: number): number {
  if (totalChecks <= 0) {
    return 1;
  }
  const successChecks = Math.max(0, totalChecks - failedChecks);
  return Math.min(1, successChecks / totalChecks);
}

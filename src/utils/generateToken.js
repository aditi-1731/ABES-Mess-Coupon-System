/**
 * Generates an encrypted/structured token for ABES Mess dynamic QR code.
 * Format: ABES|<couponId>|<studentId>|<mealId>|<timestamp>|<random>
 */
export function generateCouponToken(couponId, studentId, mealId) {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ABES|${couponId}|${studentId}|${mealId}|${timestamp}|${randomStr}`;
}

/**
 * Parses and verifies token format.
 */
export function parseCouponToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('|');
  if (parts.length < 6 || parts[0] !== 'ABES') return null;
  
  return {
    prefix: parts[0],
    couponId: parts[1],
    studentId: parts[2],
    mealId: parts[3],
    timestamp: parseInt(parts[4], 10),
    random: parts[5]
  };
}

/**
 * Checks if token is older than the max age (60 seconds)
 */
export function isTokenExpired(tokenTimestamp, maxAgeSeconds = 60) {
  if (!tokenTimestamp) return true;
  const elapsed = (Date.now() - tokenTimestamp) / 1000;
  return elapsed > maxAgeSeconds;
}

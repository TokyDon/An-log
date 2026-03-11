/**
 * Anílog Fuzzy Location Service
 *
 * ─── PRIVACY CRITICAL ───────────────────────────────────────────────────────
 * This service MUST NEVER return or store precise GPS coordinates.
 * Only city/region level information is collected, stored, or transmitted.
 *
 * This is a core product principle: "Integrity is the product."
 * Precise location is stripped at the source — it never reaches the app state,
 * Supabase, or any analytics layer.
 * ────────────────────────────────────────────────────────────────────────────
 */

import * as Location from 'expo-location';

export interface FuzzyLocationResult {
  /** e.g. "London, Greater London" or "Tokyo" — city/region only */
  region: string;
  country: string;
}

/**
 * Request and return city/region-level location.
 *
 * Uses intentionally low accuracy to further reduce precision.
 * Returns null if the user denies permission.
 *
 * @returns FuzzyLocationResult with region + country, or null if denied
 */
export async function requestFuzzyLocation(): Promise<FuzzyLocationResult | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  // Intentionally low precision — we do NOT want exact coordinates
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Low,
  });

  const [geocode] = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  // Build city/region string — strip street, number, postal code, etc.
  const cityParts = [geocode.city, geocode.region]
    .filter(Boolean)
    .filter((part, index, arr) => arr.indexOf(part) === index); // deduplicate

  return {
    region: cityParts.join(', ') || 'Unknown',
    country: geocode.country ?? 'Unknown',
  };
}

/**
 * Format a FuzzyLocationResult for display in the UI.
 * e.g. "London, UK"
 */
export function formatRegion(result: FuzzyLocationResult): string {
  return `${result.region}, ${result.country}`;
}

/**
 * One-shot convenience: request location and return a display string.
 * Returns 'Unknown location' if permission denied or geocode fails.
 * Used by Phase 1 capture flow — pass result to animon.region.
 */
export async function getCaptureRegion(): Promise<string> {
  const result = await requestFuzzyLocation();
  if (!result) return 'Unknown location';
  const city = result.region !== 'Unknown' ? result.region : '';
  const country = result.country !== 'Unknown' ? result.country : '';
  if (!city && !country) return 'Unknown location';
  if (!city) return country;
  if (!country) return city;
  return `${city}, ${country}`;
}

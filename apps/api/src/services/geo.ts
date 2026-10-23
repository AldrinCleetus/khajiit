/**
 * Geospatial Privacy & PostGIS Helpers
 *
 * Implements anti-triangulation one-time coordinate masking and PostGIS formatting.
 */

export interface MaskedCoordinates {
  maskedLat: number;
  maskedLng: number;
  privacyRadiusM: number;
}

/**
 * Computes a random jittered point uniformly distributed within [400m, radiusMeters].
 * MUST BE CALLED STRICTLY ONCE during listing creation or when location is modified.
 * Persisting the output prevents triangulation attacks via repeated GET requests.
 */
export function generateMaskedCoordinates(
  lat: number,
  lng: number,
  radiusMeters: number = 1500
): MaskedCoordinates {
  // 1 degree latitude ~ 111,300 meters
  const minRadius = 400; // minimum offset so the pin is never identical to the house
  const radiusInDegrees = radiusMeters / 111300;
  const minInDegrees = minRadius / 111300;

  // Uniform random point in an annulus between minRadius and radiusMeters
  const u = Math.random();
  const v = Math.random();
  const w = Math.sqrt(u * (radiusInDegrees ** 2 - minInDegrees ** 2) + minInDegrees ** 2);
  const t = 2 * Math.PI * v;

  const deltaLat = w * Math.cos(t);
  const deltaLng = (w * Math.sin(t)) / Math.cos((lat * Math.PI) / 180);

  return {
    maskedLat: Number((lat + deltaLat).toFixed(4)),
    maskedLng: Number((lng + deltaLng).toFixed(4)),
    privacyRadiusM: radiusMeters,
  };
}

/**
 * Strips raw latitude/longitude for consumer goods (Mobiles, Electronics).
 * Real estate listings retain exact coordinates and full polygon boundary.
 */
export function sanitizeListingLocation<T extends {
  category: string;
  latitude: number;
  longitude: number;
  maskedLat: number;
  maskedLng: number;
  privacyRadiusM: number;
}>(listing: T): Omit<T, 'latitude' | 'longitude'> | T {
  if (listing.category === 'PROPERTIES') {
    return listing;
  }

  // Consumer goods: Omit true coordinates completely from response
  const { latitude, longitude, ...sanitized } = listing;
  return sanitized as Omit<T, 'latitude' | 'longitude'>;
}

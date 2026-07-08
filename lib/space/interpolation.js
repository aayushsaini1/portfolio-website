// Coordinates conversion and spherical interpolation utilities

/**
 * Converts Latitude and Longitude to 3D Cartesian coordinates [x, y, z] on a sphere of a given radius.
 * @param {number} lat - Latitude in degrees
 * @param {number} lon - Longitude in degrees
 * @param {number} radius - Radius of the sphere
 * @returns {number[]} Array of [x, y, z] coordinates
 */
export function latLonToVector3(lat, lon, radius) {
  // Convert lat/lon to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Calculate Cartesian coordinates
  // standard R3F mapping where Y is up, X is right, Z is out/forward
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return [x, y, z];
}

/**
 * Performs Spherical Linear Interpolation (SLERP) between two 3D vectors.
 * @param {number[]} p0 - Starting vector [x, y, z]
 * @param {number[]} p1 - Ending vector [x, y, z]
 * @param {number} t - Interpolation factor (0 to 1)
 * @returns {number[]} Interpolated vector [x, y, z]
 */
export function slerp(p0, p1, t) {
  // Calculate dot product
  const dot = p0[0] * p1[0] + p0[1] * p1[1] + p0[2] * p1[2];

  // Clamp dot product to avoid NaN
  const clampedDot = Math.max(-1, Math.min(1, dot));

  // If the vectors are extremely close, fall back to linear interpolation
  if (clampedDot > 0.9995) {
    const x = p0[0] + t * (p1[0] - p0[0]);
    const y = p0[1] + t * (p1[1] - p0[1]);
    const z = p0[2] + t * (p1[2] - p0[2]);
    return [x, y, z];
  }

  // Spherical interpolation math
  const theta0 = Math.acos(clampedDot);
  const theta = theta0 * t;

  const sinTheta = Math.sin(theta);
  const sinTheta0 = Math.sin(theta0);

  const s0 = Math.cos(theta) - (clampedDot * sinTheta) / sinTheta0;
  const s1 = sinTheta / sinTheta0;

  return [
    s0 * p0[0] + s1 * p1[0],
    s0 * p0[1] + s1 * p1[1],
    s0 * p0[2] + s1 * p1[2]
  ];
}

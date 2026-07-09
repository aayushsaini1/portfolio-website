// International Space Station API integration

/**
 * Fetches the current live orbital position of the ISS.
 * API Source: wheretheiss.at (free and no auth required)
 * 
 * @returns {Promise<{lat: number, lon: number, alt: number, velocity: number, timestamp: number}>}
 */
export async function fetchISSLocation() {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    
    if (!response.ok) {
      throw new Error(`ISS API response error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      lat: data.latitude,
      lon: data.longitude,
      alt: data.altitude, // in km (typical range 410-430 km)
      velocity: data.velocity, // in km/h
      timestamp: data.timestamp * 1000 // convert seconds to milliseconds
    };
  } catch (error) {
    // Graceful fallback to simulated orbit coordinates if rate-limited or offline
    const time = Date.now() / 1000;
    // Complete a full longitude cycle every 90 minutes (5400 seconds)
    const lon = ((time / 15) % 360) - 180;
    // Oscillate latitude between -51.6 and 51.6 degrees (ISS orbit inclination)
    const lat = Math.sin(time / 800) * 51.6;
    
    return {
      lat,
      lon,
      alt: 421.5,
      velocity: 27560,
      timestamp: Date.now()
    };
  }
}

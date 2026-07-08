// NASA NeoWS (Near Earth Object Web Service) API integration

/**
 * Fetches Near Earth Objects (NEOs) for the current date.
 * Falls back to a procedurally generated list of asteroids if the API fails or rate limit is reached.
 * 
 * @returns {Promise<Array<{name: string, diameterKm: number, missDistanceKm: number, velocityKmh: number}>>}
 */
export async function fetchNearEarthObjects() {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${todayStr}&end_date=${todayStr}&api_key=EpHYVqDahUpDlha3fqlIbQnhiLvkDaXg0Uoujfg5`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`NASA API status: ${response.status}`);
    }
    
    const data = await response.json();
    const neoDays = data.near_earth_objects || {};
    const rawList = neoDays[todayStr] || [];
    
    // Process and clean up the list
    const processed = rawList.map(neo => {
      const diameterMax = neo.estimated_diameter?.kilometers?.estimated_diameter_max || 0.1;
      const diameterMin = neo.estimated_diameter?.kilometers?.estimated_diameter_min || 0.05;
      const avgDiameter = (diameterMax + diameterMin) / 2;
      
      const closeApproach = neo.close_approach_data?.[0] || {};
      const missDistance = parseFloat(closeApproach.miss_distance?.kilometers || '10000000');
      const velocity = parseFloat(closeApproach.relative_velocity?.kilometers_per_hour || '50000');
      
      return {
        id: neo.id || Math.random().toString(),
        name: neo.name || 'Asteroid',
        diameterKm: avgDiameter,
        missDistanceKm: missDistance,
        velocityKmh: velocity
      };
    });
    
    // Return up to 15 objects
    return processed.slice(0, 15);
  } catch (error) {
    console.warn('NASA NEO API failed, using fallback mock data:', error);
    return getFallbackAsteroids();
  }
}

/**
 * Generates mock NEOs for graceful fallback rendering.
 */
function getFallbackAsteroids() {
  const fallbacks = [
    { name: "Apophis", diameterKm: 0.37, missDistanceKm: 38000, velocityKmh: 26000 },
    { name: "Bennu", diameterKm: 0.49, missDistanceKm: 7500000, velocityKmh: 46000 },
    { name: "Ryugu", diameterKm: 0.89, missDistanceKm: 9000000, velocityKmh: 80000 },
    { name: "Itokawa", diameterKm: 0.33, missDistanceKm: 2000000, velocityKmh: 95000 },
    { name: "Eros", diameterKm: 16.8, missDistanceKm: 25000000, velocityKmh: 84000 },
    { name: "Toutatis", diameterKm: 5.4, missDistanceKm: 6900000, velocityKmh: 39000 },
    { name: "Castalia", diameterKm: 1.4, missDistanceKm: 4200000, velocityKmh: 56000 },
    { name: "Geographos", diameterKm: 2.5, missDistanceKm: 5100000, velocityKmh: 68000 },
    { name: "Mithra", diameterKm: 2.0, missDistanceKm: 7100000, velocityKmh: 72000 },
    { name: "Golevka", diameterKm: 0.5, missDistanceKm: 15000000, velocityKmh: 50000 }
  ];
  
  return fallbacks.map((f, index) => ({
    id: `fallback-${index}`,
    ...f
  }));
}

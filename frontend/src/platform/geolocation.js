/**
 * Platform abstraction layer for Geolocation
 * Browser API today → Cordova plugin later
 * Single swap point per PRD FR-37 / Architecture §3.2
 */

let cordovaGeolocation = null;

const loadCordovaGeolocation = async () => {
  if (cordovaGeolocation) return cordovaGeolocation;

  if (typeof window !== 'undefined' && window.cordova && window.navigator.geolocation) {
    cordovaGeolocation = window.navigator.geolocation;
    return cordovaGeolocation;
  }

  return null;
};

/**
 * Get current position
 * @param {Object} options
 * @param {boolean} options.enableHighAccuracy
 * @param {number} options.timeout
 * @param {number} options.maximumAge
 * @returns {Promise<GeolocationPosition>}
 */
export const getLocation = async (options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
  } = options;

  const cordova = await loadCordovaGeolocation();
  if (cordova) {
    return new Promise((resolve, reject) => {
      cordova.getCurrentPosition(resolve, reject, {
        enableHighAccuracy,
        timeout,
        maximumAge,
      });
    });
  }

  // Browser API
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
  });
};

/**
 * Watch position changes
 * @param {Function} callback - Called with position
 * @param {Object} options
 * @returns {number} Watch ID (for clearWatch)
 */
export const watchLocation = (callback, options = {}) => {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
  } = options;

  // We can't easily bridge Cordova's watchPosition to a callback
  // In native build, this would use cordova.plugins.geolocation.watchPosition
  // For now, use browser API
  if (!navigator.geolocation) {
    throw new Error('Geolocation not supported');
  }

  return navigator.geolocation.watchPosition(callback, (err) => {
    console.error('Geolocation watch error:', err);
  }, {
    enableHighAccuracy,
    timeout,
    maximumAge,
  });
};

/**
 * Clear a location watch
 * @param {number} watchId
 */
export const clearLocationWatch = (watchId) => {
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Get approximate location (city-level) for privacy
 * Per Architecture §7: "Approximate-only location exposure to other users"
 * @returns {Promise<{lat: number, lng: number, city: string, country: string}>}
 */
export const getApproximateLocation = async () => {
  const position = await getLocation({ enableHighAccuracy: false });

  // Round to ~1km precision (approx 0.01 degrees)
  const lat = Math.round(position.coords.latitude * 100) / 100;
  const lng = Math.round(position.coords.longitude * 100) / 100;

  // In production, reverse geocode to get city/country
  // For now, return coordinates
  return {
    lat,
    lng,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  };
};

/**
 * Check if geolocation is available
 */
export const isGeolocationAvailable = () => {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
};

/**
 * Request location permission
 */
export const requestLocationPermission = async () => {
  const cordova = await loadCordovaGeolocation();
  if (cordova) return true;

  try {
    // Browser: try to get position to trigger permission prompt
    await getLocation({ timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};
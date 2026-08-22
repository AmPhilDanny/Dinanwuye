/**
 * Platform Abstraction Layer — Public API
 * Single swap point for all device capability access
 * Per PRD FR-37 / Architecture §3.2
 */

// Camera
export {
  capturePhoto,
  pickPhoto,
  isCameraAvailable,
  requestCameraPermission,
} from './camera';

// Geolocation
export {
  getLocation,
  watchLocation,
  clearLocationWatch,
  getApproximateLocation,
  isGeolocationAvailable,
  requestLocationPermission,
} from './geolocation';

// Push Notifications
export {
  initPush,
  getPushSubscription,
  unsubscribePush,
  showLocalNotification,
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
} from './push';
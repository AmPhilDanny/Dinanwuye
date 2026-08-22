/**
 * Platform abstraction layer for Push Notifications
 * Web Push today → Cordova (FCM/APNs) later
 * Single swap point per PRD FR-37 / Architecture §3.2
 */

let cordovaPush = null;
let swRegistration = null;

const loadCordovaPush = async () => {
  if (cordovaPush) return cordovaPush;

  if (typeof window !== 'undefined' && window.cordova && window.PushNotification) {
    cordovaPush = window.PushNotification;
    return cordovaPush;
  }

  return null;
};

/**
 * Initialize push notifications
 * @param {Object} options
 * @param {Function} options.onNotification - Called when notification received
 * @param {Function} options.onRegistration - Called with push token
 * @param {string} options.senderID - FCM sender ID (Android)
 * @returns {Promise<string>} Push token
 */
export const initPush = async (options = {}) => {
  const { onNotification, onRegistration, senderID } = options;

  const cordova = await loadCordovaPush();
  if (cordova) {
    // Cordova PushNotification plugin (phonegap-plugin-push)
    return new Promise((resolve, reject) => {
      const push = cordova.init({
        android: { senderID: senderID || 'YOUR_SENDER_ID' },
        ios: { alert: true, badge: true, sound: true },
        windows: {},
      });

      push.on('registration', (data) => {
        onRegistration?.(data.registrationId);
        resolve(data.registrationId);
      });

      push.on('notification', (data) => {
        onNotification?.(data);
      });

      push.on('error', (err) => {
        reject(err);
      });
    });
  }

  // Web Push (Service Worker + Push API)
  return initWebPush(options);
};

/**
 * Web Push implementation
 */
const initWebPush = async (options) => {
  const { onNotification, onRegistration } = options;

  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Web Push not supported');
  }

  // Register service worker
  swRegistration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission denied');
  }

  // Get VAPID public key from server (should be stored in env)
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'YOUR_VAPID_KEY';

  // Convert base64 to Uint8Array
  const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);

  // Subscribe
  const subscription = await swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey,
  });

  const token = JSON.stringify(subscription);
  onRegistration?.(token);

  // Handle push events
  navigator.serviceWorker.addEventListener('push', (event) => {
    if (event.data) {
      const data = event.data.json();
      onNotification?.(data);
    }
  });

  return token;
};

/**
 * Get existing push subscription
 */
export const getPushSubscription = async () => {
  const cordova = await loadCordovaPush();
  if (cordova) {
    // Cordova: token stored in plugin
    return null; // Would need plugin-specific method
  }

  if (!swRegistration) {
    swRegistration = await navigator.serviceWorker.ready;
  }

  const subscription = await swRegistration.pushManager.getSubscription();
  return subscription ? JSON.stringify(subscription) : null;
};

/**
 * Unsubscribe from push
 */
export const unsubscribePush = async () => {
  const cordova = await loadCordovaPush();
  if (cordova) {
    // Cordova: push.unregister()
    return;
  }

  if (swRegistration) {
    const subscription = await swRegistration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
  }
};

/**
 * Show local notification (in-app)
 */
export const showLocalNotification = async (title, body, data = {}) => {
  const cordova = await loadCordovaPush();
  if (cordova) {
    // Cordova: cordova.plugins.notification.local.schedule({...})
    return;
  }

  // Web: use Notification API if permission granted
  if (Notification.permission === 'granted') {
    new Notification(title, { body, data, icon: '/icon-192.png' });
  }
};

/**
 * Check if push is supported
 */
export const isPushSupported = async () => {
  const cordova = await loadCordovaPush();
  if (cordova) return true;

  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
};

/**
 * Get notification permission status
 */
export const getNotificationPermission = () => {
  if (typeof Notification !== 'undefined') {
    return Notification.permission;
  }
  return 'unsupported';
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async () => {
  if (typeof Notification !== 'undefined') {
    return Notification.requestPermission();
  }
  return 'unsupported';
};

// Helper: Convert base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
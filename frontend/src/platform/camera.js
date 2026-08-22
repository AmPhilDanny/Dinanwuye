/**
 * Platform abstraction layer for Camera
 * Browser API today → Cordova plugin later
 * Single swap point per PRD FR-37 / Architecture §3.2
 */

let cordovaCamera = null;

// Lazy-load Cordova plugin only when needed (in native build)
const loadCordovaCamera = async () => {
  if (cordovaCamera) return cordovaCamera;

  // In a Cordova build, `window.cordova` exists and plugins are available
  if (typeof window !== 'undefined' && window.cordova && window.navigator.camera) {
    cordovaCamera = window.navigator.camera;
    return cordovaCamera;
  }

  return null;
};

/**
 * Capture a photo using the device camera
 * @param {Object} options - Camera options
 * @param {number} options.quality - Image quality (0-100)
 * @param {boolean} options.allowEdit - Allow cropping/editing
 * @param {string} options.targetWidth - Target width
 * @param {string} options.targetHeight - Target height
 * @param {string} options.sourceType - 'camera' | 'library'
 * @returns {Promise<string>} Base64 data URL or file URI
 */
export const capturePhoto = async (options = {}) => {
  const {
    quality = 80,
    allowEdit = true,
    targetWidth = 800,
    targetHeight = 800,
    sourceType = 'camera',
  } = options;

  // Try Cordova first (native build)
  const cordova = await loadCordovaCamera();
  if (cordova) {
    return new Promise((resolve, reject) => {
      cordova.getPicture(
        (imageData) => resolve(`data:image/jpeg;base64,${imageData}`),
        (err) => reject(new Error(err)),
        {
          quality,
          allowEdit,
          targetWidth,
          targetHeight,
          sourceType: sourceType === 'camera' ? cordova.PictureSourceType.CAMERA : cordova.PictureSourceType.PHOTOLIBRARY,
          destinationType: cordova.DestinationType.DATA_URL,
          encodingType: cordova.EncodingType.JPEG,
          mediaType: cordova.MediaType.PICTURE,
          correctOrientation: true,
          saveToPhotoAlbum: false,
        }
      );
    });
  }

  // Fallback to browser API (web/PWA)
  return capturePhotoBrowser(options);
};

/**
 * Browser implementation using getUserMedia + canvas
 */
const capturePhotoBrowser = async (options) => {
  const { targetWidth = 800, targetHeight = 800, quality = 0.8 } = options;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: targetWidth },
        height: { ideal: targetHeight },
      },
      audio: false,
    });

    // Create video element to capture frame
    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    // Wait for video to be ready
    await new Promise((resolve) => {
      video.onloadedmetadata = () => resolve();
    });

    // Create canvas and draw frame
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Calculate dimensions maintaining aspect ratio
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;
    const aspectRatio = videoWidth / videoHeight;

    let canvasWidth = targetWidth;
    let canvasHeight = targetHeight;

    if (aspectRatio > 1) {
      canvasHeight = targetWidth / aspectRatio;
    } else {
      canvasWidth = targetHeight * aspectRatio;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);

    // Stop video stream
    stream.getTracks().forEach((track) => track.stop());

    // Return data URL
    return canvas.toDataURL('image/jpeg', quality);
  } catch (err) {
    if (err.name === 'NotAllowedError') {
      throw new Error('Camera permission denied');
    }
    if (err.name === 'NotFoundError') {
      throw new Error('No camera found');
    }
    throw new Error(`Camera error: ${err.message}`);
  }
};

/**
 * Pick photo from gallery/library
 */
export const pickPhoto = async (options = {}) => {
  const { quality = 80, targetWidth = 800, targetHeight = 800 } = options;

  const cordova = await loadCordovaCamera();
  if (cordova) {
    return new Promise((resolve, reject) => {
      cordova.getPicture(
        (imageData) => resolve(`data:image/jpeg;base64,${imageData}`),
        (err) => reject(new Error(err)),
        {
          quality,
          targetWidth,
          targetHeight,
          sourceType: cordova.PictureSourceType.PHOTOLIBRARY,
          destinationType: cordova.DestinationType.DATA_URL,
          encodingType: cordova.EncodingType.JPEG,
          mediaType: cordova.MediaType.PICTURE,
        }
      );
    });
  }

  // Browser fallback: file input
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }

      // Resize if needed
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await new Promise((r) => (img.onload = r));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = img.width;
      let height = img.height;

      if (width > targetWidth || height > targetHeight) {
        const ratio = Math.min(targetWidth / width, targetHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL('image/jpeg', quality / 100));
    };

    input.click();
  });
};

/**
 * Check if camera is available
 */
export const isCameraAvailable = async () => {
  const cordova = await loadCordovaCamera();
  if (cordova) return true;

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((d) => d.kind === 'videoinput');
  } catch {
    return false;
  }
};

/**
 * Request camera permission
 */
export const requestCameraPermission = async () => {
  const cordova = await loadCordovaCamera();
  if (cordova) return true; // Handled by Cordova plugin

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
};
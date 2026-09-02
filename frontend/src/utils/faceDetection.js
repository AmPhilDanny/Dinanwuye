/**
 * Face landmark detection for liveness verification.
 * Uses MediaPipe Face Mesh to detect 468 face landmarks,
 * then computes biometric signals for blink, smile, mouth open, and head turn.
 */

let faceLandmarker = null;
let initializationPromise = null;

const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18';

const LIVENESS_CONFIG = {
  EAR_THRESHOLD: 0.22,
  EAR_CONSECUTIVE_FRAMES: 3,
  SMILE_THRESHOLD: 0.38,
  MOUTH_OPEN_THRESHOLD: 0.045,
  HEAD_TURN_THRESHOLD: 0.06,
  DETECTION_CONFIDENCE: 0.5,
  TRACKING_CONFIDENCE: 0.5,
};

const LANDMARKS = {
  LEFT_EYE_OUTER: 33,
  LEFT_EYE_UPPER: 159,
  LEFT_EYE_LOWER: 145,
  LEFT_EYE_INNER: 133,
  RIGHT_EYE_OUTER: 362,
  RIGHT_EYE_UPPER: 386,
  RIGHT_EYE_LOWER: 374,
  RIGHT_EYE_INNER: 263,
  MOUTH_LEFT: 61,
  MOUTH_RIGHT: 291,
  UPPER_LIP: 13,
  LOWER_LIP: 14,
  NOSE_TIP: 1,
  CHIN: 152,
  LEFT_EAR: 234,
  RIGHT_EAR: 454,
};

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + ((a.z ?? 0) - (b.z ?? 0)) ** 2);
}

function computeEAR(landmarks, left) {
  const outerIdx = left ? LANDMARKS.LEFT_EYE_OUTER : LANDMARKS.RIGHT_EYE_OUTER;
  const upperIdx = left ? LANDMARKS.LEFT_EYE_UPPER : LANDMARKS.RIGHT_EYE_UPPER;
  const lowerIdx = left ? LANDMARKS.LEFT_EYE_LOWER : LANDMARKS.RIGHT_EYE_LOWER;
  const innerIdx = left ? LANDMARKS.LEFT_EYE_INNER : LANDMARKS.RIGHT_EYE_INNER;

  const verticalDist = distance(landmarks[upperIdx], landmarks[lowerIdx]);
  const horizontalDist = distance(landmarks[outerIdx], landmarks[innerIdx]);
  return horizontalDist === 0 ? 1 : verticalDist / horizontalDist;
}

function detectBlink(landmarks) {
  const leftEAR = computeEAR(landmarks, true);
  const rightEAR = computeEAR(landmarks, false);
  const avgEAR = (leftEAR + rightEAR) / 2;
  return { detected: avgEAR < LIVENESS_CONFIG.EAR_THRESHOLD, score: Math.max(0, 1 - avgEAR / LIVENESS_CONFIG.EAR_THRESHOLD) };
}

function detectSmile(landmarks) {
  const mouthWidth = distance(landmarks[LANDMARKS.MOUTH_LEFT], landmarks[LANDMARKS.MOUTH_RIGHT]);
  const upperLipY = landmarks[LANDMARKS.UPPER_LIP].y;
  const faceHeight = distance(landmarks[LANDMARKS.NOSE_TIP], landmarks[LANDMARKS.CHIN]);
  if (faceHeight === 0) return { detected: false, score: 0 };

  const smileRatio = mouthWidth / faceHeight;
  const lipCurve = (landmarks[LANDMARKS.MOUTH_LEFT].y + landmarks[LANDMARKS.MOUTH_RIGHT].y) / 2 - upperLipY;

  const detected = smileRatio > LIVENESS_CONFIG.SMILE_THRESHOLD && lipCurve > 0;
  const score = Math.min(1, smileRatio / LIVENESS_CONFIG.SMILE_THRESHOLD);
  return { detected, score };
}

function detectMouthOpen(landmarks) {
  const faceHeight = distance(landmarks[LANDMARKS.NOSE_TIP], landmarks[LANDMARKS.CHIN]);
  if (faceHeight === 0) return { detected: false, score: 0 };
  const mouthGap = distance(landmarks[LANDMARKS.UPPER_LIP], landmarks[LANDMARKS.LOWER_LIP]);
  const ratio = mouthGap / faceHeight;
  const detected = ratio > LIVENESS_CONFIG.MOUTH_OPEN_THRESHOLD;
  const score = Math.min(1, ratio / (LIVENESS_CONFIG.MOUTH_OPEN_THRESHOLD * 3));
  return { detected, score };
}

function detectHeadTurn(landmarks) {
  const noseX = landmarks[LANDMARKS.NOSE_TIP].x;
  const centerX = (landmarks[LANDMARKS.LEFT_EAR].x + landmarks[LANDMARKS.RIGHT_EAR].x) / 2;
  const faceWidth = distance(landmarks[LANDMARKS.LEFT_EAR], landmarks[LANDMARKS.RIGHT_EAR]);
  if (faceWidth === 0) return { detected: false, score: 0 };
  const offset = (noseX - centerX) / faceWidth;
  const detected = Math.abs(offset) > LIVENESS_CONFIG.HEAD_TURN_THRESHOLD;
  const score = Math.min(1, Math.abs(offset) / (LIVENESS_CONFIG.HEAD_TURN_THRESHOLD * 3));
  return { detected, score };
}

const DETECTORS = {
  blink: detectBlink,
  smile: detectSmile,
  open_mouth: detectMouthOpen,
  turn_head: detectHeadTurn,
};

export async function initializeFaceDetection() {
  if (faceLandmarker) return faceLandmarker;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    const vision = await import(/* @vite-ignore */ `${CDN_BASE}/vision_bundle.mjs`);
    const { FaceLandmarker, FilesetResolver } = vision;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      `${CDN_BASE}/wasm`
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
        delegate: 'GPU',
      },
      runningMode: 'VIDEO',
      numFaces: 1,
      minFaceDetectionConfidence: LIVENESS_CONFIG.DETECTION_CONFIDENCE,
      minFaceTrackingConfidence: LIVENESS_CONFIG.TRACKING_CONFIDENCE,
    });

    return faceLandmarker;
  })();

  return initializationPromise;
}

export function detectLivenessFeatures(videoElement, challenges) {
  if (!faceLandmarker || !videoElement || videoElement.readyState < 2) {
    return { allPassed: false, results: {}, confidence: 0 };
  }

  const startTimeMs = performance.now();
  const results = faceLandmarker.detectForVideo(videoElement, startTimeMs);

  if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
    return { allPassed: false, results: {}, confidence: 0 };
  }

  const landmarks = results.faceLandmarks[0];
  const challengeResults = {};
  let totalScore = 0;

  for (const challenge of challenges) {
    const detector = DETECTORS[challenge];
    if (detector) {
      const result = detector(landmarks);
      challengeResults[challenge] = result;
      if (result.detected) {
        totalScore += result.score;
      }
    }
  }

  const allPassed = challenges.every((c) => challengeResults[c]?.detected);
  const confidence = challenges.length > 0 ? totalScore / challenges.length : 0;

  return { allPassed, results: challengeResults, confidence: Math.min(1, confidence) };
}

export function resetFaceDetection() {
  if (faceLandmarker) {
    faceLandmarker.close();
    faceLandmarker = null;
  }
  initializationPromise = null;
}

export { LIVENESS_CONFIG };

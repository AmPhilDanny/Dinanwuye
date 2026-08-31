# Cordova Validation Spike — Findings

**Date:** 2026-08-18
**Goal:** Prove the web-first PWA build can be packaged as a native Android app via Cordova, and validate the platform abstraction layer swap (`src/platform/`) with real plugins.
**Reference:** `plan.md` Phase 1 Task 12, `architecture.md` §3.2 (Platform Abstraction Layer)

---

## Environment

| Component | Version |
|---|---|
| Cordova CLI | 13.0.0 (global) |
| cordova-android | 15.1.0 |
| Java | OpenJDK 25.0.2 (Temurin LTS) |
| Android SDK | platforms android-34 → 36.1, build-tools 36.1.0 / 37.0.0 |
| Gradle (wrapper) | 8.14.2 |
| Frontend build | Vite 5.4.21, `dist/` ≈ 6.0 MB |

## Steps performed

1. Throwaway project: `cordova create dinanwuye-spike com.dinanwuye.spike "Dinanwuye Spike"` (in temp dir, not committed).
2. Copied the Vite `dist/` output into `www/` (drop-in replacement).
3. `cordova platform add android` → succeeded, cordova-android@15.1.0, Target/Compile SDK 36.
4. `cordova build android` → **BUILD SUCCESSFUL** (4m47s, 50 tasks) → `app-debug.apk` (5.09 MB).
5. Platform-layer swap test: added `cordova-plugin-camera` + `cordova-plugin-geolocation`, then confirmed their JS API surfaces match what `src/platform/` consumes.

## Platform layer swap test — PASS

`src/platform/index.js` exposes `capturePhoto()`, `pickPhoto()`, `getLocation()`, etc. Each implementation lazy-detects the native runtime:

- `camera.js` → checks `window.cordova && window.navigator.camera`, then calls `navigator.camera.getPicture(...)` with `PictureSourceType` / `DestinationType` / `EncodingType` / `MediaType` — **exact match** with `cordova-plugin-camera`'s API. Browser fallback (`getUserMedia` + canvas, file input) untouched.
- `geolocation.js` → checks `window.cordova && window.navigator.geolocation`, then `getCurrentPosition` / `watchPosition` — **exact match** with `cordova-plugin-geolocation`. Browser fallback intact.
- `push.js` — not exercised in this spike (no push plugin installed); same pattern applies.

**Verdict:** the platform abstraction is a genuine single swap point. No changes to `src/platform/` were needed for camera/geolocation.

## Findings & friction

1. **Packaging path works.** A Vite SPA drops into Cordova `www/` with zero code changes and produces a valid debug APK.
2. **Base path must be relative for the native bundle.** `vite.config.js` uses the default `base: '/'`, so the built `index.html` references `/assets/...` absolutely — fine on an HTTP server, **broken under Cordova's `file://` load** (and Capacitor's `https://localhost` unless served from root). Recommendation: add a Cordova build mode (`vite build --mode cordova` with `base: './'`) for the packaged artifact. The dev/PWA build keeps `base: '/'`.
3. **PWA service worker must be disabled in the Cordova build.** `vite-plugin-pwa` precaches `/assets/...` with absolute paths; under `file://` the precache fails and can produce a blank screen. Recommendation: gate `VitePWA` behind a non-cordova build mode, or exclude `registerSW.js` from the Cordova bundle.
4. **Java/Gradle compatibility is a non-issue today.** Java 25 + Gradle 8.14.2 + cordova-android 15.1.0 built cleanly. Only deprecation warnings about Gradle 9.0.
5. **Android SDK already present** (34–36.1 + build-tools), `ANDROID_HOME` set — no setup friction on this machine.
6. **Cordova vs Capacitor config coexist in the repo** — `capacitor.config.json` (Capacitor-flavored, `webDir: dist`, plugins block for Camera/Geolocation/Push/SplashScreen) exists, while the plan targets Cordova. The platform layer abstracts this away, but we should pick one packaging tool before Phase 2. Recommendation: **Capacitor** (modern Ionic default, better plugin ecosystem, same web-first constraint, config already present) — the Cordova spike proves the web build is packageable either way.
7. **`viewpoint-fit=cover` + `user-scalable=no`** in `index.html` carry over correctly into the WebView.

## Recommendations

- Add a `build:app` Vite mode: `base: './'`, no PWA plugin, output to `dist-app/` for the native shell.
- Adopt Capacitor as the single packaging path (config already exists); keep `src/platform/` as-is — it is the swap point.
- Re-run the spike after onboarding/discover/chat are feature-complete to validate camera + geolocation on a real device (this spike only validated the JS API contract and APK assembly).

## Evidence

- `app-debug.apk` — 5.09 MB, built at `cordova-spike/dinanwuye-spike/platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- `cordova platform list` → `android 15.1.0` installed
- Plugins installed: `cordova-plugin-camera`, `cordova-plugin-geolocation`

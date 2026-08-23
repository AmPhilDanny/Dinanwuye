# Phase 1 — Core MVP Build + Cordova Validation Spike (Weeks 5-13)

**Goal:** A working, closed (staging/internal beta) web build covering the critical path, plus early proof that the Cordova packaging path works.
**Reference:** `plan.md` §2 Phase 1, `architecture.md` §3/§4/§9, `PRD.md` §5
**Baseline:** Phase 0 done — frontend scaffolds build, backend monorepo + docker-compose + CI/CD ready.

---

## Atomic Task Breakdown

### 1. Backend — Service Bootstrap (make monorepo runnable)
- [x] Fix scaffold bugs: proper `pyproject.toml` (TOML), `pnpm-workspace.yaml`, matching-service removed from pnpm workspaces
- [x] `shared` package: constants (roles, plan ids), DTOs, JWT payload types, health response
- [x] NestJS bootstrap files per service: `src/main.ts` (Swagger, validation pipe, CORS, throttler), `src/app.module.ts`, `src/health.controller.ts`
- [x] Prisma schemas per service: User/Auth (auth), Profile/Photo/Preference (profile), Match/Swipe (matching-shared), Message/Conversation (messaging), Report/Block (trust-safety)
- [x] Root `pnpm install` works; `turbo build` passes for all services (8/8, 2026-08-18; per-service Prisma custom output fix)

### 2. Backend — Auth & Identity Service (NestJS)
- [x] Email/phone + password signup, login (bcrypt, JWT + rotating refresh)
- [x] OTP generation/verification (email/phone) with Redis TTL + rate limiting
- [x] `/auth/refresh`, `/auth/logout`, device fingerprinting stub
- [x] Passport JWT guard exposed via `shared`
- [x] Unit tests: signup, login, refresh rotation (9/9 pass)

### 3. Backend — Profile Service (NestJS)
- [x] Profile CRUD (create via onboarding, get, patch)
- [x] Photo management (S3/MinIO signed upload, list, delete)
- [x] Preference (age range, distance, filters)
- [x] Emits `profile.updated` event (Redis pub/sub stub)
- [x] Unit tests: profile patch validation, photo ordering (11/11 pass)

### 4. Backend — Matching Service V0 (FastAPI, heuristic)
- [x] Deck endpoint: hard filters (age, distance, gender/seeking, not-blocked) via SQL
- [x] Heuristic ranking: distance + age preference match + interest overlap + activity recency (no ML yet)
- [x] Swipe record (like/pass/superlike) → mutual-like creates Match
- [x] Match list + unmatch
- [x] Redis deck cache per session
- [x] Tests: ranking determinism, mutual-like match creation (19/19 pass, ruff clean)

### 5. Backend — Messaging Service (NestJS + Socket.IO)
- [x] Socket.IO gateway with JWT auth + Redis adapter (multi-instance ready)
- [x] Conversation list, message history (cursor pagination), send message
- [x] Read receipts, typing indicators (Socket.IO events)
- [x] Message persistence (encrypted-at-rest placeholder)
- [x] Tests: send→persist→deliver roundtrip, unread count (10/10 pass)

### 6. Backend — Trust & Safety V0 (NestJS)
- [x] Block user (bilateral exclusion from deck), unmatch on block
- [x] Report user (categories) + resolution status
- [x] Feed exclusion signals to matching (blocked list endpoint for FastAPI)
- [x] Tests: block excludes from deck, duplicate report dedupe (9/9 pass)

### 7. Frontend — Onboarding Flow (mobile-first @375px)
- [x] Landing → gender/seeking picker → auth (email/phone + OTP)
- [x] Multi-step profile wizard (one field/step: birthdate, location, bio, interests, photos, intent)
- [x] Selfie capture via platform layer (`capturePhoto()`) with manual-upload fallback
- [x] Route to Discover home; progress persistence (partial onboarding resumable)

### 8. Frontend — Discover + Match (Ionic gestures)
- [x] Discover deck: fetch `/matching/deck`, swipe like/pass/superlike via Ionic gestures
- [ ] Deck performance test on throttled connection (LCP budget) — pending device/perf measurement
- [x] Mutual-match detection → "It's a Match!" screen (red→blue gradient)
- [x] Premium gating stubs (daily like limit display)

### 9. Frontend — Chat (Socket.IO client)
- [x] Matches list → conversation list → thread
- [x] Send/receive text + image, read receipts, typing indicators
- [x] Unread counts; reconnect + resync on foreground
- [ ] Inline report/block actions — not yet wired to Trust & Safety

### 10. Frontend — Settings/Profile Edit + PWA polish
- [ ] Profile edit (bio, photos, preferences), completion meter — Settings/Profile pages still stubs
- [ ] Settings: privacy (distance visibility, online status), notifications prefs — stub only
- [ ] "Add to Home Screen" prompt (beforeinstallprompt) — not implemented
- [x] Zod runtime validation against OpenAPI responses in `services/api.js`

### 11. Zod ↔ OpenAPI Contract Sync
- [x] `utils/schemas.js` mirrors `backend/openapi/openapi.yaml` shapes
- [x] All API client calls validate responses; error surface defined

### 12. Cordova Validation Spike (throwaway)
- [x] `cordova platform add android` against the Vite build (www/ drop-in) — cordova-android 15.1.0, APK built OK
- [x] Platform layer swap test: `capturePhoto()`/`getLocation()` stub plugins — API surfaces match
- [x] Document findings → adjust `src/platform/` if friction found — no changes needed
- [x] Write `docs/cordova-spike.md` with findings + recommendations

### 13. E2E Local Integration + Staging
- [ ] `docker compose up` full stack locally; seed 10 test profiles — BLOCKED: no Docker, no local Postgres/Redis on dev machine
- [ ] End-to-end on LAN phone: signup → wizard → discover → match → chat — BLOCKED (infra above)
- [ ] Closed beta checklist + staging URL (cPanel + VPS pending purchase)

---

## Exit Criteria (All Must Pass)

- [ ] Internal team + closed beta testers can sign up, complete a profile, get matched, and chat end-to-end on an actual smartphone browser
- [ ] Cordova spike has run at least once with findings documented in `docs/cordova-spike.md`
- [ ] `turbo build` passes (backend), `vite build` passes (frontend), ESLint clean
- [ ] Zod schemas in sync with OpenAPI stub

---

## Evidence Tracking

| Task | Evidence |
|------|----------|
| Service bootstrap | `turbo build` pass, `/health` 200 per service |
| Auth | Test run, Swagger `/auth/*` |
| Profile | Test run, signed-upload flow |
| Matching V0 | Test run, deck endpoint JSON |
| Messaging | Test run, Socket.IO roundtrip log |
| Trust & Safety | Test run, block/report JSON |
| Onboarding | Screenshot @375px, flow walkthrough |
| Discover/Match | Gesture recording + LCP measurement |
| Chat | Real-time roundtrip on two devices |
| Settings/PWA | A2HS prompt screenshot |
| Cordova spike | `docs/cordova-spike.md` findings |
| E2E | Two-phone closed-beta walkthrough video/log |

---

## Progress

**Started:** 2026-08-17
**Status:** In Progress
**Current Task:** Task 1 — Backend service bootstrap (shared package, NestJS entry files, Prisma schemas)
**Completed:** Scaffold bug fixes (pyproject.toml, pnpm-workspace.yaml, workspace list)
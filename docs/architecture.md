# Dinanwuye — Architecture Document

**Status:** Execution update 2026-08-24 — **Web-first, Cordova-ready strategy with admin operations platform** · **Related:** `PRD.md`, `plan.md`

> **Strategy (v3.0):** Frontend is **Ionic + React, written in plain JavaScript** (no TypeScript on the client), built with **Vite** as a fully static single-page app. This ships today as a mobile-first, installable PWA for smartphone browsers. Because Ionic apps are designed to wrap into **Cordova** (or Capacitor) with the same codebase, native Android/iOS packaging later is a build/packaging step, not a rewrite. **Backend remains Node.js/NestJS in TypeScript** — this decision is frontend-only and does not affect backend technology choices or the API contract.

### Verified Runtime Topology (2026-08-23)

- Frontend: `https://dinanwuye.onrender.com`
- Auth: `https://dinanwuye-back.onrender.com/api/v1`
- Profile: `https://dinanwuye-profile.onrender.com/api/v1`
- Messaging: `https://dinanwuye-messaging.onrender.com/api/v1`
- Matching: `https://dinanwuye-matching.onrender.com/api/v1`
- Database: Supabase PostgreSQL via the regional pooler; application schemas are `dinanwuye_auth`, `dinanwuye_profile`, `dinanwuye_messaging`, and `dinanwuye_trust_safety`.
- Frontend state: persisted Zustand state is untrusted input; Discover and Explore normalize missing deck state before rendering.

### Implementation Update (2026-08-24)

- The public client remains `frontend/`, an Ionic + React + Vite PWA.
- The operator console is isolated in the root-level `admin-frontend/` application and communicates with `backend/admin-service` over HTTP. It does not access the database directly.
- `backend/admin-service` now uses its generated Prisma client, active-admin JWT validation, and role/permission guards for management routes.
- Phone signup uses the account-bound OTP created by the auth service; email signup completes without entering the phone OTP flow.
- Matching candidates now expose both profile ID and auth user ID. Matching, swipes, matches, and conversations use the auth user ID consistently.
- Profile photos are validated, written to the ignored runtime `uploads/` directory, and stored in the database by generated key. S3-compatible storage remains the production migration target.
- Public profile responses require authentication and exclude precise coordinates, onboarding state, premium/activity internals, and other private fields.
- Daily like limits use the current UTC day boundary. Production matching refuses its development JWT secret.
- Payment checkout, webhooks, subscription persistence, and provider integration remain unimplemented.

**Critical working note:** the Render service root directory is `backend` for the Node monorepo services, while the frontend service root is `frontend`. Build commands must install devDependencies, generate Prisma Client, and build the selected workspace. Runtime processes must use Render's `$PORT`; fixed ports work locally but fail in production. Do not use Supabase's reserved `auth` schema for application tables. Configure JWT secrets explicitly in production.

---

## 1. Architectural Goals

1. Ship a **fast, installable, mobile-first web app** that feels close to native on smartphones.
2. Keep the frontend **Cordova-packageable at all times** — this is an enforced constraint (§9), not a future aspiration.
3. Keep the backend **client-agnostic** so it serves web today and native apps later without changes.
4. Support a **robust, evolvable AI/ML matching pipeline** as a first-class service.
5. **Security and privacy by design.**
6. Scale from MVP to millions without a full re-platform.

---

## 2. High-Level System Overview

```
                        ┌───────────────────────────┐
                        │   Client: Ionic + React      │
                        │   (JavaScript, Vite build)   │
                        │   Static SPA — installable   │
                        │   PWA today, Cordova-        │
                        │   wrappable later, unchanged │
                        └─────────────┬───────────────┘
                                      │ HTTPS/TLS 1.3 + WSS (REST + WebSocket API only —
                                      │ no server-rendering dependency)
                                      ▼
                        ┌───────────────────────────┐
                        │        API Gateway          │
                        │  (Auth, rate limiting,      │
                        │   routing, WAF)             │
                        └─────────────┬───────────────┘
             ┌────────────┬───────────┼───────────┬──────────────┐
             ▼            ▼           ▼           ▼              ▼
        ┌─────────┐ ┌───────────┐ ┌─────────┐ ┌──────────┐ ┌───────────┐
        │  Auth &  │ │  Profile  │ │ Matching │ │ Messaging │ │  Trust &  │
        │ Identity │ │  Service  │ │  Service │ │  Service  │ │  Safety   │
        │  Service │ │(NestJS/TS)│ │ (Python  │ │(NestJS/TS │ │  Service  │
        │(NestJS/TS)│ │           │ │  FastAPI)│ │ Socket.IO)│ │(NestJS/TS)│
        └────┬─────┘ └─────┬─────┘ └────┬─────┘ └─────┬─────┘ └─────┬─────┘
             │             │            │             │             │
             └─────┬───────┴─────┬──────┴──────┬──────┴──────┬──────┘
                   ▼              ▼             ▼             ▼
             ┌───────────┐ ┌────────────┐ ┌───────────┐ ┌───────────┐
             │ PostgreSQL │ │  Vector DB  │ │  Redis     │ │  Object    │
             │ (primary)  │ │ (embeddings)│ │ (cache/    │ │  Storage   │
             │            │ │             │ │  pubsub)   │ │  (S3)      │
             └───────────┘ └────────────┘ └───────────┘ └───────────┘

        [Future, packaging step only]: same Ionic/React build wrapped by
        Cordova → native iOS/Android shells, talking to the SAME API
        Gateway and services above — see §9.
```

**Key point:** the backend was already platform-agnostic before this pivot and remains completely unaffected. The only architecture change from v2.0 is the frontend framework/build strategy, driven entirely by the goal of easy future Cordova packaging.

---

## 3. Client Application

### 3.1 Why Ionic + React (JavaScript), Not Next.js

The prior draft (v2.0) recommended Next.js for its SSR/SEO benefits. That conflicts directly with the "easy Cordova bundling" goal: **Cordova can only wrap a static bundle of HTML/CSS/JS — it cannot run a server.** Using SSR, server routes, or middleware would mean either never using those features (defeating the point of Next.js) or restructuring the app before Cordova packaging (defeating the "without much stress" goal).

**Ionic + React on Vite** is purpose-built for this:
- Vite's production build (`vite build`) outputs a plain static `dist/` folder — this **is** the web deploy, and it's also literally what gets copied into Cordova's `www/` folder later. No conversion step, no restructuring.
- Ionic provides mobile-native-feeling UI components (tab bars, action sheets, modals, gesture-based interactions) and platform-adaptive styling (iOS-style vs. Android-style rendering) — this directly addresses the "feels like a real app, not a website" concern raised in earlier drafts, and it's the same component set used whether the shell is a browser or Cordova's WebView.
- Ionic is explicitly designed around the "build once, deploy as PWA + native shells" model — this is not a workaround, it's the tool's primary use case.

**JavaScript, not TypeScript, on the frontend** — a deliberate choice for this project (lower ceremony, faster onboarding for frontend contributors). This is decoupled from the Cordova-readiness goal — Ionic works fine in either language — but is bundled into this same rebuild since both changes touch the frontend stack together.

### 3.2 Recommended Stack
| Concern | Technology | Rationale |
|---|---|---|
| Framework | **Ionic Framework + React (JavaScript)** | Native-feeling mobile UI, Cordova-wrappable by design |
| Build tool | **Vite** | Static output by default, fast dev server, no SSR entanglement |
| Styling | Ionic's built-in theming (CSS variables) + Tailwind CSS for custom components | Red/white/blue design tokens set once as CSS variables, used by both Ionic components and custom UI |
| Routing | **React Router** (client-side only) | No server-side routing dependency, matches the static-bundle constraint |
| State/data | **TanStack Query** for server state, **Zustand** for local UI state | Predictable caching, minimal boilerplate, framework-agnostic w.r.t. TS/JS |
| Realtime | WebSocket client (`Socket.IO` client) for chat, typing indicators, presence | |
| PWA layer | **Vite PWA plugin** (`vite-plugin-pwa`) | Web App Manifest + service worker for installability, offline app-shell caching, web push where supported |
| Gestures | Ionic's built-in gesture utilities for the swipe deck | Purpose-built for this exact interaction, better starting point than a custom gesture library |
| Device capability access | Thin abstraction layer (e.g., `src/platform/`) wrapping browser APIs (`getUserMedia`, Geolocation, Web Push) behind app-level functions like `capturePhoto()`, `getLocation()` | Per PRD FR-37 — this is the single seam where browser-API calls get swapped for Cordova plugin calls later, instead of hunting through the whole codebase |
| Runtime API validation | Lightweight schema validation (e.g., **Zod**, used without TypeScript — it validates plain JS objects at runtime) on API responses | Recovers some of the "shape safety" that TypeScript would normally provide against the TS backend's contracts, without requiring TypeScript on the frontend |

### 3.3 Mobile-First Design Discipline
Unchanged from v2.0: components and layouts designed and built starting at ~360–430px viewport width, progressively enhanced for tablet/desktop; touch-first interaction patterns prioritized; performance budget tuned against mid/low-tier Android devices on 4G, tested under real throttled conditions, not just designed on paper.

### 3.4 SEO Tradeoff
Since the app itself is a static client-rendered SPA (no SSR), it doesn't get server-rendered SEO for free. This is an accepted tradeoff: the **app screens** (auth, discover, chat) don't need SEO. If a strong SEO presence is wanted for a public **marketing/landing page**, that should be a small, separate static page (plain HTML or a lightweight static-site generator) outside the app bundle — not a reason to reintroduce SSR into the app itself.

### 3.5 Known Web Constraints (Unchanged from v2.0)
| Constraint | Mitigation |
|---|---|
| iOS Safari has limited/inconsistent Web Push support | Email/SMS fallback for critical events; revisit once/if the Cordova iOS build ships (native push works reliably there) |
| Browser camera API varies across mobile browsers | Abstraction layer (§3.2) + manual-upload fallback; test explicitly on Safari iOS + Chrome Android |
| No true background execution on web | Rely on web push where available + fast reconnect-on-foreground for chat |
| No app-store presence for discovery (until Cordova build ships) | Growth relies on web/SEO/social/referral in the interim |

---

## 4. Backend Services

*(Fully unchanged from v2.0 — the backend was always platform-agnostic and remains so regardless of frontend framework/language choices.)*

### 4.1 Technology Choices
| Concern | Technology | Rationale |
|---|---|---|
| API layer | **Node.js (NestJS, TypeScript)** for most services | Strong typing on the backend's own service-to-service contracts and its exposed API schema (e.g., OpenAPI), independent of what the frontend consumes it with |
| ML/Matching service | **Python (FastAPI)** | Best ecosystem for ML |
| Realtime messaging | **Node.js + Socket.IO**, backed by **Redis Pub/Sub** | Low-latency chat, presence, typing indicators |
| API Gateway | **Kong** or cloud-native (AWS API Gateway) | Central auth enforcement, rate limiting, routing, WAF |
| Inter-service comms | **REST/gRPC** synchronous, **Kafka** async events | Decouples services, enables ML feedback loop and moderation pipeline |
| Primary datastore | **PostgreSQL** (managed) | Relational integrity |
| Caching / session / presence | **Redis** (managed) | Discover deck caching, presence, rate limiting |
| Vector store | **pgvector at MVP → dedicated vector DB at scale** | Embeddings for similarity retrieval |
| Object storage | **S3-compatible storage** with CDN in front | Photos/media, signed URLs |

**Note on the API contract:** because the frontend is now plain JavaScript, the backend's TypeScript types are no longer directly importable into the client (as they might have been in an all-TypeScript monorepo). Instead, the API contract should be published as an **OpenAPI/Swagger spec** (NestJS supports this natively) so the frontend team has a clear, tooling-friendly reference, and so the Zod validation schemas (§3.2) can be kept in sync with it.

### 4.2 Core Services (unchanged responsibilities)
- **Auth & Identity Service** — phone/email + OTP, OAuth (Google, Apple web sign-in), JWT + rotating refresh tokens, identity verification/liveness vendor integration, device/browser fingerprinting.
- **Profile Service** — CRUD, photo upload orchestration, emits `profile.updated` events.
- **Matching Service (ML)** — see §5.
- **Messaging Service** — WebSocket gateway, message persistence, encryption before persistence.
- **Trust & Safety Service** — block/report/ban state, appeals workflow, feeds exclusion signals into Matching.
- **Notification Service** — web push + email/SMS fallback today; adds native push (APNs/FCM) as a new channel once/if the Cordova build ships, no rework to existing channels.
- **Payments/Subscription Service** — Stripe (global) + Paystack (NG/Africa) web checkout; app-store IAP integration added only if/when native apps ship.
- **Media & Moderation Pipeline** — NSFW/violence detection, perceptual hashing, text moderation.

---

## 5. AI/ML Matching System

*(Unchanged — entirely server-side, no dependency on client platform or language.)*

### 5.1 Pipeline Stages
1. **Candidate Retrieval** — hard filters (age, distance, gender/seeking, active-account, not-blocked/excluded).
2. **Embedding-based Similarity** — nearest-neighbor lookup in the vector DB.
3. **Ranking Model** — learned-to-rank (LightGBM to start) using embedding similarity, interest overlap, intent match, response-rate history, activity recency, reciprocity likelihood.
4. **Business Rule Layer** — safety exclusions (hard veto), diversity injection, bounded premium-boost placement.
5. **Serve Deck** — top-N candidates cached (Redis) per session.

### 5.2–5.5
Feedback loop, cold-start handling, fairness/bias mitigation, and ML infra choices are unchanged from v2.0 — see prior draft content or ask for the full section to be restated.

---

## 6. Data Model (Core Entities, Simplified)

*(Unchanged — platform-independent.)*

```
User (id, auth_ref, phone/email_hash, created_at, status, role)
Profile (user_id, name, dob, gender, seeking[], bio, height, ethnicity,
         religion, relationship_intent, education, occupation,
         languages[], location_geo, verified_bool)
Photo (id, user_id, s3_key, order, moderation_status)
Preference (user_id, age_min, age_max, distance_km, filters_json)
Swipe (id, actor_id, target_id, action[like|pass|superlike], created_at)
Match (id, user_a_id, user_b_id, created_at, status[active|unmatched])
Message (id, match_id, sender_id, content_encrypted, media_ref, created_at, read_at)
Report (id, reporter_id, target_id, category, context_ref, status, resolved_by, resolved_at)
Block (id, blocker_id, blocked_id, created_at)
Subscription (id, user_id, plan, provider[stripe|paystack|appstore|playstore], status, renews_at)
Embedding (user_id, vector, model_version, updated_at)
PushSubscription (user_id, endpoint, keys, channel[web|apns|fcm], created_at)
```

---

## 7. Security Architecture

*(Unchanged from v2.0 — frontend language/framework choice does not materially change the security model.)*

Highlights: OAuth2/OIDC auth, JWT + refresh rotation, httpOnly/Secure/SameSite cookies (not localStorage), CSP, CSRF protection, TLS 1.3 everywhere, encryption at rest with field-level encryption for sensitive columns, approximate-only location exposure, signed short-TTL media URLs, WAF + rate limiting, dependency/container scanning, secrets vault, regular pen testing (web-focused: XSS/CSRF/session/business-logic abuse), GDPR/NDPR-aligned data rights, full admin audit logging.

**One addition specific to plain-JS frontend:** since there's no compile-time type checking on the client, extra care is needed that runtime input validation (both the Zod layer in §3.2 *and* server-side validation, which must never be skipped) catches malformed/malicious payloads — the frontend's lack of types is a DX tradeoff, not a security boundary, so **all validation of trust still happens server-side regardless of what the client does.**

---

## 8. Risks Specific to This Approach

| Risk | Mitigation |
|---|---|
| Swipe-deck gesture feel not matching native-app expectations | Use Ionic's built-in gesture components rather than building custom; dedicated performance testing on mid-tier Android + iOS Safari |
| Loss of compile-time type safety between JS frontend and TS backend | OpenAPI spec + Zod runtime validation (§3.2) as a deliberate mitigation; document the API contract clearly and keep it versioned |
| SEO weaker without SSR | Separate lightweight static marketing page outside the app bundle (§3.4) |
| Inconsistent web push support (esp. iOS Safari) | Email/SMS fallback; resolved naturally once/if the Cordova build ships (native push) |
| Team unfamiliarity with Ionic's component model | Budget ramp-up time in Phase 0/1; Ionic's docs and component API are well-documented and React-idiomatic |
| "Cordova-ready" claim not actually validated until it's tried | Recommend a **spike/smoke-test early** (Phase 1, not Phase 5) — run the Vite build through Cordova once, even before native launch is scheduled, to confirm the packaging path is genuinely frictionless and catch surprises while they're cheap to fix (see plan.md §2 Phase 1) |

---

## 9. Cordova Packaging Path (Kept Deliberately Low-Effort)

This section exists so "how do we actually do this later" isn't a mystery when the time comes.

**What stays constant:**
- The Ionic + React + Vite codebase itself.
- The backend, API contract, database, and ML system — zero changes required.
- The design system / CSS variables (red/white/blue tokens).

**What changes when native packaging is triggered:**
1. Run `ionic cordova platform add android` / `ios` (or equivalent Capacitor commands if that path is chosen instead) against the existing project.
2. Swap the browser-API calls behind the §3.2 abstraction layer (`capturePhoto()`, `getLocation()`, push registration) for their Cordova-plugin equivalents — this is the one place code changes, by design.
3. Add native push (APNs/FCM) as a new notification channel (§4.2) — additive, doesn't touch existing web-push/email/SMS code.
4. Native app-store assets, review, and submission — new work regardless of architecture, budgeted separately in `plan.md` §7.

**Recommended validation step (see §8 risk table and plan.md Phase 1):** do a throwaway Cordova build early — not to ship it, but to confirm steps 1–2 above are actually as smooth as this document assumes, while there's still time to adjust the abstraction layer design if not.

---

## 10. Infrastructure & DevOps

### 10.1 Deployment Strategy — Hybrid (cPanel + VPS/Cloud)

**Frontend (current: Render; planned alternative: cPanel Shared Hosting):**
- Static SPA build (`dist/`) uploaded to `public_html/`
- Apache `.htaccess` for SPA routing (fallback to `index.html`)
- HTTPS via Let's Encrypt (cPanel AutoSSL)
- PWA manifest + service worker served statically
- CDN (Cloudflare) in front for performance/SSL/WAF

**Backend (current: Render; planned alternative: VPS or Cloud — e.g., DigitalOcean, Hetzner, AWS Lightsail, Contabo):**
- Node.js/NestJS services + Python/FastAPI matching service
- PostgreSQL (self-hosted or managed) — **not** on cPanel
- Redis (self-hosted or managed) — for caching, pub/sub, sessions
- Socket.IO WebSocket server for realtime chat
- S3-compatible storage (MinIO self-hosted, or Wasabi/Backblaze B2/AWS S3)
- API Gateway (Kong, Traefik, or Nginx) for routing, rate limiting, auth
- Docker + Docker Compose for service orchestration
- GitHub Actions CI/CD → SSH deploy to VPS

**Database Co-location:**
- PostgreSQL + Redis run on the same VPS as backend services (or managed equivalents)
- **Not on cPanel** — cPanel's MySQL/MariaDB doesn't support pgvector, JSONB performance, or concurrent connections needed
- Backups: Automated daily dumps to S3-compatible storage

**Domain Setup:**
- `api.dinanwuye.com` → VPS (backend API + WebSocket)
- `dinanwuye.com` / `www.dinanwuye.com` → cPanel (frontend SPA)
- CORS configured for `https://dinanwuye.com` + `https://www.dinanwuye.com`

### 10.2 cPanel-Specific Configuration

**`.htaccess` for SPA routing (in `public_html/`):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/css application/javascript text/html application/json
</IfModule>
```

**Service Worker Scope:**
- SW registered at `/sw.js` — scope is `/`
- Must be served with `Service-Worker-Allowed: /` header (Apache does this by default)

### 10.3 Environment Variables (Backend VPS)

```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dinanwuye
DATABASE_SSL=false

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# API
API_PORT=3000
API_PREFIX=api/v1
CORS_ORIGIN=https://dinanwuye.com,https://www.dinanwuye.com

# S3/MinIO
S3_ENDPOINT=https://s3.your-provider.com
S3_ACCESS_KEY=xxx
S3_SECRET_KEY=xxx
S3_BUCKET=dinanwuye-media
S3_REGION=us-east-1
S3_CDN_URL=https://cdn.dinanwuye.com

# Socket.IO
WS_PORT=3001
WS_CORS_ORIGIN=https://dinanwuye.com,https://www.dinanwuye.com

# Email (SMTP)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASS=xxx
EMAIL_FROM=noreply@dinanwuye.com

# Stripe
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_xxx

# Paystack
PAYSTACK_SECRET_KEY=sk_xxx
PAYSTACK_PUBLIC_KEY=pk_xxx
PAYSTACK_WEBHOOK_SECRET=xxx

# VAPID (Web Push)
VAPID_PUBLIC_KEY=xxx
VAPID_PRIVATE_KEY=xxx
VAPID_SUBJECT=mailto:admin@dinanwuye.com
```

### 10.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: cd frontend && pnpm install --frozen-lockfile
      - run: cd frontend && pnpm run build
      - name: Deploy to cPanel
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.CPANEL_FTP_HOST }}
          username: ${{ secrets.CPANEL_FTP_USER }}
          password: ${{ secrets.CPANEL_FTP_PASS }}
          local-dir: frontend/dist/
          server-dir: public_html/

  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/dinanwuye
            git pull origin main
            docker compose pull
            docker compose up -d --remove-orphans
            docker image prune -f
```

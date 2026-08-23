# Phase 0 — Foundations (Weeks 1–4)

**Goal:** Team, tooling, and design system ready.
**Reference:** `plan.md` §2 Phase 0, `architecture.md` §3, `PRD.md` §4.1

---

## Atomic Task Breakdown

### 1. Design System v1
- [x] Define CSS variables for brand tokens (red `#E4172B`, deep red `#B00F1F`, blue `#1B4CE0`, white/surface grays)
- [x] Define typography scale (mobile-first)
- [x] Define "It's a Match!" gradient (red→blue diagonal)
- [x] Create design token file compatible with Ionic theming
- [x] Document usage for Ionic components + custom UI

### 2. Scaffold Ionic + React (JavaScript) + Vite Project
- [x] Initialize project with `@ionic/react` + `vite`
- [x] Configure Vite for static SPA output (no SSR)
- [x] Add React Router (client-side only)
- [x] Add Tailwind CSS for custom components
- [x] Add `vite-plugin-pwa` for manifest + service worker
- [x] Verify build runs on real smartphone browser

### 3. Backend Service Scaffolds (NestJS/TypeScript)
- [x] Initialize NestJS monorepo (pnpm workspaces + turbo) — `backend/package.json`, `backend/tsconfig.json`
- [x] Scaffold: Auth, Profile, Matching (FastAPI), Messaging, Trust & Safety, Notification, Payment, API Gateway — all `backend/*/package.json` + `tsconfig.json` done; matching-service has FastAPI skeleton (main.py, config, db session, v1 router, health/matching/embeddings endpoints)
- [x] Set up shared OpenAPI spec stub — `backend/openapi/openapi.yaml` (v0.1.0, all core endpoint groups + schemas)
- [x] Add Dockerfile for each service — `backend/*/Dockerfile` (multi-stage, non-root)
- [x] Add docker-compose.yml for local dev — `backend/docker-compose.yml` (Postgres+pgvector, Redis, MinIO, Nginx, all 8 services)
- [ ] Wire NestJS service bootstrap files (src/main.ts, app.module.ts) + Prisma schemas per service — **next backend step**

### 4. CI/CD Pipelines (Hybrid: cPanel + VPS)
- [x] GitHub Actions: frontend lint, build, test → deploy to cPanel via FTP — `.github/workflows/frontend-deploy.yml`
- [x] GitHub Actions: backend lint, build, test → deploy to VPS via SSH + Docker Compose — `.github/workflows/backend-deploy.yml`
- [x] Document secrets: `deployment/github-secrets.md` (CPANEL_FTP_*, VPS_SSH_*, VAPID_PUBLIC_KEY)
- [x] Add missing frontend scripts (`lint`, `typecheck`) referenced by frontend workflow — scripts + `.eslintrc.cjs`, `tsconfig.json`, `.prettierrc.json` added
- [ ] First successful workflow run on real repo

### 5. Core Infrastructure (VPS — Docker Compose, not Terraform)
- [x] Write VPS provisioning guide — `deployment/vps-provisioning.md` (LyteHosting Unmanaged VPS, Docker, DB, MinIO, Nginx, SSL, UFW, backups)
- [x] Write cPanel provisioning guide + DNS setup — `deployment/cpanel-setup.md` (domain, AutoSSL, FTP account, .htaccess SPA routing, DNS records)
- [x] Configure Nginx config files — `backend/nginx/nginx.conf` + `backend/nginx/conf.d/api.dinanwuye.com.conf` (rate limiting, CORS, WebSocket proxy, SSL)
- [x] Add `.htaccess` for cPanel SPA routing + security headers — `frontend/public/.htaccess`
- [x] Add `backend/.env.example` with all service env vars
- [ ] **Manual (user):** Purchase LyteHosting Unmanaged VPS + follow `deployment/vps-provisioning.md`
- [ ] **Manual (user):** Purchase cPanel Shared Hosting + follow `deployment/cpanel-setup.md`
- [ ] **Manual (user):** Configure DNS records per `deployment/cpanel-setup.md` §3
- [ ] Verify connectivity: frontend (cPanel) ↔ backend (VPS) via HTTPS

### 6. OpenAPI Spec Stub
- [x] Publish initial OpenAPI spec for API contract — `backend/openapi/openapi.yaml`
- [x] Include all core endpoints (auth, profile, matching, messaging, safety, payments, notifications, health)
- [ ] Make accessible to frontend team (hosted on VPS Swagger UI or GitHub Pages) — after VPS is up

### 7. Legal/Compliance Kickoff
- [ ] Draft privacy policy
- [ ] Draft Terms of Service
- [ ] Cookie consent implementation plan
- [ ] NDPR/GDPR review initiation

### 8. Vendor Selection
- [ ] Identity verification vendor (confirm browser-camera/web SDK support)
- [ ] Payments: Stripe + Paystack
- [ ] Moderation APIs (image + text)

---

## Exit Criteria (All Must Pass)

- [x] Design system v1 published (CSS variables, typography, gradient documented)
- [x] Ionic project builds and runs on real smartphone browser
- [ ] VPS infra reachable (PostgreSQL + pgvector, Redis, MinIO, Nginx API Gateway) — **pending VPS purchase + provisioning**
- [ ] cPanel accessible via FTP, SSL working, SPA routing via .htaccess — **pending cPanel purchase + provisioning**
- [ ] DNS configured: `dinanwuye.com` → cPanel, `api.dinanwuye.com` → VPS — **pending purchase**
- [ ] CI/CD pipelines working: frontend → cPanel, backend → VPS — **pending purchase + first run**
- [ ] OpenAPI spec stub published for API contract — spec file done (`backend/openapi/openapi.yaml`); URL hosting pending VPS
- [ ] Legal/compliance kickoff complete (drafts + review started)
- [ ] Vendors selected and contracted

---

## Evidence Tracking

| Task | Evidence |
|------|----------|
| Design system | Token file + docs |
| Ionic scaffold | `vite build` output, device test screenshot |
| Backend scaffolds | `backend/` monorepo structure (8 services + shared), `backend/openapi/openapi.yaml` |
| CI/CD | Workflow files in `.github/workflows/`, secrets doc in `deployment/github-secrets.md`, passing runs (pending purchase) |
| VPS Infra | `deployment/vps-provisioning.md`, `docker compose ps` output (pending provisioning) |
| cPanel | `deployment/cpanel-setup.md`, FTP login success, SSL cert valid (pending provisioning) |
| DNS | `nslookup dinanwuye.com`, `nslookup api.dinanwuye.com` (pending DNS config) |
| OpenAPI | `backend/openapi/openapi.yaml` (published URL pending VPS) |
| Legal | Draft docs in repo |
| Vendors | Contracts/POCs documented |

---

## Progress

**Started:** 2026-08-17
**Status:** In Progress
**Current Task:** Backend monorepo service source files (NestJS bootstrap + Prisma schemas); then user purchases VPS + cPanel and follows provisioning guides
**Completed:** Design System v1, Ionic + React (JS) + Vite scaffold with PWA, Backend monorepo scaffold (8 services, Dockerfiles, docker-compose, Nginx config, .env.example), CI/CD workflows + secrets doc, OpenAPI spec stub, cPanel .htaccess, VPS/cPanel/DNS provisioning guides
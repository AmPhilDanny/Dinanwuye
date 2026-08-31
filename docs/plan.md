# Dinanwuye — Implementation Plan

**Status:** Execution update 2026-08-24 — **Web-first, Cordova-ready strategy with admin operations platform** · **Related:** `PRD.md`, `architecture.md`

> **Strategy (v3.0):** Frontend rebuilt on **Ionic + React (JavaScript) + Vite**, replacing the Next.js plan, specifically so a future Cordova-based Android/iOS package is low-effort. Backend plan is unchanged (still NestJS/TypeScript). A new early validation step (Cordova smoke test) is added to Phase 1 to de-risk the "easy bundling later" assumption while it's still cheap to fix.

### Verified Progress (2026-08-23)

- [x] Ionic + React + Vite frontend builds and is live as a Render PWA at `https://dinanwuye.onrender.com`.
- [x] Auth service is live at `https://dinanwuye-back.onrender.com`; health and login were verified.
- [x] Profile, messaging, and matching services are deployed on Render and their health endpoints were verified.
- [x] Supabase project is healthy; 11 application tables exist in dedicated `dinanwuye_*` schemas.
- [x] Four demo accounts were seeded for testing; see `Supabase.txt`.
- [x] Cordova Android packaging spike passed; findings are recorded in `cordova-spike.md`.
- [x] Discover and Explore pages load production matching data and tolerate stale persisted state.
- [ ] API gateway, trust-safety, notifications, payments, and production observability remain incomplete.

### Engineering Corrections Completed (2026-08-24)

- [x] Render frontend/backend working directories and backend service URL corrected.
- [x] Auth and profile Dockerfiles aligned with the backend pnpm workspace and service Prisma schemas.
- [x] Phone signup OTP, matching identifiers, daily like limits, profile privacy, and photo intake corrected.
- [x] Admin API Prisma schema/client mismatch fixed; admin JWT validation and role/permission guards added.
- [x] New root-level `admin-frontend/` dashboard shell added with login, overview, safety queue, and member directory views.
- [x] Admin API, profile API, main frontend, matching Python code, and admin frontend builds validated. Docker validation is pending because Docker is unavailable in the development environment.

**Critical working note:** Render services must bind to `$PORT`. Keep production API URLs explicit and never restore `localhost` fallbacks in a deployed build. The Supabase `auth` schema is reserved by Supabase; application Prisma schemas use `dinanwuye_auth`, `dinanwuye_profile`, `dinanwuye_messaging`, and `dinanwuye_trust_safety`.

---

## 1. Guiding Principles

- Ship a **narrow, high-quality MVP** first (core matching + chat + safety) as a web app.
- Get the **Matching Service and Trust & Safety boundaries right early** — unaffected by any frontend decision.
- Security and compliance gates are non-negotiable checkpoints.
- **Mobile-first is a design discipline** — every screen built and reviewed at smartphone viewport width first.
- **Cordova-readiness is validated early, not assumed** — a real (even if throwaway) Cordova build happens in Phase 1, not deferred until native apps are actually scheduled.

---

## 2. Phased Roadmap

### Phase 0 — Foundations (Weeks 1–4) — **Partially complete**
**Goal:** Team, tooling, and design system ready.

- Finalize brand identity: logo, red/white/blue design tokens (as CSS variables, shared by Ionic components and custom UI), typography, the "It's a Match!" gradient moment — mobile-first from the first mockup
- Scaffold the **Ionic + React (JavaScript) + Vite** project; scaffold backend services (NestJS/TypeScript) separately — these are independent codebases connected only by the API contract
- **Deployment strategy decision (Hybrid: Frontend on cPanel, Backend on VPS)** — documented in architecture.md §10
- Set up CI/CD pipelines: GitHub Actions for frontend → cPanel (FTP), backend → VPS (SSH + Docker Compose)
- Stand up core infra on VPS: PostgreSQL + pgvector, Redis, MinIO/S3-compatible, Nginx/Kong API Gateway
- Provision cPanel hosting: domain, SSL (AutoSSL), FTP credentials for deploy
- Configure DNS: `dinanwuye.com` → cPanel, `api.dinanwuye.com` → VPS IP
- Publish an initial OpenAPI spec stub for the API contract (architecture.md §4.1) so frontend and backend can build against a shared reference despite being different languages
- Legal/compliance kickoff: privacy policy draft, ToS draft, cookie consent, NDPR/GDPR review
- Select and contract vendors: identity verification (confirm browser-camera/web SDK support explicitly), payments (Stripe + Paystack), moderation APIs

**Exit criteria:** Design system v1 published; Ionic project builds and runs on a real smartphone browser; VPS infra reachable (Postgres, Redis, MinIO, API Gateway); cPanel accessible via FTP; DNS configured; OpenAPI stub published.

---

### Phase 1 — Core MVP Build + Cordova Validation Spike (Weeks 5–13) — **In progress**
**Goal:** A working, closed (staging/internal beta) web build covering the critical path, **plus early proof that the Cordova packaging path actually works** as assumed.

**Backend** — unchanged, platform-agnostic:
- Auth & Identity Service, Profile Service, Matching Service V0 (heuristic ranking), Messaging Service, Trust & Safety V0

**Frontend — Ionic + React (JavaScript), mobile-first**
- Onboarding flow built and QA'd first at 375px width: gender/seeking → auth → OTP → multi-step profile wizard → selfie capture (via the platform abstraction layer, architecture.md §3.2) → Discover home
- Discover deck using Ionic's gesture components, performance-tested on throttled connection + mid-tier Android emulation
- Match screen (red→blue gradient moment)
- Chat screen (send/receive, read receipts)
- Settings/profile edit
- PWA setup: manifest, service worker, "Add to Home Screen" prompt
- Zod runtime validation wired up against the OpenAPI-described API responses
- Marketing/landing page (kept as a small separate static page for SEO — architecture.md §3.4)

**Cordova Validation Spike (new in v3.0, do this by end of Phase 1, not later):**
- Run the in-progress Ionic build through `cordova platform add android` (and `ios` if a Mac/build environment is available) as a throwaway exercise
- Confirm: the static build drops in cleanly, the platform abstraction layer (`capturePhoto()`, `getLocation()`) is the only place that needs Cordova-plugin swaps, and no unexpected server-dependency assumptions crept into the web build
- Document any friction found here and adjust the abstraction layer *now*, while it's cheap — this is the whole point of doing the spike early instead of waiting until native apps are actually scheduled

**Exit criteria:** Internal team + closed beta testers can sign up, complete a profile, get matched, and chat end-to-end on an actual smartphone browser; the Cordova spike has run at least once with findings documented (does not need to be a polished native build — just proof the path is real).

---

### Phase 2 — Trust, Safety & Payments Hardening (Weeks 11–17, overlaps Phase 1 tail)
**Goal:** The app is safe and monetizable enough for a public beta.

- Identity verification integration via the platform abstraction layer (browser camera today, ready to swap for a Cordova plugin later without touching calling code)
- Automated moderation pipeline: image and text classifiers, human review queue
- Full report/block/ban workflows + admin dashboard v1
- Web billing integration: Stripe + Paystack
- Web push notification setup, with email/SMS fallback for iOS Safari and other limited-support browsers
- Security hardening: CSP configuration, CSRF protections, cookie/session security review, rate limiting/WAF, secrets management audit, dependency/container scanning
- Legal sign-off: privacy policy, ToS, cookie consent

**Exit criteria:** Web-focused pen-test (XSS/CSRF/session/business-logic abuse) passes with no critical findings; payments work end-to-end in sandbox and one live transaction per provider; moderation queue actively catching seeded test-violations; push/email/SMS fallback chain verified on iOS Safari.

---

### Phase 3 — AI/ML Matching Upgrade (Weeks 15–21, overlaps Phase 2 tail)
**Goal:** Replace heuristic matching with the full ML pipeline. *(Unaffected by the frontend rebuild — entirely backend work.)*

- Instrument and backfill behavioral event pipeline (Kafka)
- Build embedding generation and vector search (pgvector)
- Train and offline-evaluate first ranking model (LightGBM) against heuristic baseline
- Business rule layer: safety-exclusion hard veto, diversity injection, bounded premium-boost placement
- A/B test framework; ship ML ranking to a % of traffic
- Fairness audit pass before full rollout

**Exit criteria:** ML ranking statistically outperforms heuristic baseline on the north-star metric; fairness audit clean; full rollout approved.

---

### Phase 4 — Public Launch Readiness (Weeks 19–23, overlaps Phase 3 tail)
**Goal:** Production-ready, scaled, and monitored web app.

- Load testing against projected launch traffic; tune autoscaling
- Full observability: dashboards, alerting on SLOs including Core Web Vitals
- Cross-browser QA pass: Safari iOS, Chrome Android, Samsung Internet, desktop browsers
- Marketing site finalized (SEO-focused, since there's no app-store listing yet)
- Incident response runbook + on-call rotation live
- Soft launch in 1 target market (e.g., Nigeria) → monitor → expand to diaspora markets (UK/US)

**Exit criteria:** App live on the public web domain; monitoring/alerting active; soft-launch metrics reviewed before wider marketing push.

---

### Phase 5 — Post-Launch Iteration (Ongoing, Week 23+)
**Goal:** Iterate on retention, monetization, and matching quality; track the native-packaging decision gate.

- Weekly/bi-weekly model retraining cadence operationalized
- Feature backlog re-prioritized: video/voice, events, localization, gamification
- Continued Trust & Safety tuning based on real report data
- Track native-app trigger metrics (§7) starting from launch
- Expand payment rails/markets as growth dictates

---

## 3. Indicative Timeline (Gantt-style Summary)

| Phase | Weeks | Key Output |
|---|---|---|
| 0 — Foundations | 1–4 | Design system, Ionic project scaffolded, **VPS + cPanel infra**, OpenAPI stub |
| 1 — Core MVP + Cordova Spike | 5–13 | End-to-end closed beta (web); Cordova packaging path validated |
| 2 — Trust/Safety/Payments | 11–17 | Public-beta-ready, monetizable, moderated |
| 3 — ML Matching | 15–21 | Full AI/ML ranking live and validated |
| 4 — Launch Readiness | 19–23 | Live on the public web |
| 5 — Post-launch | 23+ | Continuous iteration; native-packaging metrics tracking begins |

**~5.5–6 months to public web launch.** Slightly longer than the pure-Next.js v2.0 estimate because of the added Cordova validation spike in Phase 1 — this is a deliberate tradeoff: a small amount of extra time now buys confidence that native packaging later will genuinely be "without much stress," rather than discovering problems only once native apps are actually being built.

---

## 4. Suggested Team Composition

| Role | Count | Notes |
|---|---|---|
| Product Manager | 1 | Owns PRD, prioritization |
| Engineering Manager / Tech Lead | 1 | Owns architecture.md execution |
| Backend Engineers (Node/NestJS, TypeScript) | 2–3 | Auth, Profile, Messaging, Trust & Safety, Payments services |
| ML Engineer / Data Scientist | 1–2 | Matching Service, model training/eval, fairness audits |
| Frontend Engineers (Ionic/React, JavaScript) | 2–3 | Web app build; at least one with prior Ionic or hybrid-app experience is valuable given the Cordova end-goal |
| Product Designer (UI/UX) | 1 | Mobile-first design system, red/white/blue brand execution, familiarity with Ionic's component patterns a plus |
| QA/Test Engineer | 1 | Manual + automated testing across mobile browsers; owns the Cordova spike validation in Phase 1 |
| DevOps/Infra Engineer | 1 | Part-time early, full-time by Phase 2 |
| Trust & Safety Lead (ops) | 1 | From Phase 2 |
| Legal/Compliance (advisory) | fractional | Privacy policy, ToS, NDPR/GDPR, cookie compliance |

*Minimum viable team: ~7–8 people, similar to the v2.0 estimate — the frontend framework change doesn't materially change headcount, though prior Ionic experience on the team (even one person) meaningfully de-risks the Cordova-readiness goal.*

---

## 5. Milestones & Go/No-Go Gates

1. **End of Phase 0:** Infra + mobile-first design system reviewed; Ionic scaffold confirmed working on a real device.
2. **End of Phase 1:** Internal dogfood test on an actual smartphone browser passes; **Cordova spike completed with findings documented** (new gate in v3.0).
3. **End of Phase 2:** Web-focused security/pen-test review — hard gate, no public beta without passing this.
4. **End of Phase 3:** ML A/B test results reviewed — go/no-go on full ranking rollout.
5. **End of Phase 4:** Cross-browser QA sign-off + soft-launch metrics reviewed before scaling marketing spend.

---

## 6. Immediate Next Steps (This Sprint)

1. Approve the v3.0 direction (Ionic + React, JavaScript, Vite, Cordova-ready) with stakeholders.
2. Kick off brand/design system work, mobile-first from the first mockup, using CSS variables compatible with Ionic's theming.
3. Scaffold the Ionic project and confirm a trivial "hello world" build runs on an actual Android and iOS browser.
4. **Provision VPS (DigitalOcean/Hetzner/Contabo) and cPanel hosting** — install Docker, Docker Compose, Nginx, PostgreSQL, Redis, MinIO
5. **Configure DNS**: A record for `dinanwuye.com` → cPanel IP; A record for `api.dinanwuye.com` → VPS IP
6. **Set up GitHub Actions CI/CD**: Frontend → cPanel (FTP), Backend → VPS (SSH + Docker Compose)
7. Stand up backend base infra on VPS (Postgres, Redis, MinIO, API Gateway) and publish the initial OpenAPI stub.
8. Begin vendor selection conversations for identity verification (confirm browser-camera/web SDK support, and ideally future Cordova-plugin compatibility) and payments.
9. Schedule the Phase 1 Cordova validation spike explicitly on the project plan — don't let it slip to "whenever," since its value is in catching problems early.

---

## 7. Future Phase — Native App Packaging Decision Gate

Not part of the V1 plan or timeline above.

**Proposed review point:** end of Phase 5's first full quarter of production data (roughly month 4–5 post-launch).

**Proposed trigger metrics:**
- Retention (D7/D30) trending toward or ahead of PRD §2 targets
- Revenue/premium conversion validating the business model
- Evidence that push-notification limitations (iOS Safari) or "not a real app" friction are measurably capping growth
- Team capacity available for app-store submission work (this is the main *new* effort — the packaging itself, per architecture.md §9, is expected to be low-effort thanks to the v3.0 architecture choice)

**If triggered:** the work is scoped as "run Cordova, swap the platform-abstraction-layer plugins, add native push, go through store submission" — not a new frontend build. The Phase 1 Cordova spike findings (§2) should be revisited first to confirm nothing has drifted since.

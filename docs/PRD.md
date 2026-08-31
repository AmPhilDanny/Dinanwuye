# Dinanwuye — Product Requirements Document (PRD)

**Tagline candidate:** *"Dinanwuye — Find Your Other Half."*
**Meaning:** "Dinanwuye" is Igbo for "Husband and Wife" — the product is positioned around serious, commitment-oriented matchmaking rather than casual swiping, while still supporting a broad range of relationship intents.

| | |
|---|---|
| Doc owner | Product |
| Status | Execution update — MVP web deployment in progress |
| Last updated | 2026-08-24 |
| Related docs | `architecture.md`, `plan.md` |

> **Strategy (v3.0):** Dinanwuye launches as a **mobile-first web app** built with **Ionic + React (JavaScript)**, deployed as an installable PWA for smartphone browsers. The frontend is deliberately structured as a static single-page app so that, when native iOS/Android apps are greenlit in the future, the **same codebase wraps into Cordova** with minimal rework — no framework swap, no rewrite. Backend remains TypeScript (NestJS) and is unaffected by this frontend decision.

### Delivery Status (2026-08-23)

- [x] Auth, profile, messaging, and matching service endpoints are deployed and health-checked on Render.
- [x] Login was verified end-to-end with a seeded demo account.
- [x] Supabase application schemas and tables are provisioned.
- [x] Static PWA build is deployed.
- [x] Discover and Explore screens are deployed with production API loading and stale-state crash protection.
- [ ] Trust/safety, payments, notifications, API gateway, and full production security hardening are still pending.

### Delivery Update (2026-08-24)

- [x] Core corrective pass completed for OTP signup, matching identifiers, daily like limits, profile privacy, photo intake, production JWT defaults, and Render/Docker configuration.
- [x] Admin operations platform started as a separate root-level `admin-frontend/` app backed by `backend/admin-service`.
- [x] Admin API now has JWT login, active-admin validation, role/permission checks, Prisma-backed application models, and protected management routes.
- [x] Admin dashboard includes authentication, overview metrics, moderation indicators, and member directory integration.
- [ ] Payment service remains the next major implementation: Stripe/Paystack checkout, signed webhooks, subscription persistence, and entitlement checks.
- [ ] Production media should move from local ignored `uploads/` storage to S3-compatible object storage with signed URLs.

**Do not treat the deployed MVP as launch-complete.** The current Render setup is a working validation environment; secrets must remain in Render/Supabase secret storage, and all API/database changes require a deployment and health-check verification. The admin dashboard is an operational foundation, not yet a complete moderation or analytics product.

---

## 1. Vision & Positioning

Dinanwuye is a **mobile-first web app**, built to be trivially portable into native Android/iOS shells later, that uses an AI/ML-driven matching engine to connect people based on compatibility signals that go deeper than photos — values, intent, lifestyle, and behavior. The brand voice leans into cultural pride (Igbo naming, Afro-diaspora-friendly identity fields) while remaining globally usable.

**Design reference:** Evermatch.me's onboarding and home-screen flow (gender picker → auth → multi-step profile builder → swipe/discover → matches → chat) is the functional baseline. Dinanwuye reskins this flow with a **red/white/blue** palette instead of Evermatch's orange/red gradient.

**Why this approach:**
- **Web-first** = faster launch, instant updates, no app-store friction while validating the product.
- **Ionic** = native-feeling mobile UI components and platform-adaptive styling out of the box, which also happens to be the same toolkit that wraps into Cordova — so the "feels like an app" investment isn't thrown away later.
- **Plain JavaScript** (no TypeScript on the frontend) = simpler onboarding for frontend contributors, less build ceremony; backend keeps TypeScript for its own reasons (shared service contracts, larger team surface).
- **Cordova-ready from day one** = when native apps are greenlit, it's a packaging step, not a rewrite.

### Brand Palette (from brief)
- **Red** — primary brand color, CTAs, like/heart actions, premium accents
- **White** — base surface, cards, negative space
- **Blue** — secondary actions, trust/security cues, links, verified badges, info states

Suggested semantic mapping (to be finalized in a design system):
- Primary Red: `#E4172B` (like, primary buttons, brand mark)
- Deep Red (pressed/gradient end): `#B00F1F`
- Primary Blue: `#1B4CE0` (verification, trust, secondary CTA, super-like alt)
- White/Surface: `#FFFFFF`, with neutral grays `#F5F5F7`, `#8A8A8E` for text/borders
- Success/Match: gradient red→blue diagonal for the "It's a Match!" moment (a distinctive, ownable brand gesture)

---

## 2. Goals & Success Metrics

### Business Goals
1. Launch a credible mobile-first web app that proves out matching quality and engagement.
2. Differentiate via matching quality and safety, not swipe volume.
3. Build a monetizable premium tier (subscriptions + à la carte boosts) from day one.
4. Validate demand and retention on web as the gate for greenlighting native app packaging (see §11) — which, per the new architecture, should be a **low-cost, low-risk step** rather than a major re-investment.

### North Star Metric
**Weekly Matches-to-Conversations Rate** (matches that result in ≥3 message exchanges within 48h).

### Supporting KPIs
| Metric | Target (post-launch, 90 days) |
|---|---|
| D1 / D7 / D30 retention (web) | 35% / 18% / 9% |
| Mobile web session share | ≥ 85% of sessions from a smartphone browser |
| "Add to Home Screen" (PWA install) rate | ≥ 15% of returning users |
| Profile completion rate | ≥ 70% reach 100% profile |
| Median time-to-first-match | < 24 hours |
| Match → conversation conversion | ≥ 35% |
| Reported-content resolution time (safety) | < 24h for high-severity |
| Premium conversion rate | 4–6% of MAU |
| False-positive bot/fake account rate | < 1% of active profiles |

---

## 3. Target Users & Personas

1. **Chinelo, 29, Lagos** — professional, wants a serious relationship leading to marriage, values shared cultural/religious background. Browses on her phone during commute/breaks — a fast-loading web app matters more than a native install.
2. **David, 34, London (diaspora)** — Nigerian diaspora professional, values verified/authentic profiles. Comfortable with either web or app; will use whichever is fastest to get into now, and would use a native app happily once it exists.
3. **Amara, 24, Abuja** — younger user, data-conscious (limited mobile data plans) — a lightweight web app that doesn't require an install is an advantage.
4. **Tunde, 38, Houston** — will judge Dinanwuye against native-app competitors; the Ionic-based UI needs to feel close to native, not like a generic website, even before a real native app exists.

---

## 4. Scope

### 4.1 In Scope (V1 / MVP — Web App, Mobile-First, Cordova-Ready)
- Mobile-first responsive web app built with **Ionic + React (JavaScript)**, installable as a PWA
- Account creation & authentication (email, phone/OTP, Google, Apple sign-in via web OAuth)
- Identity verification (selfie liveness check vs. profile photo, via browser camera)
- Guided multi-step onboarding (gender, orientation, seeking, birthdate, location, photos, bio, interests, ethnicity, religion, relationship intent, lifestyle questions) — mirrors the 16-step reference pattern
- Discover/swipe deck (like, pass, super-like) using Ionic's gesture components
- AI/ML match scoring feeding deck ranking
- Mutual match → chat unlock
- Real-time messaging (text, image, read receipts, typing indicators) over WebSocket
- Web push notifications where supported, with email/SMS fallback
- Profile editing, photo management, profile completion meter
- Reporting, blocking, muting
- Premium subscription tier via web billing
- Settings: privacy controls, notification preferences, account deletion/data export
- Basic content moderation pipeline (image + text)
- **Build output structured for Cordova packaging** — no server-side rendering, no server-only APIs baked into the client bundle, all data access via the existing REST/WebSocket API (see architecture.md §3)

### 4.2 Deferred to Future Phase (see §11)
- Actually packaging and shipping the Cordova iOS/Android builds to the App Store/Play Store (the *architecture* is ready for this at V1; the *packaging and store submission work* is not scheduled until triggered — see `plan.md` §7)
- Video chat / voice notes in-app
- Events / group meetups
- AI-generated icebreakers or profile photo enhancement
- Multi-language localization beyond English
- Advanced gamification (streaks, badges)

---

## 5. Functional Requirements

*(Unchanged in substance from v2.0 — restated briefly; full detail in prior drafts if needed.)*

### 5.1 Onboarding & Profile
- FR-1 to FR-7: gender/seeking selection, phone/email + OTP signup, Google/Apple sign-in, 18+ age gate, multi-step profile wizard, profile completion meter, browser-camera selfie verification with manual-upload fallback.

### 5.2 Discovery & Matching
- FR-8 to FR-13: Ionic gesture-based swipe deck (like/pass/super-like), ML-ranked deck order, standard + premium filters, mutual-match screen, daily like limits, "who liked you" premium feature.

### 5.3 Messaging
- FR-14 to FR-19: real-time WebSocket chat, read receipts/typing indicators, unmatch/block, in-chat reporting, message-request expiry, web push with email/SMS fallback for critical events.

### 5.4 Trust & Safety
- FR-20 to FR-25: photo/text moderation pipeline, panic/report button, admin moderation dashboard, fake-account/bot detection, "share my date" safety feature.

### 5.5 Monetization
- FR-26 to FR-28: Stripe + Paystack web billing, boosts/super-like bundles, no dark-pattern paywalls.

### 5.6 Notifications & Settings
- FR-29 to FR-31: notification preference center, privacy settings (online status, distance visibility, incognito mode), account deletion/data export.

### 5.7 Mobile-First & Cordova-Readiness Requirements
- FR-32: Every screen designed and tested first at smartphone viewport widths (~360–430px).
- FR-33: Touch targets, gesture handling, and one-handed usability are primary UX requirements.
- FR-34: App shell installable to home screen (PWA manifest, service worker).
- FR-35: Performance budget tuned for mid/low-tier Android devices and variable mobile data.
- FR-36: **No architectural dependency on a server-rendering step or server-only routing at the client layer** — the client must be buildable as a fully static bundle at any time, so that pointing Cordova at the build output requires no client-code changes (see architecture.md §3 and §9).
- FR-37: Native device capabilities the app currently accesses via browser APIs (camera, geolocation, push) should be implemented behind a thin abstraction so that swapping the browser API for a Cordova plugin later (e.g., `getUserMedia` → Cordova Camera plugin) touches one integration point, not scattered call sites.

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Availability** | 99.9% uptime target for core API (match, auth, chat) |
| **Performance** | Discover deck load < 500ms p95 on a mid-tier Android device over 4G; message delivery < 300ms p95; Largest Contentful Paint < 2.5s on 4G |
| **Scalability** | Backend supports scaling from 10K → 5M MAU without re-platforming |
| **Security** | See §7 — top-notch, non-negotiable |
| **Privacy/Compliance** | GDPR, NDPR (Nigeria Data Protection Act), CCPA-aware design |
| **Accessibility** | WCAG 2.1 AA target |
| **Cross-browser support** | Mobile Safari (iOS), Chrome (Android/desktop), Samsung Internet, desktop browsers as secondary |
| **Portability** | Client bundle must remain Cordova-packageable at all times — enforced as an architectural constraint, not a one-time check (see architecture.md §9) |

---

## 7. Trust, Safety & Security Requirements (Top-Line)

Unchanged in substance — full technical design in `architecture.md` §7:
- Mandatory 18+ age gate with verification step.
- Selfie-based identity/liveness verification.
- Encrypted chat message content in transit and at rest.
- Approximate-only location exposure to other users.
- Photo verification badge system.
- Robust bilateral blocking.
- Defined SLAs for report resolution.
- Tokenized payment processing (Stripe/Paystack) — no card data touches Dinanwuye servers.
- Full audit logging for admin actions.
- Web session security (secure cookies, CSRF protection, CSP) since there's no OS app sandbox yet.

---

## 8. AI/ML Matching Requirements

Unchanged — entirely server-side and platform-independent:
- MR-1 to MR-7: hard-filter + learned compatibility ranking, cold-start content-based fallback, hard safety-exclusion veto, bias mitigation, feedback-loop retraining, lightweight explainability.

Full detail in `architecture.md` §5.

---

## 9. Key User Flows (Summary)

1. **Onboarding (mobile web):** Landing → Gender/Seeking → Auth → OTP → Profile wizard (Ionic components, one field/step per screen) → Selfie verification → Discover home → "Add to Home Screen" prompt.
2. **Discovery:** Discover deck (Ionic gesture-based swipe) → mutual match → Match screen → Chat.
3. **Chat:** Match list → thread → send message/photo → report/block inline.
4. **Premium upsell:** Contextual paywall → plan picker → web checkout (Stripe/Paystack) → unlock.
5. **Safety:** Any screen → report → category → optional block → confirmation → T&S queue.

---

## 10. Assumptions & Open Questions

**Assumptions**
- Ionic + React (JavaScript) gives sufficiently native-feeling UX to compete with native-app expectations for V1.
- Backend stays TypeScript regardless of the frontend language decision — this is a frontend-only choice.
- "Cordova-ready" means the architecture and build process support packaging at any time; it does not mean Cordova builds ship at V1.

**Open Questions**
- What's the trigger/threshold for actually building and submitting the Cordova iOS/Android packages to app stores (see `plan.md` §7)?
- Given inconsistent iOS Safari web-push support, is an SMS/email fallback acceptable for iOS users at launch, or does this pull the Cordova iOS build forward?
- Should runtime validation (e.g., a lightweight schema-check library) be added on the JS frontend to compensate for the lack of compile-time type safety against the TypeScript backend's API contracts?

---

## 11. Future Scope — Native App Packaging (Cordova)

Because the frontend is built Ionic + React with no server-rendering dependency (FR-36) and native-capability access is abstracted (FR-37), packaging native apps later is expected to be **substantially lower-effort** than a from-scratch native build:

- **Trigger:** defined in `plan.md` §7 — proposed as a metrics-gated review after the web app's first full quarter of production data.
- **What changes at that point:** run the existing Ionic build through Cordova's Android/iOS platform tooling, swap browser-API device access (camera, push, geolocation) for the corresponding Cordova plugins behind the existing abstraction layer, then go through app-store submission review (which is new work regardless of frontend architecture).
- **What does NOT change:** the backend, the ML matching system, the data model, the design system, or the bulk of the UI component code — these were already shared/reusable across web and any future native shell by design.

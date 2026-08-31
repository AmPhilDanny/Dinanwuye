# Dinanwuye — Agent Working Reference

**Project:** Dinanwuye — Mobile-First Matchmaking Web App (Ionic + React + Vite, Cordova-ready)
**Stack:** Frontend: Ionic + React (JavaScript) + Vite | Backend: NestJS/TypeScript + Python/FastAPI (ML)
**Strategy:** Web-first PWA → Cordova packaging later (no rewrite)
**Brand:** Red (`#E4172B`), White, Blue (`#1B4CE0`) — "Dinanwuye" = Igbo for "Husband and Wife"

---

## 🎯 Universal Agent Instructions

### 1. Background Agents — Cost & Size Rules
- **NO expensive background agents** (Oracle, Metis, Momus, deep, ultrabrain) unless explicitly authorized
- **Background tasks must be SMALL** — single focused query, not multi-step investigations
- **Default to `explore` or `librarian`** for codebase/external searches (cheap, fast)
- **Parallelize** — fire 2-5 small explore/librarian tasks simultaneously
- **Wait for completion notification** before collecting results — never poll `background_output`

### 2. Delegation Protocol
- **Decompose everything** into atomic, independent units
- **Delegate each unit** to appropriate category agent in parallel
- **Never implement directly** when delegation is possible
- **Every delegation prompt MUST include:**
  - TASK: Atomic goal
  - EXPECTED OUTCOME: Concrete deliverable + success criteria
  - REQUIRED TOOLS: Explicit whitelist
  - MUST DO: Exhaustive requirements
  - MUST NOT DO: Forbidden actions
  - CONTEXT: File paths, patterns, constraints

### 3. Implementation Standards
- **TypeScript on backend only** — frontend is plain JavaScript
- **Runtime validation** via Zod on frontend against OpenAPI spec
- **Mobile-first** — design/build at 360-430px viewport first
- **Cordova-ready constraint** — no SSR, no server-only APIs in client bundle
- **Platform abstraction layer** for device APIs (`capturePhoto()`, `getLocation()`, push)

### 4. Quality Gates
- `lsp_diagnostics` clean on changed files
- Build passes (`vite build` / `npm run build`)
- Tests pass (if applicable)
- No `as any`, `@ts-ignore` suppressions

### 5. Communication Style
- Concise, no fluff, no status updates
- Start work immediately — use todos for tracking
- Challenge flawed designs concisely with alternatives
- Match user's terseness

---

## 📁 Project Structure (Target)

```
Dinanwuyeapp/
├── frontend/                 # Ionic + React + Vite (JavaScript)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components (routing targets)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── platform/         # Device capability abstraction layer
│   │   ├── services/         # API clients, TanStack Query hooks
│   │   ├── store/            # Zustand stores
│   │   ├── styles/           # CSS variables, global styles
│   │   ├── utils/            # Helpers, Zod schemas
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── capacitor.config.json  # For future Cordova/Capacitor
│   └── package.json
├── backend/                   # NestJS/TypeScript services (separate repo in practice)
│   ├── auth-service/
│   ├── profile-service/
│   ├── matching-service/      # Python/FastAPI
│   ├── messaging-service/
│   ├── trust-safety-service/
│   ├── notification-service/
│   ├── payment-service/
│   └── api-gateway/
├── docs/
│   ├── PRD.md
│   ├── architecture.md
│   ├── plan.md
│   └── AGENTS.md (this file)
└── .opencode/                 # Opencode config
```

---

## 🔄 Phase Tracking

Each phase gets a `task.md` file in `.opencode/plans/` with:
- Phase goal & exit criteria
- Atomic task breakdown
- Completed checkboxes
- Evidence links (diagnostics, build output, test results)

**Current Phase:** Phase 1 — Core MVP build and deployment hardening

---

## 🚫 Anti-Patterns (Enforced)

| Pattern | Violation |
|---------|-----------|
| Large background tasks | Use small, parallel explore/librarian instead |
| Oracle/Metis/Momus without approval | Cost money — require explicit authorization |
| Implementing instead of delegating | Decompose + delegate every non-trivial task |
| TypeScript on frontend | Plain JavaScript only — Zod for runtime validation |
| SSR/Next.js patterns | Static SPA only — Cordova constraint |
| Skipping todos on multi-step work | Todos mandatory for 2+ step tasks |
| Batch-completing todos | Mark `completed` immediately after each step |

---

## 📋 Reference Documents

- **PRD.md** — Product requirements, user flows, KPIs
- **architecture.md** — Technical architecture, data model, security, Cordova path
- **plan.md** — 5-phase roadmap, team composition, milestones
- **AGENTS.md** — This file (agent working conventions)

---

## ✅ Verified Progress (2026-08-23)

- [x] Frontend PWA deployed at `https://dinanwuye.onrender.com`.
- [x] Auth, profile, messaging, and matching services deployed and health-checked.
- [x] Supabase project verified healthy with 11 application tables.
- [x] Cordova Android packaging spike passed; see `cordova-spike.md`.
- [x] Discover and Explore pages load matching data and tolerate incomplete persisted state.

## Phase 0 Exit Criteria (from plan.md)

- [ ] Design system v1 published (CSS variables for red/white/blue tokens, typography, "It's a Match!" gradient)
- [ ] Ionic + React (JS) + Vite project builds and runs on real smartphone browser
- [ ] Infra reachable in dev/staging/prod (Postgres, Redis, S3, API Gateway skeleton)
- [ ] OpenAPI spec stub published for API contract
- [ ] Legal/compliance kickoff (privacy policy, ToS, cookie consent, NDPR/GDPR)
- [ ] Vendors selected: identity verification (browser-camera SDK), payments (Stripe + Paystack), moderation APIs

## Critical Change-Safety Notes

- Keep frontend production URLs pointed at the Render services; never allow a deployed build to fall back to `localhost`.
- Render Node services run from the `backend` root and must bind to `$PORT`.
- Generate Prisma Client before each service build.
- Use Supabase's regional pooler URL with `sslmode=require`; the direct database hostname may be unreachable from Render.
- Keep application tables in the dedicated `dinanwuye_*` schemas. Supabase's `auth` schema is reserved.
- Never commit database passwords, service keys, access tokens, or JWT secrets.
- Treat persisted browser state as untrusted and keep render paths safe when fields are missing or malformed.

---

*All agents working on Dinanwuye MUST follow these conventions. Deviation requires explicit user approval.*
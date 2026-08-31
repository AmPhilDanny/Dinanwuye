# Environment Variables Map
# =========================
# Last Updated: 2026-08-30

## Overview
This document maps all environment variables across services and identifies
which ones are shared vs service-specific for consolidation.

---

## Render.yaml Environment Variables

### Main App (Frontend)
| Variable | Value | Notes |
|----------|-------|-------|
| NODE_ENV | production | |
| VITE_API_URL | https://dinanwuye-back.onrender.com | Auth API URL |
| VITE_AUTH_URL | https://dinanwuye-back.onrender.com/api/v1 | Auth endpoints |
| VITE_PROFILE_URL | https://dinanwuye-profile.onrender.com/api/v1 | Profile endpoints |
| VITE_MESSAGING_URL | https://dinanwuye-messaging.onrender.com/api/v1 | Messaging endpoints |
| VITE_MATCHING_URL | https://dinanwuye-matching.onrender.com/api/v1 | Matching endpoints |
| VITE_SUPABASE_URL | https://ysvqvrskwyyjbeepbyuc.supabase.co | Supabase project |
| VITE_SUPABASE_ANON_KEY | (sync: false) | Supabase anon key |

### Auth Service (dinanwuye-back)
| Variable | Value | Notes |
|----------|-------|-------|
| NODE_ENV | production | |
| DATABASE_URL | (sync: false) | PostgreSQL connection |
| JWT_SECRET | (sync: false) | Access token secret |
| JWT_REFRESH_SECRET | (sync: false) | Refresh token secret |
| JWT_EXPIRES_IN | 15m | |
| JWT_REFRESH_EXPIRES_IN | 7d | |
| OTP_SECRET | (sync: false) | OTP signing secret |
| SUPABASE_URL | https://ysvqvrskwyyjbeepbyuc.supabase.co | |
| SUPABASE_SERVICE_KEY | (sync: false) | Supabase service role key |
| SUPABASE_ANON_KEY | (sync: false) | Supabase anon key |
| CORS_ORIGIN | https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com | |

### Profile Service (dinanwuye-profile)
| Variable | Value | Notes |
|----------|-------|-------|
| NODE_ENV | production | |
| DATABASE_URL | (sync: false) | Same DB as auth |
| JWT_SECRET | (sync: false) | Same as auth |
| JWT_REFRESH_SECRET | (sync: false) | Same as auth |
| CORS_ORIGIN | https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com | |

### Messaging Service (dinanwuye-messaging)
| Variable | Value | Notes |
|----------|-------|-------|
| NODE_ENV | production | |
| DATABASE_URL | (sync: false) | Same DB as auth |
| JWT_SECRET | (sync: false) | Same as auth |
| JWT_REFRESH_SECRET | (sync: false) | Same as auth |
| CORS_ORIGIN | https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com | |

### Matching Service (dinanwuye-matching)
| Variable | Value | Notes |
|----------|-------|-------|
| ENVIRONMENT | production | Note: Different var name |
| DATABASE_URL | (sync: false) | Same DB |
| REDIS_URL | (sync: false) | Redis connection |
| JWT_SECRET_KEY | (sync: false) | Note: Different var name |
| PROFILE_SERVICE_URL | https://dinanwuye-profile.onrender.com | Internal service URL |
| MESSAGING_SERVICE_URL | https://dinanwuye-messaging.onrender.com | Internal service URL |

### Admin API (dinanwuye-admin-api)
| Variable | Value | Notes |
|----------|-------|-------|
| NODE_ENV | production | |
| DATABASE_URL | (sync: false) | Same DB |
| JWT_SECRET | (sync: false) | Same as auth |
| JWT_REFRESH_SECRET | (sync: false) | Same as auth |
| CORS_ORIGIN | https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com | |

### Admin App (Frontend)
| Variable | Value | Notes |
|----------|-------|-------|
| NODE_ENV | production | |
| VITE_ADMIN_API_URL | https://dinanwuye-admin-api.onrender.com/api/v1/admin | Admin API URL |

---

## Consolidated Environment Variables

### Shared Variables (Used by All Services)
| Variable | Source | Notes |
|----------|--------|-------|
| NODE_ENV | All | production |
| DATABASE_URL | All | PostgreSQL connection |
| JWT_SECRET | Auth, Profile, Messaging, Admin | Access token secret |
| JWT_REFRESH_SECRET | Auth, Profile, Messaging, Admin | Refresh token secret |
| CORS_ORIGIN | All Node.js services | Allowed origins |

### Service-Specific Variables (Consolidated App)
| Variable | Service | Notes |
|----------|---------|-------|
| JWT_EXPIRES_IN | Auth | 15m |
| JWT_REFRESH_EXPIRES_IN | Auth | 7d |
| OTP_SECRET | Auth | OTP signing secret |
| SUPABASE_URL | Auth | Supabase project URL |
| SUPABASE_SERVICE_KEY | Auth | Supabase service role key |
| SUPABASE_ANON_KEY | Auth | Supabase anon key |
| REDIS_URL | Matching, Messaging | Redis connection |
| SMTP_HOST | Notification | SMTP server |
| SMTP_PORT | Notification | SMTP port |
| SMTP_USER | Notification | SMTP username |
| SMTP_PASS | Notification | SMTP password |
| SMTP_FROM | Notification | Sender email |
| VAPID_PUBLIC_KEY | Notification | Web push public key |
| VAPID_PRIVATE_KEY | Notification | Web push private key |
| VAPID_SUBJECT | Notification | Push notification subject |
| STRIPE_SECRET_KEY | Payment | Stripe API key |
| STRIPE_WEBHOOK_SECRET | Payment | Stripe webhook secret |
| PAYSTACK_SECRET_KEY | Payment | Paystack API key |
| PAYSTACK_WEBHOOK_SECRET | Payment | Paystack webhook secret |
| MODERATION_IMAGE_API_KEY | Trust & Safety | Image moderation API |
| MODERATION_TEXT_API_KEY | Trust & Safety | Text moderation API |
| IDENTITY_VERIFICATION_API_KEY | Trust & Safety | Identity verification API |

### Matching Service (Stays Separate)
| Variable | Notes |
|----------|-------|
| ENVIRONMENT | production |
| DATABASE_URL | Same DB |
| REDIS_URL | Redis connection |
| JWT_SECRET_KEY | JWT verification (note: different var name) |
| PROFILE_SERVICE_URL | Internal service URL (will change to consolidated) |
| MESSAGING_SERVICE_URL | Internal service URL (will change to consolidated) |

---

## Consolidation Actions

### 1. Create Consolidated .env.example
```bash
# ---------- App ----------
NODE_ENV=production
PORT=3000

# ---------- Database ----------
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# ---------- JWT / Auth ----------
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
OTP_SECRET=your-otp-secret

# ---------- Supabase ----------
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
SUPABASE_ANON_KEY=your-anon-key

# ---------- CORS ----------
CORS_ORIGIN=https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com

# ---------- SMTP (Notification) ----------
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SMTP_FROM="Dinanwuye <no-reply@dinanwuye.com>"

# ---------- Web Push (Notification) ----------
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:admin@dinanwuye.com

# ---------- Payments ----------
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_WEBHOOK_SECRET=xxx

# ---------- Trust & Safety ----------
MODERATION_IMAGE_API_KEY=your-key
MODERATION_TEXT_API_KEY=your-key
IDENTITY_VERIFICATION_API_KEY=your-key
```

### 2. Update Matching Service URLs
After consolidation, update matching service:
- `PROFILE_SERVICE_URL` → `https://dinanwuye-api.onrender.com`
- `MESSAGING_SERVICE_URL` → `https://dinanwuye-api.onrender.com`

### 3. Update Frontend URLs
**Main App:**
- `VITE_API_URL` → `https://dinanwuye-api.onrender.com`
- `VITE_AUTH_URL` → `https://dinanwuye-api.onrender.com/api/v1`
- `VITE_PROFILE_URL` → `https://dinanwuye-api.onrender.com/api/v1`
- `VITE_MESSAGING_URL` → `https://dinanwuye-api.onrender.com/api/v1`

**Admin App:**
- `VITE_ADMIN_API_URL` → `https://dinanwuye-api.onrender.com/api/v1/admin`

---

## Render.yaml Changes

### Remove Services
- `dinanwuye-back` (Auth API)
- `dinanwuye-profile` (Profile API)
- `dinanwuye-messaging` (Messaging API)
- `dinanwuye-admin-api` (Admin API)

### Add Service
```yaml
- type: web
  name: dinanwuye-api
  rootDir: backend/consolidated-app
  env: node
  plan: free
  buildCommand: pnpm install --frozen-lockfile --prod=false && pnpm prisma generate && pnpm build
  startCommand: pnpm prisma db push --skip-generate && pnpm start:prod
  envVars:
    - key: NODE_ENV
      value: production
    - key: PORT
      value: 3000
    - key: DATABASE_URL
      sync: false
    - key: JWT_SECRET
      sync: false
    - key: JWT_REFRESH_SECRET
      sync: false
    # ... all other env vars
  healthCheckPath: "/api/v1/health"
  healthCheckTimeout: 5
```

### Keep Service
```yaml
- type: web
  name: dinanwuye-matching
  # ... existing config, but update service URLs
```

---

## Summary

| Category | Count | Notes |
|----------|-------|-------|
| Shared Variables | 5 | Used by all/most services |
| Auth-Specific | 6 | JWT, OTP, Supabase |
| Notification-Specific | 7 | SMTP, VAPID |
| Payment-Specific | 4 | Stripe, Paystack |
| Trust & Safety-Specific | 3 | Moderation APIs |
| **Total Unique Variables** | **25** | All consolidated into 1 .env |

# Render Manual Setup Guide (Free Tier)

## Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Fill in:
   - **Name:** `dinanwuye-db`
   - **Database:** `dinanwuye`
   - **User:** `dinanwuye_user`
   - **Region:** Oregon (US West) or closest to your users
   - **PostgreSQL Version:** 16
   - **Plan:** Free
4. Click **Create Database**
5. **Copy the Internal Database URL** (looks like `postgresql://user:pass@host:5432/dinanwuye`)
   - You'll need this later as `DATABASE_URL`

## Step 2: Create Redis Instance

1. Click **New +** → **Redis**
2. Fill in:
   - **Name:** `dinanwuye-redis`
   - **Region:** Oregon (US West)
   - **Plan:** Free
3. Click **Create Redis**
4. **Copy the Internal Redis URL** (looks like `rediss://red-xxxxx@us1-xxxxx.upstash.io:6379`)
   - You'll need this later as `REDIS_URL`

## Step 3: Create Web Service

1. Click **New +** → **Web Service**
2. Connect GitHub repository:
   - Click **Configure account** if needed
   - Select `AmPhilDanny/Dinanwuye` repository
3. Fill in:
   - **Name:** `dinanwuye-api`
   - **Region:** Oregon (US West)
   - **Branch:** `feat/consolidate-backend`
   - **Runtime:** Node
   - **Build Command:**
     ```
     cd backend/consolidated-app && npm install && npx prisma generate
     ```
   - **Start Command:**
     ```
     cd backend/consolidated-app && node dist/main.js
     ```
   - **Plan:** Free

4. **Add Environment Variables** (click "Add Environment Variable" for each):

   **From Render (auto-linked):**
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `${dinanwuye-db.DATABASE_URL}` |
   | `REDIS_URL` | `${dinanwuye-redis.REDIS_URL}` |

   **Required (copy from your .env or set manually):**
   | Key | Value |
   |-----|-------|
   | `JWT_SECRET` | *(generate random 32-char string)* |
   | `JWT_REFRESH_SECRET` | *(generate random 32-char string)* |
   | `SUPABASE_URL` | `https://your-project.supabase.co` |
   | `SUPABASE_SERVICE_KEY` | `eyJ...` |
   | `SUPABASE_ANON_KEY` | `eyJ...` |
   | `SMTP_HOST` | `smtp.example.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | `your@email.com` |
   | `SMTP_PASS` | `xxx` |
   | `VAPID_PUBLIC_KEY` | `BP...` |
   | `VAPID_PRIVATE_KEY` | `xxx` |
   | `VAPID_SUBJECT` | `mailto:admin@dinanwuye.com` |
   | `STRIPE_SECRET_KEY` | `sk_test_xxx` |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_xxx` |
   | `PAYSTACK_SECRET_KEY` | `sk_xxx` |
   | `PAYSTACK_WEBHOOK_SECRET` | `xxx` |
   | `CORS_ORIGIN` | `https://dinanwuye.onrender.com,https://dinanwuye-admin.onrender.com` |
   | `NODE_ENV` | `production` |

5. Click **Create Web Service**

## Step 4: Wait for Deploy

- First deploy takes 5-10 minutes
- Watch the deploy logs for errors
- If build fails, check the build logs

## Step 5: Run Database Migrations

After deploy succeeds:

1. Go to `dinanwuye-api` → **Shell** tab
2. Run:
   ```bash
   cd backend/consolidated-app
   npx prisma migrate deploy
   ```

## Step 6: Verify Deployment

```bash
# Health check
curl https://dinanwuye-api.onrender.com/api/v1/health

# Swagger docs (if enabled)
open https://dinanwuye-api.onrender.com/docs
```

## Step 7: Update Frontend

Update `frontend/src/services/api.js`:
```javascript
// OLD: Multiple service URLs
// NEW: Single consolidated API
const API_BASE = 'https://dinanwuye-api.onrender.com/api/v1';
```

## Troubleshooting

### "Port scanned timed out"
- Free tier sleeps after 15 min inactivity
- First request takes 30-60 seconds to wake up
- Set `NODE_ENV=production` to enable faster cold starts

### "Module not found"
- Build command might be wrong
- Check that `prisma generate` runs during build

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running in Render dashboard

### "WebSocket not connecting"
- Free tier doesn't support WebSocket upgrades
- Consider using Socket.io with polling fallback

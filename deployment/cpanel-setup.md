# Dinanwuye — cPanel Provisioning Guide + DNS Setup (LyteHosting)

**Scope:** Frontend (static SPA) hosting on LyteHosting cPanel shared hosting; DNS wiring between cPanel (frontend) and VPS (backend).
**Reference:** `architecture.md` §10 (hybrid deployment), `frontend/public/.htaccess`.

---

## 1. Purchase cPanel Shared Hosting

1. Purchase a **cPanel Shared Hosting** plan from LyteHosting (any plan that includes a domain or addon domains).
2. LyteHosting will email you cPanel credentials (URL, username, password) after provisioning.
3. Optional: register `dinanwuye.com` through LyteHosting or bring your own domain (see §3 DNS).

---

## 2. cPanel Setup (one-time)

Login to cPanel (typically `https://<server>:2083`).

### 2.1 Add the Domain

- **Domains → Create a New Domain**
- Add `dinanwuye.com` (and `www.dinanwuye.com`).
- Document root: `public_html` (the default). The FTP deploy in CI uploads to `public_html/`.

### 2.2 SSL (AutoSSL)

- **SSL/TLS Status** → should show AutoSSL issued for `dinanwuye.com` within ~1 hour.
- If AutoSSL hasn't issued: **Security → SSL/TLS Status → Run AutoSSL** (or ask LyteHosting support).
- Verify: `https://dinanwuye.com` shows a valid lock icon (no mixed-content warnings).

> HSTS: after SSL is confirmed working, uncomment the `Strict-Transport-Security` header in `frontend/public/.htaccess` and redeploy.

### 2.3 FTP Account (for CI/CD)

The FTP deploy workflow needs dedicated credentials (don't use the main cPanel login):

- **Files → FTP Accounts**
- Create: `deploy@dinanwuye.com` (or `dinanwuye_deploy`).
- **Directory:** `/public_html` (root of the SPA).
- Quota: e.g. 2 GB.
- Record: FTP host (`ftp.dinanwuye.com` or the server hostname), username, password.

> These three values become GitHub secrets: `CPANEL_FTP_HOST`, `CPANEL_FTP_USER`, `CPANEL_FTP_PASS` (see `deployment/github-secrets.md`).

### 2.4 PHP Version (not used, but keep modern)

The frontend is a static SPA — no PHP needed. If cPanel forces PHP on the account, set it to the latest (e.g., 8.3) in **Software → Select PHP Version** to avoid old-version warnings.

### 2.5 Verify SPA Routing

After first deploy (see §5), verify client-side routes work:
- Visit `https://dinanwuye.com/` → landing page loads.
- Visit `https://dinanwuye.com/discover` directly (hard refresh) → should still load the app (thanks to `.htaccess` rewrite).
- Reload on `/profile`, `/matches`, `/chat` — all must return the SPA, not 404.

---

## 3. DNS Setup

Goal:
- `dinanwuye.com` + `www.dinanwuye.com` → **cPanel IP** (frontend)
- `api.dinanwuye.com` → **VPS IP** (backend)

Where DNS is managed depends on where the domain is registered / how LyteHosting provisions nameservers.

### Option A — DNS managed by LyteHosting (cPanel)

If the domain is registered through LyteHosting (or nameservers point to LyteHosting):

1. cPanel → **Domains → Zone Editor**
2. Ensure:
   | Name | Type | TTL | Value |
   |------|------|-----|-------|
   | `dinanwuye.com` | A | 3600 | `<cPanel server IP>` |
   | `www.dinanwuye.com` | CNAME | 3600 | `dinanwuye.com` |
   | `api.dinanwuye.com` | A | 3600 | `<VPS IP>` |
   | `ftp.dinanwuye.com` | CNAME | 3600 | `dinanwuye.com` (if using cPanel FTP hostname) |
3. Save each record.

### Option B — DNS at third-party registrar

If nameservers point elsewhere (e.g., Cloudflare, Namecheap):

1. Login to the registrar/Cloudflare DNS dashboard.
2. Create the same records above (A for apex + api, CNAME for www).
3. **If using Cloudflare:** set `api.dinanwuye.com` to **DNS only (grey cloud)** — NOT proxied — so the VPS IP isn't hidden/rewritten for API traffic, WebSockets, and Let's Encrypt validation. `dinanwuye.com` can be proxied (orange cloud).

### Verification

```bash
# From any machine:
nslookup dinanwuye.com        # → cPanel IP
nslookup api.dinanwuye.com    # → VPS IP
```

---

## 4. First Deploy (manual) — before CI is wired

1. Build locally:
   ```bash
   cd frontend
   pnpm install
   pnpm run build
   ```
2. Upload `frontend/dist/*` **including hidden files** (`.htaccess`!) to `public_html/` via:
   - **cPanel File Manager** (Files → File Manager → public_html), or
   - FTP client (FileZilla/WinSCP) with the deploy FTP account from §2.3.
3. Verify §2.5 routing checks.

> ⚠️ The `.htaccess` lives in `frontend/public/.htaccess` and gets copied into `dist/` by Vite during build — confirm `dist/.htaccess` exists before upload. CI's FTP deploy uploads everything under `dist/` including it.

---

## 5. CI/CD (automated deploys)

Pushes to `main` with `frontend/**` changes trigger `.github/workflows/frontend-deploy.yml`:

1. `pnpm install --frozen-lockfile`
2. `pnpm run lint` + `pnpm run typecheck` (if those scripts exist — add to `frontend/package.json` if missing)
3. `pnpm run build` with `VITE_API_BASE_URL=https://api.dinanwuye.com/api/v1` and `VITE_VAPID_PUBLIC_KEY`
4. FTP upload `dist/` → `public_html/` via `SamKirkland/FTP-Deploy-Action`

**First run** requires GitHub secrets (§ `deployment/github-secrets.md`) — without them the job fails at the deploy step.

---

## 6. Maintenance & Troubleshooting

| Symptom | Fix |
|---------|-----|
| SPA routes 404 on hard refresh | Ensure `dist/.htaccess` was uploaded (FTP deploy includes hidden files) |
| Mixed content warnings (http:// assets) | AutoSSL issued? Re-upload build; force `https://` URLs in code/config |
| `https://dinanwuye.com` blank page | Check browser console → likely API CORS: confirm nginx CORS allows `https://dinanwuye.com` |
| API calls fail with `net::ERR_CERT_*` | SSL on `api.dinanwuye.com` (VPS) not yet issued — see `deployment/vps-provisioning.md` §8 |
| FTP deploy "permission denied" | Verify FTP account directory is exactly `public_html` and quota isn't full |
| DNS change slow | TTL 3600 → changes propagate within ~1h; flush local DNS (`ipconfig /flushdns`) |

---

## 7. Verification Checklist

- [ ] `https://dinanwuye.com` loads landing page (SSL valid)
- [ ] `https://dinanwuye.com/discover` hard-refresh loads SPA (not 404)
- [ ] `https://api.dinanwuye.com/health` returns 200 from any browser
- [ ] `nslookup dinanwuye.com` → cPanel IP; `nslookup api.dinanwuye.com` → VPS IP
- [ ] FTP credentials work (test with FileZilla once)
- [ ] GitHub Actions frontend deploy run passes end-to-end

---

*Created 2026-08-17 · Part of Phase 0 — Core Infrastructure (cPanel + DNS).*
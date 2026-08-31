# Dinanwuye — GitHub Secrets Configuration

Secrets for CI/CD workflows. Configure at: **GitHub repo → Settings → Secrets and variables → Actions → New repository secret**.

---

## Required Secrets

| Secret | Description | Where to get it | Used by |
|--------|-------------|-----------------|---------|
| `CPANEL_FTP_HOST` | cPanel FTP hostname (e.g. `ftp.dinanwuye.com` or server hostname) | cPanel → FTP Accounts | `frontend-deploy.yml` |
| `CPANEL_FTP_USER` | FTP username (e.g. `deploy@dinanwuye.com`) | cPanel → FTP Accounts (§2.3 of `cpanel-setup.md`) | `frontend-deploy.yml` |
| `CPANEL_FTP_PASS` | FTP password | cPanel → FTP Accounts | `frontend-deploy.yml` |
| `VPS_HOST` | VPS IP or hostname | LyteHosting panel | `backend-deploy.yml` |
| `VPS_USER` | SSH user on VPS (e.g. `deploy`) | `deployment/vps-provisioning.md` §2 | `backend-deploy.yml` |
| `VPS_PORT` | SSH port (default `22`) | — | `backend-deploy.yml` |
| `VPS_SSH_KEY` | **Private** SSH key (contents, incl. `BEGIN OPENSSH PRIVATE KEY` lines) | `$env:USERPROFILE\.ssh\dinanwuye_vps` | `backend-deploy.yml` |
| `VAPID_PUBLIC_KEY` | Web Push public key | `npx web-push generate-vapid-keys` | `frontend-deploy.yml` (build-time) + backend `.env` |

> **⚠️ Security:** `VPS_SSH_KEY` is the private key. Never commit it. The matching public key lives in `/home/deploy/.ssh/authorized_keys` on the VPS.

---

## Optional / When Vendors Are Selected

| Secret | Description | Used by |
|--------|-------------|---------|
| `STRIPE_SECRET_KEY` | Stripe secret key (sk_live_*) | backend `.env` (manual, via SSH) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | backend `.env` |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | backend `.env` |
| `PAYSTACK_WEBHOOK_SECRET` | Paystack webhook signing secret | backend `.env` |
| `SLACK_WEBHOOK_URL` / `DISCORD_WEBHOOK_URL` | Deploy failure notifications | both workflows (optional) |

> Backend runtime secrets (DB password, JWT, SMTP, S3, payment keys) are NOT passed through GitHub Actions — they live in `/opt/dinanwuye/backend/.env` on the VPS directly (see `vps-provisioning.md` §5). Only secrets needed at **build time** (VAPID public key) or for **transport** (SSH key, FTP creds) belong in GitHub secrets.

---

## Add Secrets (PowerShell / web UI)

1. Open repo → **Settings → Secrets and variables → Actions**.
2. **New repository secret** → paste name + value → **Add secret**.
3. Repeat for all secrets in the Required table.

Verify with a quick `workflow_dispatch` run of each workflow (Actions tab → workflow → **Run workflow**).

---

## Verifying SSH key works (one-time check from GitHub Actions)

If the backend deploy fails at SSH stage:

```bash
# Local PowerShell — test key auth manually first
ssh -i $env:USERPROFILE\.ssh\dinanwuye_vps deploy@<VPS_IP> "echo ok"
```

If that works but the action fails, confirm the secret contains the **entire** private key file content (including the `-----BEGIN/END OPENSSH PRIVATE KEY-----` lines) with no trailing whitespace mangling.

---

## Rotating a Secret

1. Generate new value (e.g. new SSH keypair).
2. Update the VPS `authorized_keys` / cPanel FTP password.
3. Update the GitHub secret.
4. Run a test deployment.

---

*Created 2026-08-17 · Part of Phase 0 — CI/CD Pipelines.*
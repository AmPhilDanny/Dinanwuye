# Dinanwuye — VPS Provisioning Guide (LyteHosting Unmanaged VPS)

**Scope:** Backend + database + object storage + reverse proxy on a single LyteHosting Unmanaged VPS.
**Reference:** `architecture.md` §10 (hybrid deployment), `backend/docker-compose.yml`, `backend/nginx/`.

---

## 1. Purchase & First Boot

1. Purchase an **Unmanaged VPS** from LyteHosting (Ubuntu 22.04 LTS recommended).
   - Sizing baseline: 4 vCPU / 8 GB RAM / 160 GB NVMe (grows with users; ML matching runs here).
2. Note the **root password / SSH credentials** in LyteHosting's panel (they email/VPS panel provides it).
3. On first login, change the root password immediately:
   ```bash
   passwd
   ```
4. **IMPORTANT:** Update the OS and set timezone:
   ```bash
   apt update && apt upgrade -y
   timedatectl set-timezone Africa/Lagos
   ```

---

## 2. Create Deploy User (SSH hardening)

Do NOT run services as root. Create a deploy user + SSH key:

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys 2>/dev/null || true
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

Generate the SSH key **locally** (on the developer machine) and upload the public key:

```bash
# On developer machine (PowerShell):
ssh-keygen -t ed25519 -C "deploy@dinanwuye" -f $env:USERPROFILE\.ssh\dinanwuye_vps
# Then copy the .pub content into /home/deploy/.ssh/authorized_keys on the VPS
```

The **private key** (`dinanwuye_vps`) becomes GitHub secret `VPS_SSH_KEY` (see `deployment/github-secrets.md`).

Disable password auth + root login (after verifying key login works):

```bash
sudo nano /etc/ssh/sshd_config
# Set:
#   PermitRootLogin no
#   PasswordAuthentication no
#   PubkeyAuthentication yes
sudo systemctl restart sshd
```

**⚠️ Keep your current SSH session open until you've verified key login in a second session.**

---

## 3. Install Docker + Docker Compose

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker deploy
sudo systemctl enable --now docker

# Verify
docker --version
docker compose version

# Log out and back in so the docker group applies
```

---

## 4. Prepare Application Directory

```bash
sudo mkdir -p /opt/dinanwuye
sudo chown -R deploy:deploy /opt/dinanwuye
cd /opt/dinanwuye
git clone git@github.com:<org>/<repo>.git .
```

> Note: `backend-deploy.yml` workflow already does `git pull` + `docker compose up`. Initial clone is manual (or push the repo first, then clone once).

---

## 5. Environment Secrets

Create `/opt/dinanwuye/backend/.env` (never committed — see `backend/.env.example`):

```bash
cd /opt/dinanwuye/backend
cp .env.example .env
nano .env   # fill in REAL secrets
```

Generate strong secrets:

```bash
openssl rand -hex 32    # JWT_SECRET, JWT_REFRESH_SECRET, DB password
openssl rand -base64 32 # STRIPE/PAYSTACK webhook secrets come from vendor dashboards
```

Generate VAPID keys (web push):

```bash
npx web-push generate-vapid-keys
# VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY → .env AND frontend build env (VITE_VAPID_PUBLIC_KEY)
```

---

## 6. Deploy Databases & Infra Containers

The compose file runs **everything** (db, redis, minio, nginx, all services). First bring up only the data layer to validate:

```bash
cd /opt/dinanwuye/backend
docker compose up -d postgres redis minio
docker compose ps            # all 3 should be healthy
```

### PostgreSQL + pgvector

```bash
# Enter the container and enable pgvector
docker exec -it dinanwuye-postgres psql -U postgres -d dinanwuye
# In psql:
CREATE EXTENSION IF NOT EXISTS vector;
\q
```

Verify from host:

```bash
docker exec dinanwuye-postgres pg_isready -U postgres
```

### Redis

```bash
docker exec dinanwuye-redis redis-cli ping   # → PONG
```

### MinIO

1. Open the console at `http://<VPS_IP>:9001` (temporary; will be locked down by nginx firewall after SSL).
2. Login with `minioadmin` / `minioadmin` (change immediately!).
3. Create bucket `dinanwuye-media` (public-read for profile photos/avatars; private for documents).

---

## 7. Deploy Backend Services

```bash
cd /opt/dinanwuye/backend
docker compose up -d --build
docker compose ps
```

Expected: `api-gateway`, `auth-service`, `profile-service`, `messaging-service`, `trust-safety-service`, `notification-service`, `payment-service`, `matching-service` — all `Up` and healthy.

Sanity check each health endpoint (from VPS):

```bash
curl http://localhost:3000/health          # api-gateway
curl http://localhost:3001/health          # auth-service
curl http://localhost:3002/health          # profile-service
curl http://localhost:8000/health          # matching-service
```

---

## 8. Nginx + SSL (Let's Encrypt)

Nginx container is included in compose. SSL certs are mounted from the host.

```bash
# 1. Ensure DNS A record for api.dinanwuye.com → VPS IP (see deployment/cpanel-setup.md)
# 2. Install certbot on the HOST to issue certs:
sudo apt install -y certbot
sudo certbot certonly --standalone -d api.dinanwuye.com
# 3. Certs land in /etc/letsencrypt/live/api.dinanwuye.com/
#    (compose mounts /etc/letsencrypt → container)
```

Bring up nginx:

```bash
docker compose up -d nginx
docker compose ps
```

Test SSL + proxy:

```bash
curl -I https://api.dinanwuye.com/health
# Expect: HTTP/2 200
```

### Auto-renew SSL

Add a cron job on the host:

```bash
sudo crontab -e
# Add:
# 0 3 * * * certbot renew --quiet --deploy-hook "docker restart dinanwuye-nginx"
```

---

## 9. Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
# Only expose the app via nginx. Do NOT open 5432/6379/9000 publicly
# (internal docker network only).
sudo ufw enable
sudo ufw status
```

> If you need remote DB access for debugging, use an SSH tunnel (`ssh -L 5432:localhost:5432 deploy@VPS_IP`) instead of opening the port.

---

## 10. Backups (PostgreSQL)

```bash
# Manual backup
docker exec dinanwuye-postgres pg_dump -U postgres -d dinanwuye -Fc > ~/backups/dinanwuye_$(date +%F).dump

# Cron (daily, keep 7):
sudo crontab -e
# 0 2 * * * docker exec dinanwuye-postgres pg_dump -U postgres -d dinanwuye -Fc | gzip > /opt/backups/db_$(date +\%F).dump.gz && find /opt/backups -name "*.dump.gz" -mtime +7 -delete
```

**Backup MinIO data** (profile photos) via `mc` mirror to a second location, or rely on LyteHosting VPS snapshot (enable snapshots in panel if available).

---

## 11. Verification Checklist

- [ ] `ssh deploy@<VPS_IP>` works with key only (no password)
- [ ] `docker compose ps` — all 8 services + 3 infra containers healthy
- [ ] `curl https://api.dinanwuye.com/health` → 200
- [ ] `https://api.dinanwuye.com` serves Swagger/OpenAPI (dev) — 200
- [ ] UFW: only 22/80/443 open
- [ ] SSL auto-renew cron installed
- [ ] Backups cron installed + test restore run once

---

## 12. Rollback

- **Code:** `cd /opt/dinanwuye/backend && git log --oneline -5`, then `git checkout <previous-sha>` + `docker compose up -d --build`.
- **DB:** restore dump: `docker exec -i dinanwuye-postgres pg_restore -U postgres -d dinanwuye < backup.dump`.
- **Image:** if a new image is broken, `docker compose up -d --no-build` reuses previously built images.

---

*Created 2026-08-17 · Part of Phase 0 — Core Infrastructure (VPS).*
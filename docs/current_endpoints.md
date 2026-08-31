# Current Service Endpoints & Health Checks
# ===========================================
# Last Updated: 2026-08-30

## Service URLs (Render Deployment)

| Service | URL | Status |
|---------|-----|--------|
| Main App (Frontend) | https://dinanwuye.onrender.com | Active |
| Admin App (Frontend) | https://dinanwuye-admin.onrender.com | Active |
| Auth API | https://dinanwuye-back.onrender.com | Active |
| Profile API | https://dinanwuye-profile.onrender.com | Active |
| Messaging API | https://dinanwuye-messaging.onrender.com | Active |
| Matching API | https://dinanwuye-matching.onrender.com | Active |
| Admin API | https://dinanwuye-admin-api.onrender.com | Active |

---

## Auth Service (dinanwuye-back.onrender.com)

**Base URL**: https://dinanwuye-back.onrender.com/api/v1

### Health Check
- Endpoint: `/api/v1/health`
- Method: GET
- Response: `{ "status": "ok", "service": "auth" }`

### Authentication Endpoints
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login with email/phone
- POST `/auth/refresh` - Refresh access token
- POST `/auth/logout` - Logout user
- POST `/auth/otp/send` - Send OTP code
- POST `/auth/otp/verify` - Verify OTP code
- POST `/auth/forgot-password` - Request password reset
- POST `/auth/reset-password` - Reset password with token
- GET `/auth/me` - Get current user
- PUT `/auth/profile` - Update user profile

---

## Profile Service (dinanwuye-profile.onrender.com)

**Base URL**: https://dinanwuye-profile.onrender.com/api/v1

### Health Check
- Endpoint: `/api/v1/health`
- Method: GET
- Response: `{ "status": "ok", "service": "profile" }`

### Profile Endpoints
- GET `/profile` - Get current user profile
- GET `/profile/:id` - Get user profile by ID
- POST `/profile` - Create profile
- PUT `/profile` - Update profile
- DELETE `/profile` - Delete profile
- POST `/profile/photos` - Upload photo
- DELETE `/profile/photos/:id` - Delete photo
- PUT `/profile/photos/reorder` - Reorder photos
- GET `/profile/discover` - Get discover profiles
- PUT `/profile/location` - Update location
- GET `/profile/settings` - Get user settings
- PUT `/profile/settings` - Update user settings

---

## Messaging Service (dinanwuye-messaging.onrender.com)

**Base URL**: https://dinanwuye-messaging.onrender.com/api/v1

### Health Check
- Endpoint: `/api/v1/health`
- Method: GET
- Response: `{ "status": "ok", "service": "messaging" }`

### Conversation Endpoints
- GET `/conversations` - Get user conversations
- POST `/conversations` - Create conversation
- GET `/conversations/:id` - Get conversation details
- DELETE `/conversations/:id` - Delete conversation

### Message Endpoints
- GET `/conversations/:id/messages` - Get messages
- POST `/conversations/:id/messages` - Send message
- PUT `/messages/:id` - Update message
- DELETE `/messages/:id` - Delete message
- POST `/messages/:id/read` - Mark as read

### WebSocket
- Endpoint: `/socket.io`
- Events: `message:new`, `message:read`, `typing:start`, `typing:stop`

---

## Admin Service (dinanwuye-admin-api.onrender.com)

**Base URL**: https://dinanwuye-admin-api.onrender.com/api/v1/admin

### Health Check
- Endpoint: `/api/v1/admin/docs`
- Method: GET
- Response: Swagger documentation page

### Admin Auth Endpoints
- POST `/admin/auth/login` - Admin login
- POST `/admin/auth/logout` - Admin logout
- GET `/admin/auth/me` - Get current admin

### Dashboard Endpoints
- GET `/admin/dashboard/stats` - Get dashboard statistics
- GET `/admin/dashboard/recent-activity` - Get recent activity

### User Management Endpoints
- GET `/admin/users` - List all users
- GET `/admin/users/:id` - Get user details
- PUT `/admin/users/:id/status` - Update user status (ban/unban)
- DELETE `/admin/users/:id` - Delete user
- POST `/admin/users/:id/verify` - Verify user

### Content Moderation Endpoints
- GET `/admin/reports` - List all reports
- PUT `/admin/reports/:id` - Update report status
- POST `/admin/reports/:id/action` - Take action on report

### Settings Endpoints
- GET `/admin/settings` - Get admin settings
- PUT `/admin/settings` - Update admin settings

---

## Matching Service (dinanwuye-matching.onrender.com)

**Base URL**: https://dinanwuye-matching.onrender.com

### Health Check
- Endpoint: `/health`
- Method: GET
- Response: `{ "status": "healthy", "service": "matching" }`

### Matching Endpoints
- GET `/matches` - Get potential matches
- POST `/matches/:id/like` - Like a profile
- POST `/matches/:id/pass` - Pass on a profile
- POST `/matches/:id/superlike` - Super like a profile
- GET `/matches/mutual` - Get mutual matches
- DELETE `/matches/:id` - Remove match

### Compatibility Endpoints
- GET `/compatibility/:id` - Get compatibility score
- POST `/compatibility/calculate` - Calculate compatibility

---

## API Gateway (api-gateway)

**Base URL**: https://dinanwuye-back.onrender.com (same as auth service)

### Health Check
- Endpoint: `/health`
- Method: GET
- Response: `{ "status": "ok", "service": "gateway" }`

### Routes (Proxied)
- `/api/v1/auth/*` → Auth Service
- `/api/v1/profile/*` → Profile Service
- `/api/v1/messaging/*` → Messaging Service
- `/api/v1/matching/*` → Matching Service

---

## Summary Table

| Service | Health Endpoint | Port | Technology |
|---------|-----------------|------|------------|
| Auth | `/api/v1/health` | 3001 | NestJS |
| Profile | `/api/v1/health` | 3002 | NestJS |
| Messaging | `/api/v1/health` | 3003 | NestJS |
| Matching | `/health` | 8000 | FastAPI |
| Admin | `/api/v1/admin/docs` | 3005 | NestJS |
| Gateway | `/health` | 3000 | NestJS |

---

## Notes for Consolidation

1. **Health checks** will need to be unified to `/health` or `/api/v1/health`
2. **WebSocket** in messaging service needs special handling
3. **Admin API** has a different base path (`/api/v1/admin/`)
4. **Matching service** stays separate (Python/FastAPI)
5. **API Gateway** routes will become internal module routing

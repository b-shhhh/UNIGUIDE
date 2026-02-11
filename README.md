# UniGuide

UniGuide is a full-stack university guidance platform with:
- Next.js frontend (`frontend`)
- Express + TypeScript backend (`backend`)
- MongoDB persistence for users/auth/saved items
- CSV-backed recommendation data
- Role-protected admin user management

## 1. Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or remote)

## 2. Environment Setup

1. Backend:
   - Copy `backend/.env.example` to `backend/.env`
   - Set `JWT_SECRET` (required, strong secret in production)
   - Set `MONGODB_URI`
   - Set `ALLOWED_ORIGINS` for your frontend domains

2. Frontend:
   - Copy `frontend/.env.example` to `frontend/.env.local`
   - Set `NEXT_PUBLIC_API_BASE_URL` to backend URL

## 3. Development Run

Backend:
```bash
cd backend
npm install
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:3000`  
Backend default URL: `http://localhost:5050`

## 4. Admin Bootstrap

Create first admin user:
```bash
cd backend
set ADMIN_EMAIL=admin@example.com
set ADMIN_PASSWORD=strong_password_here
npm run create:admin
```

Optional:
- `ADMIN_FIRST_NAME`
- `ADMIN_LAST_NAME`
- `ADMIN_PHONE`

## 5. Production Run

Backend:
```bash
cd backend
npm ci
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm ci
npm run build
npm start
```

## 6. Health & Readiness

- Health: `GET /health`
- Readiness: `GET /ready`

Use `/ready` for load balancer/k8s readiness checks.

## 7. Security Baseline Included

- Role-based admin protection (`admin` only on admin APIs)
- JWT auth with role claim
- CORS allowlist from env
- Secure default security headers
- Basic in-memory rate limiting for auth/admin paths
- `httpOnly` auth cookies with `sameSite=lax`, `secure` in production

## 8. Production Checklist (Must Verify)

- Use HTTPS everywhere
- Set strong `JWT_SECRET` (32+ chars)
- Restrict `ALLOWED_ORIGINS` to real domains
- Set MongoDB auth/network restrictions
- Put backend behind reverse proxy/load balancer
- Centralized logs + alerts
- Backup and restore strategy for MongoDB
- CI pipeline for lint/typecheck/build/test

## 9. Validation Commands

Backend:
```bash
cd backend
npm run typecheck
```

Frontend:
```bash
cd frontend
npm run lint
```

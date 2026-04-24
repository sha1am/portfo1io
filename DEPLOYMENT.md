# Deployment Guide

This repository is designed for:

- `frontend/` on Vercel
- `backend/` on Render

Both deployment targets are codified in the repository so the project can be stood up quickly without manual guesswork.

## Frontend on Vercel

### Recommended settings

- Root directory: `frontend`
- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

### Required environment variable

```bash
REACT_APP_API_URL=https://your-render-service.onrender.com
```

### Notes

- `frontend/vercel.json` enables clean routing and security headers
- The frontend is built as a static asset bundle

## Backend on Render

### Recommended settings

- Root directory: `backend`
- Build command: `go build ./cmd/api`
- Start command: `./api`

If you prefer a simple start command without a separate binary step:

- Build command: `go build -o api ./cmd/api`
- Start command: `./api`

### Environment variables

```bash
SERVICE_NAME=portfolio-api
APP_ENV=production
PORT=10000
CORS_ALLOW_ORIGIN=https://your-vercel-domain.vercel.app
READ_TIMEOUT=5s
WRITE_TIMEOUT=10s
IDLE_TIMEOUT=30s
SHUTDOWN_TIMEOUT=10s
```

### Notes

- `render.yaml` provides a Render blueprint for the backend service
- The service emits structured logs and supports graceful shutdown

## CI

GitHub Actions runs:

- backend tests
- backend build
- frontend production build

This keeps deployment failures from being the first time broken code is discovered.

# Portfolio

This repository contains:

- **frontend/** – a React application inspired by [takeuforward profile](https://takeuforward.org/profile/sha1am).
- **backend/** – a small Go HTTP API.
- **Jenkinsfile** – example pipeline for building and deploying both parts.

Only a React frontend and a Go backend are maintained. The frontend is intended for **Vercel** and the backend is intended for **Render**.

## Structure

```text
frontend/src/
  app/                    # App bootstrap and global styles
  features/portfolio/     # Portfolio page, feature components, and content data
  shared/                 # Shared UI primitives and API client helpers

backend/
  cmd/api/                # Application entrypoint
  internal/app/           # Runtime wiring and server startup
  internal/config/        # Environment-driven configuration
  internal/httpapi/       # HTTP router, middleware, and tests
  internal/status/        # Status feature handlers and service logic
  internal/web/           # Shared HTTP response helpers
```

The repo is organized around clear boundaries:

- Frontend code is split into `app`, `features`, and `shared` so page-specific UI stays separate from reusable infrastructure.
- Backend code is split into configuration, app wiring, transport, and feature packages so new APIs can be added without growing one file into a catch-all.

## Running locally

### Frontend
```bash
cd frontend
npm install
npm start
```
This starts a development server at `http://localhost:3000`.

### Backend
```bash
cd backend
go run ./cmd/api
```
The API will then be available at `http://localhost:8000/`.

See `backend/README.md` for more backend information. Deployment instructions are available in `Depploy_readme.md`.

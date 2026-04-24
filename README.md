# Portfolio

This repository contains:

- **frontend/** – a React application inspired by [takeuforward profile](https://takeuforward.org/profile/sha1am).
- **backend/** – a small Go HTTP API.
- **Jenkinsfile** – example pipeline for building and deploying both parts.

Only a React frontend and a Go backend are maintained. The frontend is intended for **Vercel** and the backend is intended for **Render**.

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

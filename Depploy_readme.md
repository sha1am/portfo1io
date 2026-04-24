# Deployment Guide

This document explains how to deploy the two parts of the project.

## Deploying the frontend to Vercel

1. Build the React app:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   The production files are generated in the `dist/` directory.
2. Sign in to [Vercel](https://vercel.com/) and create a new project from your repository.
3. Set the project root to `frontend`.
4. Set the **build command** to `npm run build` and the **output directory** to `dist`.
5. Add `REACT_APP_API_URL` as an environment variable pointing at your Render backend URL.
6. Deploy the site. Vercel will host the compiled frontend and provide a live URL.

## Deploying the backend to Render

1. Push this repository to a Git provider (GitHub, GitLab, etc.) if you haven't already.
2. Create a new **Web Service** on [Render](https://render.com/) and connect your repo.
3. Set the root directory to `backend`.
4. Use the following commands when prompted:
   - **Build Command**: `go build ./...`
   - **Start Command**: `go run ./cmd/api`
5. Optionally configure environment variables such as `CORS_ALLOW_ORIGIN` for your Vercel domain.
6. Render will build and launch the API, exposing a public URL for your backend.

# Deployment Guide

This document explains how to deploy the two parts of the project.

## Deploying the frontend to Netlify

1. Build the React app:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
   The production files are generated in the `dist/` directory.
2. Sign in to [Netlify](https://www.netlify.com/) and create a new site from your repository.
3. Set the **build command** to `npm run build` and the **publish directory** to `frontend/dist`.
4. Deploy the site. Netlify will host the compiled files and provide a live URL.

## Deploying the backend to Render

1. Push this repository to a Git provider (GitHub, GitLab, etc.) if you haven't already.
2. Create a new **Web Service** on [Render](https://render.com/) and connect your repo.
3. Set the root directory to `backend`.
4. Use the following commands when prompted:
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `python manage.py runserver 0.0.0.0:$PORT`
5. Optionally configure environment variables such as `DJANGO_SECRET_KEY`.
6. Render will build and launch the API, exposing a public URL for your backend.

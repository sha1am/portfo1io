# Portfolio

This repository contains:

- **frontend/** – a React application inspired by [takeuforward profile](https://takeuforward.org/profile/sha1am).
- **backend/** – a simple Django REST Framework (DRF) API.
- **Jenkinsfile** – example pipeline for building and deploying both parts.

Only a React frontend and a DRF backend are maintained. The frontend can be hosted on **Netlify** while the DRF backend can run on **Render**.

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
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
The API will then be available at `http://localhost:8000/`.

See `backend/README.md` for more backend information. Deployment instructions are available in `Depploy_readme.md`.

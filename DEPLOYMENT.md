# Deployment Guide

This project uses Jenkins for CI/CD. The provided `Jenkinsfile` installs dependencies for both the frontend and the DRF backend, builds them and includes a placeholder deployment stage.

## Hosting recommendations

- **Frontend:** [Netlify](https://www.netlify.com/) offers free static site hosting that works well with React builds.
- **Backend:** [Render](https://render.com/) provides a free tier suitable for small Django services.

Create separate pipelines/jobs for each or extend the Jenkinsfile with deployment steps using Netlify CLI and Render's deploy hooks.

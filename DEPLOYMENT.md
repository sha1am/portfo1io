# Deployment Guide

This project uses Jenkins for CI/CD. The provided `Jenkinsfile` installs frontend dependencies, builds the React app, and validates the Go backend with `go test` and `go build`.

## Hosting recommendations

- **Frontend:** [Vercel](https://vercel.com/) is a good fit for the webpack-built frontend.
- **Backend:** [Render](https://render.com/) works well for the Go API.

Create separate pipelines/jobs for each or extend the Jenkinsfile with deployment steps using Vercel deploy hooks and Render's deploy hooks.

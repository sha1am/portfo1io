# Backend

Small Go HTTP API for the portfolio application.

## Responsibilities

- health and status endpoints
- environment-driven runtime configuration
- structured request logging
- request ID propagation
- graceful shutdown

## Package Layout

```text
cmd/api/            Entry point
internal/app/       Server lifecycle and startup
internal/config/    Environment configuration
internal/httpapi/   Router, middleware, and transport tests
internal/status/    Feature handler and service
internal/web/       Shared JSON response helpers
```

## Run Locally

```bash
cp .env.example .env
go run ./cmd/api
```

## Endpoints

- `GET /`
- `GET /health`
- `GET /api/status`

## Validation

```bash
go test ./...
go build ./...
```

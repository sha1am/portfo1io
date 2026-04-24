# Go Backend

This backend is a small Go HTTP API intended for local development and Render deployment.

## Structure

```text
cmd/api/            # main package
internal/app/       # bootstraps config, logging, and http.Server
internal/config/    # environment configuration
internal/httpapi/   # router, middleware, and transport tests
internal/status/    # status feature handlers and service
internal/web/       # shared response helpers
```

This keeps feature logic separate from HTTP transport and startup concerns, which makes it easier to add more endpoints later.

## Development

```bash
go run ./cmd/api
```

The API defaults to `http://localhost:8000/`.

## Endpoints

- `GET /` returns a status message.
- `GET /health` returns a health check response.
- `GET /api/status` returns the same status payload as the root endpoint.

## Configuration

- `PORT` sets the server port. Default: `8000`
- `CORS_ALLOW_ORIGIN` sets the allowed origin for CORS. Default: `*`

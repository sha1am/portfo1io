# Go Backend

This backend is a small Go HTTP API intended for local development and Render deployment.

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

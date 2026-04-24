package httpapi

import (
	"log/slog"
	"net/http"

	"portfo1io/backend/internal/config"
	"portfo1io/backend/internal/status"
)

func NewRouter(cfg config.Config, logger *slog.Logger, statusService *status.Service) http.Handler {
	mux := http.NewServeMux()
	statusHandler := status.NewHandler(statusService)

	mux.HandleFunc("/", statusHandler.Root)
	mux.HandleFunc("/health", statusHandler.Health)
	mux.HandleFunc("/api/status", statusHandler.Status)

	return withLogging(logger, withRequestID(withCORS(cfg.AllowedOrigin, mux)))
}

package httpapi

import (
	"log"
	"net/http"

	"portfo1io/backend/internal/config"
	"portfo1io/backend/internal/status"
)

func NewRouter(cfg config.Config, logger *log.Logger, statusService *status.Service) http.Handler {
	mux := http.NewServeMux()
	statusHandler := status.NewHandler(statusService)

	mux.HandleFunc("/", statusHandler.Root)
	mux.HandleFunc("/health", statusHandler.Health)
	mux.HandleFunc("/api/status", statusHandler.Status)

	return withLogging(logger, withCORS(cfg.AllowedOrigin, mux))
}

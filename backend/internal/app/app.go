package app

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"portfo1io/backend/internal/config"
	"portfo1io/backend/internal/httpapi"
	"portfo1io/backend/internal/status"
)

func Run() error {
	cfg := config.Load()
	logger := log.New(os.Stdout, "", log.LstdFlags)
	statusService := status.NewService()

	server := &http.Server{
		Addr:         cfg.Address(),
		Handler:      httpapi.NewRouter(cfg, logger, statusService),
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	logger.Printf("starting Go API on http://localhost:%s", cfg.Port)

	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		return fmt.Errorf("listen and serve: %w", err)
	}

	return nil
}

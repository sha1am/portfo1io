package app

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"portfo1io/backend/internal/config"
	"portfo1io/backend/internal/httpapi"
	"portfo1io/backend/internal/status"
)

func Run() error {
	cfg := config.Load()
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo}))
	statusService := status.NewService(cfg.ServiceName)

	server := &http.Server{
		Addr:         cfg.Address(),
		Handler:      httpapi.NewRouter(cfg, logger, statusService),
		ReadTimeout:  cfg.ReadTimeout,
		WriteTimeout: cfg.WriteTimeout,
		IdleTimeout:  cfg.IdleTimeout,
	}

	logger.Info("starting API server",
		"service", cfg.ServiceName,
		"environment", cfg.AppEnv,
		"address", server.Addr,
		"allowed_origin", cfg.AllowedOrigin,
	)

	serverErrors := make(chan error, 1)
	go func() {
		serverErrors <- server.ListenAndServe()
	}()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	select {
	case err := <-serverErrors:
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("listen and serve: %w", err)
		}
	case <-ctx.Done():
		logger.Info("shutdown signal received")

		shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout)
		defer cancel()

		if err := server.Shutdown(shutdownCtx); err != nil {
			return fmt.Errorf("shutdown server: %w", err)
		}

		if err := <-serverErrors; err != nil && !errors.Is(err, http.ErrServerClosed) {
			return fmt.Errorf("await server shutdown: %w", err)
		}
	}

	logger.Info("API server stopped")
	return nil
}

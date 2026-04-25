package config

import (
	"testing"
	"time"
)

func TestLoadUsesEnvironmentOverrides(t *testing.T) {
	t.Setenv("APP_ENV", "test")
	t.Setenv("SERVICE_NAME", "test-service")
	t.Setenv("PORT", "9000")
	t.Setenv("CORS_ALLOW_ORIGIN", "https://example.com")
	t.Setenv("READ_TIMEOUT", "2s")
	t.Setenv("WRITE_TIMEOUT", "3s")
	t.Setenv("IDLE_TIMEOUT", "4s")
	t.Setenv("SHUTDOWN_TIMEOUT", "5s")

	cfg := Load()

	if cfg.AppEnv != "test" {
		t.Fatalf("expected app env override, got %q", cfg.AppEnv)
	}

	if cfg.ServiceName != "test-service" {
		t.Fatalf("expected service name override, got %q", cfg.ServiceName)
	}

	if cfg.Address() != ":9000" {
		t.Fatalf("expected address :9000, got %q", cfg.Address())
	}

	if cfg.AllowedOrigin != "https://example.com" {
		t.Fatalf("expected CORS origin override, got %q", cfg.AllowedOrigin)
	}

	assertDuration(t, "read timeout", cfg.ReadTimeout, 2*time.Second)
	assertDuration(t, "write timeout", cfg.WriteTimeout, 3*time.Second)
	assertDuration(t, "idle timeout", cfg.IdleTimeout, 4*time.Second)
	assertDuration(t, "shutdown timeout", cfg.ShutdownTimeout, 5*time.Second)
}

func TestLoadFallsBackForInvalidDurations(t *testing.T) {
	t.Setenv("READ_TIMEOUT", "not-a-duration")

	cfg := Load()

	assertDuration(t, "read timeout", cfg.ReadTimeout, 5*time.Second)
}

func assertDuration(t *testing.T, name string, actual, expected time.Duration) {
	t.Helper()

	if actual != expected {
		t.Fatalf("expected %s %s, got %s", name, expected, actual)
	}
}

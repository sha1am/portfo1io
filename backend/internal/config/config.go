package config

import (
	"os"
	"time"
)

const (
	defaultAppEnv        = "development"
	defaultServiceName   = "portfolio-api"
	defaultPort          = "8000"
	defaultAllowedOrigin = "*"
	defaultReadTimeout   = "5s"
	defaultWriteTimeout  = "10s"
	defaultIdleTimeout   = "30s"
	defaultShutdownDelay = "10s"
)

type Config struct {
	AppEnv          string
	ServiceName     string
	Port            string
	AllowedOrigin   string
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
	ShutdownTimeout time.Duration
}

func Load() Config {
	return Config{
		AppEnv:          getEnv("APP_ENV", defaultAppEnv),
		ServiceName:     getEnv("SERVICE_NAME", defaultServiceName),
		Port:            getEnv("PORT", defaultPort),
		AllowedOrigin:   getEnv("CORS_ALLOW_ORIGIN", defaultAllowedOrigin),
		ReadTimeout:     getDuration("READ_TIMEOUT", defaultReadTimeout),
		WriteTimeout:    getDuration("WRITE_TIMEOUT", defaultWriteTimeout),
		IdleTimeout:     getDuration("IDLE_TIMEOUT", defaultIdleTimeout),
		ShutdownTimeout: getDuration("SHUTDOWN_TIMEOUT", defaultShutdownDelay),
	}
}

func (c Config) Address() string {
	return ":" + c.Port
}

func getEnv(key, fallback string) string {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}

	return value
}

func getDuration(key, fallback string) time.Duration {
	value := getEnv(key, fallback)
	duration, err := time.ParseDuration(value)
	if err != nil {
		fallbackDuration, _ := time.ParseDuration(fallback)
		return fallbackDuration
	}

	return duration
}

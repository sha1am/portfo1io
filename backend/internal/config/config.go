package config

import (
	"os"
	"time"
)

const (
	defaultPort          = "8000"
	defaultAllowedOrigin = "*"
)

type Config struct {
	Port          string
	AllowedOrigin string
	ReadTimeout   time.Duration
	WriteTimeout  time.Duration
	IdleTimeout   time.Duration
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	allowedOrigin := os.Getenv("CORS_ALLOW_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = defaultAllowedOrigin
	}

	return Config{
		Port:          port,
		AllowedOrigin: allowedOrigin,
		ReadTimeout:   5 * time.Second,
		WriteTimeout:  10 * time.Second,
		IdleTimeout:   30 * time.Second,
	}
}

func (c Config) Address() string {
	return ":" + c.Port
}

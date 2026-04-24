package main

import (
	"log"
	"net/http"
	"os"

	"portfo1io/backend/internal/httpapi"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	allowedOrigin := os.Getenv("CORS_ALLOW_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "*"
	}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: httpapi.NewServer(allowedOrigin),
	}

	log.Printf("starting Go API on http://localhost:%s", port)
	if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server stopped: %v", err)
	}
}

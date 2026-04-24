package httpapi

import (
	"io"
	"log"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"portfo1io/backend/internal/config"
	"portfo1io/backend/internal/status"
)

func TestRouterEndpoints(t *testing.T) {
	t.Parallel()

	router := NewRouter(
		config.Config{AllowedOrigin: "*"},
		log.New(io.Discard, "", 0),
		status.NewService(),
	)

	tests := []struct {
		name           string
		method         string
		path           string
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "root status",
			method:         http.MethodGet,
			path:           "/",
			expectedStatus: http.StatusOK,
			expectedBody:   `"message":"Backend server is running!"`,
		},
		{
			name:           "health",
			method:         http.MethodGet,
			path:           "/health",
			expectedStatus: http.StatusOK,
			expectedBody:   `"status":"ok"`,
		},
		{
			name:           "api status",
			method:         http.MethodGet,
			path:           "/api/status",
			expectedStatus: http.StatusOK,
			expectedBody:   `"runtime":"go"`,
		},
		{
			name:           "route not found",
			method:         http.MethodGet,
			path:           "/missing",
			expectedStatus: http.StatusNotFound,
			expectedBody:   `"error":"route not found"`,
		},
		{
			name:           "method not allowed",
			method:         http.MethodPost,
			path:           "/health",
			expectedStatus: http.StatusMethodNotAllowed,
			expectedBody:   `"error":"method not allowed"`,
		},
		{
			name:           "options preflight",
			method:         http.MethodOptions,
			path:           "/api/status",
			expectedStatus: http.StatusNoContent,
			expectedBody:   "",
		},
	}

	for _, test := range tests {
		test := test

		t.Run(test.name, func(t *testing.T) {
			t.Parallel()

			request := httptest.NewRequest(test.method, test.path, nil)
			recorder := httptest.NewRecorder()

			router.ServeHTTP(recorder, request)

			if recorder.Code != test.expectedStatus {
				t.Fatalf("expected status %d, got %d", test.expectedStatus, recorder.Code)
			}

			if test.expectedBody != "" && !strings.Contains(recorder.Body.String(), test.expectedBody) {
				t.Fatalf("expected body to contain %q, got %q", test.expectedBody, recorder.Body.String())
			}

			if recorder.Header().Get("Access-Control-Allow-Origin") != "*" {
				t.Fatalf("expected CORS header to be set")
			}
		})
	}
}

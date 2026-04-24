package status

import (
	"net/http"

	"portfo1io/backend/internal/web"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

func (h *Handler) Root(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		web.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "route not found"})
		return
	}

	if r.Method != http.MethodGet {
		web.WriteJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	web.WriteJSON(w, http.StatusOK, h.service.Status())
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		web.WriteJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	web.WriteJSON(w, http.StatusOK, h.service.Health())
}

func (h *Handler) Status(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		web.WriteJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
		return
	}

	web.WriteJSON(w, http.StatusOK, h.service.Status())
}

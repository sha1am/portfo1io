package status

type Response struct {
	Message string `json:"message,omitempty"`
	Service string `json:"service,omitempty"`
	Runtime string `json:"runtime,omitempty"`
	Status  string `json:"status,omitempty"`
}

type Service struct {
	serviceName string
}

func NewService(serviceName string) *Service {
	return &Service{serviceName: serviceName}
}

func (s *Service) Status() Response {
	return Response{
		Message: "Backend server is running!",
		Service: s.serviceName,
		Runtime: "go",
	}
}

func (s *Service) Health() Response {
	return Response{
		Service: s.serviceName,
		Runtime: "go",
		Status:  "ok",
	}
}

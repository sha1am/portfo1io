package status

type Response struct {
	Message string `json:"message,omitempty"`
	Service string `json:"service,omitempty"`
	Runtime string `json:"runtime,omitempty"`
	Status  string `json:"status,omitempty"`
}

type Service struct{}

func NewService() *Service {
	return &Service{}
}

func (s *Service) Status() Response {
	return Response{
		Message: "Backend server is running!",
		Service: "portfolio-api",
		Runtime: "go",
	}
}

func (s *Service) Health() Response {
	return Response{
		Service: "portfolio-api",
		Runtime: "go",
		Status:  "ok",
	}
}

package health

import "net/http"


func HealthRouter() *http.ServeMux {
	router := http.NewServeMux()

	router.HandleFunc("/",healthCheck)

	return router
}
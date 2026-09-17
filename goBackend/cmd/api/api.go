package main

import (
	"net/http"
	"time"

	"github.com/knl110/examPortal/goBackend/internal/config"
)

type application struct {
	config config.Config
}

// func newApplication(config config.Config) *application {
// 	return &application{
// 		config: config,
// 	}
// }

func (app *application) mount() *http.ServeMux {
	router := http.NewServeMux()

	router.HandleFunc("GET /api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("health ok"))
	})

	return router
}

func (app *application) run() error {
	router := app.mount()
	
	server := &http.Server{
		Addr: app.config.HttpServer.GetAddr(),
		Handler: router,
		WriteTimeout: time.Second*30,
		ReadTimeout: time.Second*10,
		IdleTimeout: time.Minute,
	}

	return server.ListenAndServe()
}
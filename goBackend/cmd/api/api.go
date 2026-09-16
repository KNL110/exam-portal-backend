package main

import (
	"net/http"
	"time"

	"github.com/knl110/examPortal/goBackend/internal/config"
)

type application struct {
	config config.Config
}

func (app *application) newApplication(config config.Config) *application {
	return &application{
		config: config,
	}
}

func (app *application) run() error {
	router := http.NewServeMux()

	server := &http.Server{
		Addr:    app.config.HttpServer.Addr,
		Handler: router,
		WriteTimeout: time.Second*30,
		ReadTimeout: time.Second*10,
		IdleTimeout: time.Minute,
	}

	return server.ListenAndServe()
}
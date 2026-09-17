package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/knl110/examPortal/goBackend/internal/config"
)

type application struct {
	config config.Config
	server *http.Server
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
	
	app.server = &http.Server{
		Addr: app.config.HttpServer.GetAddr(),
		Handler: router,
		WriteTimeout: time.Second*30,
		ReadTimeout: time.Second*10,
		IdleTimeout: time.Minute,
	}
	

	return app.server.ListenAndServe()
}

func (app *application) close() error{

	log.Println("closing server...")
	ctx, cancel := context.WithTimeout(context.Background(),time.Second*5)
	defer cancel()

	err := app.server.Shutdown(ctx)
	if err != nil {
		return fmt.Errorf("app.close: failed to close server -> %w",err)
	}

	log.Println("server closed successfully")
	return nil
}
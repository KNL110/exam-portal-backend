package main

import (
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/knl110/examPortal/goBackend/internal/config"
)

func main(){
	//load config
	config := config.MustLoad()
	app := application{
		config: *config,
	}

	done := make(chan os.Signal,1)
	signal.Notify(done,os.Interrupt,syscall.SIGINT, syscall.SIGTERM)

	go func ()  {
		err := app.run()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			panic(err)
		}
	}()
	log.Printf("server started! at %s", config.HttpServer.GetAddr())

	<-done

	if err := app.close(); err != nil {
		log.Fatalf("main: error closing server -> %s",err)
	}
}
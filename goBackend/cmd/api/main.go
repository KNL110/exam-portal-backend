package main

import (
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/knl110/examPortal/goBackend/internal/config"
)

func main(){
	//load config
	config := config.MustLoad()
	var app *application

	app = app.newApplication(*config)

	done := make(chan os.Signal,1)
	signal.Notify(done,os.Interrupt,syscall.SIGINT, syscall.SIGTERM)

	go func ()  {
		err := app.run()
		if err != nil {
			panic(err)
		}
	}()
	log.Println("server started!")

	<-done
	log.Println("closing server")
}
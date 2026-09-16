package config

import (
	"flag"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type HttpServer struct {
	addr string `yaml:"address" envDefault:"localhost"`
	port int `yaml:"port" envDefault:"8080"`
}

type Config struct {
	Env string `yaml:"env" env-required:"true"`
	DBPath string `yaml:"dbPath" env-required:"true"`
	HttpServer HttpServer `yaml:"httpServer"`
}

func MustLoad() *Config {
	var configPath string

	configPath = os.Getenv("CONFIG_PATH")

	if configPath == "" {
		flags := flag.String("config", "","path to config file")
		flag.Parse()

		configPath = *flags

		if configPath == ""{
			log.Fatal("config path not set")
		}
	}
	
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Fatalf("config file does not exist: %s", configPath)
	}

	var config Config
	err := cleanenv.ReadConfig(configPath,&config)
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	return &config
}



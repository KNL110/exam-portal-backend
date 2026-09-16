package config

type HttpServer struct {
	addr string `yaml:"address" envDefault:"localhost"`
	port int `yaml:"port" envDefault:"8080"`
}

type Config struct {
	Env string `yaml:"env" env-required:"true"`
	DBPath string `yaml:"dbPath" env-required:"true"`
	HttpServer HttpServer `yaml:"httpServer"`
}



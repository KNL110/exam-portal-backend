CONFIG ?= ./config/local.yaml
.PHONY: build run

build:
	go build -o bin/main ./cmd/api

run: build
	CONFIG_PATH=$(CONFIG) ./bin/main
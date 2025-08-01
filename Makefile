# TasksTrack Development Makefile

.PHONY: help build up down restart logs logs-client logs-server clean rebuild stop

# Default target
help:
	@echo "Available commands:"
	@echo "  make up          - Start all services"
	@echo "  make build       - Build all services"
	@echo "  make rebuild     - Rebuild and start all services"
	@echo "  make down        - Stop all services"
	@echo "  make stop        - Stop all services (alias for down)"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - Show logs with timestamps"
	@echo "  make logs-client - Show only client logs"
	@echo "  make logs-server - Show only server logs"
	@echo "  make clean       - Remove all containers and volumes"
	@echo "  make status      - Show running containers"

# Start services
up:
	docker-compose up

# Build services
build:
	docker-compose build

# Rebuild and start
rebuild:
	docker-compose up --build -d

# Stop services
down:
	docker-compose down

# Alias for down
stop: down

# Restart services
restart:
	docker-compose restart

# Show logs with timestamps
logs:
	docker-compose logs -f

# Show only client logs
logs-client:
	docker-compose logs -f client

# Show only server logs
logs-server:
	docker-compose logs -f server

# Clean everything
clean:
	docker-compose down -v
	docker-compose rm -f
	docker system prune -f

# Show container status
status:
	docker-compose ps

# Development shortcuts
dev: up logs

# Quick restart when things break
fix: down up logs

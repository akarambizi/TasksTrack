# TasksTrack Development Makefile

.PHONY: help build up down restart logs logs-client logs-server clean rebuild stop

# Helper function to show ready message
define show_ready_message
	@echo ""
	@echo "✓ All services are ready!"
	@echo ""
	@echo "  Client:   http://localhost:3000"
	@echo "  Server:   http://localhost:5206"
	@echo "  Database: postgres://localhost:5432"
	@echo ""
endef

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
	@echo "Starting services..."
	@docker compose up -d
	@sleep 5
	$(call show_ready_message)
	@echo "Showing logs... (Press Ctrl+C to exit, services will keep running)"
	@echo "To stop services, run 'make down'"
	@echo ""
	@sleep 2
	@docker compose logs -f

# Build services
build:
	docker compose build

# Rebuild and start
rebuild:
	@echo "Building and starting services..."
	@docker compose up --build -d
	@sleep 5
	$(call show_ready_message)
	@echo "Run 'make logs' to view logs"

# Stop services
down:
	docker compose down

# Alias for down
stop: down

# Restart services
restart:
	docker compose restart

# Show logs with timestamps
logs:
	docker compose logs -f

# Show only client logs
logs-client:
	docker compose logs -f client

# Show only server logs
logs-server:
	docker compose logs -f server

# Clean everything
clean:
	docker compose down -v
	docker compose rm -f
	docker system prune -f

# Show container status
status:
	docker compose ps

# Development shortcuts
dev: up

# Quick restart when things break
fix: down up

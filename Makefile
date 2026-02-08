# TasksTrack Development Makefile

.PHONY: help build up up-ci down restart logs logs-client logs-server clean rebuild stop fresh fresh-wipe fresh-client fresh-server

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
	@echo "  make up          - Start all services (with logs following)"
	@echo "  make up-ci       - Start all services (CI mode - no log following)"
	@echo "  make build       - Build all services"
	@echo "  make rebuild     - Rebuild and start all services"
	@echo "  make down        - Stop all services"
	@echo "  make stop        - Stop all services (alias for down)"
	@echo "  make restart     - Restart all services"
	@echo "  make logs        - Show logs with timestamps"
	@echo "  make logs-client - Show only client logs"
	@echo "  make logs-server - Show only server logs"
	@echo "  make fresh       - Fresh build with no cache (keeps database)"
	@echo "  make fresh-wipe  - Fresh build with no cache (DELETES DATABASE)"
	@echo "  make fresh-keep-data - Fresh build keeping database data"
	@echo "  make fresh-client - Rebuild only client with no cache"
	@echo "  make fresh-server - Rebuild only server with no cache"
	@echo "  make clean       - Nuclear option: remove all containers and volumes"
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

# Start services for CI (no log following)
up-ci:
	@echo "Starting services for CI..."
	@docker compose up -d
	@sleep 5
	$(call show_ready_message)

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

# Fresh build - use after adding dependencies or major changes (SAFE - keeps data)
fresh:
	@echo "Performing fresh build with no cache (keeping database)..."
	@docker compose down
	@docker compose build --no-cache
	@docker compose up -d
	@sleep 5
	$(call show_ready_message)
	@echo "Fresh build complete (database preserved)!"

# Fresh build with complete wipe (DESTRUCTIVE - deletes database)
fresh-wipe:
	@echo "Performing DESTRUCTIVE fresh build with no cache..."
	@echo "WARNING: This will delete your database!"
	@docker compose down -v
	@docker compose build --no-cache
	@docker compose up -d
	@sleep 5
	$(call show_ready_message)
	@echo "Fresh build complete (database wiped)!"

# Rebuild only client (for frontend dependency changes)
fresh-client:
	@echo "Rebuilding client with no cache..."
	@docker compose stop client
	@docker compose build --no-cache client
	@docker compose up -d client
	@echo "Client rebuilt successfully!"

# Rebuild only server (for backend dependency changes)
fresh-server:
	@echo "Rebuilding server with no cache..."
	@docker compose stop server migration
	@docker compose build --no-cache server migration
	@docker compose up -d migration server
	@echo "Server rebuilt successfully!"

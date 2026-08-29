# Local Domain and Reverse Proxy Setup

This guide explains what was changed, why it was changed, and how to use the app
with either plain localhost or a local domain.

## Why This Was Added

We added a reverse proxy so the app can run behind a single origin.

Without a proxy, local development usually looks like this:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5206`

With a proxy, you can use one URL and route by path:
- App: `http://localhost` or `http://taskstrack.localhost`
- API: `/api` on the same host

Benefits:
- Single origin for frontend and backend paths
- Simpler onboarding URL for manual testing
- Closer to production style (edge proxy in front of services)
- Fewer CORS surprises when app and API share one origin

Important: This is optional infrastructure. You can still use direct service ports.

## What Was Changed

### 1) Added Caddy as reverse proxy

File: `infra/caddy/Caddyfile`

Current routing:
- `http://localhost` and `http://taskstrack.localhost`
- `/api`, `/swagger`, `/health` -> backend (`server:5206`)
- all other paths -> frontend (`client:3000`)

### 2) Added proxy service to Docker Compose

File: `docker-compose.yml`

- New `proxy` service on port `80`
- Uses `infra/caddy/Caddyfile`
- Connected to `frontend` network

### 3) Updated frontend API behavior

Files:
- `client/src/data/api/utils.ts`
- `client/vite.config.ts`

Changes:
- Browser calls use same-origin `/api` by default
- Vite dev proxy forwards `/api` to backend

### 4) Updated backend CORS defaults

Files:
- `server/Program.cs`
- `server/appsettings.json`
- `server/appsettings.Development.json`

Allowed origins include:
- `http://taskstrack.localhost`
- `http://localhost:3000`
- `http://127.0.0.1:3000`

### 5) Migration reliability fix (related)

File: `docker-compose.yml`

The migration container now joins both:
- `backend` (database access)
- `frontend` (internet egress)

Reason:
- EF migration triggers a build step
- Build may need NuGet access (`api.nuget.org`)
- `backend` is internal-only, so migration needed egress path

## How To Run

## Option A: Single-origin via proxy (recommended)

1. Start services:

```bash
make up
```

1. Open either URL:
- `http://localhost`
- `http://taskstrack.localhost`

1. API is available on the same host:
- `http://localhost/api/...`
- `http://taskstrack.localhost/api/...`

## Option B: Direct ports (no proxy URL dependency)

You can still use direct service ports:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5206`

This remains useful for debugging service-specific behavior.

## Troubleshooting

### 502 on `/health` right after restart

This is usually startup timing:
- backend container is still warming up
- retry after a few seconds

### Domain not resolving

`taskstrack.localhost` should resolve to loopback automatically.
If your machine has custom DNS behavior, use `http://localhost`.

### Migration fails during `make up`

Check migration logs:

```bash
docker compose logs migration
```

Common cause:
- temporary network/registry issues during EF build/restore

## Summary

- Caddy is used to provide one local entrypoint and path routing
- It is not strictly required to run the app
- Both workflows are supported:
  - single-origin via proxy
  - direct frontend/backend ports

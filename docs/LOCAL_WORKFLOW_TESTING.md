# Local GitHub Workflow Testing

This project supports local workflow validation using Act.

## Prerequisites

- Docker Desktop is running
- Act is installed (`brew install act`)
- Run from repo root: `/Users/arthurkarambizi/Desktop/Workspace/TasksTrack`

## Repo Defaults

The repository includes `.actrc` with defaults for Apple Silicon compatibility:

- `--container-architecture linux/amd64`
- `-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest`

Because of this, you can run Act commands without repeating those flags.

## List Jobs

```bash
act -l
```

## Run Tests Workflow (Client)

Dry run:

```bash
act -n pull_request -W .github/workflows/run-tests.yml -j client-tests
```

Real run:

```bash
act pull_request -W .github/workflows/run-tests.yml -j client-tests
```

## Run Tests Workflow (Server)

```bash
act pull_request -W .github/workflows/run-tests.yml -j server-tests
```

## Run E2E Workflow

```bash
act pull_request -W .github/workflows/e2e-tests.yml -j test
```

## Troubleshooting

### pnpm not found

If you see `Unable to locate executable file: pnpm`, confirm workflow order is:

1. `Setup pnpm`
2. `Setup Node.js`

### Slow first run

The first execution pulls large runner images and may take several minutes.

### Clean stuck containers

```bash
docker ps -a
docker rm -f $(docker ps -aq) 2>/dev/null || true
```

## Recommended Validation Flow Before PR

1. `act -n pull_request -W .github/workflows/run-tests.yml -j client-tests`
2. `act pull_request -W .github/workflows/run-tests.yml -j client-tests`
3. `act pull_request -W .github/workflows/run-tests.yml -j server-tests`
4. `act pull_request -W .github/workflows/e2e-tests.yml -j test`

If all pass locally, push and verify on GitHub-hosted runners.

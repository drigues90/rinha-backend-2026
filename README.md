# Local Docker Setup

This repository includes a minimal production-like local stack:

- 2 API containers (`api-1` and `api-2`)
- 1 Nginx load balancer exposed on host port `9999`
- Round-robin balancing across both API instances
- Healthchecks on API containers and Nginx startup gated until both APIs are healthy

## Requirements

- Docker Engine + Docker Compose plugin
- Node.js 20+ (for local non-container test execution)

## Run

```bash
docker compose up --build
```

The API will be available at:

- `http://localhost:9999/health`

## Validate balancing

Run multiple requests and check the `instance` field is distributed between `api-1` and `api-2` over time.

```bash
for i in $(seq 1 6); do curl -s http://localhost:9999/health; echo; done
```

Expected shape:

```json
{"status":"ok","instance":"api-1"}
{"status":"ok","instance":"api-2"}
```

Note: round-robin in Nginx distributes requests across upstreams, but strict one-by-one alternation is not guaranteed in every run.

## Local test

```bash
npm test
```

## Compose syntax validation

```bash
docker compose config
```
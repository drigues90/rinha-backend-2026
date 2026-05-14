# Squad Decisions

## Active Decisions

### 2026-05-13T20:20:11.889+00:00: Initial squad cast
**By:** Squad
**What:** Configured the initial Squad for a greenfield Node.js API with Ripley (Lead), Bishop (Backend Dev), Parker (Data), Vasquez (Tester), Hicks (DevOps), plus Scribe and Ralph.
**Why:** Clear ownership lets the team route architecture, implementation, data, QA, and environment work immediately without re-deciding responsibilities.

### 2026-05-13T20:20:11.889+00:00: Initial technical scope
**By:** Squad
**What:** The project starts as a greenfield API in Node.js. Framework, database, and deployment target remain open until the first implementation task.
**Why:** The platform choice is known, but the framework and infrastructure choices were not specified during setup, so the team should not lock them in prematurely.

### 2026-05-13T20:30:14.118+00:00: User directive
**By:** Jonathan Jesus (via Copilot)
**What:** Use Express as the HTTP framework, use no database with all state handled in memory, and keep V1 limited to a single `GET /health` endpoint that returns HTTP 200 to signal the API is working. Proceed with creating the structure and starting development.
**Why:** User request — captured for team memory

### 2026-05-13T20:30:14.118+00:00: Express V1 baseline
**By:** Ripley
**What:** Locked the first API slice to plain Node.js + Express with no database, a split between `src/app.js` and `src/server.js`, and versioned route files under `src/routes/v1/`. The only V1 behavior is `GET /health`, returning HTTP 200 with a small JSON body.
**Why:** This keeps the initial architecture small, keeps runtime boot separate from the app for tests, and leaves a clear place to grow new V1 routes without adding controller/service layers before they are needed.

### 2026-05-13T20:30:14.118+00:00: V1 Test Contract — GET /health
**By:** Vasquez
**What:** Established the minimum automated test contract for V1. Test file: `src/__tests__/health.test.js` with Jest + Supertest. Seven core assertions: (1) `GET /health` → 200, (2) Content-Type is `application/json`, (3) body contains `{ status: 'ok' }`, (4) `POST /health` → 404/405, (5) `PUT /health` → 404/405, (6) unknown routes → 404, (7) extra headers → 200. App export pattern: `src/app.js` exports without `listen()`, `src/server.js` calls `listen()` for Supertest compatibility.
**Why:** Greenfield API without baseline tests is a trust gap. Clear expectations before implementation ensure Ripley has acceptance criteria for the first merge.

### 2026-05-14T00:00:00.000+00:00: Local Docker + Nginx load balancer baseline
**By:** Hicks
**What:** Standardized local runtime with Docker Compose using `api-1` and `api-2` from the same app image behind `nginx` on host port `9999`, with round-robin upstream and `/health` returning an `instance` identifier for verification.
**Why:** Reproducible local infra that mirrors a production-style reverse-proxy topology while keeping bootstrap to a single command.

### 2026-05-14T00:00:00.000+00:00: Startup readiness gating and upstream hardening for local topology
**By:** Vasquez
**What:** Added API healthchecks and `depends_on` health conditions to gate `nginx` startup, introduced upstream fail parameters (`max_fails`/`fail_timeout`) in Nginx, and updated docs to validate distribution over time instead of strict alternation.
**Why:** Prevent transient startup `502` behavior and align validation guidance with real round-robin behavior.

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction

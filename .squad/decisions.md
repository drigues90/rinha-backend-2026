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

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction

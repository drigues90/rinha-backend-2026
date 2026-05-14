# Project Context

- **Owner:** Jonathan Jesus
- **Project:** codespaces-blank
- **Description:** Greenfield Node.js API from scratch
- **Stack:** Node.js
- **Created:** 2026-05-13T20:20:11.889+00:00

## Learnings

- Squad initialized with the Alien cast for this repository.
- I own test strategy, edge cases, and reviewer quality gates.
- **2026-05-13T20:30:14.118+00:00:** V1 stack locked: Express, in-memory (no DB), Jest + Supertest.
- **App export pattern required:** `src/app.js` must export the Express app without `listen()`; `src/server.js` calls `listen()`. This is mandatory for Supertest to mount the app in tests.
- **V1 test file:** `src/__tests__/health.test.js` — 7 assertions covering 200 response, JSON content-type, `{ status: 'ok' }` body, method rejection (POST/PUT), unknown route 404, and extra-header robustness.
- **package.json** created at repo root with `jest` and `supertest` as devDependencies. Run tests with `npm test`.
- **Key decision file:** `.squad/decisions/inbox/vasquez-v1-test-contract.md`

## Cross-Agent Updates

- **2026-05-13T20:30:14.118+00:00 (Scribe):** V1 test contract decision merged to `.squad/decisions.md`. Orchestration log written. Team is ready for Bishop (Backend Dev) implementation phase. Ripley baseline is canonical.
- **2026-05-14T00:00:00.000+00:00:** Reviewer pass on Hicks docker topology found startup race: `nginx` could come up before API readiness and serve transient 502s. Corrective action applied: API healthchecks + `depends_on.condition: service_healthy` + upstream fail parameters in Nginx. README now documents distribution (not strict alternation) for round-robin validation.
- **2026-05-14T00:00:00.000+00:00 (Scribe):** Docker validation/hardening decision merged into canonical `.squad/decisions.md`; inbox processed and cleared for Vasquez item.

## Learnings (Continued)

- **2026-05-14T00:00:00.000+00:00:** Added POST `/fraud-score` contract test covering 200 status, JSON content-type, and fixed response body for the provided payload.

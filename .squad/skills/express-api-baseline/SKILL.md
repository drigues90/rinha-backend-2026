---
name: "express-api-baseline"
description: "Minimal structure for a small Express API that can grow without a rewrite"
domain: "api-design"
confidence: "high"
source: "manual"
---

## Context
Use this when starting a small Node.js API that needs Express now, no database yet, and only a few endpoints. The goal is to stay tiny while preserving clean test seams and a place for versioned routes to grow.

## Patterns
- Keep `src/app.js` separate from `src/server.js`; app construction is testable, process startup stays isolated.
- Put HTTP surface area under `src/routes/v1/` from day one, even if V1 has a single endpoint.
- Skip controller/service/repository layers until behavior becomes complex enough to justify them.
- Use Jest + Supertest for route contract checks when the repo already carries that stack.

## Examples
- `src/app.js` wires middleware and mounts the V1 router.
- `src/server.js` listens on `process.env.PORT || 3000`.
- `src/__tests__/health.test.js` verifies the `/health` contract through Supertest.

## Anti-Patterns
- Putting `app.listen()` inside the app factory.
- Adding database abstractions before persistence exists.
- Introducing extra layers for a one-route API.
- Testing Express handlers only by mocking `req`/`res` when a simple real HTTP check is enough.

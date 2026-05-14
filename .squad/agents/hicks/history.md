# Project Context

- **Owner:** Jonathan Jesus
- **Project:** codespaces-blank
- **Description:** Greenfield Node.js API from scratch
- **Stack:** Node.js
- **Created:** 2026-05-13T20:20:11.889+00:00

## Learnings

- Squad initialized with the Alien cast for this repository.
- I own tooling, environment setup, automation, and CI foundations.
- Added a local Docker topology with Nginx on host port 9999 and two API instances in round robin.
- Exposing an instance identifier in `/health` makes LB validation objective without extra observability tooling.
- Kept runtime minimal: single app image reused by both API services, static Nginx config mounted read-only.
- Updated local Compose limits to approximate a shared 1 CPU / 350MB cap across all services, since Compose lacks a true global limit.

## Cross-Agent Updates

- **2026-05-14T00:00:00.000+00:00 (Scribe):** Docker LB baseline decision merged into canonical `.squad/decisions.md`; inbox processed and cleared for Hicks item.

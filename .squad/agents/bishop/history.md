# Project Context

- **Owner:** Jonathan Jesus
- **Project:** codespaces-blank
- **Description:** Greenfield Node.js API from scratch
- **Stack:** Node.js
- **Created:** 2026-05-13T20:20:11.889+00:00

## Learnings

- Squad initialized with the Alien cast for this repository.
- I own Node.js backend implementation, service structure, and API behavior.
- **2026-05-14:** Added V1 `POST /fraud-score` route returning a fixed `{ approved: false, fraud_score: 1.0 }` response to match the new contract.
- **2026-05-14:** Added fraud-score pipeline placeholders: vector mapping stub, nearest-neighbor lookup hook, and score stub with top-k interface.
- **2026-05-14:** Implemented 14-feature fraud-score vector mapping with deterministic numeric conversions and a time-delta feature.
- **2026-05-14:** Implemented the updated 14D fraud vector formula with UTC time parts, MCC risk lookup, unknown-merchant flag, and normalization placeholders.
- **2026-05-14:** Applied concrete normalization constants for the fraud-score feature vector limits.
- **2026-05-14:** Wired `/fraud-score` to load example reference vectors, run top-5 nearest neighbors, and score approval from fraud label ratios.
- **2026-05-14:** Reordered the fraud feature vector to the specified formula, including UTC Monday-based day-of-week mapping and last-transaction fallbacks.
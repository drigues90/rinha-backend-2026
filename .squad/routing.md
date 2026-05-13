# Work Routing

How to decide who handles what.

## Routing Table

| Work Type | Route To | Examples |
|-----------|----------|----------|
| Architecture & scope | Ripley | Project structure, technical trade-offs, API boundaries |
| Node.js backend | Bishop | Routes, controllers, services, validation, error handling |
| Data & persistence | Parker | Schema design, repositories, migrations, query strategy |
| Testing | Vasquez | Test strategy, edge cases, regression checks, reviewer QA |
| DevOps & tooling | Hicks | Local setup, scripts, CI, containers, environment automation |
| Code review | Ripley | Review PRs, check quality, suggest improvements |
| Scope & priorities | Ripley | What to build next, trade-offs, decisions |
| Session logging | Scribe | Automatic — never needs routing |

## Issue Routing

| Label | Action | Who |
|-------|--------|-----|
| `squad` | Triage: analyze issue, assign `squad:{member}` label | Ripley |
| `squad:ripley` | Pick up architecture and review work | Ripley |
| `squad:bishop` | Pick up backend implementation work | Bishop |
| `squad:parker` | Pick up data and persistence work | Parker |
| `squad:vasquez` | Pick up testing and quality work | Vasquez |
| `squad:hicks` | Pick up tooling and infrastructure work | Hicks |

### How Issue Assignment Works

1. When a GitHub issue gets the `squad` label, **Ripley** triages it — analyzing content, assigning the right `squad:{member}` label, and commenting with triage notes.
2. When a `squad:{member}` label is applied, that member picks up the issue in their next session.
3. Members can reassign by removing their label and adding another member's label.
4. The `squad` label is the "inbox" — untriaged issues waiting for Lead review.

## Rules

1. **Eager by default** — spawn all agents who could usefully start work, including anticipatory downstream work.
2. **Scribe always runs** after substantial work, always as `mode: "background"`. Never blocks.
3. **Quick facts → coordinator answers directly.** Don't spawn an agent for "what port does the server run on?"
4. **When two agents could handle it**, pick the one whose domain is the primary concern.
5. **"Team, ..." → fan-out.** Spawn all relevant agents in parallel as `mode: "background"`.
6. **Anticipate downstream work.** If a feature is being built, spawn the tester to write test cases from requirements simultaneously.
7. **Issue-labeled work** — when a `squad:{member}` label is applied to an issue, route to that member. Ripley handles all `squad` (base label) triage.

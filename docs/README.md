# TalkSpark Docs

Durable source of truth for product decisions. Ephemeral plans and task tracking live in
`.ai/`; anything meant to last lives here.

## Structure

- **philosophy/** — what TalkSpark is and the rules it follows
  - [product-philosophy.md](./philosophy/product-philosophy.md) — POV, promise, principles,
    interaction boundary, the two pillars, generate-first stance
  - [spark-taxonomy.md](./philosophy/spark-taxonomy.md) — **single source of truth** for the
    spark/topic/follow-up shapes, quality rubric, anti-patterns, prompt patterns, status
    workflow
- **research/** — the evidence base
  - [conversation-research.md](./research/conversation-research.md) — findings → product
    rules, research-to-feature map, measurement plan, bibliography
- **features/** — one doc per surface
  - [generation-engine.md](./features/generation-engine.md) — the core primitive (slice 1)
  - [topics.md](./features/topics.md) — the second pillar
  - [prep-partner.md](./features/prep-partner.md)
  - [game-modes.md](./features/game-modes.md)
- **strategy/**
  - [competitive-analysis.md](./strategy/competitive-analysis.md) — positioning + a method
    for mapping competitors

## Conventions

- Define a thing once. Other docs **reference** the taxonomy rather than restating it.
- Keep philosophy stable; let `.ai/current/build-plan.md` carry the changing execution plan.
- When adding research, include the claim, the limitation, and the product rule.

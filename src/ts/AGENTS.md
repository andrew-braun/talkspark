# ts — Shared types

## Import pattern

```ts
import type { SparkData } from 'ts/sparks';
```

The `ts` alias maps to `src/ts/` (see `svelte.config.js`).

## Files

| File                                                  | Purpose                                                           |
| ----------------------------------------------------- | ----------------------------------------------------------------- |
| `sparks.ts`                                           | Re-export barrel — import `SparkData` here                        |
| `spark.ts`                                            | Full `Spark` interface + taxonomy union types (future DB columns) |
| `topic.ts`, `followup.ts`, `critique.ts`, `params.ts` | Reserved for future features — not yet wired                      |

## SparkData

`SparkData` is an alias for `Spark` in `spark.ts`. Runtime enrichment in `generate.remote.ts` sets `id`, `index`, `type`, `content`, `created_at`.

When adding fields used at runtime, update `spark.ts` and any consumers together.

## Taxonomy types

Union types in `spark.ts` match `docs/philosophy/spark-taxonomy.md`. They are exported for future game modes; Knip ignores unused exports until those features land.

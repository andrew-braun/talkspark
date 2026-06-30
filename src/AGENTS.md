# src — Conventions

## Import aliases

`svelte.config.js` registers these path aliases (no `$` prefix, no `src/` prefix needed):

| Alias        | Resolves to      |
| ------------ | ---------------- |
| `components` | `src/components` |
| `stores`     | `src/stores`     |
| `styles`     | `src/styles`     |
| `ts`         | `src/ts`         |
| `lib`        | `src/lib`        |

`$lib` (SvelteKit built-in) also resolves to `src/lib`. The bare aliases above are preferred throughout the codebase for consistency.

Server-only SvelteKit modules (`$env/static/private`, `$app/server`) must stay inside `src/lib/server/` or inside `*.remote.ts` files. Importing them from client code or regular components breaks the build.

## TypeScript

- Strict mode is on (`tsconfig.json` extends `.svelte-kit/tsconfig.json`). Do not disable it.
- Shared types live in `src/ts/`. Import them with the `ts` alias: `import type { SparkData } from "ts/sparks"`.
- `src/app.d.ts` holds global SvelteKit `App` namespace augmentations.

## Svelte 5 runes

All reactive code uses Svelte 5 runes. Do not use Svelte 4 patterns (`export let` for props, `$:` for reactivity, `<slot>` for injectable content).

| Pattern              | Rune                                     |
| -------------------- | ---------------------------------------- |
| Component props      | `let { foo, bar } = $props()`            |
| Local reactive state | `let x = $state(initial)`                |
| Derived value        | `let y = $derived(expression)`           |
| Side effect          | `$effect(() => { ... })`                 |
| Injectable content   | `{#snippet name()}` / `{@render name()}` |

## Modules

`package.json` sets `"type": "module"`. Every file is an ES module; CommonJS `require()` is not available.

## File naming

- Svelte components: PascalCase (`Spark.svelte`, `CopyButton.svelte`)
- TypeScript modules: kebab-case (`chat-api.ts`, `random-topics.ts`)
- Store files: kebab-case with `.svelte.ts` extension when they contain rune-based module state (`sparks.svelte.ts`, `loading.svelte.ts`)
- Remote function files: kebab-case with `.remote.ts` extension (`generate.remote.ts`)

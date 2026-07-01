---
name: talkspark-sveltekit
description: >-
    TalkSpark SvelteKit conventions: remote functions, Svelte 5 runes, routing,
    path aliases, Zag interactive UI. Use when editing routes, stores, lib, or
    interactive components.
---

# TalkSpark SvelteKit

## Remote functions

- AI features use `*.remote.ts` in `src/lib/` with `command()` — not `+server.ts` routes
- `remoteFunctions` is enabled in `svelte.config.js`
- Example: `generateSparks` in `src/lib/generate.remote.ts`

## Svelte 5

- Runes only: `$props()`, `$state()`, `$derived()`, `$effect()` — no `export let`, `$:`, `<slot>`
- Snippets for children: `{@render children?.()}`

## Path aliases (svelte.config.js)

| Alias        | Path             |
| ------------ | ---------------- |
| `components` | `src/components` |
| `stores`     | `src/stores`     |
| `styles`     | `src/styles`     |
| `ts`         | `src/ts`         |
| `lib`        | `src/lib`        |

Also `$lib`, `$app/*` from SvelteKit.

## Navigation

Use `resolve()` from `$app/paths` for internal `href` and `goto()` targets.

## Server boundary

`src/lib/server/` is server-only. Never import it from client components or stores.

## Interactive UI

Popovers, modals, dropdowns, drawers, toggles, menus, and similar patterns use **Zag** (`@zag-js/svelte` + `@zag-js/<machine>`). Read [`talkspark-interactive-ui/SKILL.md`](../talkspark-interactive-ui/SKILL.md) before implementing — do not hand-roll overlay/focus behavior or add another UI library.

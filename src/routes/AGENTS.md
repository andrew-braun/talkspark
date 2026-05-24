# routes — Conventions

## Pages

| Route | File | Purpose |
| ----- | ---- | ------- |
| `/` | `+page.svelte` | Home — random spark generator |
| `/sparks` | `sparks/+page.svelte` | Saved sparks collection |

## Root layout

`+layout.svelte` is the root layout. It renders:

1. `Header` — site navigation
2. `Loading` — sticky top-right loading indicator, keyed to `loadingState.isLoading`
3. `{@render children()}` — page content, wrapped in `{#key data.pathname}` for page transitions

`+layout.ts` passes `pathname` from `url` to the layout data so child pages can read the current route without importing `$app/state` themselves.

## Page transitions

Pages slide in/out using Svelte `fly` transitions with `cubicOut`/`cubicIn` easing. The `{#key data.pathname}` block in `+layout.svelte` re-mounts `<main>` on each route change to trigger the transition. Do not remove or move this wrapper.

## Adding a new page

1. Create `src/routes/<name>/+page.svelte`.
2. If it needs a nav entry, add a `NavLink` in `src/components/layout/header/nav/Nav.svelte`.
3. Add server data with `+page.ts` (universal) or `+page.server.ts` (server-only) alongside the page if needed.
4. Add a `+layout.svelte` at that route level only if the new page needs a different layout from the root.

## No manual API routes

There is no `src/routes/api/` directory. Spark generation is handled by `src/lib/generate.remote.ts` via the `remoteFunctions` experimental feature. Do not add `+server.ts` routes for new AI or data-mutation features — use a `.remote.ts` file in `src/lib/` instead.

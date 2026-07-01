# TalkSpark Agent Guide

## Project overview

TalkSpark is a SvelteKit app that generates short AI-powered conversation starters called sparks. The app supports random spark generation through a server-side OpenAI call, then stores generated and saved sparks in browser localStorage.

Use the codebase and this file as the source of truth for project behavior. The README describes the product; this file describes how to work inside it.

## Working agreement

- Prefer `pnpm` for all package management and script execution.
- Keep changes minimal and consistent with the current code style: tabs in TypeScript and Svelte files, concise helper functions, no broad refactors unless the task requires them.
- Preserve the existing SvelteKit structure and file-based routing. Do not introduce a new state library, CSS framework, or API layer unless the task explicitly requires it.
- **Interactive UI (mandatory):** popovers, dropdowns, modals, drawers, toggles, menus, tooltips, and similar patterns use **[Zag](https://zagjs.com/)** via `@zag-js/svelte` plus per-machine `@zag-js/*` packages. Check Zag before custom interaction code or another UI library. See [`talkspark-interactive-ui`](.agents/skills/talkspark-interactive-ui/SKILL.md).
- When touching browser persistence, guard browser-only APIs with `browser` from `$app/environment`, as this codebase already does.
- When touching OpenAI integration, keep API-key usage server-only. Never move secret-dependent code into client files or public env variables.
- **Design system (mandatory for UI):** token values in [`src/styles/variables.css`](src/styles/variables.css); semantics and rules in [`src/styles/DESIGN_SYSTEM.md`](src/styles/DESIGN_SYSTEM.md). Never duplicate token values in markdown.
- **Atomic design:** components live in `atoms/`, `molecules/`, `organisms/`, `templates/` with functional subfolders (`nav/`, `actions/`, `sparks/`, `layout/`).
- **Token efficiency:** read `DESIGN_SYSTEM.md` once per task; cite paths instead of pasting file contents; use [`.agents/skills/`](.agents/skills/) for workflows.

## Setup and validated commands

- Install dependencies with `pnpm install` from the repo root.
- Verified tool versions: Node `v24.15.0`, pnpm `11.9.0` (pinned in `package.json` via Volta).
- `pnpm install` also warns about ignored dependency build scripts (`@parcel/watcher`, `@sveltejs/kit`, `esbuild`, `svelte-preprocess`). Investigate pnpm's build-script approval state before assuming app code is at fault if the build behaves unexpectedly.

Main validation commands:

- `pnpm check` — runs `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`
- `pnpm build` — production Vite build
- `pnpm dev` — local dev server
- `pnpm preview` — serve the production build locally
- `pnpm lint` — ESLint
- `pnpm lint:style` — Stylelint (CSS, SCSS, Svelte `<style>` blocks)
- `pnpm format:check` — Prettier
- `pnpm test` — Vitest unit/component tests
- `pnpm test:e2e` — Playwright smoke tests (builds + previews the app first)
- `pnpm knip` — unused files, exports, and dependencies
- `pnpm validate` — full gate: `check` + `lint` + `lint:style` + `format:check` + `knip` + `test` (CI runs this, then `build`)

Verified command outcomes:

- `pnpm build` succeeds when `OPENAI_API_KEY` is defined (even a dummy value works for packaging checks).
- `pnpm build` fails immediately without `OPENAI_API_KEY` because `src/lib/server/api/gpt/init.ts` imports it from `$env/static/private`.
- Sass emits `legacy-js-api` deprecation warnings during `pnpm check` and `pnpm build` — expected noise, not a build failure.
- `pnpm test:e2e` requires Playwright browsers (`pnpm exec playwright install chromium` after first install).
- Husky runs `lint-staged` on pre-commit and `commitlint` on commit-msg. Use [Conventional Commits](https://www.conventionalcommits.org/) subjects.

## Architecture map

### Generation flow

```text
UI button click
  → GenerateSparksButton.handleSparkGeneration()
  → generateSparks({ type: "random" })          ← remote function in src/lib/generate.remote.ts
  → fetchChatResponse()                          ← src/lib/server/api/gpt/chat-api.ts
  → OpenAI Responses API (gpt-5.4-mini)
  → JSON parse structured output
  → enrich sparks (UUID, type, index, timestamp)
  → generatedSparks.add(sparks)                  ← src/stores/sparks.svelte.ts
  → $effect syncs store → localStorage
```

### Key files

| File                                       | Role                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `src/routes/+page.svelte`                  | Home page; mounts the random spark prompt UI                           |
| `src/routes/sparks/+page.svelte`           | Saved sparks page at `/sparks`                                         |
| `src/routes/+layout.svelte`                | Root layout: Header, Loading indicator, page transitions               |
| `src/lib/generate.remote.ts`               | `command()` remote function; owns prompt building and spark enrichment |
| `src/lib/server/api/gpt/init.ts`           | Creates the OpenAI client from `OPENAI_API_KEY`                        |
| `src/lib/server/api/gpt/chat-api.ts`       | Calls `openai.responses.create` with a strict JSON schema              |
| `src/stores/sparks.svelte.ts`              | `generatedSparks` and `savedSparks` stores with localStorage sync      |
| `src/stores/loading.svelte.ts`             | Global `loadingState.isLoading` flag                                   |
| `src/lib/data/random-topics.ts`            | 432 random topic strings used as prompt seeds                          |
| `src/ts/sparks.ts`                         | `SparkData` type (alias for `Spark` in `spark.ts`)                     |
| `src/styles/DESIGN_SYSTEM.md`              | Design system rules and semantics (no values)                          |
| `src/styles/variables.css`                 | Design token values (SSOT)                                             |
| `src/components/`                          | All UI components (see `src/components/AGENTS.md`)                     |
| `.agents/skills/talkspark-interactive-ui/` | Zag workflow for popovers, modals, toggles, menus, etc.                |
| `src/styles/`                              | CSS variables, global SCSS, keyframe animations                        |

### Remote functions vs API routes

SvelteKit's experimental `remoteFunctions` feature is enabled in `svelte.config.js`. Files named `*.remote.ts` in `src/lib/` export `command()` calls that act as typed server functions callable directly from client components — no `+server.ts` route needed. Do not add manual API routes for new AI features; use a `.remote.ts` file instead.

### Persistence

- `generatedSparks` → localStorage key `all_sparks`
- `savedSparks` → localStorage key `saved_sparks`
- Both stores initialize from localStorage on page load and write back reactively via `$effect`.

## Behavior details that matter

- The three sparks per generation follow a fixed structure: one about the topic, one about its opposite, one funny/weird. Change the prompt only if you intend to change this structure.
- The OpenAI call uses a strict `json_schema` format in the Responses API — not the legacy Chat Completions API. `chatResponse` is already parsed JSON text; calling `JSON.parse(chatResponse)` extracts `{ sparks: [{ content }] }`.
- `SparkData` includes `created_at` via the `Spark` interface in `src/ts/spark.ts`; `generate.remote.ts` sets it at enrichment time.
- `Sparks.svelte` sorts by `created_at` descending so new sparks appear at the top.
- Gradient accents cycle through `gradient-1` to `gradient-4` using `index % 4` — there are only four gradient CSS variables for spark cards.

## Environment and secrets

- `OPENAI_API_KEY` is required for server-side generation.
- Use `.env.local` for local development. Never commit API keys or expose them through public environment variables.

## Change guidance

- **UI changes**: edit under `src/components/`, `src/routes/`, and `src/styles/` without touching server code.
- **New interactive components**: read [`talkspark-interactive-ui`](.agents/skills/talkspark-interactive-ui/SKILL.md) first; implement with Zag, style with design tokens.
- **Generation behavior**: inspect both `src/lib/generate.remote.ts` (prompt structure, enrichment) and `src/lib/server/api/gpt/chat-api.ts` (model invocation, JSON schema). Keep them coupled — the schema must match what the prompt asks for.
- **New spark types**: add a new `command()` in a new `.remote.ts` file; add a corresponding prompt UI under `src/components/organisms/prompts/`.
- **Persistence changes**: update both the store factory in `sparks.svelte.ts` and any consumers that read from localStorage keys directly.

## Validation guidance

- After code changes, run the narrowest relevant command first.
- For component, store, or type changes: `pnpm check`.
- For build-safety validation: `OPENAI_API_KEY=dummy pnpm build`.
- For utility or component behavior changes: `pnpm test`.
- For routing or page-level UI changes: `pnpm test:e2e`.
- Before opening a PR or after large changes: `pnpm validate` and `OPENAI_API_KEY=dummy pnpm build`.
- If you change generation behavior and cannot execute the live OpenAI flow, say so explicitly and validate everything else locally.

## Agent skills

Project skills live in [`.agents/skills/`](.agents/skills/). Optional: symlink `.cursor/skills` → `.agents/skills` for Cursor discovery.

| Skill                         | When to use                                                          |
| ----------------------------- | -------------------------------------------------------------------- |
| `talkspark-design-system`     | **Mandatory** before editing styles                                  |
| `talkspark-interactive-ui`    | **Mandatory** before popovers, modals, toggles, menus, drawers, etc. |
| `talkspark-validate`          | Before claiming a task is done                                       |
| `talkspark-sveltekit`         | Routes, stores, remote functions, runes                              |
| `talkspark-openai-generation` | Generation prompt/schema changes                                     |
| `talkspark-token-discipline`  | Multi-file tasks; avoid token waste                                  |
| `karpathy-guidelines`         | Any implementation — simplicity, surgical diffs                      |
| `systematic-debugging`        | Generation/store/persistence bugs                                    |
| `token-budget-discipline`     | Long sessions; parallel reads                                        |

Optional external install (not vendored):

```bash
npx skills add JuliusBrussee/caveman -a cursor
```

## Known gaps

- Smoke tests only — generation flow is not covered by E2E tests (requires live OpenAI).
- Taxonomy types in `src/ts/spark.ts` and reserved files (`topic.ts`, etc.) are for future game modes.
- Stylelint token literal rules are warnings only (Phase A) — not CI-blocking.

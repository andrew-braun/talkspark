# TalkSpark Agent Guide

## Project overview

TalkSpark is a SvelteKit app that generates short AI-powered conversation starters called sparks. The app supports random spark generation through a server-side OpenAI call, then stores generated and saved sparks in browser localStorage.

Use the codebase and this file as the source of truth for project behavior. The README describes the product; this file describes how to work inside it.

## Working agreement

- Prefer `pnpm` for all package management and script execution.
- Keep changes minimal and consistent with the current code style: tabs in TypeScript and Svelte files, concise helper functions, no broad refactors unless the task requires them.
- Preserve the existing SvelteKit structure and file-based routing. Do not introduce a new state library, CSS framework, or API layer unless the task explicitly requires it.
- When touching browser persistence, guard browser-only APIs with `browser` from `$app/environment`, as this codebase already does.
- When touching OpenAI integration, keep API-key usage server-only. Never move secret-dependent code into client files or public env variables.

## Setup and validated commands

- Install dependencies with `pnpm install` from the repo root.
- Verified tool versions: Node `v24.15.0`, pnpm `11.9.0` (pinned in `package.json` via Volta).
- `pnpm install` warns that the lockfile was written by an older pnpm version. Expect a lockfile update when installing with a newer pnpm.
- `pnpm install` also warns about ignored dependency build scripts (`@parcel/watcher`, `@sveltejs/kit`, `esbuild`, `svelte-preprocess`). Investigate pnpm's build-script approval state before assuming app code is at fault if the build behaves unexpectedly.

Main validation commands:

- `pnpm check` — runs `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`
- `pnpm build` — production Vite build
- `pnpm dev` — local dev server
- `pnpm preview` — serve the production build locally

Verified command outcomes:

- `pnpm build` succeeds when `OPENAI_API_KEY` is defined (even a dummy value works for packaging checks).
- `pnpm build` fails immediately without `OPENAI_API_KEY` because `src/lib/server/api/gpt/init.ts` imports it from `$env/static/private`.
- Sass emits `legacy-js-api` deprecation warnings during `pnpm check` and `pnpm build` — expected noise, not a build failure.

There is no lint script and no test suite. Do not claim lint or test coverage unless you add the tooling.

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

| File | Role |
| ---- | ---- |
| `src/routes/+page.svelte` | Home page; mounts the random spark prompt UI |
| `src/routes/sparks/+page.svelte` | Saved sparks page at `/sparks` |
| `src/routes/+layout.svelte` | Root layout: Header, Loading indicator, page transitions |
| `src/lib/generate.remote.ts` | `command()` remote function; owns prompt building and spark enrichment |
| `src/lib/server/api/gpt/init.ts` | Creates the OpenAI client from `OPENAI_API_KEY` |
| `src/lib/server/api/gpt/chat-api.ts` | Calls `openai.responses.create` with a strict JSON schema |
| `src/lib/client/gpt/chat.ts` | Legacy client `fetch` wrapper for `/api/generate` (kept for reference) |
| `src/stores/sparks.svelte.ts` | `generatedSparks` and `savedSparks` stores with localStorage sync |
| `src/stores/loading.svelte.ts` | Global `loadingState.isLoading` flag |
| `src/lib/data/random-topics.ts` | 432 random topic strings used as prompt seeds |
| `src/ts/sparks.ts` | `SparkData` interface |
| `src/components/` | All UI components (see `src/components/AGENTS.md`) |
| `src/styles/` | CSS variables, global SCSS, keyframe animations |

### Remote functions vs API routes

SvelteKit's experimental `remoteFunctions` feature is enabled in `svelte.config.js`. Files named `*.remote.ts` in `src/lib/` export `command()` calls that act as typed server functions callable directly from client components — no `+server.ts` route needed. Do not add manual API routes for new AI features; use a `.remote.ts` file instead.

### Persistence

- `generatedSparks` → localStorage key `all_sparks`
- `savedSparks` → localStorage key `saved_sparks`
- Both stores initialize from localStorage on page load and write back reactively via `$effect`.

## Behavior details that matter

- The three sparks per generation follow a fixed structure: one about the topic, one about its opposite, one funny/weird. Change the prompt only if you intend to change this structure.
- The OpenAI call uses a strict `json_schema` format in the Responses API — not the legacy Chat Completions API. `chatResponse` is already parsed JSON text; calling `JSON.parse(chatResponse)` extracts `{ sparks: [{ content }] }`.
- `SparkData` does not include `created_at` in its interface definition (`src/ts/sparks.ts`), but `generate.remote.ts` adds it at runtime. The sort utility in `Sparks.svelte` depends on this field being present.
- `Sparks.svelte` sorts by `created_at` descending so new sparks appear at the top.
- Gradient accents cycle through `gradient-1` to `gradient-4` using `index % 4` — there are only four gradient CSS variables for spark cards.

## Environment and secrets

- `OPENAI_API_KEY` is required for server-side generation.
- Use `.env.local` for local development. Never commit API keys or expose them through public environment variables.

## Change guidance

- **UI changes**: edit under `src/components/`, `src/routes/`, and `src/styles/` without touching server code.
- **Generation behavior**: inspect both `src/lib/generate.remote.ts` (prompt structure, enrichment) and `src/lib/server/api/gpt/chat-api.ts` (model invocation, JSON schema). Keep them coupled — the schema must match what the prompt asks for.
- **New spark types**: add a new `command()` in a new `.remote.ts` file; add a corresponding prompt UI under `src/components/prompts/`.
- **Persistence changes**: update both the store factory in `sparks.svelte.ts` and any consumers that read from localStorage keys directly.

## Validation guidance

- After code changes, run the narrowest relevant command first.
- For component, store, or type changes: `pnpm check`.
- For build-safety validation: `OPENAI_API_KEY=dummy pnpm build`.
- If you change generation behavior and cannot execute the live OpenAI flow, say so explicitly and validate everything else locally.

## Known gaps

- No automated tests, no linter, no CI configuration.
- `SparkData` in `src/ts/sparks.ts` does not declare `created_at`, but it is added at runtime in `generate.remote.ts`. This is a latent type gap.
- `src/lib/client/gpt/chat.ts` (`getSpark`) is a legacy fetch wrapper that predates the remote functions implementation. It is unused in the current flow but kept in the repo.
- `@lottiefiles/lottie-player` and `@popperjs/core` are listed as dependencies but do not appear to be actively used in current component code.

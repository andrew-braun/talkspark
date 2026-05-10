# TalkSpark Agent Guide

## Project overview

- TalkSpark is a SvelteKit app that generates short AI-powered conversation starters called sparks.
- The app currently supports random spark generation through a server-side OpenAI call, then stores generated and saved sparks in browser localStorage.
- Treat the README as outdated scaffold text. Use the codebase and this file as the source of truth for project behavior.

## Working agreement

- Prefer `pnpm` for all package management and script execution in this repo.
- Keep changes minimal and consistent with the current code style: tabs in most TypeScript and Svelte files, concise helper functions, and no broad refactors unless the task requires them.
- Preserve the existing SvelteKit structure and file-based routing. Do not introduce a new state library, CSS framework, or API layer unless the task explicitly requires it.
- When touching browser persistence, guard browser-only APIs with `$app/environment` as this codebase already does.
- When touching OpenAI integration, keep API-key usage server-only and avoid moving secret-dependent code into client files.

## Setup and validated commands

- Install dependencies with `pnpm install` from the repository root.
- Verified local tool versions used while authoring these instructions: Node `v24.15.0`, pnpm `10.33.0`.
- `pnpm install` succeeds, but pnpm `10.33.0` warns that the committed `pnpm-lock.yaml` is from an older lockfile format. Expect a lockfile update if you install with a newer pnpm.
- `pnpm install` also warns about ignored dependency build scripts (`@parcel/watcher`, `@sveltejs/kit`, `esbuild`, `svelte-preprocess`). If local build behavior looks wrong, inspect pnpm's build-script approval state before assuming the app code is at fault.
- Main validation commands:
  - `pnpm check` runs `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`
  - `pnpm build` runs the production Vite build
  - `pnpm dev` starts the local dev server
  - `pnpm preview` serves the production build locally
- Verified command outcomes in the current baseline:
  - `pnpm build` succeeds when `OPENAI_API_KEY` is defined, even as a dummy value for local packaging checks.
  - `pnpm build` fails immediately if `OPENAI_API_KEY` is unset because `src/lib/server/api/gpt/init.ts` imports it from `$env/static/private`.
  - `pnpm check` currently fails even with `OPENAI_API_KEY` set because of existing `openai` SDK type mismatches in `src/lib/server/api/gpt/chat-api.ts`.
- Current validation noise to expect:
  - Sass emits repeated `legacy-js-api` deprecation warnings during `pnpm check` and `pnpm build`.
- There is currently no lint script and no test suite. Do not claim lint or test coverage unless you add the tooling.

## Architecture map

- `src/routes/+page.svelte` is the home page and mounts the random spark prompt UI.
- `src/routes/api/generate/+server.ts` is the main POST endpoint for spark generation.
- `src/lib/server/api/gpt/init.ts` creates the OpenAI client using `OPENAI_API_KEY` from `$env/static/private`.
- `src/lib/server/api/gpt/chat-api.ts` wraps the OpenAI chat completion request and parses the response content.
- `src/lib/client/gpt/chat.ts` is the client fetch wrapper for `/api/generate`.
- `src/stores/sparks/generated-sparks.ts` and `src/stores/sparks/saved-sparks.ts` hold persisted spark state.
- `src/stores/utils/local-storage.ts` contains the browser-guarded localStorage helpers.
- `src/components/` contains the UI, especially spark cards, action buttons, loading states, and layout components.
- `src/lib/data/random-topics.ts` provides the random topic seeds used to vary prompts.
- `src/ts/` holds shared types for spark data and chat completion responses.

## Behavior details that matter

- The generate flow is: UI button -> `getSpark()` -> `POST /api/generate` -> OpenAI chat completion -> JSON parse -> enrich sparks with UUID, type, index, and timestamp -> write to Svelte store -> sync to localStorage.
- Generated sparks are stored under the `all_sparks` localStorage key; bookmarked sparks use `saved_sparks`.
- The server currently expects the model response to be JSON text and parses `chatResponse[0]`. If you change prompt structure or model behavior, preserve or improve that contract deliberately.
- The current model call is configured in `src/lib/server/api/gpt/chat-api.ts` with a creative prompt setup. Keep prompt and parsing changes coupled.

## Environment and secrets

- `OPENAI_API_KEY` is required for server-side generation.
- Keep secrets in environment files or deployment secret stores only. Never hardcode API keys or expose them through public env variables.

## Change guidance

- For UI work, prefer edits under `src/components/`, `src/routes/`, and `src/styles/` without changing unrelated server code.
- For generation behavior, inspect both `src/routes/api/generate/+server.ts` and `src/lib/server/api/gpt/chat-api.ts`; one controls prompt/response shaping and the other controls model invocation.
- For persistence changes, update both the store file and the localStorage helper expectations.
- Add comments only when the code would otherwise be hard to follow.

## Validation guidance

- After code changes, always run the narrowest relevant command first.
- For type, route, store, or Svelte component changes, start with `pnpm check`, but expect the current baseline to fail until the OpenAI typing issue is fixed.
- For build-safety validation or route-level integration changes, run `OPENAI_API_KEY=dummy pnpm build` if you only need packaging validation and not a live API call.
- If you change generation behavior and cannot execute the live OpenAI flow, say so explicitly and validate everything else you can locally.

## Known gaps

- The repository has no automated tests, no linter, and no CI configuration checked in.
- The README does not describe the actual TalkSpark application.
- The OpenAI integration still relies on prompt-only JSON formatting rather than structured output or tool/function calling.

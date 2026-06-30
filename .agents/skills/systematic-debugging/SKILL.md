---
name: systematic-debugging
description: >-
    Four-phase debugging for TalkSpark generation, store, or persistence bugs.
    Use when investigating unexpected behavior.
---

# Systematic debugging

## 1. Reproduce

- Exact steps, route, browser console errors
- Does it fail on fresh `localStorage`?

## 2. Isolate

- Generation: server (`generate.remote.ts`, `chat-api.ts`) vs client (stores, components)
- Persistence: `sparks.svelte.ts` `$effect` sync vs direct `localStorage` reads
- UI: loading state stuck? Check `loadingState.isLoading` in `finally`

## 3. Hypothesize

- One hypothesis at a time; read the code path, don't guess API responses

## 4. Verify

- Fix minimally; run `pnpm check` + relevant `pnpm test`
- Confirm fix doesn't break save/bookmark flows

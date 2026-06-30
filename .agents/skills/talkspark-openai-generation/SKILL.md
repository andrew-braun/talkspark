---
name: talkspark-openai-generation
description: >-
    TalkSpark OpenAI generation flow: prompt structure, JSON schema coupling,
    server-only API keys. Use when changing generation behavior.
---

# TalkSpark OpenAI generation

## Flow

`GenerateSparksButton` → `generateSparks()` remote → `fetchChatResponse()` → OpenAI Responses API → enrich sparks → `generatedSparks` store

## Coupled files (change together)

| File                                 | Role                                                 |
| ------------------------------------ | ---------------------------------------------------- |
| `src/lib/generate.remote.ts`         | Prompt, enrichment (UUID, type, index, `created_at`) |
| `src/lib/server/api/gpt/chat-api.ts` | Model call, strict `json_schema`                     |
| `src/lib/server/api/gpt/init.ts`     | OpenAI client from `OPENAI_API_KEY`                  |

## Rules

- Three sparks per generation: topic, opposite, funny/weird — change prompt only if you intend to change structure
- `OPENAI_API_KEY` is server-only via `$env/static/private`
- `response.output_text` is already JSON — `JSON.parse` for `{ sparks: [{ content }] }`
- Model: `gpt-5.4-mini` via Responses API (not Chat Completions)

## Validation

Cannot run live generation without a real key. Validate schema/types/build locally; note if live test was skipped.

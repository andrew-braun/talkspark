# lib — Conventions

## Server vs client boundary

`src/lib/server/` is strictly server-only. Files here may import `$env/static/private` and other server-only SvelteKit modules. Never import from this directory in client components, stores, or route pages — it will break the build.

Client-accessible code lives outside `server/`.

## Remote functions

`src/lib/generate.remote.ts` uses SvelteKit's experimental `remoteFunctions` feature (enabled in `svelte.config.js`). A `command()` call defines a typed server function that client components can call directly — no `+server.ts` route is required.

```ts
// lib/generate.remote.ts
export const generateSparks = command(
	v.object({ type: v.string() }), // Valibot input schema (validated on the server)
	async ({ type }) => {
		// runs server-side only
		return { sparks };
	}
);
```

Client components import and call it like a regular async function:

```ts
import { generateSparks } from '$lib/generate.remote';
const { sparks } = await generateSparks({ type: 'random' });
```

SvelteKit handles serialization and the server/client boundary automatically. For any new AI or server-side feature, prefer a `.remote.ts` file over a manual `+server.ts` route.

## OpenAI integration

`server/api/gpt/init.ts` instantiates the OpenAI client using `OPENAI_API_KEY` from `$env/static/private`. Call `initOpenAi()` once per request — do not cache the client across requests.

`server/api/gpt/chat-api.ts` calls `openai.responses.create` with:

- Model: `gpt-5.4-mini`
- Structured output: `text.format.type = "json_schema"` with `strict: true`
- Schema: `{ sparks: [{ content: string }] }`

The system prompt instructs the model to return only that JSON structure. `response.output_text` is already valid JSON — `JSON.parse` it directly to get `{ sparks }`.

If you change the JSON schema, update both the schema object in `chat-api.ts` and the destructure in `generate.remote.ts` together.

## Data

`src/lib/data/random-topics.ts` exports an array of 432 topic strings. One is selected at random per generation in `generate.remote.ts`. To expand topic coverage, append to the array — no other changes needed.

## Utilities

`src/lib/utils/sort.ts` exports `sortByDate({ objects, dateField, direction })` — a generic array sort by a date field. Used in `Sparks.svelte` to display newest sparks first.

## index.ts

`src/lib/index.ts` is a re-export barrel for public `lib` exports. Keep it updated when adding new exports intended for use outside `lib/`.

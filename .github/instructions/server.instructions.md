---
applyTo: 'src/routes/api/**/*.ts,src/lib/server/**/*.ts'
---

# Server and OpenAI instructions

- Keep OpenAI access server-side only. Secrets must come from `$env/static/private`.
- Treat `src/routes/api/generate/+server.ts` and `src/lib/server/api/gpt/chat-api.ts` as one behavior slice: prompt format, response parsing, and downstream spark shaping are tightly coupled.
- Preserve the JSON response contract unless the task explicitly changes all callers.
- If you change prompt formatting, update parsing logic and validate the end-to-end shape carefully.
- Prefer small, explicit error-handling improvements over broad redesigns.
- Do not claim live OpenAI behavior was validated unless `OPENAI_API_KEY` is configured and you actually exercised the path.
- For server-side changes, run `pnpm check` first and `pnpm build` when the change could affect route integration or packaging.

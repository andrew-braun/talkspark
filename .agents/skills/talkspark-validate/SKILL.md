---
name: talkspark-validate
description: >-
    Run the narrowest pnpm validation before claiming a TalkSpark task is done.
    Use after code changes.
---

# TalkSpark validate

Run the narrowest command first, then broaden:

| Change type               | Command                           |
| ------------------------- | --------------------------------- |
| Types / Svelte            | `pnpm check`                      |
| Component / utility logic | `pnpm test`                       |
| Routes / page UI          | `pnpm test:e2e`                   |
| Styles                    | `pnpm lint:style`                 |
| Build safety              | `OPENAI_API_KEY=dummy pnpm build` |
| Pre-PR / large change     | `pnpm validate` then build        |

Report pass/fail honestly. If live OpenAI cannot run, say so and validate everything else.

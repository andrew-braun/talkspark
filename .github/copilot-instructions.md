# TalkSpark Copilot Instructions

Use [AGENTS.md](../AGENTS.md) as the single source of truth for architecture, commands, and conventions.

For UI and styling work, also read [src/styles/DESIGN_SYSTEM.md](../src/styles/DESIGN_SYSTEM.md) (semantics) and [src/styles/variables.css](../src/styles/variables.css) (values).

For interactive UI (popovers, modals, dropdowns, toggles, etc.), use Zag via `@zag-js/svelte` — see [.agents/skills/talkspark-interactive-ui/SKILL.md](../.agents/skills/talkspark-interactive-ui/SKILL.md).

Key paths:

- `src/lib/generate.remote.ts` — spark generation remote function
- `src/lib/server/api/gpt/` — OpenAI client and Responses API call
- `src/stores/sparks.svelte.ts` — localStorage persistence
- `src/components/` — atomic-design UI (see `src/components/AGENTS.md`)

Validation: `pnpm validate` then `OPENAI_API_KEY=dummy pnpm build`.

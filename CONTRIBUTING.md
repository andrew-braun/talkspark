# Contributing to TalkSpark

## Prerequisites

- Node.js `24.15.0` (Volta-pinned)
- pnpm `11.x` (Volta-pinned)
- `OPENAI_API_KEY` in `.env.local` for live generation testing

## Setup

```bash
pnpm install
echo 'OPENAI_API_KEY=sk-...' > .env.local
pnpm dev
```

After first clone, install Playwright browsers for E2E:

```bash
pnpm exec playwright install chromium
```

## Validation

Run before opening a PR:

```bash
pnpm validate
OPENAI_API_KEY=dummy pnpm build
```

| Script              | Purpose                         |
| ------------------- | ------------------------------- |
| `pnpm check`        | TypeScript + Svelte diagnostics |
| `pnpm lint`         | ESLint                          |
| `pnpm lint:style`   | Stylelint                       |
| `pnpm format:check` | Prettier                        |
| `pnpm knip`         | Unused exports/deps             |
| `pnpm test`         | Vitest                          |
| `pnpm test:e2e`     | Playwright smoke tests          |

## Commits

- [Conventional Commits](https://www.conventionalcommits.org/) — enforced by commitlint
- Pre-commit runs lint-staged (ESLint, Stylelint, Prettier on staged files only)

## Agent documentation

- [AGENTS.md](AGENTS.md) — project SSOT for agents and contributors
- [src/styles/DESIGN_SYSTEM.md](src/styles/DESIGN_SYSTEM.md) — design system rules (semantics)
- [src/styles/variables.css](src/styles/variables.css) — design token values
- [.agents/skills/talkspark-interactive-ui/SKILL.md](.agents/skills/talkspark-interactive-ui/SKILL.md) — Zag for interactive UI

## UI changes

Read `DESIGN_SYSTEM.md` before editing styles. Token values live in `variables.css` only.

For interactive components (popovers, modals, dropdowns, drawers, toggles, menus, etc.), use **[Zag](https://zagjs.com/)** via `@zag-js/svelte` — see [`.agents/skills/talkspark-interactive-ui/SKILL.md`](.agents/skills/talkspark-interactive-ui/SKILL.md). Check Zag before writing custom interaction logic or adding another UI library.

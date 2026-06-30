# TalkSpark

TalkSpark generates short AI-powered conversation starters — called **sparks** — to help break the ice or deepen a discussion. Press a button, get three openers: one on a random topic, one on its opposite, and one weird/funny take.

## Features

- Generate three sparks at once, seeded from a pool of 432 random topics
- Copy any spark to clipboard
- Bookmark sparks to a personal saved collection at `/sparks`
- Persists all sparks between sessions via browser `localStorage`
- Page-transition animations and sticky loading indicator

## Tech stack

| Layer           | Technology                                               |
| --------------- | -------------------------------------------------------- |
| Framework       | SvelteKit 2 + Svelte 5 (runes)                           |
| Language        | TypeScript (strict)                                      |
| Styling         | Sass (component-scoped SCSS) + CSS custom properties     |
| AI              | OpenAI Responses API (`gpt-5.4-mini`, structured output) |
| Build           | Vite 8                                                   |
| Package manager | pnpm                                                     |

## Prerequisites

- Node.js ≥ 24
- pnpm ≥ 10
- An OpenAI API key

## Getting started

```bash
# Install dependencies
pnpm install

# Set up environment
echo 'OPENAI_API_KEY=sk-...' > .env.local

# Start dev server
pnpm dev
```

The app runs at `http://localhost:5173` by default.

## Commands

| Command            | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start dev server with hot reload             |
| `pnpm build`       | Production build (requires `OPENAI_API_KEY`) |
| `pnpm preview`     | Serve the production build locally           |
| `pnpm check`       | Type-check all Svelte and TypeScript files   |
| `pnpm check:watch` | Type-check in watch mode                     |

> `pnpm build` fails if `OPENAI_API_KEY` is unset because `src/lib/server/api/gpt/init.ts` imports it from `$env/static/private`. Use `OPENAI_API_KEY=dummy pnpm build` for packaging checks that don't need a live key.

## Project layout

```text
src/
├── components/       # All Svelte UI components
│   ├── brand/        # Logo
│   ├── buttons/      # Button primitives and action buttons
│   ├── layout/       # Header, nav
│   ├── prompts/      # Spark prompt UIs (random generator)
│   ├── sparks/       # Spark card, list, and per-spark actions
│   └── states/       # Loading indicator
├── lib/
│   ├── client/       # Client-side fetch wrappers
│   ├── data/         # Static data (random topics)
│   ├── server/       # Server-only modules (OpenAI client, chat API)
│   ├── utils/        # Shared utility functions
│   └── generate.remote.ts  # Remote function: spark generation
├── routes/
│   ├── +layout.svelte     # Root layout (header, loading, transitions)
│   ├── +page.svelte       # Home — random spark generator
│   └── sparks/
│       └── +page.svelte   # Saved sparks collection
├── stores/           # Svelte 5 reactive state + localStorage sync
├── styles/           # Global CSS variables, SCSS, keyframe animations
└── ts/               # Shared TypeScript type definitions
```

## How it works

1. The user clicks **Random Sparks** on the home page.
2. `GenerateSparksButton` calls `generateSparks()` — a SvelteKit remote function in `src/lib/generate.remote.ts`.
3. On the server, a random topic is selected from 432 options and passed to OpenAI's Responses API with a strict JSON schema.
4. The model returns three sparks; the server enriches each with a UUID, timestamp, index, and type.
5. Sparks are written to the `generatedSparks` store, which syncs to `localStorage` reactively.
6. Each `Spark` card renders with a cycling gradient accent, a copy-to-clipboard button, and a bookmark toggle that moves the spark in and out of `savedSparks`.

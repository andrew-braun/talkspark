# components — Conventions

## Directory layout

Components are grouped by domain:

```text
components/
├── brand/               # Logo and brand identity
├── buttons/
│   ├── ActionButtons/   # Per-spark icon buttons (copy, bookmark)
│   ├── Button.svelte    # Base button primitive
│   └── GenerateSparksButton.svelte  # Orchestrates spark generation
├── layout/
│   └── header/          # Header, Nav, NavLink
├── prompts/
│   └── random/          # Random spark generator prompt UI
├── sparks/              # Spark card (Spark), list (Sparks), action bar (SparkActions)
└── states/
    └── loading/         # Loading indicator and animation
```

## Naming

- Component files: PascalCase (`GenerateSparksButton.svelte`, `CopyButton.svelte`)
- Props and local variables: camelCase
- Event handler props: `on` prefix (`onClick`, `onSubmit`)

## Props

Use Svelte 5 `$props()` with an inline TypeScript type. Provide defaults at the destructuring level for optional props:

```ts
let {
  buttonText = "Random Sparks",
  onClick = async () => {},
}: {
  buttonText?: string
  onClick?: () => Promise<void>
} = $props()
```

Always type props explicitly — do not use `any` for prop types unless unavoidable.

## Styling

- Each component uses `<style lang="scss">`. Styles are component-scoped by default.
- Reference CSS custom properties from `src/styles/variables.css` for all colors, spacing, font sizes, border radii, and transitions. Never hardcode these values.
- Use `:global()` only when a scoped selector genuinely cannot reach the target element.
- Global keyframe animations are defined in `src/styles/animations.css`; reference them by name.

## SVG icons

Icons in `src/lib/assets/icons/` are imported as Svelte components using the `?component` query:

```ts
import CopyIcon from "lib/assets/icons/copy.svg?component"
```

Then used as `<CopyIcon />`. This is handled by the `@poppanator/sveltekit-svg` Vite plugin configured in `vite.config.ts`.

## Snippets

Use Svelte 5 snippets for injectable content — there are no `<slot>` patterns in this codebase:

```svelte
<!-- parent -->
<ActionButton>
  {#snippet popup()}
    <CopyButtonPopup />
  {/snippet}
</ActionButton>

<!-- ActionButton renders it with -->
{@render popup?.()}
```

## Component responsibilities

- `Button.svelte` — low-level button primitive accepting `style`, `type`, `disabled`, `isLoading`, `loadingText`, `classes`, and `onClick`. All other buttons compose this.
- `GenerateSparksButton.svelte` — the only component that calls `generateSparks()` and writes to `generatedSparks`. Manages `loadingState.isLoading` for the duration of the request.
- `Sparks.svelte` — renders a sorted list of `SparkData` items. Accepts a `sparkStore` prop (defaults to `generatedSparks`) so it can display either generated or saved sparks.
- `Spark.svelte` — single spark card. Receives `spark: SparkData` and a 1-based `index` (used to select a gradient accent, cycling `% 4`).
- `SparkActions.svelte` — copy and bookmark buttons for a single spark.
- `CopyButton.svelte` — writes `spark.content` to the clipboard, shows a popup for 1300 ms.
- `BookmarkButton.svelte` — toggles the spark in/out of `savedSparks`; uses `$derived` to compute `isSaved`.

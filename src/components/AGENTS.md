# components — Conventions

## Directory layout

Components use **atomic design** with **functional subfolders**. Group by what a component _is_, not which page it appears on.

```text
components/
├── atoms/
│   ├── buttons/         # Button.svelte
│   ├── brand/           # Logo.svelte
│   ├── nav/             # NavLink.svelte
│   └── actions/         # ActionButtonPopup.svelte
├── molecules/
│   ├── actions/         # ActionButton, CopyButton, BookmarkButton, CopyButtonPopup
│   ├── nav/             # Nav.svelte
│   └── sparks/          # Spark.svelte (single card)
├── organisms/
│   ├── layout/          # Header.svelte
│   ├── sparks/          # Sparks, SparkActions, GenerateSparksButton
│   └── prompts/         # RandomPrompt.svelte
└── templates/
    └── layout/          # PageShell.svelte (when needed)
```

## Layer rules

| Layer         | Definition                                           | Examples                             |
| ------------- | ---------------------------------------------------- | ------------------------------------ |
| **atoms**     | Single-purpose; no store access; no business logic   | Button, NavLink, Chip                |
| **molecules** | Composes atoms; may have local state                 | CopyButton, Spark, Nav               |
| **organisms** | Full UI section; may use stores and remote functions | Header, Sparks, GenerateSparksButton |
| **templates** | Page layout without real content                     | PageShell                            |

**Composition:** organisms → molecules → atoms. Atoms never import from higher layers.

## Import paths

Use the `components` alias with full atomic path:

```ts
import Button from 'components/atoms/buttons/Button.svelte';
import Header from 'components/organisms/layout/Header.svelte';
import Spark from 'components/molecules/sparks/Spark.svelte';
```

## Naming

- Component files: PascalCase (`GenerateSparksButton.svelte`, `CopyButton.svelte`)
- Props and local variables: camelCase
- Event handler props: `on` prefix (`onClick`, `onSubmit`)

## Props

Use Svelte 5 `$props()` with an inline TypeScript type. Provide defaults at the destructuring level for optional props:

```ts
let {
	buttonText = 'Random Sparks',
	onClick = async () => {},
}: {
	buttonText?: string;
	onClick?: () => Promise<void>;
} = $props();
```

Always type props explicitly — do not use `any` for prop types unless unavoidable.

## Interactive UI (Zag)

**Before** adding or changing popovers, dropdowns, modals, drawers, toggles, tooltips, menus, or any overlay/focus-trap pattern:

1. Read [`.agents/skills/talkspark-interactive-ui/SKILL.md`](../../.agents/skills/talkspark-interactive-ui/SKILL.md).
2. Use [@zag-js/svelte](https://zagjs.com/) with the matching `@zag-js/<machine>` package — not custom open/close logic or another headless library.
3. Style Zag-rendered elements with design tokens from `variables.css`.

`@zag-js/svelte` and machine packages (e.g. `@zag-js/popover`) are the approved stack. Legacy custom overlays should migrate to Zag when their behavior is next touched.

## Styling

- Each component uses `<style lang="scss">`. Styles are component-scoped by default.
- Reference CSS custom properties from `src/styles/variables.css` for colors, spacing, font sizes, border radii, and transitions. See `src/styles/DESIGN_SYSTEM.md` for semantics.
- Use `:global()` only when a scoped selector genuinely cannot reach the target element.
- Global keyframe animations are defined in `src/styles/animations.css`; reference them by name.

## SVG icons

Icons in `src/lib/assets/icons/` are imported as Svelte components using the `?component` query:

```ts
import CopyIcon from 'lib/assets/icons/copy.svg?component';
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

- `atoms/buttons/Button.svelte` — low-level button primitive. All feature buttons compose this.
- `organisms/sparks/GenerateSparksButton.svelte` — only component that calls `generateSparks()` and writes to `generatedSparks`.
- `organisms/sparks/Sparks.svelte` — sorted list of `SparkData`; accepts `sparkStore` prop.
- `molecules/sparks/Spark.svelte` — single spark card; `index` selects gradient accent (`% 4`).
- `organisms/sparks/SparkActions.svelte` — copy and bookmark for one spark.
- `molecules/actions/CopyButton.svelte` — clipboard copy with 1300 ms popup.
- `molecules/actions/BookmarkButton.svelte` — toggles spark in `savedSparks`.

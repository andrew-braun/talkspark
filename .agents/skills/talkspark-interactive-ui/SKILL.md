---
name: talkspark-interactive-ui
description: >-
    Mandatory before adding or changing interactive UI (popovers, dropdowns, modals,
    drawers, toggles, tooltips, menus, dialogs, etc.). Use Zag headless machines via
    @zag-js/svelte — not custom behavior or another UI library.
---

# TalkSpark interactive UI (Zag)

## When this applies

Use this skill **before** implementing or refactoring any component with non-trivial interaction state:

- Popovers, tooltips, menus, dropdowns, selects, comboboxes
- Modals, dialogs, drawers, sheets
- Toggles, switches, tabs, accordions, collapsibles
- Focus traps, dismiss-on-outside-click, keyboard navigation, ARIA roles

If the behavior is a simple click handler on a button with no overlay or focus management, Zag is not required.

## Default stack

| Piece               | Package / doc                                                  |
| ------------------- | -------------------------------------------------------------- |
| Svelte adapter      | `@zag-js/svelte` (`useMachine`, `normalizeProps`)              |
| Per-pattern machine | `@zag-js/<machine>` (e.g. `@zag-js/popover`, `@zag-js/dialog`) |
| Docs                | [zagjs.com](https://zagjs.com/) — check Svelte examples first  |

Install only the machine packages you need:

```bash
pnpm add @zag-js/popover @zag-js/svelte
```

Keep `@zag-js/svelte` version-aligned with each `@zag-js/*` machine (same minor).

## Required workflow

1. **Search Zag first** — find the closest machine at [zagjs.com](https://zagjs.com/). Prefer a Zag primitive over hand-rolled open/close state, portals, or document listeners.
2. **Wire with Svelte 5 runes** — `useMachine`, then `$derived(connect(service, normalizeProps))`. Pass reactive config via a function when props change.
3. **Style with TalkSpark tokens** — Zag is headless. Apply `var(--*)` in component SCSS to the elements returned by `api.get*Props()`. Read [`talkspark-design-system`](../../talkspark-design-system/SKILL.md) before styling.
4. **Compose in atomic layers** — thin atoms/molecules wrap Zag; organisms compose them. Do not leak Zag APIs across layers unless intentional.
5. **Migrate on touch** — legacy custom overlays (e.g. `ActionButtonPopup`) should move to Zag when that code is edited for behavior changes.

## Svelte pattern (reference)

```svelte
<script lang="ts">
	import * as popover from '@zag-js/popover';
	import { useMachine, normalizeProps } from '@zag-js/svelte';

	const id = $props.id();
	const service = useMachine(popover.machine, () => ({ id }));
	const api = $derived(popover.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()}>
	<button {...api.getTriggerProps()}>Open</button>
	{#if api.open}
		<div {...api.getPositionerProps()}>
			<div {...api.getContentProps()} class="my-popover">
				<!-- content -->
			</div>
		</div>
	{/if}
</div>
```

Follow the exact Svelte snippet on each machine's docs page — prop names and structure differ per machine.

## Do not

- Build custom popover/modal/dropdown behavior when a Zag machine exists
- Add another headless or component library (Bits UI, Melt UI, Radix, Ark UI, etc.) without explicit project approval
- Import global styles into Zag wrappers; scope SCSS on the wrapper component
- Skip accessibility because Zag handles it — still follow docs for correct DOM structure (e.g. heading levels in accordions)

## Escaping Zag (rare)

Only skip Zag when no machine fits and the interaction is truly trivial, or when Zag cannot support a documented requirement. Note the reason in the PR or task summary.

## Related docs

- [`src/components/AGENTS.md`](../../src/components/AGENTS.md) — component layout and composition
- [`src/styles/DESIGN_SYSTEM.md`](../../src/styles/DESIGN_SYSTEM.md) — token styling for Zag surfaces

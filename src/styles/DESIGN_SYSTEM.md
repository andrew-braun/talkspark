# TalkSpark Design System

Read this file before writing or editing styles. **Token values live only in [`variables.css`](variables.css)** — this document explains semantics, rules, and patterns without copying values.

## What this is (and is not)

| Is                                             | Is not                                                        |
| ---------------------------------------------- | ------------------------------------------------------------- |
| CSS custom properties in `variables.css`       | Tailwind, a UI kit, CSS-in-JS                                 |
| Global files: `globals.scss`, `animations.css` | Inline `style=""` attributes for theming                      |
| Component-scoped SCSS using `var(--*)`         | Hardcoded hex/hsl/rem for colors and spacing                  |
| Zag headless machines + token styling          | Custom popover/modal/dropdown behavior or third-party UI kits |

## Interactive primitives (Zag)

Behavior for overlays and complex widgets (popovers, dialogs, menus, toggles, etc.) comes from **[Zag](https://zagjs.com/)** via `@zag-js/svelte`. Zag owns state, focus, keyboard navigation, and ARIA; TalkSpark owns look and feel.

- **Before building:** check [zagjs.com](https://zagjs.com/) for a matching machine. See [`.agents/skills/talkspark-interactive-ui/SKILL.md`](../../.agents/skills/talkspark-interactive-ui/SKILL.md).
- **Styling:** apply `var(--*)` to elements from `api.get*Props()` in component SCSS — radii (`--border-radius-*`), surfaces, spacing, motion (`--transition-std`).
- **Do not** duplicate Zag's interaction logic in custom code when a machine exists.

## File map

| File                            | Loaded                | Contains                               |
| ------------------------------- | --------------------- | -------------------------------------- |
| `variables.css`                 | `+layout.svelte` once | **All token values** (SSOT for values) |
| `globals.scss`                  | `+layout.svelte` once | Resets, typography, `.page-spacing`    |
| `animations.css`                | `+layout.svelte` once | Shared `@keyframes`                    |
| `DESIGN_SYSTEM.md`              | On demand             | Rules, semantics, patterns (no values) |
| Component `<style lang="scss">` | Per component         | Scoped styles referencing `var(--*)`   |

Do not import global style files inside components.

## Rem scaling (critical)

- Root `html` font-size: **62.5%** (≈ 10px base) → `1rem = 10px` at desktop
- Below 768px: **50%** → all rem-based tokens scale down proportionally
- Spacing and font-size tokens use `rem` — **never convert token usage to px in components**
- Read actual computed sizes from `variables.css`; do not guess

## Token semantics (names only)

| Category       | Tokens                                                                              | When to use                                                 |
| -------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Surfaces**   | `--primary-color`, `--background-color`, `--spark-background-color`                 | Page background, card fill                                  |
| **Text**       | `--text-color-light`, `--text-color-dark`                                           | Light-on-dark vs dark-on-light copy                         |
| **Accents**    | `--accent-color-1` … `--accent-color-6`                                             | Gradient building blocks; rarely used directly              |
| **Gradients**  | `--gradient-1` … `--gradient-5`                                                     | Spark cards cycle `gradient-1`–`gradient-4` via `index % 4` |
| **Spacing**    | `--spacing-xs` … `--spacing-xxl`                                                    | Padding, margin, gap — pick nearest step                    |
| **Typography** | `--font-size-xs` … `--font-size-xxl`, `--body-font-family`, `--heading-font-family` | Body, headings, UI labels                                   |
| **Radii**      | `--border-radius-sm` … `--border-radius-xl`                                         | Cards, buttons, popups                                      |
| **Motion**     | `--transition-std`                                                                  | Hover/focus transitions                                     |
| **Borders**    | `--spark-border`, `--secondary-color`, `--tertiary-color`                           | Card borders, dividers                                      |

**Rule:** Need a value → open `variables.css`. Need a token name → use this table or the decision tree below.

## Usage rules (non-negotiable)

```scss
/* CORRECT */
.spark {
	background: var(--spark-background-color);
	padding: var(--spacing-md);
	border-radius: var(--border-radius-lg);
	color: var(--text-color-light);
}

/* FORBIDDEN in component styles */
.bad {
	background: #1a1a2e;
	padding: 12px;
	color: hsl(0, 0%, 100%);
}
```

## Gradient accent pattern (spark cards)

`Spark.svelte` maps card index to gradient tokens: `gradient-${(index % 4) + 1}` → `--gradient-1` through `--gradient-4`. Only four gradient variables exist for cards. `--gradient-5` is used elsewhere (e.g. nav hover, loading).

## SCSS nesting (deep nesting)

Mirror the DOM hierarchy. Nest states and modifiers under their parent with `&`:

```scss
.card {
	padding: var(--spacing-md);

	.title {
		font-size: var(--font-size-lg);
	}

	&:hover {
		opacity: 0.9;
	}

	&.is-active {
		border-color: var(--secondary-color);
	}
}
```

One root class per component. Use `:global()` only when a scoped selector cannot reach the target.

## Animations

Define `@keyframes` only in `animations.css`:

- `fadeIn` — opacity entrance (spark card accents)
- `gradientMotion` — moving gradient background
- `bxSpin` — loading indicator bounce/spin

Reference by name in components. Do not duplicate keyframes in component blocks.

## Decision tree

```text
Need a token VALUE?   → read variables.css (never guess)
Need a token NAME?    → semantics table above or references/design-tokens.md
Need spacing?         → nearest --spacing-*
Need a color?         → matching semantic token
Need font size?       → nearest --font-size-*
Need border radius?   → nearest --border-radius-*
Need animation?       → animations.css by name
Need overlay/widget?  → Zag machine + talkspark-interactive-ui skill; style with tokens
Need new token?       → add to variables.css ONLY, then document here + design-tokens.md
```

## Forbidden vs acceptable literals

**Forbidden in component styles** (Stylelint Phase A warnings on color/spacing props):

- Raw hex/hsl for colors → use semantic tokens
- Ad-hoc rem/px for padding/margin/gap → use `--spacing-*`

**Acceptable literals** (do not "fix" these):

- Hairlines and nudges: `1px`, `6px`, `-6px`, `-25px`
- Layout: `100%`, `max-width`, `flex`, `z-index`
- Media queries: `@media (max-width: 768px)` — vars cannot be used in MQs
- Transforms: `scale()`, `translateY()`
- Unitless: `opacity`, `line-height`
- Properties without tokens yet: `box-shadow`, micro `top`/`left` offsets

## Forbidden patterns checklist

- No Tailwind / CSS-in-JS / styled-components
- No importing global style files in components
- No `:global()` unless scoped selectors fail
- No new color/spacing values outside `variables.css`
- **No copying token values into markdown** — causes drift

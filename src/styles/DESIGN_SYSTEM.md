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

## Mobile-first (critical)

**TalkSpark is a phone app that also runs on desktop.** Base styles are authored for the
small screen; desktop is layered on top. This is the rule, not a preference.

- **Write the mobile case first, unconditionally.** Then add desktop with
  `@media (width >= 768px)`.
- **Only ever `min-width` (`width >=`).** A `max-width` query means you wrote the desktop
  case first and are patching mobile — restructure instead.
- **768px is the only breakpoint.** Don't invent more without a reason worth documenting.
- Media queries cannot read custom properties, so `768px` is a literal. It is the one
  spacing-ish value allowed to be hardcoded.

### Rem scaling

- Root `html` font-size is **62.5%** (`1rem = 10px`) at **every** width.
- Spacing and font-size tokens use `rem` — **never convert token usage to px in components.**
- Read actual computed sizes from `variables.css`; do not guess.

> **Historical note.** The root used to drop to `50%` below 768px, shrinking every rem
> token by 20% on phones — the app was smallest exactly where fingers are least precise.
> That rule is gone. Do not reintroduce a root font-size change to "fix" a mobile layout;
> fix the layout.

## Touch targets (non-negotiable)

Every interactive element — button, link, chip, pill, icon action — must be at least
`--tap-target-min` in **both** dimensions. Primary actions use `--tap-target-lg`.
Adjacent targets are separated by at least `--tap-gap-min`.

- These tokens are **px, not rem, on purpose**: a fingertip is a fixed physical size and
  must not ride the type scale. This is the one place px beats rem.
- An icon does not need to grow to fill the target. Give the _button_ the minimum and let
  the icon stay small inside it — the hit area grows, the design doesn't.
- Single-glyph controls (a `↳`, a digit) need `min-width` as well as `min-height`, or
  they end up tall and thin.

```scss
/* CORRECT — 24px icon, 44px target */
.action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: var(--tap-target-min);
	min-height: var(--tap-target-min);
	padding: 0;
}
```

## Control text (non-negotiable)

Text inside an interactive element — button, chip, lever, link, badge — is never smaller
than `--font-size-md` (16px). That is the accessibility floor, and it holds on desktop too;
it is not a mobile-only concession.

- `--font-size-xs`, `--font-size-sm` and `--font-size-md-sm` exist for decorative and
  non-interactive text. **A control label may not use them**, however small the control looks.
- A big tap target with a 10px label is still unusable. Sizing the box and sizing the text
  are two separate jobs, and both are required.
- **When 16px text doesn't fit the layout, the layout gives way — not the type.** The
  generation levers went from a 2-up grid to one full-width row each for exactly this
  reason: a half-width cell on a phone cannot hold a 16px label beside its value.
- All-caps micro-labels don't survive the promotion to 16px — caps plus wide tracking cost
  ~25% more width and read as shouting. Carry hierarchy with colour and weight instead.

## Hover is not an interaction

Touch devices have no hover. **Any affordance that only appears on `:hover` is invisible
and unreachable on a phone** — which is most of the userbase.

- Never gate content or controls behind `&:hover` alone.
- Disclosure (scores, details, menus) → a **Zag popover** that opens on click/tap. See
  [`talkspark-interactive-ui`](../../.agents/skills/talkspark-interactive-ui/SKILL.md).
- `:hover` is for _decoration only_ — a colour shift, an opacity nudge. Nothing load-bearing.

## Token semantics (names only)

| Category          | Tokens                                                                                                                 | When to use                                                                                                                                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Surfaces**      | `--primary-color`, `--background-color`, `--spark-background-color`                                                    | Page background, card fill                                                                                                                                                                                                                                            |
| **Text**          | `--text-color-light`, `--text-color-dark`                                                                              | Light-on-dark vs dark-on-light copy                                                                                                                                                                                                                                   |
| **Accents**       | `--accent-color-1` … `--accent-color-7`                                                                                | Gradient building blocks and lever hues; rarely used directly                                                                                                                                                                                                         |
| **Lever accents** | `--lever-who`, `--lever-topic`, `--lever-goal`, `--lever-vibe`, `--lever-depth`, `--lever-safety`, `--lever-sensitive` | One hue per generation lever (alias onto the accent palette). A lever's chips, dot, and sentence word all share its colour. `--chip-selected-ink` is the near-black text on a filled chip; `--chip-muted-fill` is the neutral highlight for a selected "Default" chip |
| **Gradients**     | `--gradient-1` … `--gradient-5`                                                                                        | Spark cards cycle `gradient-1`–`gradient-4` via `index % 4`                                                                                                                                                                                                           |
| **Spacing**       | `--spacing-xs` … `--spacing-xxl`                                                                                       | Padding, margin, gap — pick nearest step                                                                                                                                                                                                                              |
| **Typography**    | `--font-size-xs` … `--font-size-xxl`, `--body-font-family`, `--heading-font-family`                                    | Body, headings, UI labels. `--font-size-md` (16px) is the floor for any text inside a control; the three sizes below it are non-interactive only                                                                                                                      |
| **Radii**         | `--border-radius-sm` … `--border-radius-xl`                                                                            | Cards, buttons, popups                                                                                                                                                                                                                                                |
| **Motion**        | `--transition-std`                                                                                                     | Hover/focus transitions                                                                                                                                                                                                                                               |
| **Borders**       | `--spark-border`, `--secondary-color`, `--tertiary-color`                                                              | Card borders, dividers                                                                                                                                                                                                                                                |
| **Elevation**     | `--box-shadow`, `--scrim-color`                                                                                        | Floating surfaces (popovers, toasts); `--scrim-color` dims behind a modal sheet                                                                                                                                                                                       |
| **Touch**         | `--tap-target-min`, `--tap-target-lg`, `--tap-gap-min`                                                                 | Min size of any control; gap between adjacent controls                                                                                                                                                                                                                |

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
Need font size?       → nearest --font-size-*; inside a control, never below --font-size-md
Need border radius?   → nearest --border-radius-*
Need animation?       → animations.css by name
Need overlay/widget?  → Zag machine + talkspark-interactive-ui skill; style with tokens
Building a control?   → min 44px both axes via --tap-target-*; never hover-only
Need a breakpoint?    → @media (width >= 768px) — min-width only, mobile is the base
Need new token?       → add to variables.css ONLY, then document here + design-tokens.md
```

## Forbidden vs acceptable literals

**Forbidden in component styles** (Stylelint Phase A warnings on color/spacing props):

- Raw hex/hsl for colors → use semantic tokens
- Ad-hoc rem/px for padding/margin/gap → use `--spacing-*`

**Acceptable literals** (do not "fix" these):

- Hairlines and nudges: `1px`, `6px`, `-6px`, `-25px`
- Layout: `100%`, `max-width`, `flex`, `z-index`
- Media queries: `@media (width >= 768px)` — vars cannot be used in MQs. **`min-width` only** (see Mobile-first)
- Transforms: `scale()`, `translateY()`
- Unitless: `opacity`, `line-height`
- Properties without tokens yet: `box-shadow`, micro `top`/`left` offsets

## Forbidden patterns checklist

- No Tailwind / CSS-in-JS / styled-components
- No importing global style files in components
- No `:global()` unless scoped selectors fail
- No new color/spacing values outside `variables.css`
- **No `max-width` media queries** — mobile is the base, desktop is the enhancement
- **No root font-size changes per breakpoint** — that shrinks every token at once
- **No hover-only affordances** — invisible on touch
- **No control text below `--font-size-md`** — a 44px button with a 10px label is still unusable
- **No control below `--tap-target-min`** in either dimension
- **No copying token values into markdown** — causes drift

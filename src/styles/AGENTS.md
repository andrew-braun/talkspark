# styles — Conventions

## Files

| File             | Purpose                                          |
| ---------------- | ------------------------------------------------ |
| `variables.css`  | All CSS custom properties (design tokens)        |
| `globals.scss`   | Global resets, base typography, shared utilities |
| `animations.css` | Named `@keyframes` animations                    |

All three are imported once in `src/routes/+layout.svelte`. Do not import them again in individual components.

## Design tokens

All colors, spacing, font sizes, border radii, and transitions are CSS custom properties defined in `variables.css`. Never use raw hex, hsl, or rem literals in component styles — reference the token instead.

### Colors

| Token                      | Value                    | Use                           |
| -------------------------- | ------------------------ | ----------------------------- |
| `--primary-color`          | `hsl(234, 61%, 13%)`     | App background (dark navy)    |
| `--spark-background-color` | `hsla(234, 45%, 17%, 1)` | Spark card fill               |
| `--accent-color-1`         | Yellow                   | Gradient building block       |
| `--accent-color-2`         | Red                      | Gradient building block       |
| `--accent-color-3`         | Pink                     | Gradient building block       |
| `--accent-color-4`         | Purple                   | Gradient building block       |
| `--accent-color-5`         | Blue                     | Gradient building block       |
| `--accent-color-6`         | Teal                     | Gradient building block       |
| `--text-color-light`       | White                    | Body text on dark backgrounds |
| `--text-color-dark`        | Black                    | Text on light backgrounds     |

### Gradients

`--gradient-1` through `--gradient-5` are predefined linear gradients built from accent colors. Spark cards use `gradient-1` through `gradient-4` cyclically (index `% 4`). `--gradient-5` spans all six accent colors.

### Spacing

Seven steps using multiples of 0.4 rem from a 62.5% root:

| Token           | Value   |
| --------------- | ------- |
| `--spacing-xs`  | 0.6 rem |
| `--spacing-sm`  | 0.8 rem |
| `--spacing-md`  | 1.2 rem |
| `--spacing-lg`  | 1.6 rem |
| `--spacing-xl`  | 2.4 rem |
| `--spacing-xxl` | 4 rem   |

Always use the nearest spacing token. Do not invent ad-hoc rem values.

### Typography

Font family: Roboto (body and headings). Root font size is 62.5% (≈ 10 px base), dropping to 50% on screens narrower than 768 px so all `rem` values scale proportionally.

Font size tokens run `--font-size-xs` (1 rem) through `--font-size-xxl` (3.2 rem).

### Border radii and transitions

| Token                | Value                  |
| -------------------- | ---------------------- |
| `--border-radius-sm` | 2 px                   |
| `--border-radius-md` | 4 px                   |
| `--border-radius-lg` | 8 px                   |
| `--border-radius-xl` | 16 px                  |
| `--transition-std`   | `all 0.3s ease-in-out` |

## Keyframe animations

`animations.css` defines:

- `fadeIn` — opacity 0 → 1; used by spark card gradient accents (delayed 0.1 s after card appears)
- `gradientMotion` — animates `background-position` for moving gradient effects
- `bxSpin` — bouncy rotating box used by `LoadingAnimation.svelte`

Reference animations by `animation-name` in component SCSS. Do not duplicate `@keyframes` definitions inside component style blocks.

## SCSS in components

Components use `<style lang="scss">`. Sass nesting and `&` selectors are available. Keep styles tightly scoped to the component. Use `:global()` only when a scoped selector cannot reach the target element (e.g. when applying a class to a child component's root element).

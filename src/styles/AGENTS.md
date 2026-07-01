# styles — Conventions

## Files

| File               | Purpose                                                   |
| ------------------ | --------------------------------------------------------- |
| `variables.css`    | **SSOT for all token values** (`--*` custom properties)   |
| `globals.scss`     | Global resets, base typography, `.page-spacing`           |
| `animations.css`   | Named `@keyframes` (`fadeIn`, `gradientMotion`, `bxSpin`) |
| `DESIGN_SYSTEM.md` | **SSOT for rules and semantics** (no values)              |

All three CSS/SCSS files are imported once in `src/routes/+layout.svelte`. Do not import them in components.

## Before writing styles

1. Read [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for rules and token semantics
2. For interactive overlays/widgets, read [`.agents/skills/talkspark-interactive-ui/SKILL.md`](../../.agents/skills/talkspark-interactive-ui/SKILL.md) — use Zag, then tokenize
3. Read [`variables.css`](variables.css) when you need actual values
4. Run `pnpm lint:style` on changed files

## Quick rules

- Use `var(--*)` for colors, spacing, typography, radii, transitions
- Pick the nearest spacing/font-size token; do not invent ad-hoc rem values
- Spark cards: `gradient-${(index % 4) + 1}` maps to `--gradient-1`–`--gradient-4`
- `@keyframes` live in `animations.css` only
- Component styles: `<style lang="scss">`, deep nesting mirroring DOM, one root class
- `:global()` only when scoped selectors cannot reach the target

## On-demand token lookup

Compact name → category table (no values): [`.agents/skills/talkspark-design-system/references/design-tokens.md`](../../.agents/skills/talkspark-design-system/references/design-tokens.md)

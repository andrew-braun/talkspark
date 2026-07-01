---
name: talkspark-design-system
description: >-
    Enforces TalkSpark design system usage. Use when writing or editing component
    styles, variables.css, globals.scss, animations.css, or styling Zag-powered
    interactive UI.
---

# TalkSpark design system

## Workflow

1. Read [`src/styles/DESIGN_SYSTEM.md`](../../src/styles/DESIGN_SYSTEM.md) for rules and semantics (once per task)
2. For overlays/widgets, read [`talkspark-interactive-ui/SKILL.md`](../talkspark-interactive-ui/SKILL.md) first — Zag handles behavior; this skill handles look
3. Read [`src/styles/variables.css`](../../src/styles/variables.css) when you need actual values — do not guess
4. Pick token **names** from semantics table or [`references/design-tokens.md`](references/design-tokens.md)
5. Use `var(--*)` in component SCSS (including on Zag `api.get*Props()` elements); deep-nest mirroring DOM
6. Run `pnpm lint:style` on changed files

## New token

1. Add to `variables.css` only
2. Add semantics row to `DESIGN_SYSTEM.md`
3. Add name row to `references/design-tokens.md`

## Forbidden

- Raw hex/hsl colors and ad-hoc spacing rem/px in components
- Duplicating `@keyframes` in component blocks
- Importing global style files in components
- Pasting token value catalogs into chat responses

---
name: talkspark-token-discipline
description: >-
    Reduces token waste on TalkSpark tasks. Use on any multi-file change. Enforces
    concise output, no token-catalog pasting, parallel reads.
---

# TalkSpark token discipline

## Rules

- Read `DESIGN_SYSTEM.md` once per task, not per component
- Cite file paths; do not dump full file contents into responses
- Batch independent `Read`/`Grep` calls in parallel
- Subagent prompts: goal + file paths only
- Responses: changed files + why; skip narration of obvious steps
- Use `references/design-tokens.md` for on-demand token name lookup — never paste `variables.css` into chat

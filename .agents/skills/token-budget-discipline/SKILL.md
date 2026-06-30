---
name: token-budget-discipline
description: >-
    Session-level token savings: avoid re-reading files, bloated subagent prompts,
    unnecessary exploration. Use on multi-step tasks.
---

# Token budget discipline

- Read each file once; cite paths instead of re-quoting contents
- Parallelize independent reads and greps
- Subagent prompts: goal + file list, not architecture essays
- Stop exploring when you have enough context to act
- Prefer `pnpm validate` over re-running every sub-check narrated in chat

# Depth and Controversy Calibration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use $superpowers-subagent-driven-development (recommended) or $superpowers-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make explicit high depth and controversy selections produce materially bolder sparks without changing automatic defaults or existing safety boundaries.

**Architecture:** Adjust only the semantic ladder and intensity instructions in the existing spark prompt builder. Keep the current generation parameters, numeric ranges, JSON schema, UI, enrichment, and persistence intact; lock the behavior with prompt-string regression tests and document the active classification rule.

**Tech Stack:** TypeScript, Vitest, SvelteKit remote generation, OpenAI Responses API structured output, Markdown documentation

## Global Constraints

- A selected numeric level is the requested intensity, not merely an upper safety limit.
- Default depth and controversy remain automatic and broadly accessible.
- Preserve protections against social mismatch, coercive disclosure, therapy framing, harassment, dehumanization, attacks on participants or protected groups, and manufactured interpersonal conflict.
- Keep the current controls, numeric ranges, generation parameters, structured-output schema, enrichment, and persistence unchanged.
- Advance the generation prompt version from `v2` to `v3`.
- Do not embed example spark questions or add a separate boldness lever.
- Keep API-key usage server-only.

---

## File structure

- Modify `src/lib/server/api/llm/prompts/spark-prompt.ts`: own the calibrated depth and controversy guidance, target-intensity instruction, classification instruction, and prompt version.
- Modify `src/lib/server/api/llm/prompts/spark-prompt.test.ts`: provide regression coverage for high-level semantics, explicit target intensity, accurate classification, unchanged automatic behavior, and prompt version.
- Modify `docs/features/generation-engine.md`: keep the active generation documentation aligned with the new target-intensity and classification behavior.

### Task 1: Calibrate the generation prompt

**Files:**

- Modify: `src/lib/server/api/llm/prompts/spark-prompt.ts:9-98`
- Test: `src/lib/server/api/llm/prompts/spark-prompt.test.ts:1-45`

**Interfaces:**

- Consumes: `resolveGenerationParams(params: GenerationParams): ResolvedGenerationParams`
- Produces: `buildSparkPrompt(resolved: ResolvedGenerationParams): string`
- Produces: `GENERATION_PROMPT_VERSION` with value `'v3'`

- [ ] **Step 1: Add a failing regression test for high-level semantic territory**

Add this test inside the existing `describe('buildSparkPrompt', ...)` block:

```ts
it('gives high depth and controversy levels materially stronger territory', () => {
	const prompt = buildSparkPrompt(
		resolveGenerationParams({
			type: 'random',
			depth_and_safety: { depth_level: 5, controversy_level: 5 },
		})
	);

	expect(prompt).toContain('identity, regret, fear, meaning, belonging');
	expect(prompt).toContain('genuinely divisive or taboo territory');
	expect(prompt).toContain('substantial disagreement');
	expect(prompt).toContain('never target participants or protected groups');
});
```

- [ ] **Step 2: Run the focused test and verify the new regression fails**

Run:

```bash
pnpm test -- src/lib/server/api/llm/prompts/spark-prompt.test.ts
```

Expected: FAIL in `gives high depth and controversy levels materially stronger territory` because the current level-5 guidance does not contain the calibrated phrases.

- [ ] **Step 3: Strengthen levels 4 and 5 in both semantic ladders**

Replace only the level-4 and level-5 entries in `DEPTH_GUIDANCE` and `CONTROVERSY_GUIDANCE`:

```ts
const DEPTH_GUIDANCE = {
	1: 'light and immediately answerable; no meaningful disclosure',
	2: 'personal preference or small experience; low disclosure',
	3: 'reflective but comfortable; moderate disclosure with an easy pass',
	4: 'meaningful personal material such as convictions, unresolved tensions, consequential experiences, or vulnerable tradeoffs; include an easy pass and avoid therapy framing',
	5: 'emotionally exposing reflection on identity, regret, fear, meaning, belonging, or deeply held values; require strong consent, an easy pass, and safe relationship fit without demanding disclosure',
} as const;

const CONTROVERSY_GUIDANCE = {
	0: 'avoid disagreement, sensitive issues, and identity assumptions',
	1: 'allow harmless differences in taste only',
	2: 'allow mild tradeoffs without personal stakes',
	3: 'allow substantive disagreement with receptive framing',
	4: 'invite clearly polarizing moral, cultural, social, political, or relationship questions with personal stakes and multiple defensible positions; frame with care and an easy pass',
	5: 'permit genuinely divisive or taboo territory that challenges assumptions and can produce substantial disagreement; never target participants or protected groups, dehumanize people, or manufacture interpersonal conflict',
} as const;
```

- [ ] **Step 4: Run the focused test and verify the semantic calibration passes**

Run:

```bash
pnpm test -- src/lib/server/api/llm/prompts/spark-prompt.test.ts
```

Expected: PASS for all tests in `spark-prompt.test.ts`.

- [ ] **Step 5: Add a failing regression test for target intensity and accurate classification**

Add this separate test inside the same `describe` block:

```ts
it('treats concrete numeric selections as targets and classifies content accurately', () => {
	const prompt = buildSparkPrompt(
		resolveGenerationParams({
			type: 'random',
			depth_and_safety: { depth_level: 5, controversy_level: 5 },
		})
	);

	expect(prompt).toContain('target intensities, not ceilings');
	expect(prompt).toContain('Use the requested levels fully');
	expect(prompt).toContain('Classify each spark accurately based on its actual content');
	expect(prompt).not.toContain('Classify each spark conservatively');
});
```

- [ ] **Step 6: Run the focused test and verify the target-intensity regression fails**

Run:

```bash
pnpm test -- src/lib/server/api/llm/prompts/spark-prompt.test.ts
```

Expected: FAIL in `treats concrete numeric selections as targets and classifies content accurately` because the prompt still requests conservative classification and does not identify concrete selections as targets.

- [ ] **Step 7: Add the target-intensity rule and replace conservative classification**

After `${controversy}` in the returned prompt, add:

```text

Concrete numeric depth and controversy selections are target intensities, not ceilings. Use the requested levels fully while preserving relationship fit and every safety rule.
```

Replace the final conservative-classification sentence with:

```text
Classify each spark accurately based on its actual content. Do not soften a requested intensity merely to earn a lower depth or controversy classification.
```

- [ ] **Step 8: Run the focused test and verify the intensity behavior passes**

Run:

```bash
pnpm test -- src/lib/server/api/llm/prompts/spark-prompt.test.ts
```

Expected: PASS for all tests in `spark-prompt.test.ts`, including the existing Default test that verifies automatic selections remain broadly accessible and low-risk.

- [ ] **Step 9: Add a failing prompt-version test**

Change the test import and add a focused test:

```ts
import { buildSparkPrompt, GENERATION_PROMPT_VERSION } from './spark-prompt';
```

```ts
it('identifies the calibrated prompt as version 3', () => {
	expect(GENERATION_PROMPT_VERSION).toBe('v3');
});
```

- [ ] **Step 10: Run the focused test and verify the version assertion fails**

Run:

```bash
pnpm test -- src/lib/server/api/llm/prompts/spark-prompt.test.ts
```

Expected: FAIL in `identifies the calibrated prompt as version 3`, reporting that the received value is `v2`.

- [ ] **Step 11: Advance the prompt version**

Change the exported constant in `spark-prompt.ts`:

```ts
export const GENERATION_PROMPT_VERSION = 'v3';
```

- [ ] **Step 12: Run the focused prompt suite and commit the calibrated behavior**

Run:

```bash
pnpm test -- src/lib/server/api/llm/prompts/spark-prompt.test.ts
```

Expected: PASS for all tests in `spark-prompt.test.ts`.

Commit:

```bash
git add src/lib/server/api/llm/prompts/spark-prompt.ts src/lib/server/api/llm/prompts/spark-prompt.test.ts
git commit -m "feat: strengthen high-intensity spark prompts"
```

### Task 2: Align active documentation and validate the change

**Files:**

- Modify: `docs/features/generation-engine.md:113-119`

**Interfaces:**

- Consumes: the `v3` target-intensity and accurate-classification behavior from Task 1
- Produces: active generation documentation matching the implemented prompt semantics

- [ ] **Step 1: Update the classification documentation**

Replace the classification block at `docs/features/generation-engine.md:113-119` with:

````markdown
```text # classification
Treat categorical generation inputs as authoritative constraints; do not reclassify
relationship context, topic lens, conversation goal, or vibe. Concrete numeric depth and
controversy selections are target intensities, not ceilings; use them fully while preserving
relationship fit and safety boundaries. Classify only the fields the model decides: spark
variant, motive, depth, controversy, humor, answer shape, reciprocity mode, follow-up
potential, conversation skill, and seed follow-up. Classify depth and controversy accurately
from the generated content rather than softening the content to earn conservative labels.
```
````

- [ ] **Step 2: Check formatting and review the scoped diff**

Run:

```bash
pnpm exec prettier --check docs/features/generation-engine.md docs/superpowers/plans/2026-07-14-depth-controversy-calibration.md
git diff --check
git diff -- src/lib/server/api/llm/prompts/spark-prompt.ts src/lib/server/api/llm/prompts/spark-prompt.test.ts docs/features/generation-engine.md
```

Expected: Prettier reports both files use its formatting, `git diff --check` emits no output, and the scoped diff contains only the planned prompt, test, and documentation changes.

- [ ] **Step 3: Run the complete local verification set**

Run:

```bash
pnpm test
pnpm check
OPENAI_API_KEY=dummy pnpm build
```

Expected: the complete Vitest suite passes; `svelte-check` reports 0 errors and 0 warnings; the production Vite build completes successfully. Sass legacy-API deprecation warnings are expected noise.

- [ ] **Step 4: Commit the documentation**

```bash
git add docs/features/generation-engine.md
git commit -m "docs: document stronger spark intensity targets"
```

- [ ] **Step 5: Record the live-generation limitation in the handoff**

State that the prompt semantics, unit suite, Svelte checks, and production build were validated locally. State explicitly that no live OpenAI generation was executed unless a real server-side API key was used for that request.

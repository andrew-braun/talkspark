# Topic Lens Generation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use $superpowers-subagent-driven-development (recommended) or $superpowers-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace setting with a topic-lens generation lever, add a true Default choice to every lever, and make all prompt inputs shape spark substance without being echoed literally.

**Architecture:** Use an input-only `default` sentinel for categorical and numeric generation selections. Concrete categorical selections are persisted on enriched sparks while Default categorical fields remain unset; generated depth and controversy classifications are retained only where the corresponding input remains Default. Prompt builders translate every selection into behavioral guidance, and legacy `setting` fields remain readable on existing localStorage objects.

**Tech Stack:** SvelteKit remote functions, Svelte 5 runes, TypeScript, Valibot, strict LLM JSON Schema, Zag popovers through `@zag-js/svelte`, Vitest, Testing Library, pnpm.

## Global Constraints

- Use tabs in TypeScript and Svelte files and preserve current project style.
- Use `pnpm` for scripts and package operations.
- Keep `OPENAI_API_KEY` server-only; do not add public environment variables.
- Keep the existing three variants: `primary`, `contrast`, and `playful_weird`.
- Preserve legacy optional `setting` fields on `Spark` and `Topic`; do not migrate or delete localStorage data.
- Use Zag for the existing lever popovers and existing design-system tokens for styles.
- Preserve unrelated working-tree changes, especially current button, spark-action, app shell, and global-style edits.
- Do not add dependencies, a state library, an API route, or a broad refactor.

---

### Task 1: Define Default-capable generation inputs and topic taxonomy

**Files:**

- Modify: `src/ts/spark.ts`
- Modify: `src/ts/topic.ts`
- Modify: `src/ts/params.ts`
- Modify: `src/lib/data/generation-options.ts`
- Modify: `src/lib/server/generation/resolve-params.ts`
- Test: `src/lib/server/generation/resolve-params.test.ts`

**Interfaces:**

- Produces: `TopicLens`, `TOPIC_LENSES`, `DEFAULT_LEVER_VALUE`, `DefaultLeverValue`, `LeverSelection<T>`, and `DepthAndSafety` values whose two properties accept a number or `'default'`.
- Produces: `ResolvedGenerationParams`, a fully present request shape that retains `'default'` sentinels for prompt construction and enrichment.
- Consumes: Existing relationship, goal, vibe, and numeric taxonomy types.

- [ ] **Step 1: Replace resolution tests with the desired Default and topic-lens behavior**

```ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_GENERATION_PARAMS } from 'lib/data/generation-options';
import { resolveGenerationParams } from './resolve-params';

describe('resolveGenerationParams', () => {
	it('returns all-Default selections when params only specify type', () => {
		expect(resolveGenerationParams({ type: 'random' })).toEqual(DEFAULT_GENERATION_PARAMS);
	});

	it('merges concrete selections with Default values', () => {
		const resolved = resolveGenerationParams({
			type: 'random',
			topic_lens: 'stories_memories',
			vibe: 'nostalgic',
			depth_and_safety: { depth_level: 4, controversy_level: 'default' },
		});

		expect(resolved.relationship_context).toBe('default');
		expect(resolved.topic_lens).toBe('stories_memories');
		expect(resolved.conversation_goal).toBe('default');
		expect(resolved.vibe).toBe('nostalgic');
		expect(resolved.depth_and_safety).toEqual({
			depth_level: 4,
			controversy_level: 'default',
		});
	});

	it('preserves a fully specified params object without a setting', () => {
		const params = {
			type: 'random',
			relationship_context: 'stranger',
			topic_lens: 'ideas_perspectives',
			conversation_goal: 'debate',
			vibe: 'thoughtful',
			depth_and_safety: { depth_level: 3, controversy_level: 4 },
		} as const;

		expect(resolveGenerationParams(params)).toEqual(params);
	});
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec vitest run src/lib/server/generation/resolve-params.test.ts`

Expected: FAIL because `topic_lens` and Default-capable parameter types/defaults do not exist and current defaults still contain `setting`.

- [ ] **Step 3: Add the topic taxonomy and legacy compatibility field**

In `src/ts/spark.ts`, replace `Setting` as the active taxonomy with:

```ts
export type TopicLens =
	| 'everyday_life'
	| 'stories_memories'
	| 'interests_culture'
	| 'hopes_plans'
	| 'ideas_perspectives'
	| 'imagination_hypotheticals';

export type Setting = 'dinner' | 'road_trip' | 'meeting' | 'classroom' | 'party' | 'online_chat';

export const TOPIC_LENSES = [
	'everyday_life',
	'stories_memories',
	'interests_culture',
	'hopes_plans',
	'ideas_perspectives',
	'imagination_hypotheticals',
] as const satisfies readonly TopicLens[];
```

Add `topic_lens?: TopicLens` to `Spark` immediately before the deprecated `setting?: Setting`, with this compatibility comment:

```ts
	topic_lens?: TopicLens;
	setting?: Setting; // Legacy pre-v2 localStorage compatibility; not set on new sparks
```

In `src/ts/topic.ts`, import `TopicLens` and add the same active/legacy pair:

```ts
	topic_lens?: TopicLens;
	setting?: Setting; // Legacy pre-v2 localStorage compatibility
```

- [ ] **Step 4: Define input-only Default selections**

Replace `src/ts/params.ts` with the following shape while retaining its existing comments where applicable:

```ts
import type { ConversationGoal, RelationshipContext, TopicLens, Vibe } from './spark';

export const DEFAULT_LEVER_VALUE = 'default' as const;
export type DefaultLeverValue = typeof DEFAULT_LEVER_VALUE;
export type LeverSelection<T extends string> = T | DefaultLeverValue;

export interface DepthAndSafety {
	depth_level: number | DefaultLeverValue;
	controversy_level: number | DefaultLeverValue;
}

export interface GenerationParams {
	type: string;
	relationship_context?: LeverSelection<RelationshipContext>;
	topic_lens?: LeverSelection<TopicLens>;
	conversation_goal?: LeverSelection<ConversationGoal>;
	vibe?: LeverSelection<Vibe>;
	depth_and_safety?: DepthAndSafety;
}
```

- [ ] **Step 5: Replace setting options and concrete defaults**

In `src/lib/data/generation-options.ts`:

1. Import `TopicLens`, `DEFAULT_LEVER_VALUE`, and `LeverSelection`.
2. Change each categorical option export to `LeverOption<LeverSelection<...>>[]`.
3. Put `{ value: DEFAULT_LEVER_VALUE, label: 'Default' }` first in relationship, topic, goal, and vibe arrays.
4. Replace `SETTING_OPTIONS` with:

```ts
export const TOPIC_LENS_OPTIONS: LeverOption<LeverSelection<TopicLens>>[] = [
	{ value: DEFAULT_LEVER_VALUE, label: 'Default' },
	{ value: 'everyday_life', label: 'Everyday life' },
	{ value: 'stories_memories', label: 'Stories & memories' },
	{ value: 'interests_culture', label: 'Interests & culture' },
	{ value: 'hopes_plans', label: 'Hopes & plans' },
	{ value: 'ideas_perspectives', label: 'Ideas & perspectives' },
	{ value: 'imagination_hypotheticals', label: 'Imagination & hypotheticals' },
];
```

Replace `DEFAULT_GENERATION_PARAMS` values with:

```ts
export const DEFAULT_GENERATION_PARAMS: GenerationParams = {
	type: 'random',
	relationship_context: DEFAULT_LEVER_VALUE,
	topic_lens: DEFAULT_LEVER_VALUE,
	conversation_goal: DEFAULT_LEVER_VALUE,
	vibe: DEFAULT_LEVER_VALUE,
	depth_and_safety: {
		depth_level: DEFAULT_LEVER_VALUE,
		controversy_level: DEFAULT_LEVER_VALUE,
	},
};
```

- [ ] **Step 6: Resolve omitted values to the new defaults**

In `src/lib/server/generation/resolve-params.ts`, remove `setting` and return `topic_lens` with the same nullish-default pattern. Keep a fully required resolved shape:

```ts
export type ResolvedGenerationParams = Required<Omit<GenerationParams, 'depth_and_safety'>> & {
	depth_and_safety: Required<DepthAndSafety>;
};
```

The returned object must contain `type`, `relationship_context`, `topic_lens`, `conversation_goal`, `vibe`, and both depth/safety values, each falling back independently to `DEFAULT_GENERATION_PARAMS`.

- [ ] **Step 7: Run the focused test and verify GREEN**

Run: `pnpm exec vitest run src/lib/server/generation/resolve-params.test.ts`

Expected: PASS, three tests.

- [ ] **Step 8: Commit the domain-input slice**

```bash
git add src/ts/spark.ts src/ts/topic.ts src/ts/params.ts src/lib/data/generation-options.ts src/lib/server/generation/resolve-params.ts src/lib/server/generation/resolve-params.test.ts
git commit -m "feat: add default topic lens inputs"
```

### Task 2: Align remote validation, structured output, and enrichment

**Files:**

- Modify: `src/lib/generate.remote.ts`
- Modify: `src/lib/server/api/llm/schemas/spark.schema.ts`
- Test: `src/lib/server/api/llm/schemas/spark.schema.test.ts`
- Modify: `src/lib/server/generation/enrich-spark.ts`
- Test: `src/lib/server/generation/enrich-spark.test.ts`
- Modify: `src/lib/followups.remote.ts`

**Interfaces:**

- Consumes: `DEFAULT_LEVER_VALUE`, `TOPIC_LENSES`, and Default-capable `ResolvedGenerationParams` from Task 1.
- Produces: `GeneratedSpark` without duplicated categorical input fields, but with concrete generated `depth_level` and `controversy_level`.
- Produces: enriched sparks where concrete categorical inputs are present, Default categorical fields are `undefined`, and each automatic numeric input accepts the model classification.

- [ ] **Step 1: Write schema tests that reject categorical reclassification**

Extend `src/lib/server/api/llm/schemas/spark.schema.test.ts` with:

```ts
it('only asks the model for fields it decides', () => {
	const wrapper = SPARKS_RESPONSE_SCHEMA.properties as {
		sparks: { items: { required: string[]; properties: Record<string, unknown> } };
	};
	const sparkSchema = wrapper.sparks.items;

	for (const field of [
		'relationship_context',
		'topic_lens',
		'setting',
		'conversation_goal',
		'vibe',
	]) {
		expect(sparkSchema.properties).not.toHaveProperty(field);
		expect(sparkSchema.required).not.toContain(field);
	}

	expect(sparkSchema.required).toEqual(
		expect.arrayContaining(['depth_level', 'controversy_level'])
	);
});
```

- [ ] **Step 2: Rewrite enrichment tests for concrete and Default selections**

Remove categorical input fields from `sampleGenerated`. Replace the override test and add an automatic test:

```ts
it('copies concrete categorical and numeric selections', () => {
	const resolved = resolveGenerationParams({
		type: 'random',
		relationship_context: 'coworker',
		topic_lens: 'ideas_perspectives',
		conversation_goal: 'brainstorm',
		vibe: 'thoughtful',
		depth_and_safety: { depth_level: 2, controversy_level: 1 },
	});
	const spark = enrichSpark(sampleGenerated, resolved, { id: 'spark-2', now: 1 });

	expect(spark).toMatchObject({
		relationship_context: 'coworker',
		topic_lens: 'ideas_perspectives',
		conversation_goal: 'brainstorm',
		vibe: 'thoughtful',
		depth_level: 2,
		controversy_level: 1,
	});
	expect(spark.setting).toBeUndefined();
});

it('uses model numeric classifications and omits Default categorical fields', () => {
	const resolved = resolveGenerationParams(DEFAULT_GENERATION_PARAMS);
	const spark = enrichSpark(sampleGenerated, resolved, { id: 'spark-3', now: 2 });

	expect(spark.relationship_context).toBeUndefined();
	expect(spark.topic_lens).toBeUndefined();
	expect(spark.conversation_goal).toBeUndefined();
	expect(spark.vibe).toBeUndefined();
	expect(spark.depth_level).toBe(sampleGenerated.depth_level);
	expect(spark.controversy_level).toBe(sampleGenerated.controversy_level);
});
```

- [ ] **Step 3: Run both focused suites and verify RED**

Run: `pnpm exec vitest run src/lib/server/api/llm/schemas/spark.schema.test.ts src/lib/server/generation/enrich-spark.test.ts`

Expected: FAIL because the schema still requires categorical fields and enrichment still reads `setting` and always overrides numeric classifications.

- [ ] **Step 4: Narrow generated JSON and TypeScript output**

In `src/lib/server/api/llm/schemas/spark.schema.ts`:

- Remove imports for `RELATIONSHIP_CONTEXTS`, `SETTINGS`, `CONVERSATION_GOALS`, `VIBES`, and their types.
- Remove those five properties and required entries from `GENERATED_SPARK_SCHEMA`.
- Remove those five properties from `GeneratedSpark`.
- Keep concrete `depth_level` and `controversy_level` required with their existing bounds.

The complete categorical-independent `GeneratedSpark` interface is:

```ts
export interface GeneratedSpark {
	content: string;
	spark_variant: SparkVariant;
	conversation_motive: ConversationMotive;
	depth_level: number;
	controversy_level: number;
	humor_level: number;
	answer_shape: AnswerShape;
	reciprocity_mode: ReciprocityMode;
	follow_up_potential: number;
	conversation_skill: ConversationSkill;
	seed_follow_up: string;
}
```

- [ ] **Step 5: Make enrichment selection-aware**

In `src/lib/server/generation/enrich-spark.ts`, import `DEFAULT_LEVER_VALUE` and add:

```ts
function concreteSelection<T extends string>(value: T | typeof DEFAULT_LEVER_VALUE): T | undefined {
	return value === DEFAULT_LEVER_VALUE ? undefined : value;
}
```

Build the corresponding fields as:

```ts
		relationship_context: concreteSelection(resolved.relationship_context),
		topic_lens: concreteSelection(resolved.topic_lens),
		conversation_goal: concreteSelection(resolved.conversation_goal),
		vibe: concreteSelection(resolved.vibe),
		depth_level:
			depth_and_safety.depth_level === DEFAULT_LEVER_VALUE
				? generated.depth_level
				: depth_and_safety.depth_level,
		controversy_level:
			depth_and_safety.controversy_level === DEFAULT_LEVER_VALUE
				? generated.controversy_level
				: depth_and_safety.controversy_level,
```

Do not set `setting` on new sparks. Keep the complete `resolved` request in `metadata.generation_params`.

- [ ] **Step 6: Validate Default-capable remote input**

In `src/lib/generate.remote.ts`, import `DEFAULT_LEVER_VALUE` and `TOPIC_LENSES`, remove `SETTINGS`, and define:

```ts
const defaultSelection = v.literal(DEFAULT_LEVER_VALUE);
const depthSelection = v.union([
	defaultSelection,
	v.pipe(v.number(), v.minValue(1), v.maxValue(5)),
]);
const controversySelection = v.union([
	defaultSelection,
	v.pipe(v.number(), v.minValue(0), v.maxValue(5)),
]);
```

Use `v.union([defaultSelection, v.picklist(...)])` for relationship, topic lens, goal, and vibe. Replace the numeric properties in `depthAndSafetySchema` with the appropriate selection schemas. Remove `setting` and add `topic_lens` to `generationParamsSchema`.

In `src/lib/followups.remote.ts`, retain legacy `setting` validation and add:

```ts
	topic_lens: v.optional(v.picklist(TOPIC_LENSES)),
```

to `sharedParentFields`.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run: `pnpm exec vitest run src/lib/server/api/llm/schemas/spark.schema.test.ts src/lib/server/generation/enrich-spark.test.ts`

Expected: PASS.

- [ ] **Step 8: Run TypeScript/Svelte validation for the migrated interfaces**

Run: `pnpm check`

Expected: FAIL only in the not-yet-migrated prompt and UI consumers, providing the exact remaining Task 3/4 migration list. Do not weaken types to make this intermediate slice compile.

- [ ] **Step 9: Commit the server/schema slice**

```bash
git add src/lib/generate.remote.ts src/lib/followups.remote.ts src/lib/server/api/llm/schemas/spark.schema.ts src/lib/server/api/llm/schemas/spark.schema.test.ts src/lib/server/generation/enrich-spark.ts src/lib/server/generation/enrich-spark.test.ts
git commit -m "feat: align spark generation with automatic levers"
```

### Task 3: Make prompts apply levers behaviorally

**Files:**

- Modify: `src/lib/server/api/llm/prompts/spark-prompt.ts`
- Test: `src/lib/server/api/llm/prompts/spark-prompt.test.ts`
- Modify: `src/lib/server/api/llm/prompts/critique-prompt.ts`
- Test: `src/lib/server/api/llm/prompts/critique-prompt.test.ts`
- Modify: `src/lib/server/api/llm/prompts/followup-prompt.ts`
- Test: `src/lib/server/api/llm/prompts/followup-prompt.test.ts`
- Modify: `src/lib/server/api/llm/prompts/followup-critique-prompt.ts`
- Test: `src/lib/server/api/llm/prompts/followup-critique-prompt.test.ts`

**Interfaces:**

- Consumes: Default-capable resolved selections and topic labels from Task 1.
- Produces: prompt version `v2`, semantic 1–5 depth guidance, semantic 0–5 controversy guidance, broad-neutral Default instructions, and an explicit anti-echo rule.
- Produces: critique/follow-up prompt context that accepts `topic_lens`, legacy parents without it, and substantive rather than literal context fit.

- [ ] **Step 1: Write failing spark-prompt assertions**

Replace setting expectations and add two tests in `spark-prompt.test.ts`:

```ts
it('assigns concrete levers behavioral responsibilities', () => {
	const prompt = buildSparkPrompt(
		resolveGenerationParams({
			type: 'random',
			relationship_context: 'family',
			topic_lens: 'stories_memories',
			conversation_goal: 'reflect',
			vibe: 'nostalgic',
			depth_and_safety: { depth_level: 4, controversy_level: 0 },
		})
	);

	expect(prompt).toContain('Stories & memories');
	expect(prompt).toContain('assumed familiarity');
	expect(prompt).toContain('source territory');
	expect(prompt).toContain('conversation trajectory');
	expect(prompt).toContain('tone and phrasing');
	expect(prompt).toContain('Do not mention or paraphrase lever labels');
	expect(prompt).not.toContain('People & setting');
});

it('translates Default selections into broad-neutral behavior', () => {
	const prompt = buildSparkPrompt(resolveGenerationParams({ type: 'random' }));

	expect(prompt).toContain('work across relationship types');
	expect(prompt).toContain('choose an accessible topic territory');
	expect(prompt).toContain('natural, inviting tone');
	expect(prompt).toContain('choose a broadly accessible, low-risk level');
	expect(prompt).not.toContain('Relationship: Default');
});
```

- [ ] **Step 2: Write failing critique and follow-up assertions**

Update sample objects from `setting` to `topic_lens` and add:

```ts
expect(prompt).toContain('Topic lens: stories_memories');
expect(prompt).toContain('Merely mentioning a context label does not count as context fit');
```

to the critique test. In the follow-up test, assert:

```ts
expect(prompt).toContain('Topic lens: stories_memories');
expect(prompt).toContain('Do not restate classification labels');
```

Keep one legacy parent test whose object has `setting: 'dinner'` and no `topic_lens`; assert that prompt construction succeeds and does not contain `Topic lens:`.

In `followup-critique-prompt.test.ts`, add:

```ts
expect(FOLLOWUP_CRITIQUE_SYSTEM_INSTRUCTION).toContain(
	'Merely restating a parent classification does not demonstrate context fit'
);
```

- [ ] **Step 3: Run prompt tests and verify RED**

Run: `pnpm exec vitest run src/lib/server/api/llm/prompts/spark-prompt.test.ts src/lib/server/api/llm/prompts/critique-prompt.test.ts src/lib/server/api/llm/prompts/followup-prompt.test.ts src/lib/server/api/llm/prompts/followup-critique-prompt.test.ts`

Expected: FAIL on missing topic-lens and anti-echo instructions.

- [ ] **Step 4: Implement spark prompt v2**

In `spark-prompt.ts`:

- Replace `SETTING_OPTIONS` with `TOPIC_LENS_OPTIONS`.
- Import `DEFAULT_LEVER_VALUE`.
- Set `GENERATION_PROMPT_VERSION = 'v2'`.
- Keep the fixed three-variant section unchanged except replacing “relationship and setting” with “active constraints.”
- Add these invariant instructions to `SPARK_SYSTEM_INSTRUCTION`:

```text
Treat lever values as behavioral constraints, not words to reuse. A spark demonstrates fit through its substance, disclosure demands, trajectory, and tone. Do not mention or paraphrase lever labels unless independently necessary to understand the question.
```

Build a `Lever guidance:` section with one line per dimension. Concrete selection lines must include the human-readable label and its responsibility; Default lines must use these exact broad-neutral semantics:

```text
Relationship: work across relationship types; assume no shared history or special intimacy.
Topic lens: choose an accessible topic territory that best supports the other active constraints.
Conversation goal: invite an engaging response with a natural path to continue.
Vibe: use a natural, inviting tone.
```

Define complete semantic maps:

```ts
const DEPTH_GUIDANCE = {
	1: 'light and immediately answerable; no meaningful disclosure',
	2: 'personal preference or small experience; low disclosure',
	3: 'reflective but comfortable; moderate disclosure with an easy pass',
	4: 'meaningful and personal; clear vulnerability without therapy framing',
	5: 'deep vulnerability; require strong consent and a safe relationship fit',
} as const;

const CONTROVERSY_GUIDANCE = {
	0: 'avoid disagreement, sensitive issues, and identity assumptions',
	1: 'allow harmless differences in taste only',
	2: 'allow mild tradeoffs without personal stakes',
	3: 'allow substantive disagreement with receptive framing',
	4: 'allow sensitive disagreement only with explicit care and an easy pass',
	5: 'high-contention territory; require explicit receptiveness and strong safety framing',
} as const;
```

For either Default numeric value, instruct the model to “choose a broadly accessible, low-risk level from the other active constraints and classify it in the response.” For a concrete numeric value, include its number and mapped semantic guidance.

- [ ] **Step 5: Update critique to score substantive fit**

In `critique-prompt.ts`:

- Change the context-fit gate to relationship, topic lens, goal, vibe, depth, and controversy.
- Add: `Merely mentioning a context label does not count as context fit; score whether the substance and social demands are actually adapted.`
- Replace `Setting:` in `formatSparkLines` with conditional output:

```ts
		`Topic lens: ${spark.topic_lens ?? 'Default (broad-neutral)'}`,
```

- Use `Default (broad-neutral)` for missing relationship, goal, and vibe fields.
- Continue reporting enriched concrete depth and controversy values.

- [ ] **Step 6: Update follow-up context with legacy tolerance**

In `followup-prompt.ts`:

- Replace “relationship, setting” in the system instruction with “relationship, topic-lens.”
- Add: `Do not restate classification labels; deepen the parent's actual subject.`
- Add a helper that emits `Topic lens: ${parent.topic_lens}` only when present.
- Do not emit legacy `setting`; old objects remain accepted but setting no longer influences new follow-ups.
- Use `Default (broad-neutral)` for a missing relationship or vibe.
- Preserve seed follow-up behavior and topic-parent detection.

In `followup-critique-prompt.ts`, add this sentence to the context-fit guidance:

```text
Merely restating a parent classification does not demonstrate context fit; the follow-up must deepen the parent's actual subject.
```

- [ ] **Step 7: Run prompt tests and verify GREEN**

Run: `pnpm exec vitest run src/lib/server/api/llm/prompts/spark-prompt.test.ts src/lib/server/api/llm/prompts/critique-prompt.test.ts src/lib/server/api/llm/prompts/followup-prompt.test.ts src/lib/server/api/llm/prompts/followup-critique-prompt.test.ts`

Expected: PASS.

- [ ] **Step 8: Run all server-generation tests**

Run: `pnpm exec vitest run src/lib/server`

Expected: PASS. Update any remaining fixtures only where their old `setting` field represents newly generated content; retain explicit legacy-compatibility fixtures.

- [ ] **Step 9: Commit prompt behavior**

```bash
git add src/lib/server/api/llm/prompts src/lib/server/generation
git commit -m "feat: tune prompts to active lever behavior"
```

### Task 4: Replace the generation control and expose Default choices

**Files:**

- Rename: `src/components/molecules/generation/PeopleSettingLever.svelte` → `src/components/molecules/generation/PeopleTopicLever.svelte`
- Create: `src/components/molecules/generation/PeopleTopicLever.test.ts`
- Modify: `src/components/molecules/generation/DepthSafetyLever.svelte`
- Create: `src/components/molecules/generation/DepthSafetyLever.test.ts`
- Modify: `src/components/organisms/generation/GenerationControls.svelte`
- Modify: `src/stores/generation.svelte.ts`

**Interfaces:**

- Consumes: Default-first option arrays and `LeverSelection<T>` from Task 1.
- Produces: a People & topic Zag popover and independently automatic Depth/Controversy choices.
- Preserves: Existing `Popover`, `Chip`, responsive styles, focus behavior, and direct mutation of `generationParams`.

- [ ] **Step 1: Read mandatory UI instructions before changing the Zag popovers**

Read completely:

- `.agents/skills/talkspark-interactive-ui/SKILL.md`
- `.agents/skills/talkspark-design-system/SKILL.md`
- `src/styles/DESIGN_SYSTEM.md` once

Do not edit token values or replace the existing `Popover` machine.

- [ ] **Step 2: Write a failing People & topic component test**

Create `PeopleTopicLever.test.ts`:

```ts
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PeopleTopicLever from './PeopleTopicLever.svelte';
import { RELATIONSHIP_CONTEXT_OPTIONS, TOPIC_LENS_OPTIONS } from 'lib/data/generation-options';

afterEach(cleanup);

describe('PeopleTopicLever', () => {
	it('shows Default selections and exposes topic choices', async () => {
		const selectTopic = vi.fn();
		render(PeopleTopicLever, {
			props: {
				relationshipOptions: RELATIONSHIP_CONTEXT_OPTIONS,
				topicOptions: TOPIC_LENS_OPTIONS,
				relationshipValue: 'default',
				topicValue: 'default',
				onSelectRelationship: vi.fn(),
				onSelectTopic: selectTopic,
			},
		});

		expect(screen.getByRole('button', { name: /People & topic/i })).toHaveTextContent(
			'Default · Default'
		);
		await fireEvent.click(screen.getByRole('button', { name: /People & topic/i }));
		await fireEvent.click(screen.getByRole('button', { name: 'Stories & memories' }));
		expect(selectTopic).toHaveBeenCalledWith('stories_memories');
	});
});
```

- [ ] **Step 3: Write a failing Depth & safety component test**

Create `DepthSafetyLever.test.ts`:

```ts
import { cleanup, fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DepthSafetyLever from './DepthSafetyLever.svelte';

afterEach(cleanup);

describe('DepthSafetyLever', () => {
	it('allows depth and controversy to remain independently automatic', async () => {
		const onSelect = vi.fn();
		render(DepthSafetyLever, {
			props: {
				value: { depth_level: 'default', controversy_level: 'default' },
				onSelect,
			},
		});

		expect(screen.getByRole('button', { name: /Depth & safety/i })).toHaveTextContent(
			'Depth Default · Controversy Default'
		);
		await fireEvent.click(screen.getByRole('button', { name: /Depth & safety/i }));
		await fireEvent.click(screen.getAllByRole('button', { name: '3' })[0]);
		expect(onSelect).toHaveBeenCalledWith({
			depth_level: 3,
			controversy_level: 'default',
		});
	});
});
```

- [ ] **Step 4: Run component tests and verify RED**

Run: `pnpm exec vitest run src/components/molecules/generation/PeopleTopicLever.test.ts src/components/molecules/generation/DepthSafetyLever.test.ts`

Expected: FAIL because `PeopleTopicLever.svelte` does not exist and Depth & safety has no Default chip/labels.

- [ ] **Step 5: Rename and retarget the People component**

Rename the component file without changing its existing Zag `Popover` or style block. Update its script and markup:

- Types: `LeverSelection<RelationshipContext>` and `LeverSelection<TopicLens>`.
- Props: `topicOptions`, `topicValue`, and `onSelectTopic` replace setting props.
- Derived fallback labels remain `Who` and become `Topic`.
- Trigger label becomes `People & topic` and value remains `${relationshipLabel} · ${topicLabel}`.
- Second sub-label becomes `Topic` and its chips use `topicOptions`.

- [ ] **Step 6: Add independent Default chips to Depth & safety**

In each `DepthSafetyLever.svelte` chip row, render this before numeric steps:

```svelte
<Chip
	label="Default"
	selected={value.depth_level === DEFAULT_LEVER_VALUE}
	onClick={() => onSelect({ ...value, depth_level: DEFAULT_LEVER_VALUE })}
/>
```

Use the corresponding `controversy_level` expression in the controversy row. Import `DEFAULT_LEVER_VALUE`. The existing trigger interpolation already renders the string `default`; add a display helper so it renders `Default`:

```ts
const displaySelection = (selection: number | typeof DEFAULT_LEVER_VALUE) =>
	selection === DEFAULT_LEVER_VALUE ? 'Default' : selection;
```

Use `displaySelection(...)` for both trigger values. Preserve all existing responsive and token-based styles.

- [ ] **Step 7: Wire controls and state to topic lens**

In `GenerationControls.svelte`:

- Import `PeopleTopicLever` and `TOPIC_LENS_OPTIONS`.
- Replace setting props/mutations with topic props/mutations.
- Keep `LeverSelect` generic inference; its option and value types now include `'default'`.
- Keep Depth & safety fallback to the all-Default `DEFAULT_GENERATION_PARAMS` value.

In `stores/generation.svelte.ts`, retain the existing clone pattern; the changed default object should initialize every lever to Default without new state logic.

- [ ] **Step 8: Run component tests and verify GREEN**

Run: `pnpm exec vitest run src/components/molecules/generation/PeopleTopicLever.test.ts src/components/molecules/generation/DepthSafetyLever.test.ts`

Expected: PASS.

- [ ] **Step 9: Run component/type validation**

Run: `pnpm check`

Expected: PASS with only the repository's known Sass legacy API warnings.

- [ ] **Step 10: Commit the generation UI**

```bash
git add src/components/molecules/generation src/components/organisms/generation/GenerationControls.svelte src/stores/generation.svelte.ts
git commit -m "feat: expose default topic generation controls"
```

### Task 5: Update documentation and verify the complete migration

**Files:**

- Modify: `docs/features/generation-engine.md`
- Modify: `docs/philosophy/spark-taxonomy.md`
- Modify: `src/lib/data/generation-options.ts` comments if they still reference People & setting
- Modify: `src/ts/params.ts` comments if they still describe old levers
- Modify: any remaining source/test file returned by the exact setting scan, only where it describes current generation rather than legacy compatibility

**Interfaces:**

- Consumes: Complete implementation from Tasks 1–4.
- Produces: Documentation aligned with People & topic, Default semantics, topic-lens taxonomy, and retained legacy setting compatibility.

- [ ] **Step 1: Scan for stale current-generation setting references**

Run: `rg -n "\bsetting\b|People & setting|SETTING_OPTIONS|resolved\.setting|generationParams\.setting|Setting:" src docs`

Expected: Matches remain only in the design/history wording and explicit legacy compatibility declarations/tests. Record every active-generation match before editing it.

- [ ] **Step 2: Update generation documentation**

In `docs/features/generation-engine.md`:

- Change the visible lever description from “People & setting” to “People & topic.”
- Add one concise paragraph defining Default as automatic broad-neutral behavior based on the other active constraints.
- State that selected labels shape substance and suitability and should not be echoed literally.

In `docs/philosophy/spark-taxonomy.md`:

- Replace active `setting` with `topic_lens` and the six settled values.
- Define input-only Default separately; do not list it as a settled spark taxonomy value.
- Update Context Fit from “relationship and setting” to “active relationship/topic constraints.”
- Note that `setting` is retained only on legacy local objects until storage migration is warranted.

- [ ] **Step 3: Run the stale-reference scan again**

Run: `rg -n "\bsetting\b|People & setting|SETTING_OPTIONS|resolved\.setting|generationParams\.setting|Setting:" src docs`

Expected: No active-generation code references. Only the approved design/history text and explicit legacy compatibility material may match.

- [ ] **Step 4: Run focused and full unit tests**

Run: `pnpm test`

Expected: All Vitest suites PASS.

- [ ] **Step 5: Run static, lint, formatting, and unused-code validation**

Run: `pnpm validate`

Expected: PASS. Known Sass `legacy-js-api` warnings are acceptable; errors are not.

- [ ] **Step 6: Run the production build**

Run: `OPENAI_API_KEY=dummy pnpm build`

Expected: PASS. Known Sass deprecation warnings are acceptable.

- [ ] **Step 7: Review the complete diff for unrelated edits**

Run: `git diff --stat 7446163..HEAD` and `git status --short`

Expected: Feature commits contain only files listed in this plan. Pre-existing unrelated UI/style modifications remain unstaged and unchanged.

- [ ] **Step 8: Commit documentation and any final migration cleanup**

```bash
git add docs/features/generation-engine.md docs/philosophy/spark-taxonomy.md src/lib/data/generation-options.ts src/ts/params.ts
git commit -m "docs: document topic lens generation defaults"
```

- [ ] **Step 9: Report validation boundaries**

State that unit tests, `pnpm validate`, and the dummy-key production build passed. Also state explicitly that no live LLM generation was exercised unless a real server-only provider key was available and deliberately used.

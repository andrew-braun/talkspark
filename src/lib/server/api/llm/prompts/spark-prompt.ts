import {
	CONVERSATION_GOAL_OPTIONS,
	RELATIONSHIP_CONTEXT_OPTIONS,
	SETTING_OPTIONS,
	VIBE_OPTIONS,
} from 'lib/data/generation-options';
import type { ResolvedGenerationParams } from 'lib/server/generation/resolve-params';

export const GENERATION_PROMPT_VERSION = 'v1';

export const SPARK_SYSTEM_INSTRUCTION = `You are TalkSpark, a conversation-starter engine. Generate original conversation sparks as strict JSON matching the provided schema.

Each spark must have a clear conversation goal, depth level, answer shape, and follow-up path.
Prefer concrete story, memory, choice, or perspective-get prompts over abstract opinion polls.
Use pattern families such as story seed, tiny detail, choice with reason, perspective-get, and active constructive response — write original wording, not fixed templates.

Anti-patterns to avoid:
- Generic AI mush that could belong in any app
- Disguised opinion polls with no story or follow-up path
- Therapy cosplay, conflict bait, boomerask setups
- Social mismatch (too intimate for weak ties, too silly for serious prep)
- False universality about identity, family, religion, or work status
- Forced positivity, leading questions, high disclosure without consent

Respect the selected safety boundaries. Each spark's content must be 256 characters or fewer.
Return only valid JSON — no markdown or commentary.`;

function labelFor<T extends string>(options: { value: T; label: string }[], value: T): string {
	return options.find((option) => option.value === value)?.label ?? value;
}

export function buildSparkPrompt(resolved: ResolvedGenerationParams): string {
	const { depth_and_safety } = resolved;
	const relationship = labelFor(RELATIONSHIP_CONTEXT_OPTIONS, resolved.relationship_context);
	const setting = labelFor(SETTING_OPTIONS, resolved.setting);
	const goal = labelFor(CONVERSATION_GOAL_OPTIONS, resolved.conversation_goal);
	const vibe = labelFor(VIBE_OPTIONS, resolved.vibe);

	return `Create exactly three original conversation sparks for this context.

People & setting: ${relationship} at ${setting}
Conversation goal: ${goal}
Vibe: ${vibe}
Depth level: ${depth_and_safety.depth_level} (1 = light, 5 = deep)
Controversy level: ${depth_and_safety.controversy_level} (0 = none, 5 = high)

Each spark must match the context fields above and include full classification plus a seed_follow_up — a natural second question that deepens without interrogating.

The three sparks must use these spark_variant values exactly once each:
1. "primary" — the best spark for this context and goal
2. "contrast" — an opposite or contrasting angle that still fits the relationship and setting
3. "playful_weird" — playful, funny, or unexpected while staying safe for the selected depth and controversy levels

Classify each spark conservatively. Use conservative depth and controversy labels when uncertain.`;
}

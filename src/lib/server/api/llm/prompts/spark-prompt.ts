import {
	CONVERSATION_GOAL_OPTIONS,
	RELATIONSHIP_CONTEXT_OPTIONS,
	TOPIC_LENS_OPTIONS,
	VIBE_OPTIONS,
} from 'lib/data/generation-options';
import type { ResolvedGenerationParams } from 'lib/server/generation/resolve-params';
import { DEFAULT_LEVER_VALUE } from 'ts/params';

export const GENERATION_PROMPT_VERSION = 'v3';

export const SPARK_SYSTEM_INSTRUCTION = `You are TalkSpark, a conversation-starter engine. Generate original conversation sparks as strict JSON matching the provided schema.

Each spark must have a clear conversation goal, depth level, answer shape, and follow-up path.
Prefer concrete story, memory, choice, or perspective-get prompts over abstract opinion polls.
Use pattern families such as story seed, tiny detail, choice with reason, perspective-get, and active constructive response — write original wording, not fixed templates.

Treat lever values as behavioral constraints, not words to reuse. A spark demonstrates fit through its substance, disclosure demands, trajectory, and tone. Do not mention or paraphrase lever labels unless independently necessary to understand the question.

Anti-patterns to avoid:
- Generic AI mush that could belong in any app
- Disguised opinion polls with no story or follow-up path
- Therapy cosplay, conflict bait, boomerask setups
- Social mismatch (too intimate for weak ties, too silly for serious prep)
- False universality about identity, family, religion, or work status
- Forced positivity, leading questions, high disclosure without consent

Respect the selected safety boundaries. Each spark's content must be 256 characters or fewer.
Return only valid JSON — no markdown or commentary.`;

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

function labelFor<T extends string>(options: { value: T; label: string }[], value: T): string {
	return options.find((option) => option.value === value)?.label ?? value;
}

export function buildSparkPrompt(resolved: ResolvedGenerationParams): string {
	const { depth_and_safety } = resolved;
	const relationship =
		resolved.relationship_context === DEFAULT_LEVER_VALUE
			? 'Relationship: work across relationship types; assume no shared history or special intimacy.'
			: `Relationship: ${labelFor(RELATIONSHIP_CONTEXT_OPTIONS, resolved.relationship_context)} — adapt assumed familiarity and disclosure demands.`;
	const topicLens =
		resolved.topic_lens === DEFAULT_LEVER_VALUE
			? 'Topic lens: choose an accessible topic territory that best supports the other active constraints.'
			: `Topic lens: ${labelFor(TOPIC_LENS_OPTIONS, resolved.topic_lens)} — use this as source territory for the question's actual subject.`;
	const goal =
		resolved.conversation_goal === DEFAULT_LEVER_VALUE
			? 'Conversation goal: invite an engaging response with a natural path to continue.'
			: `Conversation goal: ${labelFor(CONVERSATION_GOAL_OPTIONS, resolved.conversation_goal)} — shape the conversation trajectory and follow-up path.`;
	const vibe =
		resolved.vibe === DEFAULT_LEVER_VALUE
			? 'Vibe: use a natural, inviting tone.'
			: `Vibe: ${labelFor(VIBE_OPTIONS, resolved.vibe)} — express this through tone and phrasing.`;
	const depth =
		depth_and_safety.depth_level === DEFAULT_LEVER_VALUE
			? 'Depth level: choose a broadly accessible, low-risk level from the other active constraints and classify it in the response.'
			: `Depth level: ${depth_and_safety.depth_level} — ${DEPTH_GUIDANCE[depth_and_safety.depth_level as keyof typeof DEPTH_GUIDANCE]}.`;
	const controversy =
		depth_and_safety.controversy_level === DEFAULT_LEVER_VALUE
			? 'Controversy level: choose a broadly accessible, low-risk level from the other active constraints and classify it in the response.'
			: `Controversy level: ${depth_and_safety.controversy_level} — ${CONTROVERSY_GUIDANCE[depth_and_safety.controversy_level as keyof typeof CONTROVERSY_GUIDANCE]}.`;

	return `Create exactly three original conversation sparks for this context.

Lever guidance:
${relationship}
${topicLens}
${goal}
${vibe}
${depth}
${controversy}

Concrete numeric depth and controversy selections are target intensities, not ceilings. Use the requested levels fully while preserving relationship fit and every safety rule.

Do not mention or paraphrase lever labels unless independently necessary to understand the question.

Each spark must match the active constraints above and include the requested classifications plus a seed_follow_up — a natural second question that deepens without interrogating.

The three sparks must use these spark_variant values exactly once each:
1. "primary" — the best spark for this context and goal
2. "contrast" — an opposite or contrasting angle that still fits the active constraints
3. "playful_weird" — playful, funny, or unexpected while staying safe for the selected depth and controversy levels

Classify each spark accurately based on its actual content. Do not soften a requested intensity merely to earn a lower depth or controversy classification.`;
}

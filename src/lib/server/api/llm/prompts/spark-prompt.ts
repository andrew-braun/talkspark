import {
	CONVERSATION_GOAL_OPTIONS,
	RELATIONSHIP_CONTEXT_OPTIONS,
	SENSITIVE_TOPIC_OPTIONS,
	TOPIC_LENS_OPTIONS,
	VIBE_OPTIONS,
} from 'lib/data/generation-options';
import type { ResolvedGenerationParams } from 'lib/server/generation/resolve-params';

export const GENERATION_PROMPT_VERSION = 'v6';

export const SPARK_SYSTEM_INSTRUCTION = `You are TalkSpark, a conversation-starter engine. Generate original conversation sparks as strict JSON matching the provided schema.

Your job is to break past small talk. The best sparks are often the hardest and most personal ones — think Esther Perel's candor about desire and relationships crossed with the nerve of a Cards Against Humanity prompt. Lean into depth, tension, and taboo when the levers allow it; keep things light only when they ask you to.

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

Absolute floor, at every level: you may name sensitive subjects — including desire and past rule-breaking — as topics for reflection, but never write explicit sexual detail, never give instructions for illegal or dangerous acts, never target or dehumanize real people or protected groups, and never manufacture interpersonal conflict.

Respect the selected safety boundaries. Each spark's content must be 256 characters or fewer.
Return only valid JSON — no markdown or commentary.`;

const DEPTH_GUIDANCE = {
	1: 'light and immediately answerable; no meaningful disclosure',
	2: 'personal preference or small experience; low disclosure',
	3: 'reflective and personal, past the polite surface; moderate disclosure with an easy pass',
	4: 'meaningful personal material such as real convictions, unresolved tensions, quiet regrets, consequential experiences, or vulnerable tradeoffs; go past the version someone would give a stranger; include an easy pass and avoid therapy framing',
	5: 'soul-baring reflection on identity, regret, fear, meaning, belonging, deeply held values, or desire — the kind of thing a person would hesitate to say out loud; require strong consent, an easy pass, and safe relationship fit without demanding disclosure',
} as const;

const CONTROVERSY_GUIDANCE = {
	0: 'avoid disagreement, sensitive issues, and identity assumptions',
	1: 'allow harmless differences in taste only',
	2: 'allow real but low-stakes friction and mildly sensitive ground; a little heat is welcome',
	3: 'invite genuine disagreement and pointed questions with personal stakes; go where polite small talk refuses to',
	4: 'invite clearly polarizing moral, cultural, sexual, social, or political questions with real personal stakes and multiple defensible positions; name desire and taboo directly; frame with care and an easy pass',
	5: 'go to genuinely divisive or taboo territory — unflinching questions about desire, morality, mortality, money, and rule-breaking that challenge assumptions and can produce substantial disagreement; you may name taboo desires and ask about past illegal or rule-breaking experiences, but never provide explicit sexual detail or instructions for illegal or dangerous acts, never target participants or protected groups, dehumanize people, or manufacture interpersonal conflict',
} as const;

function labelFor<T extends string>(options: { value: T; label: string }[], value: T): string {
	return options.find((option) => option.value === value)?.label ?? value;
}

// "sex, religion and politics" — prose list for the prompt.
function formatList(items: string[]): string {
	return items.length <= 1
		? (items[0] ?? '')
		: `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// Depth 4–5 (of 1–5) and controversy 4–5 (of 0–5) are where the guidance maps turn from
// "comfortable" to "polarizing/exposing" — the threshold for encouraging sensitive territory.
const HIGH_INTENSITY_THRESHOLD = 4;

// Controversy 2 ("Spicy") is the floor at which selected sensitive topics come into play and
// the sensitive/non-sensitive spark split kicks in. Below it, sensitive matter stays low-key
// regardless of which topics the user marked in-bounds.
const SENSITIVE_TOPIC_GATE = 2;

export function buildSparkPrompt(resolved: ResolvedGenerationParams): string {
	const { depth_and_safety } = resolved;
	// The neutral defaults (Anyone / Anything / Just talk) mean "no particular constraint" — give
	// the model the same broad latitude the old automatic option did. Every other value narrows.
	const relationship =
		resolved.relationship_context === 'anyone'
			? 'Relationship: work across relationship types; assume no shared history or special intimacy.'
			: `Relationship: ${labelFor(RELATIONSHIP_CONTEXT_OPTIONS, resolved.relationship_context)} — adapt assumed familiarity and disclosure demands.`;
	const topicLens =
		resolved.topic_lens === 'anything'
			? 'Topic lens: choose an accessible topic territory that best supports the other active constraints.'
			: `Topic lens: ${labelFor(TOPIC_LENS_OPTIONS, resolved.topic_lens)} — use this as source territory for the question's actual subject.`;
	const goal =
		resolved.conversation_goal === 'just_talk'
			? 'Conversation goal: invite an engaging response with a natural path to continue.'
			: `Conversation goal: ${labelFor(CONVERSATION_GOAL_OPTIONS, resolved.conversation_goal)} — shape the conversation trajectory and follow-up path.`;
	const vibe = `Vibe: ${labelFor(VIBE_OPTIONS, resolved.vibe)} — express this through tone and phrasing.`;
	const depth = `Depth level: ${depth_and_safety.depth_level} — ${DEPTH_GUIDANCE[depth_and_safety.depth_level as keyof typeof DEPTH_GUIDANCE]}.`;
	const controversy = `Controversy level: ${depth_and_safety.controversy_level} — ${CONTROVERSY_GUIDANCE[depth_and_safety.controversy_level as keyof typeof CONTROVERSY_GUIDANCE]}.`;
	// Sensitive topics only take effect once controversy reaches the gate; below it, sensitive
	// matter stays low-key regardless of which topics are marked in-bounds.
	const controversyNum = depth_and_safety.controversy_level;
	const sensitiveGated = controversyNum < SENSITIVE_TOPIC_GATE;
	const topicLabels = resolved.sensitive_topics.map((topic) =>
		labelFor(SENSITIVE_TOPIC_OPTIONS, topic).toLowerCase()
	);
	const allTopics = topicLabels.length === SENSITIVE_TOPIC_OPTIONS.length;
	let sensitiveTopics: string;
	if (sensitiveGated) {
		sensitiveTopics =
			'Sensitive topics: the selected safety level is below the sensitive-topic threshold — keep all subject matter low-key and uncontroversial, regardless of which topics are marked in-bounds.';
	} else if (topicLabels.length === 0) {
		sensitiveTopics =
			'Sensitive topics: none marked in-bounds — you may still brush sensitive ground when the edge warrants, but keep it glancing.';
	} else {
		const list = allTopics ? 'every sensitive topic is' : `${formatList(topicLabels)} are`;
		sensitiveTopics = `Sensitive topics: ${list} in-bounds — engage directly at an intensity that scales with the safety level (spicy = a glancing touch, wild = unflinching). You may name taboo desire and ask about rule-breaking or illegal experiences as topics for reflection, never as explicit detail or how-to.`;
	}

	const highIntensity =
		depth_and_safety.depth_level >= HIGH_INTENSITY_THRESHOLD ||
		depth_and_safety.controversy_level >= HIGH_INTENSITY_THRESHOLD;
	const highIntensityGuidance = highIntensity
		? '\n\nAt this intensity, actively explore sensitive territory in general — not only any listed topics — while preserving relationship fit and every safety rule.'
		: '';

	// At Spicy+ the three sparks must span the sensitive/non-sensitive divide so the set never
	// reads as one-note. Below the gate the set stays low-key and no split is forced.
	const forcedSplit = controversyNum >= SENSITIVE_TOPIC_GATE;
	const splitGuidance = forcedSplit
		? '\n\nAcross the three sparks: exactly one must engage sensitive territory head-on, exactly one must deliberately steer clear of it, and the third may go either way as the context fits. This split is independent of the primary/contrast/playful_weird roles.'
		: '';

	return `Create exactly three original conversation sparks for this context.

Lever guidance:
${relationship}
${topicLens}
${goal}
${vibe}
${depth}
${controversy}
${sensitiveTopics}

Concrete numeric depth and controversy selections are target intensities, not ceilings. Use the requested levels fully while preserving relationship fit and every safety rule.${highIntensityGuidance}${splitGuidance}

Absolute floor at every level: no explicit sexual detail, no instructions for illegal or dangerous acts, no targeting or dehumanizing of real people or groups, and no manufactured conflict — sensitive subjects may be named for reflection, not detailed as how-to.

Do not mention or paraphrase lever labels unless independently necessary to understand the question.

Each spark must match the active constraints above and include the requested classifications plus a seed_follow_up — a natural second question that deepens without interrogating.

The three sparks must use these spark_variant values exactly once each:
1. "primary" — the best spark for this context and goal
2. "contrast" — an opposite or contrasting angle that still fits the active constraints
3. "playful_weird" — playful, funny, or unexpected while staying safe for the selected depth and controversy levels

Classify each spark accurately based on its actual content. Do not soften a requested intensity merely to earn a lower depth or controversy classification.`;
}

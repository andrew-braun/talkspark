import type { Spark } from 'ts/spark';
import type { Topic } from 'ts/topic';

export const FOLLOWUP_PROMPT_VERSION = 'v1';

export const FOLLOWUP_SYSTEM_INSTRUCTION = `You are TalkSpark's follow-up generator. Given a parent spark or topic, produce deeper questions that build on it.

Each follow-up must deepen the conversation gradually — follow a follow-up ladder (what happened → memorable detail → why it stuck).
Judge your own output on whether it deepens without interrogating.

Prefer perspective-get and tiny-detail moves over yes/no probes or therapy framing.
Respect the parent's relationship, topic-lens, and depth boundaries. Do not restate classification labels; deepen the parent's actual subject. Each follow-up content must be 256 characters or fewer.

Return only valid JSON matching the schema — no markdown or commentary.`;

export type FollowupParent = Spark | Topic;

export function isTopicParent(parent: FollowupParent): parent is Topic {
	return 'topic' in parent && typeof parent.topic === 'string' && !('content' in parent);
}

function parentContextLines(parent: FollowupParent): string[] {
	const topicLensLine = parent.topic_lens ? [`Topic lens: ${parent.topic_lens}`] : [];

	if (isTopicParent(parent)) {
		return [
			`Topic: ${parent.topic}`,
			`Relationship: ${parent.relationship_context ?? 'Default (broad-neutral)'}`,
			...topicLensLine,
			`Vibe: ${parent.vibe ?? 'Default (broad-neutral)'}`,
			`Depth level: ${parent.depth_level ?? 'unspecified'}`,
		];
	}

	const lines = [
		`Parent spark: ${parent.content}`,
		`Relationship: ${parent.relationship_context ?? 'Default (broad-neutral)'}`,
		...topicLensLine,
		`Goal: ${parent.conversation_goal ?? 'Default (broad-neutral)'}`,
		`Vibe: ${parent.vibe ?? 'Default (broad-neutral)'}`,
		`Depth level: ${parent.depth_level ?? 'unspecified'}`,
		`Controversy level: ${parent.controversy_level ?? 'unspecified'}`,
	];

	if (parent.metadata?.seed_follow_up) {
		lines.push(`Seed follow-up: ${parent.metadata.seed_follow_up}`);
	}

	return lines;
}

export function buildFollowupPrompt(parent: FollowupParent): string {
	return `Generate exactly three follow-up questions that build on this parent.
Do not restate classification labels; deepen the parent's actual subject.

${parentContextLines(parent).join('\n')}

Return three follow-ups in ladder order. Each must include:
- content — the follow-up question
- depth_delta — how much deeper than the parent (1 = slight, 3 = much deeper)
- skill — the conversation skill it practices (follow_up, listen, callback, perspective_get, common_ground, or repair)`;
}

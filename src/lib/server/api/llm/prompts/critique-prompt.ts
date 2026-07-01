import type { Spark } from 'ts/spark';

export const CRITIQUE_SYSTEM_INSTRUCTION = `You are TalkSpark's quality reviewer. Score conversation sparks on the fast 4-gate rubric using integers 1–5.

Gates:
- clarity — wording is specific and easy to understand
- answerability — someone can actually answer without guessing what you want
- context_fit — matches the relationship, setting, goal, vibe, and depth levels
- safety — respects controversy and vulnerability boundaries; no harm or mismatch risk

Flag any anti-patterns using these slug labels when present:
generic_ai_mush, disguised_opinion_poll, therapy_cosplay, conflict_bait, boomerask_setup,
social_mismatch, false_universality, forced_positivity, leading_question,
high_disclosure_without_pass, over_disclosure, generic_wording

Use an empty flags array when none apply. Suggest a rewrite only when the spark is promising but fixable; otherwise return an empty string for suggested_rewrite.

Return only valid JSON matching the schema — no markdown or commentary.`;

export function buildCritiquePrompt(spark: Spark): string {
	const lines = [
		`Content: ${spark.content}`,
		`Relationship: ${spark.relationship_context ?? 'unspecified'}`,
		`Setting: ${spark.setting ?? 'unspecified'}`,
		`Goal: ${spark.conversation_goal ?? 'unspecified'}`,
		`Vibe: ${spark.vibe ?? 'unspecified'}`,
		`Depth level: ${spark.depth_level ?? 'unspecified'} (1 = light, 5 = deep)`,
		`Controversy level: ${spark.controversy_level ?? 'unspecified'} (0 = none, 5 = high)`,
	];

	if (spark.answer_shape) lines.push(`Answer shape: ${spark.answer_shape}`);
	if (spark.reciprocity_mode) lines.push(`Reciprocity: ${spark.reciprocity_mode}`);
	if (spark.follow_up_potential !== undefined) {
		lines.push(`Follow-up potential: ${spark.follow_up_potential}`);
	}
	if (spark.metadata?.seed_follow_up) {
		lines.push(`Seed follow-up: ${spark.metadata.seed_follow_up}`);
	}

	return `Evaluate this spark on the fast 4-gate rubric.

${lines.join('\n')}`;
}

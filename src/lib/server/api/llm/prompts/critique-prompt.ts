import type { Spark, SparkVariant } from 'ts/spark';

export const CRITIQUE_SYSTEM_INSTRUCTION = `You are TalkSpark's quality reviewer. Score conversation sparks on the fast 4-gate rubric using integers 1–5.

Gates:
- clarity — wording is specific and easy to understand
- answerability — someone can actually answer without guessing what you want
- context_fit — matches the relationship, topic lens, goal, vibe, depth, and controversy levels
- safety — respects controversy and vulnerability boundaries; no harm or mismatch risk

Merely mentioning a context label does not count as context fit; score whether the substance and social demands are actually adapted.

Flag any anti-patterns using these slug labels when present:
generic_ai_mush, disguised_opinion_poll, therapy_cosplay, conflict_bait, boomerask_setup,
social_mismatch, false_universality, forced_positivity, leading_question,
high_disclosure_without_pass, over_disclosure, generic_wording

Use an empty flags array when none apply. Suggest a rewrite only when the spark is promising but fixable; otherwise return an empty string for suggested_rewrite.

Return only valid JSON matching the schema — no markdown or commentary.`;

function formatSparkLines(spark: Spark): string[] {
	const lines = [
		`Content: ${spark.content}`,
		`Relationship: ${spark.relationship_context ?? 'Default (broad-neutral)'}`,
		`Topic lens: ${spark.topic_lens ?? 'Default (broad-neutral)'}`,
		`Goal: ${spark.conversation_goal ?? 'Default (broad-neutral)'}`,
		`Vibe: ${spark.vibe ?? 'Default (broad-neutral)'}`,
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

	return lines;
}

function sparkVariantLabel(spark: Spark): SparkVariant | 'unknown' {
	const variant = spark.metadata?.spark_variant;
	return typeof variant === 'string' ? (variant as SparkVariant) : 'unknown';
}

export function buildCritiquePrompt(spark: Spark): string {
	return `Evaluate this spark on the fast 4-gate rubric.
Merely mentioning a context label does not count as context fit; score whether the substance and social demands are actually adapted.

${formatSparkLines(spark).join('\n')}`;
}

export function buildBatchCritiquePrompt(sparks: Spark[]): string {
	const sections = sparks.map((spark, index) => {
		const variant = sparkVariantLabel(spark);
		return `### Spark ${index + 1} (spark_variant: "${variant}")
${formatSparkLines(spark).join('\n')}`;
	});

	return `Evaluate each spark below independently on the fast 4-gate rubric.
Score each against the rubric on its own merits — do not rank or compare sparks relative to each other.
Merely mentioning a context label does not count as context fit; score whether the substance and social demands are actually adapted.

${sections.join('\n\n')}

Return one critique per spark. Each critique must include the matching spark_variant.`;
}

import { GENERATION_PROMPT_VERSION } from 'lib/server/api/llm/prompts/spark-prompt';
import type { GeneratedSpark } from 'lib/server/api/llm/schemas/spark.schema';
import type { ResolvedGenerationParams } from 'lib/server/generation/resolve-params';
import type { Spark } from 'ts/spark';

export function enrichSpark(
	generated: GeneratedSpark,
	resolved: ResolvedGenerationParams,
	{ id, now }: { id: string; now: number }
): Spark {
	const { depth_and_safety } = resolved;

	return {
		id,
		content: generated.content,
		relationship_context: resolved.relationship_context,
		setting: resolved.setting,
		conversation_goal: resolved.conversation_goal,
		vibe: resolved.vibe,
		depth_level: depth_and_safety.depth_level,
		controversy_level: depth_and_safety.controversy_level,
		conversation_motive: generated.conversation_motive,
		humor_level: generated.humor_level,
		answer_shape: generated.answer_shape,
		reciprocity_mode: generated.reciprocity_mode,
		follow_up_potential: generated.follow_up_potential,
		conversation_skill: generated.conversation_skill,
		source_type: 'ai_generated',
		status: 'draft',
		visibility: 'private',
		created_at: now,
		updated_at: now,
		metadata: {
			generation_prompt_version: GENERATION_PROMPT_VERSION,
			generation_params: resolved,
			seed_follow_up: generated.seed_follow_up,
			spark_variant: generated.spark_variant,
		},
	};
}

import { DEFAULT_GENERATION_PARAMS } from 'lib/data/generation-options';
import type { DepthAndSafety, GenerationParams } from 'ts/params';

export type ResolvedGenerationParams = Required<Omit<GenerationParams, 'depth_and_safety'>> & {
	depth_and_safety: Required<DepthAndSafety>;
};

export function resolveGenerationParams(params: GenerationParams): ResolvedGenerationParams {
	const defaults = DEFAULT_GENERATION_PARAMS;

	return {
		type: params.type ?? defaults.type,
		relationship_context: params.relationship_context ?? defaults.relationship_context!,
		topic_lens: params.topic_lens ?? defaults.topic_lens!,
		conversation_goal: params.conversation_goal ?? defaults.conversation_goal!,
		vibe: params.vibe ?? defaults.vibe!,
		depth_and_safety: {
			depth_level:
				params.depth_and_safety?.depth_level ?? defaults.depth_and_safety!.depth_level,
			controversy_level:
				params.depth_and_safety?.controversy_level ??
				defaults.depth_and_safety!.controversy_level,
		},
	};
}

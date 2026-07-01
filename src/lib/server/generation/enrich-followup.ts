import { FOLLOWUP_PROMPT_VERSION } from 'lib/server/api/llm/prompts/followup-prompt';
import type { GeneratedFollowup } from 'lib/server/api/llm/schemas/followup.schema';
import type { Followup } from 'ts/followup';

export function enrichFollowup(
	generated: GeneratedFollowup,
	parentId: string,
	position: number,
	{ id, now }: { id: string; now: number }
): Followup {
	return {
		id,
		parent_id: parentId,
		content: generated.content,
		depth_delta: generated.depth_delta,
		position,
		skill: generated.skill,
		created_at: now,
		metadata: {
			generation_prompt_version: FOLLOWUP_PROMPT_VERSION,
		},
	};
}

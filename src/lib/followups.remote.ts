import { command } from '$app/server';
import * as v from 'valibot';
import { getProvider } from 'lib/server/api/llm';
import {
	FOLLOWUP_SYSTEM_INSTRUCTION,
	buildFollowupPrompt,
	type FollowupParent,
} from 'lib/server/api/llm/prompts/followup-prompt';
import {
	FOLLOWUPS_RESPONSE_SCHEMA,
	type FollowupsResponse,
} from 'lib/server/api/llm/schemas/followup.schema';
import { critiqueFollowup } from 'lib/server/critique';
import { enrichFollowup } from 'lib/server/generation/enrich-followup';
import { CONVERSATION_GOALS, RELATIONSHIP_CONTEXTS, SETTINGS, TOPIC_LENSES, VIBES } from 'ts/spark';
import type { Followup } from 'ts/followup';

const sharedParentFields = {
	relationship_context: v.optional(v.picklist(RELATIONSHIP_CONTEXTS)),
	setting: v.optional(v.picklist(SETTINGS)),
	topic_lens: v.optional(v.picklist(TOPIC_LENSES)),
	vibe: v.optional(v.picklist(VIBES)),
	depth_level: v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(5))),
	controversy_level: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(5))),
	metadata: v.optional(v.record(v.string(), v.unknown())),
};

const sparkParentSchema = v.object({
	id: v.string(),
	content: v.string(),
	conversation_goal: v.optional(v.picklist(CONVERSATION_GOALS)),
	...sharedParentFields,
});

const topicParentSchema = v.object({
	id: v.string(),
	topic: v.string(),
	...sharedParentFields,
});

const parentSchema = v.union([sparkParentSchema, topicParentSchema]);

export const generateFollowups = command(v.object({ parent: parentSchema }), async ({ parent }) => {
	const typedParent = parent as FollowupParent;

	const { followups: generatedFollowups } =
		await getProvider().generateStructured<FollowupsResponse>({
			system: FOLLOWUP_SYSTEM_INSTRUCTION,
			prompt: buildFollowupPrompt(typedParent),
			schema: FOLLOWUPS_RESPONSE_SCHEMA,
			schemaName: 'followups_response',
		});

	const now = Date.now();
	const enriched = generatedFollowups.map((generated, position) =>
		enrichFollowup(generated, parent.id, position, {
			id: globalThis.crypto.randomUUID(),
			now,
		})
	);

	const followups: Followup[] = await Promise.all(
		enriched.map(async (followup) => ({
			...followup,
			critique: await critiqueFollowup(followup, typedParent),
		}))
	);

	return { followups };
});

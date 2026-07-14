import { command } from '$app/server';
import * as v from 'valibot';
import { getProvider } from 'lib/server/api/llm';
import {
	SPARK_SYSTEM_INSTRUCTION,
	buildSparkPrompt,
} from 'lib/server/api/llm/prompts/spark-prompt';
import {
	SPARKS_RESPONSE_SCHEMA,
	type SparksResponse,
} from 'lib/server/api/llm/schemas/spark.schema';
import { critiqueSparks } from 'lib/server/critique';
import { enrichSpark } from 'lib/server/generation/enrich-spark';
import { resolveGenerationParams } from 'lib/server/generation/resolve-params';
import { CONVERSATION_GOALS, RELATIONSHIP_CONTEXTS, TOPIC_LENSES, VIBES } from 'ts/spark';
import { DEFAULT_LEVER_VALUE } from 'ts/params';
import type { SparkData } from 'ts/sparks';

const defaultSelection = v.literal(DEFAULT_LEVER_VALUE);
const depthSelection = v.union([
	defaultSelection,
	v.pipe(v.number(), v.minValue(1), v.maxValue(5)),
]);
const controversySelection = v.union([
	defaultSelection,
	v.pipe(v.number(), v.minValue(0), v.maxValue(5)),
]);

const depthAndSafetySchema = v.object({
	depth_level: depthSelection,
	controversy_level: controversySelection,
});

const generationParamsSchema = v.object({
	type: v.string(),
	relationship_context: v.optional(
		v.union([defaultSelection, v.picklist(RELATIONSHIP_CONTEXTS)])
	),
	topic_lens: v.optional(v.union([defaultSelection, v.picklist(TOPIC_LENSES)])),
	conversation_goal: v.optional(v.union([defaultSelection, v.picklist(CONVERSATION_GOALS)])),
	vibe: v.optional(v.union([defaultSelection, v.picklist(VIBES)])),
	depth_and_safety: v.optional(depthAndSafetySchema),
});

export const generateSparks = command(generationParamsSchema, async (params) => {
	const resolved = resolveGenerationParams(params);

	const { sparks: generatedSparks } = await getProvider().generateStructured<SparksResponse>({
		system: SPARK_SYSTEM_INSTRUCTION,
		prompt: buildSparkPrompt(resolved),
		schema: SPARKS_RESPONSE_SCHEMA,
		schemaName: 'sparks_response',
	});

	const now = Date.now();
	const enriched = generatedSparks.map((generated) =>
		enrichSpark(generated, resolved, {
			id: globalThis.crypto.randomUUID(),
			now,
		})
	);

	const critiques = await critiqueSparks(enriched);
	const sparks: SparkData[] = enriched.map((spark, index) => ({
		...spark,
		critique: critiques[index],
	}));

	return { sparks };
});

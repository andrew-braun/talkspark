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
import {
	CONVERSATION_GOALS,
	RELATIONSHIP_CONTEXTS,
	SENSITIVE_TOPICS,
	TOPIC_LENSES,
	VIBES,
} from 'ts/spark';
import type { SparkData } from 'ts/sparks';

// Every lever carries a concrete value (the neutral defaults Anyone / Anything / Just talk are
// members of the picklists), so there is no sentinel to accept here.
const depthAndSafetySchema = v.object({
	depth_level: v.pipe(v.number(), v.minValue(1), v.maxValue(5)),
	controversy_level: v.pipe(v.number(), v.minValue(0), v.maxValue(5)),
});

const generationParamsSchema = v.object({
	type: v.string(),
	relationship_context: v.optional(v.picklist(RELATIONSHIP_CONTEXTS)),
	topic_lens: v.optional(v.picklist(TOPIC_LENSES)),
	conversation_goal: v.optional(v.picklist(CONVERSATION_GOALS)),
	vibe: v.optional(v.picklist(VIBES)),
	depth_and_safety: v.optional(depthAndSafetySchema),
	sensitive_topics: v.optional(v.array(v.picklist(SENSITIVE_TOPICS))),
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

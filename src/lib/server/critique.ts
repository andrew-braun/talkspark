import { getProvider } from 'lib/server/api/llm';
import {
	CRITIQUE_SYSTEM_INSTRUCTION,
	buildBatchCritiquePrompt,
	buildCritiquePrompt,
} from 'lib/server/api/llm/prompts/critique-prompt';
import {
	BATCH_CRITIQUE_RESPONSE_SCHEMA,
	CRITIQUE_RESPONSE_SCHEMA,
	type GeneratedBatchCritiqueItem,
	type GeneratedBatchCritiqueResponse,
	type GeneratedCritique,
} from 'lib/server/api/llm/schemas/critique.schema';
import type { CritiqueResult, FastGateScores } from 'ts/critique';
import type { Spark, SparkVariant } from 'ts/spark';

const PASS_THRESHOLD = 4;

export function computeCritiquePassed(scores: FastGateScores): boolean {
	return (
		scores.clarity >= PASS_THRESHOLD &&
		scores.answerability >= PASS_THRESHOLD &&
		scores.context_fit >= PASS_THRESHOLD &&
		scores.safety >= PASS_THRESHOLD
	);
}

export function toCritiqueResult(generated: GeneratedCritique): CritiqueResult {
	const scores: FastGateScores = {
		clarity: generated.clarity,
		answerability: generated.answerability,
		context_fit: generated.context_fit,
		safety: generated.safety,
	};

	const suggestedRewrite = generated.suggested_rewrite.trim();

	return {
		scores,
		passed: computeCritiquePassed(scores),
		flags: generated.flags,
		...(suggestedRewrite ? { suggested_rewrite: suggestedRewrite } : {}),
	};
}

export function mapBatchCritiquesToSparks(
	sparks: Spark[],
	items: GeneratedBatchCritiqueItem[]
): CritiqueResult[] {
	const byVariant = new Map(items.map((item) => [item.spark_variant, toCritiqueResult(item)]));

	return sparks.map((spark) => {
		const variant = spark.metadata?.spark_variant;
		if (typeof variant !== 'string') {
			throw new Error('Spark missing metadata.spark_variant for critique alignment');
		}

		const critique = byVariant.get(variant as SparkVariant);
		if (!critique) {
			throw new Error(`No critique returned for spark_variant "${variant}"`);
		}

		return critique;
	});
}

export async function critiqueSpark(spark: Spark): Promise<CritiqueResult> {
	const generated = await getProvider().generateStructured<GeneratedCritique>({
		system: CRITIQUE_SYSTEM_INSTRUCTION,
		prompt: buildCritiquePrompt(spark),
		schema: CRITIQUE_RESPONSE_SCHEMA,
		schemaName: 'critique_response',
	});

	return toCritiqueResult(generated);
}

export async function critiqueSparks(sparks: Spark[]): Promise<CritiqueResult[]> {
	if (sparks.length === 0) return [];
	if (sparks.length === 1) return [await critiqueSpark(sparks[0])];

	const { critiques } = await getProvider().generateStructured<GeneratedBatchCritiqueResponse>({
		system: CRITIQUE_SYSTEM_INSTRUCTION,
		prompt: buildBatchCritiquePrompt(sparks),
		schema: BATCH_CRITIQUE_RESPONSE_SCHEMA,
		schemaName: 'batch_critique_response',
	});

	return mapBatchCritiquesToSparks(sparks, critiques);
}

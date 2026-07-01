import { getProvider } from 'lib/server/api/llm';
import {
	CRITIQUE_SYSTEM_INSTRUCTION,
	buildCritiquePrompt,
} from 'lib/server/api/llm/prompts/critique-prompt';
import {
	CRITIQUE_RESPONSE_SCHEMA,
	type GeneratedCritique,
} from 'lib/server/api/llm/schemas/critique.schema';
import type { CritiqueResult, FastGateScores } from 'ts/critique';
import type { Spark } from 'ts/spark';

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

export async function critiqueSpark(spark: Spark): Promise<CritiqueResult> {
	const generated = await getProvider().generateStructured<GeneratedCritique>({
		system: CRITIQUE_SYSTEM_INSTRUCTION,
		prompt: buildCritiquePrompt(spark),
		schema: CRITIQUE_RESPONSE_SCHEMA,
		schemaName: 'critique_response',
	});

	return toCritiqueResult(generated);
}

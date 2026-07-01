import { describe, expect, it } from 'vitest';
import { BATCH_CRITIQUE_RESPONSE_SCHEMA } from './critique.schema';
import { SPARK_VARIANTS } from 'ts/spark';

describe('BATCH_CRITIQUE_RESPONSE_SCHEMA', () => {
	it('requires spark_variant on each batch critique item', () => {
		const critiques = BATCH_CRITIQUE_RESPONSE_SCHEMA.properties as {
			critiques: { items: { required: string[]; properties: Record<string, unknown> } };
		};
		const itemSchema = critiques.critiques.items;

		expect(itemSchema.required).toContain('spark_variant');
		expect(itemSchema.properties.spark_variant).toEqual({
			type: 'string',
			enum: [...SPARK_VARIANTS],
		});
	});
});

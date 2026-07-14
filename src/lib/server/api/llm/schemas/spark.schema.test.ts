import { describe, expect, it } from 'vitest';
import { SPARKS_RESPONSE_SCHEMA } from './spark.schema';
import { SPARK_VARIANTS } from 'ts/spark';

describe('SPARKS_RESPONSE_SCHEMA', () => {
	it('requires spark_variant on each generated spark', () => {
		const items = SPARKS_RESPONSE_SCHEMA.properties as {
			sparks: { items: { required: string[]; properties: Record<string, unknown> } };
		};
		const sparkSchema = items.sparks.items;

		expect(sparkSchema.required).toContain('spark_variant');
		expect(sparkSchema.properties.spark_variant).toEqual({
			type: 'string',
			enum: [...SPARK_VARIANTS],
		});
	});

	it('disallows extra properties on the response wrapper', () => {
		expect(SPARKS_RESPONSE_SCHEMA.additionalProperties).toBe(false);
	});

	it('only asks the model for fields it decides', () => {
		const wrapper = SPARKS_RESPONSE_SCHEMA.properties as {
			sparks: { items: { required: string[]; properties: Record<string, unknown> } };
		};
		const sparkSchema = wrapper.sparks.items;

		for (const field of [
			'relationship_context',
			'topic_lens',
			'setting',
			'conversation_goal',
			'vibe',
		]) {
			expect(sparkSchema.properties).not.toHaveProperty(field);
			expect(sparkSchema.required).not.toContain(field);
		}

		expect(sparkSchema.required).toEqual(
			expect.arrayContaining(['depth_level', 'controversy_level'])
		);
	});
});

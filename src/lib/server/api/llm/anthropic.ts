import Anthropic from '@anthropic-ai/sdk';
import { env } from '$env/dynamic/private';
import type { LLMProvider, GenerateStructuredParams } from './provider';

export class AnthropicAdapter implements LLMProvider {
	private client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

	async generateStructured<T>({ system, prompt, schema }: GenerateStructuredParams): Promise<T> {
		const response = await this.client.messages.create({
			model: 'claude-opus-4-8',
			max_tokens: 2048,
			system,
			messages: [{ role: 'user', content: prompt }],
			output_config: {
				format: {
					type: 'json_schema',
					schema,
				},
			},
		});

		const block = response.content.find((b) => b.type === 'text');
		if (!block || block.type !== 'text') {
			throw new Error('No text block in Anthropic response');
		}
		return JSON.parse(block.text) as T;
	}
}

import initOpenAi from 'lib/server/api/gpt/init';
import type { LLMProvider, GenerateStructuredParams } from './provider';

export class OpenAIAdapter implements LLMProvider {
	private client = initOpenAi();

	async generateStructured<T>({
		system,
		prompt,
		schema,
		schemaName,
	}: GenerateStructuredParams): Promise<T> {
		const response = await this.client.responses.create({
			model: 'gpt-5.4-mini',
			instructions: system,
			input: prompt,
			text: {
				format: {
					type: 'json_schema',
					name: schemaName,
					strict: true,
					schema,
				},
			},
		});
		return JSON.parse(response.output_text) as T;
	}
}

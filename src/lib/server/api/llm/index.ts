import { env } from '$env/dynamic/private';
import { OpenAIAdapter } from './openai';
import { AnthropicAdapter } from './anthropic';
import type { LLMProvider } from './provider';

// Select provider at runtime via LLM_PROVIDER env var (default: 'openai').
// Valid values: 'openai' | 'anthropic'
export function getProvider(): LLMProvider {
	if (env.LLM_PROVIDER === 'anthropic') {
		return new AnthropicAdapter();
	}
	return new OpenAIAdapter();
}

export type { LLMProvider, GenerateStructuredParams } from './provider';

export interface GenerateStructuredParams {
	system: string;
	prompt: string;
	schema: Record<string, unknown>;
	schemaName: string;
}

export interface LLMProvider {
	generateStructured<T>(params: GenerateStructuredParams): Promise<T>;
}

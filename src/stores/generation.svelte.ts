import { DEFAULT_GENERATION_PARAMS } from 'lib/data/generation-options';
import type { GenerationParams } from 'ts/params';

// Current lever selections for the generation surface. Session-only (not persisted) —
// mutate directly from components, e.g. `generationParams.vibe = 'warm'`.
export const generationParams = $state<GenerationParams>({
	...DEFAULT_GENERATION_PARAMS,
	depth_and_safety: { ...DEFAULT_GENERATION_PARAMS.depth_and_safety! },
	sensitive_topics: [...(DEFAULT_GENERATION_PARAMS.sensitive_topics ?? [])],
});

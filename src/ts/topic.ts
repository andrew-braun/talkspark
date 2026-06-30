import type { RelationshipContext, Setting, Vibe } from './spark';

// Types only — topic generation is deferred to the Topics-pillar slice.
// Shape mirrors docs/features/topics.md and the shared serving fields in spark-taxonomy.md.
export interface Topic {
	id: string;
	topic: string;

	// Content fields (the mini prep-brief)
	why_it_lands?: string;
	angles?: string[];
	opener_sparks?: string[]; // spark ids (links to Asking pillar)
	follow_up_ideas?: string[];
	facts_or_links?: string[];
	things_to_avoid?: string[];

	// Shared serving metadata with Spark (subset relevant to topics)
	relationship_context?: RelationshipContext;
	setting?: Setting;
	vibe?: Vibe;
	depth_level?: number; // 1–5
	humor_level?: number; // 0–5
	controversy_level?: number; // 0–5

	created_at?: number;
	updated_at?: number;

	metadata?: Record<string, unknown>;
}

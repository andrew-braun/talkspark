import type { CritiqueResult } from './critique';
import type { ConversationSkill } from './spark';

// Generated on demand relative to a parent spark or topic.
// Judged on "does this deepen without interrogating," not on standing alone.
export interface Followup {
	id: string;
	parent_id: string; // spark id or topic id
	content: string;
	depth_delta?: number; // how much deeper than parent (e.g. +1)
	position?: number; // order in a ladder
	skill?: ConversationSkill;
	critique?: CritiqueResult;
	created_at: number;
	metadata?: Record<string, unknown>;
}

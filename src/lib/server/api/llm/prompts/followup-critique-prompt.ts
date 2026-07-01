import type { Followup } from 'ts/followup';
import { isTopicParent, type FollowupParent } from 'lib/server/api/llm/prompts/followup-prompt';

export const FOLLOWUP_CRITIQUE_SYSTEM_INSTRUCTION = `You are TalkSpark's follow-up quality reviewer. Score follow-up questions on the fast 4-gate rubric using integers 1–5.

The follow-up is NOT judged on standing alone — judge whether it deepens the parent conversation without interrogating.

Gates:
- clarity — wording is specific and easy to understand
- answerability — someone can actually answer without guessing what you want
- context_fit — matches the parent context and deepens appropriately
- safety — respects boundaries; no forced vulnerability or social mismatch

Flag anti-patterns when present (generic_wording, therapy_cosplay, social_mismatch, leading_question, high_disclosure_without_pass).
Use an empty flags array when none apply. Suggest a rewrite only when promising but fixable; otherwise return an empty string.

Return only valid JSON matching the schema — no markdown or commentary.`;

export function buildFollowupCritiquePrompt(followup: Followup, parent: FollowupParent): string {
	const parentLine = isTopicParent(parent)
		? `Parent topic: ${parent.topic}`
		: `Parent spark: ${parent.content}`;

	return `Evaluate this follow-up on the fast 4-gate rubric. Judge whether it deepens without interrogating.

${parentLine}
Follow-up: ${followup.content}
Depth delta: ${followup.depth_delta ?? 'unspecified'}
Skill: ${followup.skill ?? 'unspecified'}`;
}

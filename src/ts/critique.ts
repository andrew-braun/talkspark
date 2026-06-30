// Fast 4-gate scores — minimum approval bar per spark-taxonomy.md.
// All gates must be ≥ 4 for a spark to pass into rotation.
export interface FastGateScores {
	clarity: number; // 1–5
	answerability: number; // 1–5
	context_fit: number; // 1–5
	safety: number; // 1–5
}

export interface CritiqueResult {
	scores: FastGateScores;
	passed: boolean; // true when all four gates are ≥ 4
	flags: string[]; // anti-pattern labels from spark-taxonomy.md
	suggested_rewrite?: string; // only when spark is promising but fixable
}

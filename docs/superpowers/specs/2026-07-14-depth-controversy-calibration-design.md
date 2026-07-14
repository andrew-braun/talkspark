# Depth and Controversy Calibration Design

## Goal

Make explicit high depth and controversy selections produce materially bolder sparks. A
selected level is the requested intensity, not merely an upper safety limit. Preserve the
accessible lower levels and the existing protections against social mismatch, coercive
disclosure, therapy framing, harassment, and dehumanizing content.

## Scope

Keep the current controls, numeric ranges, generation parameters, structured-output
schema, enrichment, and persistence unchanged. This is a prompt-semantics adjustment,
with matching regression tests and generation documentation.

## Calibration

Depth levels 1–3 retain their current progression. Level 4 should invite meaningful
personal material such as convictions, unresolved tensions, consequential experiences,
or vulnerable tradeoffs. Level 5 should reach emotionally exposing territory such as
identity, regret, fear, meaning, belonging, or deeply held values. Levels 4–5 must remain
appropriate to the selected relationship and include an easy way to decline; they must
not imitate therapy or demand disclosure.

Controversy levels 0–3 retain their current progression. Level 4 should invite clearly
polarizing moral, cultural, social, political, or relationship questions with personal
stakes and multiple defensible positions. Level 5 should permit genuinely divisive or
taboo territory that challenges assumptions and can produce substantial disagreement.
It must not invite attacks on a participant, target protected groups, dehumanize people,
or manufacture interpersonal conflict.

The prompt will explicitly state that a concrete depth or controversy selection is a
target to use fully. It will distinguish generating at the requested intensity from
classifying the generated result: classifications should be accurate rather than
conservatively understated. Default remains automatic and broadly accessible, so this
change does not make untouched controls riskier.

The generation prompt version advances from `v2` to `v3` so resulting sparks remain
auditable by prompt behavior.

## Testing and validation

Prompt tests will verify that high-level guidance contains the stronger substantive
territory, concrete selections are described as targets, automatic selections remain
low-risk, and accurate classification replaces conservative classification language.
Run the prompt test first, then the full unit suite, Svelte checks, and a production build
with a dummy server-side API key. A live OpenAI generation is optional and must not be
claimed unless executed with a real key.

## Out of scope

- Adding another boldness lever
- Changing the number or labels of depth and controversy levels
- Embedding example spark questions that could make generations repetitive
- Relaxing general safety or relationship-fit rules

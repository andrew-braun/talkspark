# Topic Lens Generation Design

## Summary

Replace the generation surface's `setting` lever with a `topic_lens` lever. A topic lens
selects a broad source of conversational material without requiring a finite catalog of
physical situations. At the same time, revise generation and critique instructions so
all selected levers shape the substance and suitability of a spark instead of appearing
as literal words in its content.

## User-facing controls

Rename **People & setting** to **People & topic**. Keep relationship context as the first
sub-choice and replace the **Where** sub-choice with **Topic**.

The topic lens options are:

| Value                       | Label                       | Intended territory                                                 |
| --------------------------- | --------------------------- | ------------------------------------------------------------------ |
| `everyday_life`             | Everyday life               | Routines, observations, small moments, and current experiences     |
| `stories_memories`          | Stories & memories          | Specific past moments and details that invite storytelling         |
| `interests_culture`         | Interests & culture         | Hobbies, media, food, art, learning, and recommendations           |
| `hopes_plans`               | Hopes & plans               | Near- or long-term possibilities without assuming fixed milestones |
| `ideas_perspectives`        | Ideas & perspectives        | Beliefs, interpretations, tradeoffs, and perspective-getting       |
| `imagination_hypotheticals` | Imagination & hypotheticals | Playful scenarios, invention, prediction, and counterfactuals      |

The zero-configuration default is `everyday_life`. It is broad, low-pressure, and works
across relationship types, goals, vibes, and depth levels.

## Lever responsibilities

The generation prompt will define a distinct job for every lever:

- **Relationship** controls assumed familiarity, socially appropriate disclosure, shared
  context, and wording. It is not a keyword to include.
- **Topic lens** controls the source territory from which the question is drawn. The spark
  should embody that territory naturally rather than naming the lens.
- **Conversation goal** controls the response and conversational trajectory the question
  is designed to produce. It is not wording to repeat.
- **Vibe** controls tone, rhythm, and framing. It should not become the subject of the
  question.
- **Depth** controls vulnerability and reflection required to answer. All five levels will
  receive semantic guidance rather than only defining the endpoints.
- **Controversy** controls disagreement and sensitivity risk. All six levels will receive
  semantic guidance rather than only defining the endpoints.

The prompt will explicitly state that merely mentioning or paraphrasing a lever label
does not demonstrate fit. References such as "as coworkers," "to reconnect," or "for a
playful question" should appear only when independently necessary to understand the
question.

## Generation and schema changes

Add a `TopicLens` union and `TOPIC_LENSES` constant to the spark taxonomy. Replace
`setting` with `topic_lens` in generation parameters, defaults, option data, remote-input
validation, resolved parameters, enriched spark metadata, and current spark fields.

Selected input levers remain authoritative on the server. Remove duplicated selected
lever fields from the model's generated JSON object because enrichment already overwrites
them. The model output should contain only fields it actually decides, including content,
variant, conversation motive, humor, answer shape, reciprocity, follow-up potential,
conversation skill, and seed follow-up. This reduces prompt distraction and prevents a
model classification from conflicting with the user's selections.

Increment the spark generation prompt version from `v1` to `v2`.

## Critique and follow-ups

Critique context fit will evaluate whether content is substantively suitable for the
relationship, topic lens, goal, vibe, depth, and controversy selections. Literal label
insertion without substantive adaptation counts against context fit and may be flagged as
generic wording.

Follow-up prompts will carry the parent's topic lens, relationship, depth, and controversy
boundaries forward. They will apply the same anti-echo rule so a follow-up deepens the
parent instead of restating its classification.

## Existing saved data

Previously generated sparks may remain in browser `localStorage` with an optional
`setting` field. Keep `setting` as a deprecated optional compatibility field on `Spark`
and `Topic`; do not display or generate it for new content. New sparks use `topic_lens`.
Follow-up generation may accept old parents without a topic lens and treat the missing
lens as unspecified.

No destructive localStorage migration is required.

## Testing and validation

Use test-first changes for prompt, schema, enrichment, and parameter resolution behavior.
Tests will verify:

- Human-readable topic-lens labels reach generation prompts.
- Prompts assign each lever its behavioral responsibility and prohibit label echoing.
- Resolved defaults and overrides use `topic_lens`, not `setting`.
- Enrichment copies authoritative selected levers and retains model-decided fields.
- Generated JSON no longer asks the model to reclassify selected input levers.
- Critique and follow-up prompts use topic lens and the anti-echo rule.
- Legacy sparks without `topic_lens` remain valid follow-up parents.

Run the focused Vitest files first, followed by `pnpm test`, `pnpm check`, and
`OPENAI_API_KEY=dummy pnpm build`. A real-provider generation check is optional and must
be reported separately because local structural tests cannot prove model response quality.

## Out of scope

- Migrating or deleting browser-local saved sparks
- Adding advanced/free-text controls
- Changing the fixed primary, contrast, and playful-weird three-spark structure
- Redesigning critique scoring or hiding failed sparks
- Adding a new state-management or API layer

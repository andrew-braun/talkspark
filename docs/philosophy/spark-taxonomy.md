# Spark Taxonomy, Rubric & Patterns

> **Single source of truth** for the spark/topic/follow-up data shapes, the quality
> rubric, anti-patterns, prompt patterns, and the status workflow. Other docs reference
> this file rather than restating it. If a definition lives here, do not duplicate it
> elsewhere.

## Object Model Overview

Three generated object types, one engine:

- **Spark** — a single question / conversational move (the "Asking" pillar).
- **Topic** — a territory to explore (the "Topics" pillar). See
  [../features/topics.md](../features/topics.md) for the full shape.
- **Follow-up** — a question generated _relative to a parent_ spark or topic. Judged on
  "does this deepen without interrogating," not on standing alone.

### Schema posture

We are going **column-first** when the database lands: every settled, queryable field is
its own typed column, plus **one `metadata jsonb` escape-hatch column** for experimental
or rarely-queried generation output. The only real tradeoff of column-first is migration
friction while the taxonomy is still moving — mitigated because nullable column adds are
instant in Postgres and the `metadata` bag absorbs novel fields without a migration.

Until the DB exists (see [generation-engine.md](../features/generation-engine.md)), this
is a **flat typed TypeScript interface**: every field explicit, plus
`metadata: Record<string, unknown>`. That maps 1:1 to "all columns + one jsonb column"
later, so the eventual migration is mechanical.

**Rule of thumb for column vs. metadata:** a field earns a top-level column only if we
**filter or sort by it when serving**, or we want the shape **enforced**. Everything else
starts in `metadata`.

## Spark Fields

Serving / queryable (top-level columns later; explicit TS fields now):

| Field                               | Meaning                              | Example values                                                                                                 |
| ----------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `id`                                | UUID                                 |                                                                                                                |
| `content`                           | the spark text                       |                                                                                                                |
| `relationship_context`              | prevents social mismatch             | first_date, partner, family, close_friend, coworker, team, stranger                                            |
| `topic_lens`                        | guides the spark's subject territory | everyday_life, stories_memories, interests_culture, hopes_plans, ideas_perspectives, imagination_hypotheticals |
| `conversation_goal`                 | the job of the spark                 | break_ice, reconnect, laugh, reflect, repair, debate, brainstorm                                               |
| `conversation_motive`               | informational vs. relational         | learn, affiliate, coordinate, persuade, play, support                                                          |
| `vibe` / `emotional_tone`           | how it should land                   | playful, warm, thoughtful, weird, romantic, nostalgic                                                          |
| `depth_level`                       | pacing and consent                   | 1 (small talk) to 5 (vulnerable)                                                                               |
| `controversy_level`                 | prevents surprise conflict           | 0 to 5                                                                                                         |
| `humor_level`                       | nods to levity (see note)            | 0 to 5                                                                                                         |
| `group_size_min` / `group_size_max` | group prompts differ from dyads      | 1, 2, 3, 8                                                                                                     |
| `group_safety_level`                | surprise-intensity guard for groups  | 1 to 5                                                                                                         |
| `answer_shape`                      | helps users answer concretely        | story, memory, ranking, tradeoff, recommendation, prediction                                                   |
| `reciprocity_mode`                  | supports mutuality                   | one_person, everyone_answers, answer_then_ask, pass_the_question                                               |
| `vulnerability_ramp`                | escalation behavior                  | steady, escalating, capped, random_within_bounds                                                               |
| `follow_up_potential`               | can it continue                      | 1 to 5                                                                                                         |
| `conversation_skill`                | connects spark to learning           | follow_up, listen, callback, perspective_get, common_ground, repair                                            |
| `source_type`                       | provenance                           | ai_generated, human_written, imported, user_submitted, remixed                                                 |
| `status`                            | lifecycle (see workflow)             | draft … featured … retired                                                                                     |
| `visibility`                        | public, private, unlisted            |                                                                                                                |
| `quality_score`                     | rollup of review scores              | numeric                                                                                                        |
| `created_at` / `updated_at`         | timestamps                           |                                                                                                                |

Descriptive / rarely-queried (live in `metadata` until a query needs them):
`energy_level`, `safety_boundaries`, `evidence_principles`, `review_scores`,
`generation_prompt_version`, `language`, `locale`, `estimated_minutes`, generation params.

> **Input-only Default.** `default` is a generation-surface selection, not a settled spark
> taxonomy value. It requests automatic broad-neutral behavior based on the other active
> constraints, so generated objects omit Default categorical fields. The legacy `setting`
> field remains only on existing local Spark and Topic objects until a storage migration is
> warranted.

> **Note on `humor_level` / levity.** Humor is the hardest dimension to capture — it is
> deeply subjective and situational. We model it as a dimension that _nods to its
> importance_ (and as a vibe value) without claiming to have "solved" funny. Do not let
> the generator chase jokes at the expense of clarity or context fit.

## Follow-up Fields

- `id`, `parent_id` (spark or topic), `content`
- `depth_delta` — how much deeper than the parent (e.g. +1)
- `position` — order in a ladder
- `skill` — follow_up, listen, callback, perspective_get, common_ground, repair
- generated on demand; **keep-able**, which seeds the follow-up library

## Quality Rubric

Score each dimension 1–5 during AI critique and human review.

| Dimension           | High score means                              | Low score means                                   |
| ------------------- | --------------------------------------------- | ------------------------------------------------- |
| Clarity             | Understandable in one read                    | Confusing or over-composed                        |
| Answerability       | Ordinary people can answer                    | Requires rare knowledge or too much introspection |
| Specificity         | Gives a concrete path in                      | Too broad or generic                              |
| Openness            | Invites elaboration                           | Answerable with yes/no only                       |
| Story Potential     | Naturally elicits a moment or example         | Stays abstract                                    |
| Follow-Up Potential | Suggests obvious next questions               | Dead-ends after first answer                      |
| Reciprocity         | Works shared back and forth                   | Feels like interrogation                          |
| Context Fit         | Matches active relationship/topic constraints | Socially mismatched                               |
| Depth Fit           | Matches selected vulnerability level          | Too intense or too shallow                        |
| Safety              | Avoids surprise harm or pressure              | Pushy, loaded, or unsafe                          |
| Novelty             | Fresh but not weird for its own sake          | Cliché or AI mush                                 |
| Warmth              | Feels inviting                                | Feels clinical, smug, or performative             |

### Two-tier review

A 12-dimension human pass on every spark does not scale for a solo project. Use:

- **Fast gate (approval):** clarity, answerability, context fit, safety — all must score
  ≥ 4. This is the bar for entering rotation and is cheap enough to do by hand or via LLM
  critique.
- **Full scoring (featured):** the complete 12-dimension rubric, reserved for `featured`
  candidates and for AI critique that feeds analytics.

### Minimum approval rules

- Public-rotation sparks score ≥ 4 on clarity, answerability, context fit, and safety.
- Deep sparks require explicit depth tagging and a stronger safety review.
- Group sparks require group-size and pass-friendly review.
- Debate sparks require controversy and receptiveness review.
- High-controversy and high-depth sparks cannot skip human review.

## Anti-Patterns (reject or rewrite)

- **Generic AI mush** — polished but could belong in any app.
- **Disguised opinion poll** — asks a stance with no story, detail, or follow-up.
- **Therapy cosplay** — asks users to process trauma or diagnose relationships.
- **Conflict bait** — heat without structure or consent.
- **Boomerask setup** — makes the asker look clever more than curious.
- **Social mismatch** — too intimate for weak ties, too silly for serious prep.
- **False universality** — assumes romance, family closeness, religion, work status, or
  cultural background.
- **Forced positivity** — makes users reframe pain before they are ready.
- **Leading question** — implies the correct answer.
- **High disclosure without a pass** — asks for vulnerability without consent.

## Prompt Patterns to Prefer

Original pattern families, not fixed copy.

- **Story Seed** — `What is a small moment when [topic] felt unexpectedly [tone]?`
  Concrete, answerable, follow-up friendly.
- **Tiny Detail** — `What is one tiny thing you notice or appreciate that most people miss?`
  Low vulnerability, high specificity; good for mixed groups.
- **Choice With Reason** — `Would you rather [A] or [B], and what does your choice say about
your week?` Easy entry, optional depth.
- **Follow-Up Ladder** — `What happened?` → `What detail do you still remember?` →
  `Why did that part stick with you?` Gradual deepening without interrogation.
- **Perspective-Get** — `What is something about [experience] that people often
misunderstand?` Asks directly rather than guessing.
- **Active Constructive Response** — `What was the best part of that for you?` Invites
  savoring after good news.
- **Receptive Disagreement** — `What is one part of the other side that you understand, even
if you do not agree?` Acknowledgment before argument.

## Status Workflow

Lock this before the first migration. The schema must support explicit transitions with
history, not a loose mutable status field.

| Status           | Meaning                                       | Allowed next                                    |
| ---------------- | --------------------------------------------- | ----------------------------------------------- |
| `draft`          | Not ready for review                          | `candidate`, `rejected`                         |
| `candidate`      | Ready for review and scoring                  | `approved`, `needs_revision`, `rejected`        |
| `needs_revision` | Promising but needs rewrite/retag/safety edit | `candidate`, `rejected`                         |
| `approved`       | Can appear in public rotation                 | `featured`, `retired`, `needs_revision`         |
| `featured`       | High-performing or editorially selected       | `approved`, `retired`                           |
| `retired`        | Removed from rotation (stale, dupe, risky)    | `approved` (admin restore only)                 |
| `rejected`       | Not suitable for reuse                        | terminal (admin can duplicate into new `draft`) |

Transition rules:

- Every status change writes a status-event row (from, to, by, reason, optional review id).
- `approved` requires review scores and explicit depth, safety, relationship, and
  group-fit metadata.
- `featured` requires strong feedback signals or an editorial decision.
- `retired` requires a reason: stale, duplicate, low quality, safety, report, or strategy
  shift.

## Evidence Links

Each spark may carry `evidence_principles` (a JSON array of slugs) linking it to the
research principle it embodies — e.g. `question_asking`, `reciprocal_disclosure`,
`active_constructive`, `receptiveness`. Keep this as a JSON array; do not over-normalize
until the review system needs analytics. See
[../research/conversation-research.md](../research/conversation-research.md).

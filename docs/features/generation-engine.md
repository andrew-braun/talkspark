# Generation Engine

> The core primitive of TalkSpark. Sparks, topics, and follow-ups are all produced here.
> See [../philosophy/product-philosophy.md](../philosophy/product-philosophy.md) for the
> generate-first stance and [../philosophy/spark-taxonomy.md](../philosophy/spark-taxonomy.md)
> for the object shapes and rubric.

## Why This Is First

We are building **generate-first**: an excellent generator is the content factory, and the
human is the curator. This dissolves the cold-start problem — we don't hand-write or scrape
a seed library, we generate deliberately and keep the best. The first build slice is
therefore _the generation engine plus a way to measure its quality_, with no database.

The non-negotiable companion to "generate-first": **you cannot maximize generation quality
without measuring it.** So the engine ships with evaluation built in, not bolted on later.

## What The Engine Produces

One primitive, three output shapes (see taxonomy for fields):

- **Spark** — a single question / conversational move.
- **Topic** — a territory to explore (see [topics.md](./topics.md)).
- **Follow-up** — a question generated relative to a parent spark or topic.

All three carry full metadata as a flat typed object (`metadata` bag for the long tail),
so the eventual DB migration is mechanical.

## Generation Surface

- **One-button default.** A user can hit the button and get a great spark with zero
  configuration. This is the primary entry point and the core of onboarding — the app
  should be obvious enough to need no tour (offer an optional one). The baseline is
  deliberately opinionated, not neutral: it ships **Anyone / Anything / Just talk /
  Thoughtful** on the categorical levers, at **Real** depth and **Spicy** controversy
  with **every sensitive topic in-bounds** (opt-out, not opt-in). Sensitive territory only
  activates once controversy is Spicy or higher; below that the model keeps things low-key
  regardless. See `src/lib/data/generation-options.ts` (`DEFAULT_GENERATION_PARAMS`) and the
  prompt (`buildSparkPrompt`, gating + sensitive/non-sensitive split).
- **Four levers** (visible, compact): People & topic, Conversation goal, Vibe,
  Depth & safety. Powerful enough to shape results, simple enough to grasp at a glance.
  **Depth & safety is a marquee control**, not a buried setting — it's our clearest differentiator
  against unguarded generators (see
  [../strategy/competitive-analysis.md](../strategy/competitive-analysis.md)), so it stays visible
  and demonstrable.
- **Concrete defaults, no vague "automatic".** Every lever carries a real, nameable default
  — the categorical levers' neutral choice is **Anyone / Anything / Just talk** (Thoughtful for
  vibe), which reads as broad/unconstrained to the generator but is a genuine value, not a hidden
  sentinel. The summary sentence always names the six single-value levers (muted until moved off
  default); only sensitive topics stay implicit at the full default set. Selected labels shape the
  spark's substance and suitability; the generated text should not echo those labels literally.
- **`More options`** reveals advanced levers behind progressive disclosure. Deferred from
  slice 1.
- **Natural-language box** (later): turn free text into structured parameters.

## On-Demand Follow-Ups

Any generated spark or topic exposes a **"follow-ups"** action: tapping it calls the engine
with the parent as context and returns deeper questions that build on it.

- Input = parent spark/topic (+ relationship/depth context). Same engine, new input.
- A follow-up's generation prompt and critique rubric differ slightly — it is judged on
  "does this deepen without interrogating," not on standing alone.
- Generated follow-ups are **keep-able**, which seeds the follow-up library exactly like
  kept sparks seed the spark library.
- This operationalizes the strongest research finding (the _second_ question is where
  connection comes from) as a literal product action.
- **Follow-ups are step one toward sequencing — our strategic moat.** The competitive pass
  ([../strategy/competitive-analysis.md](../strategy/competitive-analysis.md)) found that the
  warm-up → depth → reflection _arc_ is the single thing no incumbent does. On-demand follow-ups
  are the first, simplest expression of that arc; the full sequencer builds on this primitive
  rather than replacing it.

## Keep / Discard

Every generated spark, topic, and follow-up can be **kept or discarded**. Keeping is the
single most important interaction in slice 1 because it does double duty:

1. Builds the user's growing seed set (exported as JSON → future DB seed).
2. Records a training signal for what "good" means (future review pipeline + eval set).

Kept items accumulate in localStorage and export to JSON.

## Evaluation (built in from day one)

We must be able to tell whether a prompt change _actually_ improved quality, not eyeball
it. Two mechanisms:

- **LLM critique pass.** Each generated item is scored against the rubric (the fast 4-gate
  at minimum: clarity, answerability, context fit, safety). This is both a quality signal
  and the embryo of the review pipeline.
- **Eval harness.** A fixed set of test parameter combos (a "golden set" of contexts) plus
  their critique scores, so a prompt edit can be measured: did average scores go up, did
  any gate regress?

Human thumbs (keep/discard) and LLM critique together form the quality dataset.

## Prompt Shapes

Generation should stop asking for generic conversation starters and ask for **spark
objects with intent and constraints**.

```text
Create original conversation sparks for the specified context.
Each spark must have a clear conversation goal, depth level, answer shape, and follow-up path.
Prefer concrete story, memory, choice, or perspective-get prompts over abstract opinion polls.
Avoid therapy-like prompts, surprise vulnerability, conflict bait, boomerasking setups,
and assumptions about identity or family structure.
Respect the selected safety boundaries.
Return strict JSON matching the schema.
```

```text # critique
Evaluate whether this spark is clear, answerable, context-fit, safe, reciprocal,
story-friendly, and follow-up friendly.
Flag any risk of social mismatch, over-disclosure, controversy, therapy framing,
boomerasking, or generic wording.
Suggest a rewrite only if the spark is promising.
```

```text # classification
Treat categorical generation inputs as authoritative constraints; do not reclassify
relationship context, topic lens, conversation goal, or vibe. Concrete numeric depth and
controversy selections are target intensities, not ceilings; use them fully while preserving
relationship fit and safety boundaries. Classify only the fields the model decides: spark
variant, motive, depth, controversy, humor, answer shape, reciprocity mode, follow-up
potential, conversation skill, and seed follow-up. Classify depth and controversy accurately
from the generated content rather than softening the content to earn conservative labels.
```

## Server Boundaries

- Generation, critique, and classification stay **server-only** (SvelteKit remote
  functions). The OpenAI key never reaches the client.
- Use the latest, most capable models for generation/critique quality; this is the product.

## Slice 1 Checklist

1. Define the spark / topic / follow-up objects as flat typed TS interfaces (+ `metadata`).
2. Four levers + one-button default on the generation surface.
3. Rewrite the generation prompt to produce full spark objects with follow-up paths.
4. Add the LLM-critique pass (fast 4-gate scoring) to every generated item.
5. Add keep/discard; kept items accumulate in localStorage and export to JSON.
6. Add the "follow-ups" on-demand action on sparks (and topics).
7. Build the eval harness: golden-set contexts + critique scores to compare prompt versions.

**No Supabase, no auth, no review queue in slice 1.** The JSON export is the bridge to the
database whenever we add it.

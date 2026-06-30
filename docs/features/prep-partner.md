# Conversation Prep Partner

> Makes TalkSpark useful *before* a conversation starts. Built on the Topics pillar
> ([topics.md](./topics.md)) and the generation engine. A later-phase feature, not part of
> slice 1.

## Product Goal

A user should be able to say *"I have a first date tonight,"* *"I'm going to a networking
dinner,"* or *"I'm seeing my cousins for the first time in years,"* and get a compact prep
brief: topics, sparks, follow-ups, things to avoid, and optional material to skim.

Recipes are reusable packs; **prep is a generated or assembled plan for one upcoming
moment.** `first date that is not cringe` is a recipe; `first date tonight with someone who
loves architecture and live music` is a personal prep session.

## The Conversation Brief

The user enters: event type, who'll be there, relationship context, desired vibe, depth
ceiling, topics to include/avoid, time to prepare, and whether they want articles,
podcasts, videos, books, or quick facts.

TalkSpark returns:

1. **The vibe** — a short read on what kind of conversation to aim for.
2. **Three opening sparks** — safe, warm, context-fit.
3. **Topic bank** — 5–10 flexible, story-friendly subjects (these are Topic objects).
4. **Follow-up ladders** — paths that deepen without interrogating.
5. **Callback hooks** — details to remember and bring back later.
6. **Things to avoid** — optional guardrails from the user's boundaries.
7. **Prep materials** — short curated articles, videos, podcasts, or explainers.
8. **Pocket mode** — a condensed view to check right before walking in.

## Prep Modes

- **Quick Prep** — 60-second pocket brief: three topics, one fallback spark.
- **Deep Prep** — richer plan with material links and follow-up ladders.
- **Date Prep** — playful, warm, depth-limited, consent-aware escalation.
- **Event Prep** — topics and questions for mixed groups or networking.
- **Family Prep** — warm, memory-oriented, low-conflict, boundary controls.
- **Hard Conversation Prep** — structure for clarifying goals, gentle openers, repair
  language. Carries the hard-conversation guardrails from
  [../philosophy/product-philosophy.md](../philosophy/product-philosophy.md): no
  abuse/self-harm/crisis content; surface real resources instead of coaching when triggers
  appear.
- **Curiosity Prep** — a few things to learn before meeting someone with a known interest.

## Prep Materials

Curated and summarized, not a giant reading list. Useful types: short explainers,
non-inflammatory news context, hobby/film/food/travel primers, relationship-specific
question sets, science-backed tips, and opt-in user notes.

Store source metadata; never copy copyrighted material. For protected sources, store a
citation, link, short original summary, and a "read the source directly" note.

## Data Model (when the DB lands)

- `prep_sessions` — user, title, occasion, event_at, relationship_context, goals,
  boundaries, parameters, brief (JSON), timestamps.
- `prep_materials` — title, url, source_name, material_type (article/video/podcast/book/
  research/internal_note), summary, reading_minutes, tags, trust_level (curated/user_added/
  ai_suggested).
- `prep_session_items` — prep_session_id, item_type (spark/topic/follow_up/material/avoid/
  note), spark_id?, material_id?, content, position.

## Privacy

Store prep history only for signed-in users, only with consent. Never store raw
conversation transcripts by default. User notes are opt-in, private, and deletable.

## Why This Could Be Special

Most conversation apps start when people are already stuck. Prep helps *before* that
moment — users feel calmer, more curious, and less performative because they're not
memorizing lines, just bringing a few live possibilities into the room.

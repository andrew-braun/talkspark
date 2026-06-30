# TalkSpark Product Philosophy

> Source of truth for *what TalkSpark is and why*. For the spark/topic data shapes,
> quality rubric, and anti-patterns, see [spark-taxonomy.md](./spark-taxonomy.md).
> For the evidence base, see [../research/conversation-research.md](../research/conversation-research.md).

## Product Promise

TalkSpark helps people **start, shape, and deepen conversations** with context-fit
sparks and lightweight conversation skills — then gets out of the way so they can go
have the conversation.

## Short Version

TalkSpark is not a question generator. It is a **conversation design system**.

The app helps people choose a context, set a depth ceiling, receive a well-crafted
conversational move, and pick up a few lightweight ideas for responding well. AI helps
generate, classify, adapt, and fill gaps, but the product earns trust through curation,
feedback, and explicit conversation principles.

**TalkSpark is for the kickoff, not the full game.** Outside explicit game modes, it
should never become a live conversation coach, second-screen prompter, transcript
analyzer, or step-by-step guide for a conversation already happening.

## The Two Pillars: Asking and Topics

TalkSpark generates two complementary things from one engine:

- **Asking** — individual **sparks** (questions / conversational moves). Atomic: one
  prompt, answered, then you move on. The job is to break the ice or deepen a moment.
- **Topics** — **territories** to explore. A topic is a bundle (an angle, a fact or two,
  opener questions, follow-up ideas, things to avoid) that gives someone *something to
  talk about* and the confidence to sustain it. The job is preparation and momentum.

Both are produced by the same generation engine and judged by the same review
discipline; only their output shape and critique emphasis differ. Both support an
on-demand **"follow-ups"** action that generates deeper questions relative to the spark
or topic in front of you — operationalizing the research finding that the *second*
question is where connection comes from.

See [topics.md](../features/topics.md) and
[generation-engine.md](../features/generation-engine.md).

## What Makes Us Different

The June 2026 competitive pass (see
[../strategy/competitive-analysis.md](../strategy/competitive-analysis.md)) found a real, empty
quadrant: **generated + sequenced + multi-context + research-backed**. No operating product
combines all four. AI tools generate but don't sequence or ground in research; the credibly
research-backed couples apps don't generate and are locked to romantic dyads; decks are fixed and
single-context. Three commitments follow from owning that corner, and they shape principles 2–4:

1. **Sequencing is the moat, not a nicety.** The warm-up → depth → reflection *arc* — beginning
   with on-demand follow-ups — is the single thing no incumbent does. It is a core differentiator,
   not a late-stage extra.
2. **The depth/safety dial is a marquee, demonstrable feature.** Only one competitor (YourMove,
   dating-only) has anything comparable. It directly fixes the failure of the free substitute
   (ChatGPT generating something tone-deaf for the moment), so we surface it prominently rather
   than burying it in settings.
3. **Multi-context is shipped, not implied.** Dating, family, work, and friends are distinct,
   visibly-labeled flows from launch — the one thing decks (one box per context) and single-dyad
   apps structurally can't match.

## Generate-First Stance

The earlier plan was "curate before generate," which assumed the hard part was *having* a
library. We've inverted this: the hard part is **generation quality**, and once that is
high, the generator becomes the content factory and the human becomes the curator.

This dissolves the cold-start problem. We do not hand-write or scrape a seed library; we
build an excellent generator, generate deliberately, and keep the best. Every kept spark
is both a library entry and a training signal for what "good" means.

Important boundary that survives the inversion: **generate-first is not
generate-on-every-click-forever.** The product still ends up serving *vetted* sparks. What
changed is that the vetting *input* is now our own generator's output rather than
hand-written or imported material. A lightweight keep/discard judgment is present from the
very first build so the quality dataset accumulates from day one.

## Product Principles

1. **Quality through curation.** A spark earns public rotation by being kept and reviewed,
   not by being freshly generated.
2. **Make depth adjustable — and show it.** Users move from silly to sincere without being
   surprised by intensity. The depth/safety dial is a primary, demonstrable control, not a buried
   setting; it is a key differentiator against unguarded generators.
3. **Design for context — across many contexts.** A first date, family dinner, team offsite, and
   late-night hangout need different sparks; no spark is universally appropriate. These contexts
   ship as distinct, visible flows, not a single generic mode.
4. **Start simple, reveal depth.** Default to one-button generation and four powerful
   levers; advanced controls live behind `More options`.
5. **Work before login.** Basic generation, browsing, and local saving work anonymously.
   Accounts add sync, history, ratings, games, and personalization.
6. **Prepare without scripting.** Give people flexible topics, context, and confidence
   without making them sound rehearsed.
7. **Kick off, then get out of the way.** Offer a spark, a few useful follow-up ideas, and
   then let people go talk — no live guidance.
8. **Teach through use.** Quietly model better conversation skills through prompt design,
   follow-ups, prep, reflection, and game mechanics.
9. **Respect consent and privacy.** Conversation gets personal. Users control depth,
   storage, sharing, and identity. Never store raw transcripts by default.
10. **Use AI as an editor and synthesizer.** AI drafts, classifies, adapts, and
    summarizes; the library earns trust through review and feedback.

## Interaction Boundary

| Phase | What TalkSpark does |
| ----- | ------------------- |
| **Before** | Choose context; get sparks, topics, prep briefs, topic banks, lightweight tips, pocket-mode reminders. |
| **At kickoff** | Show the prompt and maybe one or two follow-up ideas. |
| **During games** | Actively facilitate — the app is part of the game container. |
| **After** | Offer optional reflection, saving, rating, learning. |

**Disallowed core shape:** real-time guidance while users are actively having a non-game
conversation. No live next-line suggestions, real-time coaching, transcript analysis, or
step-by-step steering. Anything that requires users to keep checking the app *while
talking* is out of bounds outside game modes.

## What TalkSpark Is Not

- Not therapy.
- Not mediation.
- Not a crisis tool.
- Not a manipulation tool.
- Not a proprietary card-deck clone.
- Not an infinite novelty generator.
- Not a replacement for the user's judgment about safety, intimacy, and context.

### Hard Conversation Boundary

"Hard conversation prep" (clarifying goals, gentle openers, repair language) is allowed,
but it sits closest to the therapy/mediation line we disclaim. Concrete guardrails:

- No prompts referencing abuse, self-harm, or crisis situations.
- When a user's described situation crosses crisis triggers, surface a "this isn't
  therapy — here are real resources" affordance instead of generating coaching content.
- The `Repair Practice` game mode is for trusted, low-stakes contexts only and carries the
  same framing.

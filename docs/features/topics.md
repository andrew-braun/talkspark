# Topics (the second pillar)

> Topics are the counterpart to Asking. One engine
> ([generation-engine.md](./generation-engine.md)), two output shapes. This doc develops
> how topics differ from and complement sparks.

## Asking vs. Topics

A **spark/question** is a single conversational _move_ — one prompt, answered, then you
move on. A **topic** is a _territory_ — a subject you can explore for minutes, with
multiple angles, a fact or two, opener questions, and follow-ups.

|                   | Asking (sparks)             | Topics                                                        |
| ----------------- | --------------------------- | ------------------------------------------------------------- |
| **Lifespan**      | one exchange                | sustained, minutes                                            |
| **Structure**     | atomic prompt               | a bundle: angle + facts + openers + follow-ups + avoid-list   |
| **Job**           | break ice / deepen a moment | give you _something to talk about_ + confidence to sustain it |
| **Vulnerability** | can run high                | usually low                                                   |
| **Best for**      | dates, deepening, games     | weak ties, networking, "what do I even bring up?"             |
| **Shareability**  | medium                      | high — it's a prep packet                                     |

This maps directly to Brooks' **Topics** maxim (prepare subjects in advance) and to the
Prep Partner. Topics are the answer to the most common real-world conversation problem,
which is not "what's a deep question" but "I have nothing to say."

## Topic Object Shape

A topic is essentially a mini prep-brief:

- `id`, `topic` (the subject), `metadata` bag
- `why_it_lands` — a short read on why this is a good thing to bring up here
- `angles` — 2–3 entry points into the territory
- `opener_sparks` — 2–3 sparks that kick off the topic (links to the Asking pillar)
- `follow_up_ideas` — directions to go deeper once it's flowing
- `facts_or_links` — a fact or two and/or curated links with original summaries
  (never copied source text)
- `things_to_avoid` — optional guardrails
- shared serving metadata with sparks: `relationship_context`, `setting`,
  `depth_level`, `humor_level`, `controversy_level`, etc.

## Behaviors

- **Generate-first, same as sparks.** Hit the button, get a topic with the most
  generally-optimal settings; adjust levers to taste.
- **On-demand follow-ups.** Tap a topic's "follow-ups" action to generate deeper questions
  to ask within that territory. Same engine, parent = the topic.
- **Keep / discard.** Kept topics seed the topic library and the quality dataset.
- **Share.** Topics are the natural unit to share — a user can send a prepared topic (with
  its angles, openers, and links) to someone else, so two people can walk into a
  conversation with shared prep. This is also a growth surface (see
  [../strategy/competitive-analysis.md](../strategy/competitive-analysis.md)).
- **Enrichment.** Topics can carry links, facts, and ideas. Store source metadata; for
  protected sources, store a citation, link, and short original summary — never copy
  copyrighted material into the product.

## Open Questions for Deeper Work

- What makes a topic _sustainable_ — able to carry several minutes of conversation rather
  than dead-ending? This is a distinct quality dimension from spark answerability.
- What makes a topic _shareable_ — screenshot-and-send worthy?
- How much enrichment (facts/links) helps before a topic feels like homework?
- How do topic critique criteria differ from the spark rubric? (Likely: breadth of angles,
  sustain potential, low-pressure entry, freshness.)

These are flagged as a high-priority research direction in
[../research/conversation-research.md](../research/conversation-research.md).

# Shared Game Mode

> Multiplayer conversation games powered by sparks. A later-phase feature (host-led,
> realtime). Game modes are the one place the app _actively facilitates_ during a live
> conversation, because the app is part of the game container — see the interaction
> boundary in [../philosophy/product-philosophy.md](../philosophy/product-philosophy.md).
> Game modes are also a likely growth engine (see
> [../strategy/competitive-analysis.md](../strategy/competitive-analysis.md)).

## Product Goal

A host creates a room, shares a link, and runs structured conversation games. Fun enough
for friends, useful enough for teams, classrooms, and events.

## Technical Model

Supabase Realtime for the first version unless latency or orchestration later demands a
specialized service.

Tables (when built): `game_rooms`, `game_participants`, `game_rounds`, `game_votes`,
`game_submissions`, `game_events`.

MVP flow: host picks a mode + safety/depth settings → app creates room + join link →
participants enter names or sign in → room serves approved sparks filtered by mode → host
advances rounds → participants vote/answer/submit/react → after, users save favorites.

## Game Safety Defaults

- Pass is always available.
- Group depth starts capped; controversy starts low.
- Host can lower controversy mid-game.
- Anonymous submissions need moderation.
- Workplace-safe mode avoids romance, body image, religion, politics, family trauma, and
  personal finances by default.

## First Modes (research-aligned)

- **Story Swap** — everyone answers the same story prompt, then asks one follow-up each.
- **Ask Me Anything** — featured participant chooses topics, others submit questions, can
  pass. Anonymous submission + host moderation + one required follow-up.
- **Change My Mind** — disagreement with steelman-first round and controversy cap; no
  personal attacks; sides randomly assigned. Optimizes for reasoning and perspective-taking,
  not outrage.

## Additional Modes

- **Follow-Up Ladder** — group asks three progressively deeper follow-ups. Trains curiosity.
- **Callback Quest** — app marks a detail from an answer; players earn points for naturally
  referencing it later. Turns Brooks' call-back idea into a skill game.
- **Common Ground** — players privately answer; app reveals overlaps. Great for teams.
- **Perspective Flip** — argue/explain a scenario from someone else's viewpoint. Bounded
  and respectful.
- **Hot Take Thermometer** — private agreement ratings revealed as a distribution, then
  follow-ups explore why people differ.
- **Question Relay** — one player answers, then chooses/creates the next question for
  someone else; app nudges toward balanced participation.
- **Values Auction** — limited budget to bid on values/experiences/tradeoffs; discussion
  comes from why people spent where they did.
- **Inside Joke Builder** — silly prompts remixed into a closing callback or shared phrase.
- **Repair Practice** — trusted contexts only; low-stakes scenarios to practice apology,
  clarification, repair. Strong safety framing per the hard-conversation guardrails.

## Adjacent: Shared Screen Mode

A no-login, big-type room display for dinner tables, classrooms, and parties. Minimal
controls, readable across a table, QR code to join. One person brings the app to a table of
six — inherently viral, and the cheapest acquisition surface we have.

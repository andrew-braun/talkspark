# Conversation Research

> The evidence base behind TalkSpark. Each finding ends in a product rule. For how those
> rules become data fields and review standards, see
> [../philosophy/spark-taxonomy.md](../philosophy/spark-taxonomy.md). For the product POV
> they support, see [../philosophy/product-philosophy.md](../philosophy/product-philosophy.md).

## Evidence Posture

Conversation science is not one settled field; useful evidence spans social psychology,
relationship science, organizational behavior, communication, conflict research, and
computational conversation research.

- Treat replicated experimental and meta-analytic findings as strong product guidance.
- Treat correlational well-being research as directionally useful, not proof a feature
  _causes_ well-being.
- Treat lab conversation protocols as design inspiration, then validate with product
  feedback.
- Avoid medical, therapeutic, mediation, or crisis claims.
- Do not copy proprietary games, decks, or book exercises — use the underlying principles.
- Measure whether features work _inside TalkSpark_ rather than assuming the literature
  transfers perfectly.

## The TALK Framework as a Spine

Alison Wood Brooks' work organizes conversation skill around four maxims — **Topics,
Asking, Levity, Kindness**. We use this as an organizing spine so we don't over-index on
Asking alone:

- **Topics** — preparing subjects in advance. Underpins the **Topics pillar** and the Prep
  Partner. A historically under-built area; see [../features/topics.md](../features/topics.md).
- **Asking** — questions, especially follow-ups, signal curiosity. The original spark
  pillar.
- **Levity** — playfulness lowers the cost of vulnerability. Modeled as a `humor_level`
  dimension that _nods_ to its importance without claiming to solve subjective humor.
- **Kindness** — responsiveness, warmth, making people feel understood. Covered by the
  responsiveness and receptiveness findings below; named as a first-class pillar, not
  buried.

## Big Takeaways

### 1. Conversation has motives, not just topics

People talk to learn, coordinate, affiliate, impress, repair, persuade, play, and feel
understood (Yeomans, Schweitzer & Brooks — conversational circumplex).
**Rule:** every spark has a job. Serve by `conversation_goal` and `conversation_motive`,
not topic alone.

### 2. People underestimate how much others like talking with them

The liking gap, stranger research, and conversation-forecasting work show people predict
conversation will be more awkward and shallow than it is.
**Rule:** lower activation energy. Keep one-tap generation, warm defaults, low-risk
warm-ups, depth ramps, and pass controls.

### 3. Good questions work because they signal curiosity

Asking — especially follow-ups — increases liking (Huang, Yeomans, Brooks, Minson, Gino).
**Rule:** be as much about the second question as the first. `follow_up_potential` is a
review criterion; follow-ups are a first-class on-demand action.

### 4. Self-disclosure builds liking when reciprocal and paced

Collins & Miller (meta-analysis); Aron et al. (closeness); Laurenceau et al.
(responsiveness).
**Rule:** depth is a ramp, not a trap door. `depth_level`, `reciprocity_mode`, and
`vulnerability_ramp` are core. Reject high disclosure without consent.

### 5. Responsiveness is the actual product

Feeling understood and validated matters more than clever questions; active constructive
responding and call-backs are visible listening.
**Rule:** help users prepare to _listen and respond_, then get out of the way. Response
ideas in prep/detail views, `conversation_skill` tags, Callback Quest, callback hooks. No
UX that keeps the app open during ordinary conversation.

### 6. Boomerasking is an anti-pattern

Asking a question then answering it yourself masquerades as curiosity (Brooks & Yeomans).
**Rule:** design for reciprocal curiosity. `anti_boomerask` on the review checklist;
balanced turn-taking in games.

### 7. Stories beat abstract opinions

Scenes, memories, and concrete details are easier to answer and create natural follow-ups.
**Rule:** prefer prompts asking for a story, moment, choice, or tiny detail over abstract
beliefs. `answer_shape` captures this; `story prompt` is a first-class format.

### 8. Groups are not just bigger dyads

The many-minds problem and psychological-safety research: disclosure and participation
change with audience size.
**Rule:** group sparks need lower default depth/controversy, turn structure, and pass
controls. `group_size_*` and `group_safety_level` are metadata; group-safety check is
required for group-friendly sparks.

### 9. Disagreement needs receptiveness, not just balance

Conversational receptiveness: acknowledging, hedging, finding agreement, positive framing
(Yeomans et al.); voice humanizes disagreement (Schroeder et al.).
**Rule:** debate optimizes for curiosity and perceived listening, not heat.
`controversy_level` and `receptiveness_required`; steelman/perspective-get rounds first.

### 10. Perspective-getting beats perspective-taking

Inferring another's mind is less accurate than asking (Eyal, Steffel & Epley).
**Rule:** prefer `What is it like for you when…` over `Why do people like you…`. Add a
`perspective_getting` skill tag; reward accurate restatement before disagreement.

### 11. Social variety matters

Relational diversity in one's social portfolio correlates with well-being beyond
interaction volume (Collins et al.). _Correlational_ — frame as "variety is nice," not
"this makes you healthier."
**Rule:** support weak ties, family, friends, dating, teams, community — no single context
is the default human experience.

### 12. Preparation helps when it creates readiness, not scripts

Flexible prep reduces friction; over-scripting makes people performative.
**Rule:** prep mode brings _live possibilities_, not lines to recite. Topics, arcs,
fallback sparks, boundaries, follow-ups, pocket mode. Store prep history only for signed-in
users with consent; never store raw transcripts by default.

## Research-To-Feature Map

| Research line                     | Product rule                          | Feature                                        |
| --------------------------------- | ------------------------------------- | ---------------------------------------------- |
| Question asking increases liking  | Optimize for curiosity and follow-ups | On-demand follow-ups; follow-up ladders        |
| Conversational circumplex         | Serve by motive, not only topic       | Motive taxonomy; goal-aware search             |
| Reciprocal disclosure             | Depth gradual and mutual              | Depth + reciprocity fields; vulnerability ramp |
| Responsiveness and intimacy       | Help users respond, not only ask      | Skill tags; prep response ideas and callbacks  |
| Active constructive responding    | Explore good news                     | Good-news spark pack; response-style prompts   |
| Liking gap / stranger research    | Lower start friction                  | One-button default; warm-up mode               |
| Deeper-conversation misprediction | Opt into depth safely                 | Explicit depth ladder UI                       |
| Sensitive-question research       | Depth needs consent                   | Safety boundaries; sensitive-prompt review     |
| Many minds problem                | Groups need separate design           | Group-fit metadata; turn-taking and pass       |
| Psychological safety              | Protect participation                 | Group safety presets                           |
| Conversational receptiveness      | Structure disagreement                | Change My Mind with steelman rounds            |
| Perspective mistaking             | Ask, do not assume                    | Perspective-get tags; hard-conversation prep   |
| Humanizing voice                  | Medium matters in disagreement        | Voice-first debate experiments (later)         |
| Relational diversity              | Support many contexts                 | Social portfolio challenges (gentle)           |
| Preparation research              | Prepare flexibly                      | Conversation briefs; Topics pillar             |

## Measurement Plan

Track lightweight signals to validate the philosophy inside the app:

- Save rate by spark tag; skip rate by depth and context.
- Copy/share rate; report rate.
- Rating after use; explicit "led to a good conversation" signal.
- Follow-up opened or used; spark used in game.
- Prep brief revisited before event; collection adds; retired sparks by reason.

Do not infer private emotional outcomes from behavior alone. Ask sparingly, opt-in only.

## Open Research Directions

Higher-priority gaps to mine next:

- **Topics vs. Asking** — how preparing territories differs from asking questions; what
  makes a topic sustainable and shareable. (Highest priority — it's the second pillar.)
- **Shareability / virality** — what makes a prompt get screenshotted and passed around;
  distinct from the 12 quality dimensions and a likely growth lever.
- **Onboarding / first 60 seconds** — where these apps lose new users; supports the
  one-button + optional-tour approach.
- **Personalization without creepiness** — a Midjourney-style preference quiz (pick which
  of two sparks you'd rather ask, repeat → taste profile) instead of a "tell us about
  yourself" form. Highest privacy-risk feature; deferred until core works.

## Bibliography

Practical source map for product work, not an exhaustive academic review.

### Core conversation research

- Brooks, A. W. Public research index. https://alisonwoodbrooks.com/conversation-research/
- Brooks, A. W. _TALK: The Science of Conversation and the Art of Being Ourselves_ (book
  page, call-back technique). https://alisonwoodbrooks.com/conversation-book/
- Huang, Yeomans, Brooks, Minson & Gino (2017). _It doesn't hurt to ask: Question-asking
  increases liking._ JPSP. DOI 10.1037/pspi0000097
- Yeomans, Schweitzer & Brooks (2022). _The Conversational Circumplex._ Current Opinion in
  Psychology. DOI 10.1016/j.copsyc.2021.10.001
- Brooks & Yeomans (2025). _Boomerasking: Answering your own questions._ JEP: General.
  DOI 10.1037/xge0001693
- Collins, Minson, Kristal & Brooks (2024). _Conveying and detecting listening during live
  conversation._ JEP: General. DOI 10.1037/xge0001454

### Closeness, disclosure, responsiveness

- Aron, Melinat, Aron, Vallone & Bator (1997). _The Experimental Generation of
  Interpersonal Closeness._ PSPB. DOI 10.1177/0146167297234003
- Collins & Miller (1994). _Self-disclosure and liking: A meta-analytic review._
  Psychological Bulletin. DOI 10.1037/0033-2909.116.3.457
- Laurenceau, Barrett & Pietromonaco (1998). _Intimacy as an interpersonal process._ JPSP.
  DOI 10.1037/0022-3514.74.5.1238
- Gable, Reis, Impett & Asher (2004). _What Do You Do When Things Go Right?_ JPSP.
  DOI 10.1037/0022-3514.87.2.228

### Social forecasting and starting conversations

- Boothby, Cooney, Sandstrom & Clark (2018). _The Liking Gap in Conversations._
  Psychological Science. DOI 10.1177/0956797618783714
- Mastroianni, Cooney, Boothby & Reece (2021). _The liking gap in groups and teams._ OBHDP.
  DOI 10.1016/j.obhdp.2020.10.013
- Epley & Schroeder (2014). _Mistakenly seeking solitude._ JEP: General. DOI 10.1037/a0037323
- Schroeder, Lyons & Epley (2022). _Hello, stranger?_ JEP: General. DOI 10.1037/xge0001118
- Kardas, Kumar & Epley (2022). _Overly shallow?_ JPSP. DOI 10.1037/pspa0000281
- Kardas, Schroeder & O'Brien (2022). _Keep talking._ JPSP. DOI 10.1037/pspi0000379
- Hart, VanEpps & Schweitzer (2021). _The (better than expected) consequences of asking
  sensitive questions._ OBHDP. DOI 10.1016/j.obhdp.2020.10.014

### Groups, safety, social variety

- Cooney, Mastroianni, Abi-Esber & Brooks (2020). _The many minds problem._ Current Opinion
  in Psychology. DOI 10.1016/j.copsyc.2019.06.032
- Edmondson & Lei (2014). _Psychological Safety._ Annual Review of Org. Psych. & Org.
  Behavior. DOI 10.1146/annurev-orgpsych-031413-091305
- Collins, Hagerty, Quoidbach, Norton & Brooks (2022). _Relational diversity in social
  portfolios predicts well-being._ PNAS. DOI 10.1073/pnas.2120668119

### Conflict, perspective, hard conversations

- Yeomans, Minson, Collins, Chen & Gino (2020). _Conversational receptiveness._ OBHDP.
  DOI 10.1016/j.obhdp.2020.03.011
- Eyal, Steffel & Epley (2018). _Perspective mistaking._ JPSP. DOI 10.1037/pspa0000115
- Schroeder, Kardas & Epley (2017). _The Humanizing Voice._ Psychological Science.
  DOI 10.1177/0956797617713798
- Levine, Roberts & Cohen (2020). _Difficult conversations._ Current Opinion in Psychology.
  DOI 10.1016/j.copsyc.2019.07.034

## Maintainer Note

When adding a research note, include three things: the **claim**, the **limitation**, and
the **product rule**. A citation without an app implication is not yet useful for TalkSpark.

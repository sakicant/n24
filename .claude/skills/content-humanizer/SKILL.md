---
name: content-humanizer
description: Detect and fix AI writing patterns in content. Use when text sounds robotic, formulaic, or obviously AI-generated. Analyzes writing for AI tells and rewrites to sound natural.
triggers:
  - humanize this
  - sounds like AI
  - make this sound natural
  - fix AI writing
  - remove AI patterns
  - content humanizer
allowed-tools: []
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# Content Humanizer

Detect AI writing patterns and rewrite content to sound like a real person wrote it.

## Writes
- Rewrites the provided content in place, or outputs to `outputs/humanized-[name].md`

## AI Writing Tells

### Word Choice
- **Overused:** delve, navigate, leverage, streamline, comprehensive, robust, innovative, cutting-edge, seamless, harness, pivotal, realm, landscape, paradigm, foster, utilize, empower, ecosystem
- **Fix:** Replace with plain language. "Use" not "utilize." "Help" not "empower." "Change" not "paradigm shift."

### Sentence Structure
- **Formulaic openers:** "In today's fast-paced world..." "When it comes to..." "It's worth noting that..."
- **Triple structures:** "X, Y, and Z" repeated in every paragraph
- **Hedge phrases:** "It's important to note that" "One might argue" "It could be said"
- **Fix:** Vary sentence length aggressively. Mix short punchy sentences with longer ones. Start sentences differently.

### Tone Patterns
- **False enthusiasm:** "Exciting!" "Amazing!" on mundane topics
- **Excessive hedging:** "Perhaps" "Might" "Could potentially" when you should just state things
- **Balanced to a fault:** Every pro has a con, every opinion has a counterpoint
- **Fix:** Take a position. Be specific. Let some sentences be blunt.

### Formatting
- **Too many headers** for short content
- **Bullet points for everything** even when prose would flow better
- **Em dashes everywhere** (ironic, yes)
- **Fix:** Use prose for narrative. Headers for reference. Bullets only when listing parallel items.

### Composition
- **Perfect structure:** Every piece has intro, 3-5 body sections, conclusion
- **Topic sentence + supporting sentences** in every paragraph like a textbook
- **Manufactured transitions:** "Moreover" "Furthermore" "Additionally" "In conclusion"
- **Fix:** Let structure be imperfect. Skip transitions when the next paragraph naturally follows. End mid-thought sometimes.

## Process

1. **Scan** the content for patterns above. Flag every instance.
2. **Score** AI-ness: 1 (fully human) to 10 (obviously AI)
3. **Rewrite** flagged sections. Preserve the meaning. Change the voice.
4. **Verify** the rewrite does not introduce new AI patterns.

## Rewriting Rules

- Replace any word from the "overused" list
- Break up sentences over 30 words
- Remove every "It's worth noting" and "It's important to"
- Cut 20% of adverbs (really, truly, incredibly, essentially)
- Add one imperfect or conversational element per paragraph
- Vary paragraph length (some 1 sentence, some 4-5)
- Remove the conclusion if the last section already wraps up naturally
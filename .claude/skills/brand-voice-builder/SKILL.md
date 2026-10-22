---
name: brand-voice-builder
description: Build a brand voice guidelines document from existing content. Use when establishing or documenting a consistent brand tone.
triggers:
  - build brand voice
  - voice guidelines
  - brand tone
---

# Brand Voice Builder

Analyze provided content samples and extract a complete, reusable brand voice guide that any writer (human or AI) can follow to produce on-brand content.

## Gather Content Samples

Request at least 5 content samples across different formats:

1. **Website copy** — Homepage, about page, product pages
2. **Email** — Marketing emails, transactional emails, support responses
3. **Social media** — Posts, replies, comments across platforms
4. **Documentation** — Help docs, guides, tutorials
5. **Sales materials** — Pitch decks, proposals, one-pagers

Check `reference/` for any existing voice documentation. If a partial guide exists, use it as a starting point.

The more samples provided, the more accurate the extraction. Minimum 3 samples across 2 formats.

## Analysis Method: The Voice Extraction Framework

### Phase 1: Pattern Detection
Read every sample and annotate patterns across these dimensions:

**Tone Markers:**
- Formal vs informal language (contractions, colloquialisms, sentence fragments)
- Confident vs hedging ("We built this" vs "We think this might help")
- Warm vs clinical ("We're here to help" vs "Support documentation is available")
- Playful vs serious (humor, wordplay, pop culture references)
- Direct vs diplomatic ("This is wrong" vs "There might be an opportunity to improve")

**Vocabulary Patterns:**
- Recurring words and phrases that appear across multiple samples
- Words and phrases that are conspicuously absent
- Technical jargon usage: when it appears, how it is introduced, when it is avoided
- Pronoun patterns: "we" vs "the team", "you" vs "users", "I" vs impersonal

**Structural Patterns:**
- Average sentence length (count words in 20 random sentences)
- Paragraph length (count sentences per paragraph across samples)
- Use of lists vs prose
- Heading style (questions, commands, labels)
- Bold and italic usage patterns
- Punctuation habits: Oxford comma, exclamation marks, em dashes, ellipses

### Phase 2: Personality Distillation
From the patterns, derive 3-5 personality trait pairs. Each pair defines a boundary:

Format: "[What we are] but not [what we are not]"

Examples:
- "Confident but not arrogant" — we state things directly but acknowledge when we do not know
- "Casual but not sloppy" — we use contractions and short sentences but never misspell or use text-speak
- "Helpful but not patronizing" — we explain things clearly without assuming the reader is stupid
- "Opinionated but not preachy" — we have strong views but present them as our perspective, not the only truth

### Phase 3: Vocabulary Extraction
Build three vocabulary lists from the content samples:

**Preferred Terms (15-20 words/phrases):**
Words that appear consistently and represent the brand voice. Include the context for each.
Example: "workspace" (not "project" or "config")

**Avoided Terms (15-20 words/phrases):**
Words the brand never uses and why.
Example: "leverage" (too corporate), "synergy" (meaningless), "utilize" (pretentious form of "use")

**Conditional Terms:**
Words that are acceptable in some contexts but not others.
Example: "hack" — OK in blog posts ("productivity hacks"), not OK in enterprise documentation

### Phase 4: Context Calibration
Define how the voice shifts across contexts. The core personality stays the same but the dial turns:

| Context | Energy Level | Formality | Humor | Technical Depth | Example |
|---------|-------------|-----------|-------|-----------------|---------|
| Marketing pages | High | Low-Medium | Yes (light) | Low | "Get started in 5 minutes, not 5 meetings." |
| Documentation | Medium | Medium | Rare | High | "Run `npm install` to add the dependency." |
| Social media | High | Low | Yes | Low | "That feeling when your deploy just works." |
| Error messages | Low-Medium | Medium | No | Medium | "Something went wrong loading your data. Try refreshing." |
| Sales emails | Medium | Medium | Minimal | Low-Medium | "Teams like yours typically see results in the first week." |
| Support responses | Medium | Medium | No | As needed | "I understand the frustration. Here is what happened." |

## Voice Guide Document Structure

### 1. Voice Summary
One paragraph that captures the brand personality. This is the "if you read nothing else" section.

### 2. Personality Traits
The 3-5 trait pairs with explanations and examples for each.

### 3. Vocabulary Guide
Preferred, avoided, and conditional terms with context.

### 4. Sentence Style Rules
- Target sentence length
- Active vs passive voice policy
- Punctuation rules
- Formatting preferences

### 5. Do/Don't Examples
Provide 8-10 paired examples covering different contexts:

| Context | Do (On-Brand) | Don't (Off-Brand) |
|---------|--------------|-------------------|
| Headline | "Ship faster with less stress" | "Accelerate your development velocity" |
| Error | "We could not save your changes. Try again?" | "ERROR: Save operation failed (code 500)" |
| CTA | "Start building" | "Submit your information" |
| Feature | "See who visited your page" | "Comprehensive visitor analytics dashboard" |

### 6. Context Calibration Table
The energy/formality/humor matrix from Phase 4.

### 7. Voice Audit Checklist
A quick checklist writers can use to self-review:
- [ ] First sentence is about the reader, not about us
- [ ] No words from the "avoid" list
- [ ] Tone matches the context calibration table
- [ ] Sentences average under [X] words
- [ ] Every claim is specific, not vague

## Output

Save the voice guide to `reference/brand-voice.md`. Add a revision date and note which content samples were analyzed.

This file should be referenced by other skills and templates for consistent output across all generated content.

## Do NOT
- Invent a voice that does not match the provided samples — extract, do not imagine
- Create rules so restrictive that all content sounds the same regardless of context
- Include subjective aesthetic preferences ("never use blue") — focus on language patterns
- Write a guide so long that nobody reads it — aim for a document someone can review in 10 minutes
- Skip the Do/Don't examples — they are the most useful part of any voice guide
- Assume the voice should sound like every other tech company — find what makes this brand distinct

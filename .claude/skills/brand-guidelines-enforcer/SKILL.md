---
name: brand-guidelines-enforcer
description: Audit copy or assets against the documented brand guidelines and flag violations with concrete fixes. Use when reviewing draft content before it ships, when onboarding new contributors, or when output starts feeling off-voice.
triggers:
  - brand check
  - check brand consistency
  - review against brand guidelines
  - is this on-brand
  - brand audit
---

# Brand Guidelines Enforcer

You are a brand guardian. Your job is to read draft copy and flag anything that violates the documented voice, tone, terminology, or formatting rules. You explain *why* it's off and propose a fix that stays in the author's intent.

## Gather Context First

Read these in order before reviewing anything:

1. `knowledge/brand.md` — voice, tone, messaging pillars, terminology rules
2. `content-library/` — past pieces that represent brand at its best (use as positive reference)
3. `.claude/rules/` — any glob-scoped voice or content-guidelines rules
4. The draft itself — what is it, what channel, who is it for?

If `knowledge/brand.md` is empty, stop and tell the user the audit needs the brand doc filled in first. Do not invent rules.

## Audit Process

### Pass 1 — Voice and Tone

For each paragraph, ask:
- Does the energy match the documented voice? (e.g., "playful but confident" — is it both, or just playful?)
- Are there hedging phrases ("I think", "maybe", "kind of") if the brand calls for confidence?
- Is the reading level appropriate for the audience?
- Does it sound like the brand wrote it, or like a generic AI draft?

### Pass 2 — Terminology

- Are product names, capabilities, and segment terms used consistently with the brand doc?
- Are banned words present? (Brands often ban jargon like "synergy", "leverage", "best-in-class")
- Are abbreviations and casing correct? ("Claude Code" not "claude code"; "MRR" vs "mrr")

### Pass 3 — Structure and Formatting

- Heading hierarchy and length
- Sentence length distribution (too uniform = robotic)
- List vs prose balance per channel
- Em dashes if they're banned, smart quotes if they're required, etc.

### Pass 4 — Channel Fit

- Long-form (blog) vs short-form (social): is the format right?
- Does it follow the documented hook style for this channel?
- Length within range?

## Output Format

```markdown
# Brand Audit: [piece title]
Channel: [blog | email | landing | social | press]
Reviewed against: knowledge/brand.md (last updated [date if known])

## Verdict
[On brand | Minor fixes | Off brand — needs rewrite]

## Violations
| # | Severity | Location | Issue | Fix |
|---|----------|----------|-------|-----|
| 1 | High | Para 2 | "leverages" is a banned word | Replace with "uses" |
| 2 | Med | Subhead 3 | Hedging breaks confident voice | "We believe X" → "X" |

## On-brand strengths
[2-3 things the draft does well — keep these]

## Suggested rewrite
[Only the changed lines/paragraphs, side-by-side if helpful]
```

## Severity Definitions

- **High** — public-facing copy that misrepresents brand or breaks an explicit rule
- **Medium** — voice drift that reads as generic; fix improves but doesn't block ship
- **Low** — style nit, judgment call

## Do NOT

- Invent brand rules that aren't in `knowledge/brand.md`
- Rewrite the entire piece if only 3 lines need fixing — surgical edits only
- Strip personality in the name of compliance — match the brand's energy, including humor or sharpness
- Pass content as "on brand" without doing all four passes

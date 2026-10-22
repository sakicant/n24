---
name: copy-editor
description: Edit existing marketing copy through structured passes for clarity, specificity, voice, and conversion. Use to polish, tighten, or refresh copy without rewriting from scratch. For new copy, see landing-page-writer or ad-copy-writer. For copy diagnosis, see copy-analyzer.
triggers:
  - edit this copy
  - polish this
  - tighten this up
  - copy review
  - refresh this content
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# Copy Editor

Edit existing marketing copy without rewriting it. Each pass focuses on one dimension. Multiple focused passes beat one unfocused review.

## Gather Context First

1. Read `context/` for brand voice and audience
2. Confirm the placement (landing page, ad, email, social, doc)
3. Confirm the goal (conversion, awareness, education, retention)
4. Identify any constraints (length cap, brand-mandated words, legal review)
5. Note the original author's voice — preserve it, don't overwrite it

## The Seven Sweeps

Run each sweep top-to-bottom on the copy. After each, loop back to confirm earlier sweeps still hold.

### Sweep 1 — Clarity

The reader must understand what the copy is about within the first sentence.

- Replace abstract nouns with concrete verbs
- Cut clauses that don't advance the meaning
- Move the most important idea to the first 8 words
- Replace pronouns with the noun they reference if ambiguous

### Sweep 2 — Specificity

Vague claims kill conversion. Every benefit needs a number, name, or example.

| Vague | Specific |
|-------|----------|
| "Save time" | "Cut report generation from 4 hours to 8 minutes" |
| "Trusted by leading companies" | "Used by [3 named, recognizable customers]" |
| "Significantly faster" | "3.2x faster" |
| "Better results" | "31% lift in conversion across 200+ tests" |

If a claim can't be made specific, cut it. Vague claims hurt more than they help.

### Sweep 3 — Voice

Match the brand voice. Read each sentence aloud — does it sound like the brand?

- Strip filler ("just", "actually", "basically", "really", "very")
- Replace passive voice with active where it doesn't change the meaning
- Cut hedges ("might", "could potentially", "in some cases")
- Match sentence rhythm — short punches mixed with longer flows

### Sweep 4 — Specificity of audience

Generic "you" copy reads like everyone copy, which reads like no one copy.

- Name the role ("for marketers" beats "for teams")
- Reference the user's tools by name where the audience all uses the same one
- Reference their pain in their words (pull from `notes/user-insights/` or transcripts)

### Sweep 5 — Friction

Where does the reader stop? Read the copy out loud and mark every place you stumble.

- Replace jargon with plain language (or define it inline)
- Break long sentences (over 25 words) into two
- Replace abstract words ("solution", "leverage", "synergy", "robust", "comprehensive") with what they actually mean
- Cut redundant phrases ("end result" → "result", "completely free" → "free")

### Sweep 6 — Structure

Format for scanning. Most readers don't read — they scan.

- One idea per paragraph (3 lines max)
- Subheads every 3-4 paragraphs
- Bullet lists for parallel items, prose for sequential ideas
- Bold the most important phrase in each section, not the whole sentence

### Sweep 7 — Conversion close

Every piece of copy ends with an action.

- One primary CTA, no choices
- Action verb that matches the next step ("Get the audit" beats "Submit")
- Reduce risk near the CTA (free trial, no credit card, money-back)
- Remove CTA-distracting links above the primary CTA

## Output Format

Save to `outputs/copy-edit-[asset-name].md`:

```
## Original
[paste original copy]

## Edits

### Sweep 1 — Clarity
- [Line ref] Changed "[before]" → "[after]" because [reason]

### Sweep 2 — Specificity
- ...

[continue per sweep]

## Final
[the edited copy in full]

## Open questions for the author
- [anything that needs the author's voice or factual confirmation]
```

## Do NOT

- Rewrite — edit. The user wrote this; preserve their voice
- Apply all seven sweeps in one pass — each sweep catches what the others miss
- Strip personality in pursuit of clarity — voice is a feature, not a bug
- Cut a section without asking if it carries strategic weight (legal, SEO, brand)
- Use em dashes — they read as AI writing. Use periods, commas, or restructure.
- Inject AI tropes ("delve", "leverage", "seamless", "robust", "comprehensive", "innovative") in the edits
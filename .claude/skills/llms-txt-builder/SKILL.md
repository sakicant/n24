---
name: llms-txt-builder
description: Generate or audit an llms.txt file at the site root. llms.txt is the emerging convention for telling LLMs which pages on a site are most important and how to interpret them — like a sitemap for AI engines. Use when user mentions llms.txt, AI site map, or wants to publish an LLM-friendly summary of their site.
triggers:
  - generate llms.txt
  - audit llms.txt
  - ai site map
  - llms file
  - llm-friendly summary
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# llms.txt Builder

Build or audit a site's `llms.txt` file. The file lives at the site root (`https://example.com/llms.txt`) and gives AI search engines a structured, plain-text summary of the site.

## Format

`llms.txt` follows this convention:

```
# Site Name
# https://example.com

> One-paragraph description of what the site is, who it's for, and the top 3-5 things visitors do here.

## Main Pages

- [Homepage](https://example.com/): Brief description.
- [Templates](https://example.com/templates): What it is.
- ...

## Key Concepts

- **Concept 1**: Definition in one sentence.
- ...

## How It Works

1. Step one.
2. Step two.
3. ...
```

Sections are not strictly required, but every published `llms.txt` should have at minimum: site name, URL, summary paragraph, main pages list.

## Generating from scratch

If the user has no `llms.txt`:
1. Ask for the site URL or local site directory.
2. Fetch the homepage and the top-level nav links.
3. Draft the summary paragraph from the homepage hero + meta description.
4. List 5-15 main pages with one-line descriptions each.
5. If the site has product/feature concepts (skills, commands, tools, etc.), include a "Key Concepts" section.
6. If there's a clear how-it-works flow, include the steps.
7. Save to `outputs/llms.txt` and tell the user to drop it at their site root.

If the project is built with The Froject, generate `llms.txt` from `templateCounts` at build time so it never drifts (see `scripts/prerender.ts` in this repo for an example pattern).

## Auditing an existing llms.txt

If a file already exists:
1. Fetch it. Print the current contents.
2. Check freshness: do the listed counts match reality? Are listed pages still live?
3. Check completeness: every cornerstone page should be listed.
4. Check tone: should be neutral and factual, not marketing copy.
5. Check size: aim for under 500 lines. Beyond that, AI engines may truncate.
6. Output a diff: what to add, what to remove, what to update.

## Output format

For new files: save to `outputs/llms.txt` plus a short markdown summary at `outputs/llms-txt-notes.md` explaining what's in the file and where to deploy it.

For audits: save the diff to `outputs/llms-txt-audit-<date>.md` with three sections: "Add", "Remove", "Update".

## Common mistakes

- Writing marketing copy instead of neutral descriptions. AI engines penalize hype.
- Hardcoding counts/numbers that drift. Generate at build time.
- Listing too many pages (over 50). Stick to cornerstones.
- Omitting the URL line at the top — some parsers need it.

## Cross-references

For broader AI search optimization, see `ai-seo-optimizer`. For per-page citation scoring, see `geo-citability-scanner`. For the AI crawler access side (robots.txt), see `ai-crawler-access-checker`.

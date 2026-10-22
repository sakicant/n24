---
name: geo-citability-scanner
description: Score a single page for AI citation readiness. Audits structural and semantic markers that AI search engines use to decide whether to quote a page. Use when the user mentions citability score, AI citation audit, or wants to know why their content isn't being cited by ChatGPT, Perplexity, or Google AI Overviews.
triggers:
  - citability score
  - check ai citation
  - geo audit
  - why isn't this cited
  - ai overview audit
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# GEO Citability Scanner

Score one page (URL or local HTML/markdown file) for how citation-ready it is for AI search engines. Output a numeric score with concrete fixes.

## Inputs needed

Ask the user for one of:
- A URL (you'll fetch and parse the HTML).
- A path to an HTML file or a markdown source file.
- Pasted page source.

If only the URL is given and you can fetch it, do so. Otherwise ask for the source.

## What to check

Run through this checklist. Each item is a binary pass/fail; sum to a score out of 20.

### Structure (6 points)
1. Single `<h1>` per page (not zero, not multiple). Pages with one clean H1 are cited 2.8x more often.
2. Sequential heading hierarchy: H1 -> H2 -> H3 with no skipped levels.
3. Paragraphs are short (under 100 words). AI engines prefer chunks they can quote.
4. Lists and tables are present where appropriate (data answers).
5. Each section answers a question or makes a claim — no rambling exposition.
6. Page length is appropriate for the topic (250+ words for substantive answers).

### Schema (5 points)
7. `FAQPage` JSON-LD present with at least 3 questions.
8. `Organization` schema present with name, url, sameAs.
9. `BreadcrumbList` for pages deeper than the homepage.
10. `Article` or `HowTo` schema for content pages where appropriate.
11. No invalid schema (validate against schema.org). Use a parser, don't eyeball.

### Authority signals (5 points)
12. Author byline with name (not "admin" or company name).
13. Date published / date modified visible on-page.
14. Outbound links to authoritative sources.
15. Internal links to deeper pages on the same domain.
16. `sameAs` declarations on Organization include real, public profiles.

### LLM-friendliness (4 points)
17. `llms.txt` exists at the site root (run `llms-txt-builder` if not — see below).
18. `robots.txt` allows AI crawlers (run `ai-crawler-access-checker`).
19. No content-blocking JavaScript hydration that hides text from non-JS crawlers.
20. Canonical URL is present and correct.

## Scoring

- 18-20: Excellent. AI engines should cite freely.
- 14-17: Good. Address the 3-5 missing items.
- 10-13: Mediocre. Structural fixes needed.
- Under 10: Major rework. Page is unlikely to be cited as-is.

## Output format

Save to `outputs/geo-citability/<page-slug>-<date>.md` with:

```
# Citability score: <N>/20

## Source
- URL or path
- Date scanned

## Pass (<count>)
- Item 1 — quote the evidence (e.g., "single H1: 'How to set up...'")
- ...

## Fail (<count>)
- Item 7 — what's missing, exactly what to add
- ...

## Recommended fixes (priority order)
1. Highest-impact missing item — concrete change.
2. ...
```

Print the score and the top 3 fixes to the terminal so the user gets the headline immediately.

## Cross-references

- For broad AI search optimization (multiple pages, content strategy), use `ai-seo-optimizer`.
- For the `llms.txt` file specifically, use `llms-txt-builder`.
- For the `robots.txt` AI-bot allowances, use `ai-crawler-access-checker`.
- For schema markup specifics, use `schema-markup-builder`.

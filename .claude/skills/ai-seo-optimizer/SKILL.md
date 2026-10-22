---
name: ai-seo-optimizer
description: Optimize content for AI-powered search (Google AI Overviews, ChatGPT, Perplexity) and traditional SEO. Use when you need to make content discoverable by both search crawlers and LLMs. For per-page citation scoring, see geo-citability-scanner. For llms.txt generation/audit, see llms-txt-builder. For AI crawler access checks, see ai-crawler-access-checker.
triggers:
  - optimize for AI search
  - AEO optimization
  - AI overview optimization
---

# AI SEO Optimizer

Optimize content for both traditional search engines and AI answer engines (Google AI Overviews, ChatGPT Browse, Perplexity, Bing Copilot).

## Core Concept — Dual Optimization

Traditional SEO and AI answer engine optimization (AEO) have overlapping but distinct requirements:

| Factor | Traditional SEO | AI Answer Engines | Both |
|--------|----------------|-------------------|------|
| Keywords in title/headers | Critical | Helpful | Yes |
| Structured data (schema) | Ranking factor | Source signal | Yes |
| Concise answer paragraphs | Featured snippets | Direct citation | Yes |
| Backlink authority | Major ranking factor | Source trust signal | Partially |
| Entity clarity | Moderate | Critical | Yes |
| Conversational phrasing | Less important | Very important | No |
| Source attribution | Good practice | Required for citation | Somewhat |

## Phase 1 — Query Analysis

Before optimizing content, understand the search intent:

1. **Query classification:**
   - **Informational** — "What is [topic]?" → Optimize for AI Overviews and featured snippets
   - **Navigational** — "Brand + feature" → Optimize for site links and brand panel
   - **Commercial** — "Best [product] for [use case]" → Optimize for comparison content
   - **Transactional** — "Buy [product]" → Optimize for product schema and CTA

2. **AI overview likelihood** — Search the query in Google. Does an AI Overview appear? If yes, study its structure, sources, and format. Your content must match or exceed that structure.

3. **Answer engine citations** — Search the query in Perplexity or ChatGPT. Note which sources get cited and what format they use (lists, tables, definitions, step-by-step).

## Phase 2 — Traditional SEO Audit

Check each element against current best practices:

### On-Page Elements
| Element | Best Practice | Check |
|---------|-------------|-------|
| Title tag | Primary keyword + value proposition, 50-60 chars | [ ] |
| Meta description | Action-oriented summary with keyword, 150-160 chars | [ ] |
| H1 | One per page, includes primary keyword | [ ] |
| H2/H3 hierarchy | Logical outline, question-format headers for FAQ content | [ ] |
| URL slug | Short, keyword-rich, hyphenated | [ ] |
| Internal links | 3-5 relevant internal links per 1000 words | [ ] |
| Image alt text | Descriptive, includes keyword where natural | [ ] |
| Word count | Competitive with top-ranking pages for this query | [ ] |

### Technical SEO
| Element | Check |
|---------|-------|
| Page speed (LCP < 2.5s) | [ ] |
| Mobile-friendly | [ ] |
| No broken links | [ ] |
| Canonical URL set | [ ] |
| XML sitemap inclusion | [ ] |

## Phase 3 — AI Answer Engine Optimization

These elements increase the likelihood of being cited by AI systems:

### The Ski Ramp: Document Position Strategy
Research across 1.2M AI-generated responses shows the first 30% of a document receives 44.2% of all AI citations. Within paragraphs, middle sentences get cited most (53%). Front-load your strongest claims and data in the first third of the page.

### Five Characteristics of Cited Content
1. **Definitive language** — cited far more than hedged content. "X reduces Y by 40%" not "X may help reduce Y."
2. **Question-answer headers** — cited passages skew heavily toward question-formatted headers. Use "What is X?" as headers.
3. **Entity richness** — ~20% named entity density (brand names, proper nouns, specific numbers).
4. **Balanced sentiment** — ~0.47 subjectivity. Include opinions backed by evidence.
5. **Business-grade clarity** — Flesch-Kincaid grade ~16. Professional but not academic.

### Concise Answer Blocks
Write a 40-60 word direct answer paragraph immediately after each H2 question header. This is the "snippet bait" that AI systems extract.

**Pattern:**
```
## What is [topic]?

[Topic] is [clear 1-sentence definition]. It works by [brief mechanism]. Organizations use it to [primary benefit], which typically results in [measurable outcome]. [One sentence of additional context].
```

### Entity Clarity
- Define every key term on first use
- Use consistent terminology throughout (do not alternate between synonyms)
- Include "also known as" phrasing for terms with multiple names
- Link to authoritative sources when referencing data or claims

### Structured Data Implementation
Add JSON-LD schema appropriate to the content type:

| Content Type | Schema | AI Impact |
|-------------|--------|-----------|
| FAQ page | FAQPage + Question | High — direct citation source |
| How-to guide | HowTo | High — step extraction |
| Article/blog | Article + author | Medium — authority signal |
| Product page | Product + Review | Medium — comparison data |
| Definition page | DefinedTerm | High — entity knowledge |

### Source Authority Signals
AI systems prefer citing sources that demonstrate expertise:
- Include author bylines with credentials
- Cite data sources with dates ("According to [source], as of [date]...")
- Link to primary research, not other summaries
- Include "last updated" dates — freshness matters

## Phase 4 — Content Structure Optimization

Organize content for both human readers and AI extraction:

1. **Lead with the answer** — Put the key information in the first paragraph, not after a long introduction
2. **Use question-format headers** — "What is X?" and "How does X work?" match natural language queries
3. **Tables for comparisons** — AI systems extract tabular data well
4. **Ordered lists for processes** — Steps, rankings, and sequences get cited as structured answers
5. **Definition pattern** — "[Term] is [definition]" at the start of sections

## Output Format

Save to `outputs/seo-audit-[page-slug].md` with:

### SEO Scorecard
| Factor | Status | Current | Recommendation | Priority |
|--------|--------|---------|----------------|----------|
| Title tag | ✅/⚠️/❌ | [Current] | [Improvement] | [P1/P2/P3] |
| Meta description | ✅/⚠️/❌ | [Current] | [Improvement] | [P1/P2/P3] |
| H1/H2 structure | ✅/⚠️/❌ | [Current] | [Improvement] | [P1/P2/P3] |
| AI answer readiness | ✅/⚠️/❌ | [Assessment] | [Changes] | [P1/P2/P3] |
| Schema markup | ✅/⚠️/❌ | [Current] | [Addition] | [P1/P2/P3] |
| Page speed | ✅/⚠️/❌ | [LCP value] | [Fix] | [P1/P2/P3] |

### Optimized Content
Rewritten sections with inline comments explaining each change and the SEO/AEO principle behind it.

### Schema Markup
Ready-to-implement JSON-LD blocks for the page.

## Do NOT
- Keyword stuff — write for humans first, optimize for machines second
- Ignore search intent in favor of keyword volume — a page optimized for the wrong intent will not rank regardless of keywords
- Create thin content just to target a query — AI systems deprioritize low-value content
- Optimize for AI at the expense of readability — human experience is still the primary ranking factor
- Use hidden text, cloaking, or other manipulation techniques — these result in penalties from both traditional and AI search

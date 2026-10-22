---
name: brand-context-builder
description: Run a structured brand intake interview and web research to build a complete brand context document. Use when starting work on a new brand, onboarding a new client, or building foundational context for creative strategy, content, or campaigns. Run this before any creative strategy, hook writing, or campaign work.
triggers:
  - build brand context
  - brand intake
  - brand research
  - new client onboarding
  - brand context document
allowed-tools: []
---

# Brand Context Builder

Build a complete brand context document through structured interview and research. The output is a markdown file that all downstream work (creative strategy, hooks, campaigns, content) can reference.

## Writes
- `outputs/brand-context-[brand-name].md`

## Phase 1: Intake Interview

Ask all questions in a single message. Do not drip them one by one.

### Questions

**Brand basics:**
1. Brand name and website URL
2. What product(s) or services are you focused on? If multiple, which one should this context doc center on?
3. Who are the main competitors?

**What you already know:**
4. What do you know about the audience? (demographics, pain points, values, lifestyle)
5. Are there brand constraints? (regulated category, tone requirements, claims limitations)

**Creative context:**
6. Any existing messaging, campaigns, or creative direction to keep in mind?
7. What is the core problem this product solves, or the desire it fulfills?

After receiving answers, confirm before proceeding:

> "Got it. I'll use this as my starting point and research the rest. Give me a moment."

## Phase 2: Research

Work through each area. Use web search and fetch tools if available. If not, work from what the user provides and general knowledge.

### 1. Brand Story and Origin
- How did the brand start? Founder story? Mission?
- Startup, scaling, or established?
- Check the About page if accessible. Search "[brand] founder story" if web tools are available.

### 2. Product Catalog
- Key products or services and how they differ
- Hero product or primary revenue driver
- Check product/shop/services pages and site navigation if accessible.

### 3. Product Differentiation
- What makes it different from alternatives?
- Proprietary ingredient, method, technology, or approach?
- Claims and supporting evidence
- Check product detail pages, "How it works," and FAQ pages if accessible.

### 4. Competitors
- 3-5 closest competitors and how they position themselves
- What this brand does that competitors do not (and vice versa)
- Search "[brand] vs [competitor]" and "[category] alternatives" if web tools are available.

### 5. The Alternative Solution
- What was the customer doing before this product existed?
- The "old way" this product replaces (could be a behavior, DIY approach, or doing nothing)

### 6. Core Audiences
- Primary and secondary audiences based on website language, ad creative, pricing, lifestyle cues
- Combine what the user shared in Phase 1 with research findings

### 7. Customer Language
- How do customers describe this product in reviews and social posts?
- Recurring phrases, pain descriptions, and praise language
- Check review sites, social mentions, and community posts

### 8. Objections and Barriers
- Common reasons people hesitate to buy
- Price sensitivity, skepticism, switching costs
- Look for "I was skeptical but..." patterns in reviews

## Phase 3: Compile the Context Document

Structure the output as:

```markdown
# Brand Context: [Brand Name]

## Overview
[2-3 sentence summary of the brand, what it does, and why it matters]

## Brand Story
[Origin, mission, stage]

## Products
[Catalog with differentiation for each]

## Unique Mechanism
[What makes this brand different, supported by evidence]

## Competitors
[3-5 competitors with positioning comparison]

## The Alternative
[What customers did before this product]

## Audiences
### Primary
[Demographics, psychographics, pain points, desires]
### Secondary
[If applicable]

## Customer Language
[Direct quotes and recurring phrases from reviews and social]

## Objections
[What holds people back, with evidence]

## Constraints
[Regulatory, tone, claims limitations]

## Open Questions
[What could not be confirmed through research]
```

After writing, summarize the 3 most important strategic insights from the research.

## Next Step

This is Step 1 of the creative strategy pipeline. After building brand context, run creative-strategy-mapper to map messaging angles across awareness stages.

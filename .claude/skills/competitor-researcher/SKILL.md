---
name: competitor-researcher
description: Systematic competitive analysis with positioning insights. Use when evaluating market position, preparing for launches, identifying differentiation opportunities, or assessing competitive threats.
triggers:
  - competitor analysis
  - competitive research
  - analyze competitor
  - market landscape
  - how do we compare to
---

# Competitor Researcher

You produce competitive intelligence that drives decisions, not just slides. Every analysis should answer: "What should we do differently because of this?"

## Gather Context First

1. Who are the competitors to analyze? (direct, indirect, aspirational)
2. What is our product/service and who is our target customer?
3. What specific decision will this analysis inform? (positioning, pricing, features, go-to-market)
4. Check `context/` for existing positioning docs and prior analyses
5. What is our current differentiation claim?

## Research Framework

### Layer 1 — Product Intelligence

For each competitor, map:

**Features:**
- Core features vs. our offering (feature parity matrix)
- Unique capabilities they have that we lack
- Features they lack that we offer
- Quality of implementation (not just presence of feature)

**Pricing:**
- Pricing model (per seat, usage-based, flat rate, freemium)
- Tier structure and what differentiates each tier
- Published prices vs. negotiated enterprise pricing
- Free tier or trial limitations

**Technology:**
- Tech stack (languages, frameworks, infrastructure)
- Integration ecosystem (what does it connect to?)
- Platform limitations (browser-only, desktop-only, API availability)

### Layer 2 — Positioning Intelligence

**Messaging:**
- What is their primary value proposition? (check homepage headline)
- What problem do they claim to solve?
- What words do they use? (speed, security, simplicity, power)
- What do they NOT talk about? (potential weaknesses)

**Target audience:**
- Who is their ideal customer? (company size, role, industry)
- What use cases do they highlight in case studies?
- Where do they overlap with our target audience?

**Brand perception:**
- What do reviews say? (G2, Capterra, Reddit, HN, Twitter)
- What are common complaints?
- What are common praises?

### Layer 3 — Go-to-Market Intelligence

**Acquisition channels:**
- Organic search: what keywords do they rank for?
- Content: blog, podcast, YouTube, newsletter frequency and quality
- Community: Discord, Slack, forum, open source presence
- Partnerships: integrations, co-marketing, resellers

**Sales model:**
- Self-serve, sales-led, or hybrid?
- Free trial length and conversion funnel

### Layer 4 — Trajectory

- Recent feature releases and product announcements
- Job postings (what roles are they hiring for?)
- Funding rounds and investor signals
- Partnerships and acquisitions
- Public roadmap or community feature requests

## Competitive Positioning Matrix

Build a comparison table for the most important dimensions:

```
| Dimension | Us | Competitor A | Competitor B |
|-----------|-----|-------------|-------------|
| Primary audience | [who] | [who] | [who] |
| Core differentiator | [what] | [what] | [what] |
| Pricing (entry) | [price] | [price] | [price] |
| Key strength | [what] | [what] | [what] |
| Key weakness | [what] | [what] | [what] |
```

## Output Format

```
## Competitive Analysis: [market or product area]

**Date:** [date of analysis]
**Competitors analyzed:** [list]
**Decision this informs:** [what we are deciding]

### Market Overview
[2-3 sentence summary of the competitive landscape]

### Competitor Profiles

#### [Competitor Name]
**Summary:** [one paragraph overview]
**Target customer:** [who they serve]
**Pricing:** [model and range]

| Strengths | Weaknesses |
|-----------|------------|
| [strength] | [weakness] |

**Threat level:** [High / Medium / Low] — [why]
**How we win:** [specific differentiators]

### Positioning Matrix
[comparison table across key dimensions]

### Strategic Recommendations
1. [Action] — because [competitive insight supports this]
2. [Action] — because [competitive insight supports this]

### Risks to Monitor
- [What competitors could do that would hurt our position]
```

Save competitive analysis to `outputs/competitive/`.

## Do NOT

- Dismiss competitor strengths or underestimate their capabilities
- Speculate without evidence. Mark assumptions clearly.
- Focus only on feature comparison. Positioning, pricing, and go-to-market matter more.
- Produce analysis without actionable recommendations
- Assume the competitive landscape is static. Include trajectory and trend analysis.
- Copy competitor strategy. Understand it, then differentiate from it.

## Succeeds when
- Every finding links to a decision (positioning, pricing, feature, channel)
- Competitor strengths are stated as honestly as competitor weaknesses
- Trajectory is captured: where they are heading, not just where they are
- Recommendations are ranked by impact, not by ease of execution
- Assumptions are marked separately from evidence

## Fails when
- The analysis stops at a feature matrix without a positioning view
- Recommendations are generic ("we should respond") rather than specific
- The competitive landscape is treated as a snapshot, missing direction
- Competitor strengths are minimized to make your position look stronger

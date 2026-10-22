---
name: marketing-site-auditor
description: Audit a website's marketing effectiveness. Use when reviewing landing pages, homepages, or product pages for conversion potential.
triggers:
  - audit site
  - marketing audit
  - website review
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# Marketing Site Auditor

Audit a website or page across 8 dimensions using a structured scoring framework. Produce specific, actionable findings with prioritized recommendations.

## Gather Context First

1. **URL or content** — The page to audit (URL, screenshot, or pasted HTML/copy)
2. **Page goal** — What is the primary conversion action? (signup, purchase, demo request, download)
3. **Target audience** — Who is this page for? (B2B buyer, consumer, developer, non-technical user)
4. **Traffic source** — How do visitors arrive? (organic search, paid ads, social, email, direct)
5. **Known issues** — What specific concerns does the user have about the page?

## Audit Method: The 5-Second Test Framework

Before diving into detailed analysis, apply the 5-second test. Imagine landing on this page with no prior context:

- **Second 1-2:** What is this site about?
- **Second 3-4:** Is this relevant to me?
- **Second 5:** What should I do next?

If any of these questions cannot be answered in the first 5 seconds, messaging clarity is the top priority regardless of other scores.

## Audit Dimensions

### 1. Messaging Clarity (1-10)
**What to evaluate:**
- Is the value proposition immediately obvious above the fold?
- Can a visitor understand what this product/service does within 5 seconds?
- Are headlines specific and outcome-oriented, or vague and generic?
- Does the subheading explain "for whom" and "what result"?
- Is there a clear hierarchy: headline (what), subheadline (for whom/why), CTA (what to do)?

**Scoring guide:**
- 1-3: Visitor cannot determine what the product does after reading the full page
- 4-6: Product is understandable but value proposition is generic or buried
- 7-8: Clear value prop above the fold, specific to the audience
- 9-10: Immediately clear what it does, who it is for, and why it is better

### 2. CTA Strength (1-10)
**What to evaluate:**
- Is there a single, visually dominant primary CTA above the fold?
- Does the CTA use action verbs with clear outcomes ("Start free trial" vs "Submit")?
- Is the CTA repeated at logical decision points throughout the page?
- Is there a secondary CTA for visitors not ready to commit (learn more, see demo)?
- Is the CTA visually distinct from the rest of the page (contrast, size, whitespace)?

**Scoring guide:**
- 1-3: No clear CTA, or multiple competing CTAs create decision paralysis
- 4-6: CTA exists but is weak, hidden, or uses generic text
- 7-8: Strong primary CTA with good placement and copy
- 9-10: CTA is compelling, well-placed, and supported by surrounding copy

### 3. Social Proof (1-10)
**What to evaluate:**
- Are there testimonials, logos, case studies, or usage numbers?
- Is the proof specific (named people, specific results, real metrics) or generic?
- Is proof placed near decision points (CTAs, pricing, signup)?
- Do testimonials address the specific objections the target audience would have?
- Is there a mix of proof types (logos for credibility, testimonials for relatability, numbers for scale)?

**Scoring guide:**
- 1-3: No social proof or only generic "trusted by thousands" claims
- 4-6: Some proof exists but is generic, outdated, or poorly placed
- 7-8: Specific, credible proof near decision points
- 9-10: Proof is diverse, specific, addresses objections, and strategically placed

### 4. SEO Foundations (1-10)
**What to evaluate:**
- Does the page have a clear H1 with target keywords?
- Is the title tag optimized (under 60 characters, keyword-rich, compelling)?
- Is the meta description written to drive clicks (under 155 characters, includes CTA)?
- Is content structured with proper heading hierarchy (H1 > H2 > H3, no skipped levels)?
- Are images optimized (alt text, compressed, proper dimensions)?
- Is the URL clean and descriptive?

### 5. Trust Signals (1-10)
**What to evaluate:**
- Are there security badges, guarantees, or privacy statements?
- Is there a clear way to contact the company (email, chat, phone)?
- Does the design look professional and current (not outdated or broken)?
- Is there an "About" page or team page that builds credibility?
- For SaaS: is there a status page, uptime guarantee, or security documentation?
- For e-commerce: return policy, shipping info, payment security badges

### 6. Conversion Friction (1-10)
**What to evaluate:**
- How many clicks or steps from landing to completing the primary action?
- Are forms minimal (only essential fields)?
- Are there distracting elements pulling attention from the main goal?
- Is the page load time acceptable (under 3 seconds)?
- Are error states handled gracefully (form validation, 404 pages)?
- Is the mobile experience equal to desktop?

### 7. Visual Hierarchy and Design (1-10)
**What to evaluate:**
- Does the eye naturally flow from headline to supporting content to CTA?
- Is whitespace used effectively (not cluttered, not empty)?
- Is typography readable (contrast, size, line height)?
- Do images support the message or just fill space?
- Is the color palette consistent and does the CTA color stand out?

### 8. Objection Handling (1-10)
**What to evaluate:**
- Does the page address common objections before they become blockers?
- Is pricing transparent (or is the absence of pricing justified)?
- Is there an FAQ section addressing real concerns?
- Are competitive advantages made clear without being aggressive?
- Is there content for different buying stages (browsers vs ready-to-buy)?

## Output Format

Save results to `outputs/site-audit.md`:

### Executive Summary
One paragraph: overall impression, biggest strength, biggest weakness, single most impactful change to make.

### Score Card

| Dimension | Score | Key Finding |
|-----------|-------|-------------|
| Messaging Clarity | X/10 | [One-line summary] |
| CTA Strength | X/10 | ... |
| Social Proof | X/10 | ... |
| SEO Foundations | X/10 | ... |
| Trust Signals | X/10 | ... |
| Conversion Friction | X/10 | ... |
| Visual Hierarchy | X/10 | ... |
| Objection Handling | X/10 | ... |
| **Overall** | **X/10** | |

### Top 5 Prioritized Actions

| Priority | Action | Dimension | Impact | Effort | Expected Lift |
|----------|--------|-----------|--------|--------|--------------|
| 1 | [Specific change] | [Which dimension] | High | Low | [Estimate] |

### Detailed Findings
One section per dimension with specific quotes from the page, before/after copy suggestions, and implementation guidance.

## Do NOT
- Give vague recommendations ("improve the copy") — be specific about what to change and why
- Score without justification — every score needs a concrete finding
- Ignore mobile experience — a majority of traffic is mobile for most sites
- Assume the page goal — ask if unclear
- Audit design aesthetics subjectively — focus on whether design serves conversion
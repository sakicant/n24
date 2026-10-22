---
name: page-cro
description: Audit web pages for conversion rate optimization. Use when landing pages, product pages, or signup flows underperform on conversion metrics.
triggers:
  - optimize conversion
  - CRO audit
  - improve conversion rate
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# Page CRO

Audit web pages for conversion rate optimization using established CRO principles. Every recommendation must be tied to a specific principle and testable via A/B testing.

## The CRO Audit Framework

Evaluate every page through these seven lenses, in order:

### 1. Clarity (the 5-Second Test)
The visitor must understand three things within 5 seconds of landing:
- **What** is being offered?
- **Who** is it for?
- **What** should I do next?

**Audit method:** Cover the page with your hand. Reveal it for 5 seconds. Can you answer all three questions? If not, the above-the-fold content needs rework.

### 2. Value Proposition
The headline must communicate the outcome, not the product.

| Weak (product-focused) | Strong (outcome-focused) |
|------------------------|------------------------|
| "Project management software" | "Ship projects on time without micromanaging" |
| "AI-powered analytics" | "Find revenue leaks in 5 minutes" |
| "The all-in-one platform" | "Replace 5 tools with one dashboard" |

**Test:** Does the headline pass the "so what?" test? If a visitor reads it and thinks "so what?", it needs to be more specific.

### 3. Visual Hierarchy
The eye should follow a predictable path: Headline → Supporting copy → Social proof → CTA.

**Audit checklist:**
- [ ] Headline is the largest text element
- [ ] One primary CTA stands out visually (color contrast, size, whitespace)
- [ ] Supporting copy is scannable (bullets, short paragraphs, bold key phrases)
- [ ] No competing visual elements that pull attention from the CTA
- [ ] F-pattern or Z-pattern layout for left-to-right reading cultures

### 4. Social Proof Placement
Social proof must appear before or immediately adjacent to the CTA, not buried at the bottom.

**Proof hierarchy (strongest to weakest):**
1. Specific customer results with numbers ("Reduced churn by 31%")
2. Named testimonials with photos and titles
3. Customer count or user metrics ("Trusted by 10,000+ teams")
4. Logo bar of recognizable brands
5. Star ratings or review counts
6. Media mentions ("As seen in...")

**Rule:** Use at least two types of social proof. Combine quantitative (numbers) with qualitative (quotes).

### 5. Friction Analysis
Every form field, click, and decision reduces conversion. Audit each step:

| Friction Point | Measure | Benchmark |
|---------------|---------|-----------|
| Form fields | Count | 3-5 for lead gen, minimize for signup |
| Clicks to convert | Count | 1-2 for simple, 3-4 for complex |
| Page load time | LCP | Under 2.5 seconds |
| Cognitive load | Choices presented | 1 primary CTA, max 1 secondary |
| Trust barriers | Missing elements | SSL badge, privacy link, refund policy |

**Hick's Law:** Every additional choice increases decision time. If the page has multiple CTAs, identify the primary one and visually de-emphasize the rest.

### 6. Objection Handling
Map the top 3-5 objections for this page's audience and verify they are addressed:

| Common Objection | Where to Address | Method |
|-----------------|-----------------|--------|
| "Is this worth the price?" | Near pricing/CTA | ROI calculator, comparison, guarantee |
| "Can I trust this company?" | Above the fold + near CTA | Logos, testimonials, security badges |
| "Is this hard to set up?" | Before CTA | "Get started in 5 minutes" or setup video |
| "What if it doesn't work?" | Near CTA | Free trial, money-back guarantee, case study |
| "I need to ask my team" | Below CTA | Shareable summary, team pricing page |

### 7. Mobile Audit
Over 50% of web traffic is mobile. Check:

- [ ] CTA is visible without scrolling on mobile viewport
- [ ] Tap targets are at least 44x44px
- [ ] Text is readable without zooming (16px minimum)
- [ ] Forms use appropriate input types (email, tel, number)
- [ ] No horizontal scrolling
- [ ] Images load at appropriate resolution (not desktop-sized on mobile)

## CRO Principles Reference

Every recommendation must cite one of these principles:

| Principle | Definition | Application |
|-----------|-----------|-------------|
| **Hick's Law** | More choices = longer decisions | Reduce options, single primary CTA |
| **Social proof** | People follow others' behavior | Testimonials near decision points |
| **Loss aversion** | Losing hurts more than gaining | "Don't miss out" framing (honest, not manipulative) |
| **Anchoring** | First number shapes perception | Show original price before discount |
| **Cognitive load** | Mental effort reduces action | Simplify copy, reduce form fields |
| **Reciprocity** | Giving creates obligation | Free value before asking for conversion |
| **Specificity** | Specific claims are more credible | "31% increase" beats "significant improvement" |

## Output Format

Save to `outputs/cro-audit-[page-slug].md` with:

### Page Score
| Element | Score (1-5) | Principle Violated | Notes |
|---------|-------------|-------------------|-------|
| Clarity (5-sec test) | | | |
| Value proposition | | | |
| Visual hierarchy | | | |
| Social proof | | | |
| Friction | | | |
| Objection handling | | | |
| Mobile experience | | | |
| **Overall** | | | |

### Quick Wins (implement without testing)
Changes with near-zero risk based on established CRO principles:
- [Change] — Principle: [Name] — Expected impact: [High/Medium/Low]

### A/B Test Hypotheses (validate before shipping)
For each test:
```
Hypothesis: If we [specific change],
then [primary metric] will [direction] by [estimated magnitude],
because [CRO principle and reasoning].
Test duration: [Estimated days based on traffic]
```

### Detailed Recommendations
For each finding, provide: the problem, the principle it violates, the specific fix, and a before/after description.

## Do NOT
- Recommend changes without citing the CRO principle behind them
- Suggest dark patterns: fake urgency, misleading countdowns, hidden costs, forced opt-ins
- Ignore the page's primary audience and traffic source — a paid ad landing page has different rules than an organic blog post
- Treat mobile as an afterthought — audit it as a first-class experience
- Propose changes that cannot be measured — every recommendation should be testable
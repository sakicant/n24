---
name: landing-page-writer
description: Write landing page copy that converts visitors into leads or customers.
triggers:
  - landing page
  - write landing page
  - conversion copy
---

# Landing Page Writer

You write landing pages that guide visitors to one clear action. Every element on the page either moves the visitor toward the CTA or it should be removed.

## Gather Context First

Check `context/` for value propositions, ICP profiles, and competitive positioning. Ask only for what is missing:
1. **What is the one action you want visitors to take?** Sign up, book a demo, download, buy.
2. **Where is the traffic coming from?** Ad, organic, email, referral. This determines awareness level.
3. **Who is the visitor?** Persona, pain points, objections.
4. **What proof exists?** Testimonials, case studies, logos, metrics.

## Page Architecture

### Section 1: Hero (above the fold)
The hero must answer three questions in under 5 seconds:
- **What is this?** (headline)
- **How does it help me?** (subheadline)
- **What do I do next?** (CTA button)

**Headline formulas:**
- Outcome-driven: "Get [desired outcome] without [pain point]"
- Specific: "[Number]% [improvement] in [timeframe]"
- Audience-first: "For [audience] who [struggle]"

**Subheadline:** Expand on the headline. Explain the mechanism or differentiation in 1-2 sentences.

**CTA button:** Action verb + outcome. "Start free trial" not "Submit." "Get the guide" not "Download."

### Section 2: Problem (agitate the pain)
- Describe the problem in the visitor's language.
- Show you understand their world: "You have tried X, Y, and Z. None of them..."
- Make the cost of inaction concrete: "Every week you wait costs..."
- 2-3 short paragraphs or bullet points. Do not over-explain.

### Section 3: Solution (features as benefits)
- Lead with what it does for the user, then explain the feature.
- Bad: "AI-powered analytics engine." Good: "See which deals will close this quarter. Our AI scores every opportunity in your pipeline."
- 3-5 benefits maximum. Each with a headline, 1-2 sentence description, and optional icon/visual.

### Section 4: Social Proof
Layer proof in order of strength:
1. **Specific results:** "Acme Corp reduced churn by 34% in 90 days."
2. **Named testimonials:** Quote + name + title + company + photo.
3. **Logo bar:** Recognizable customer logos (6-12).
4. **Aggregate proof:** "Trusted by 10,000+ teams" or "4.8/5 on G2."

Place proof immediately after any claim that might trigger skepticism.

### Section 5: How It Works
Reduce perceived complexity to 3 steps:
1. [Action] — "Sign up in 30 seconds"
2. [Action] — "Connect your tools"
3. [Outcome] — "Get your first report"

Each step: number + headline + 1-sentence description.

### Section 6: Objection Handling
Address the top 3-5 objections as an FAQ or comparison section:
- "How is this different from [competitor]?"
- "What if it does not work for my use case?"
- "Is my data safe?"
- "What does it cost?"
- "How long does setup take?"

### Section 7: Final CTA
Repeat the primary CTA. Add a risk reversal: free trial, money-back guarantee, no credit card required. This section catches visitors who scrolled the entire page but have not acted yet.

## Copy Principles

**Specificity converts:** "37% faster" beats "significantly faster." "Setup takes 4 minutes" beats "quick setup."

**One CTA:** Every button on the page leads to the same action. Multiple CTAs split attention and reduce conversion.

**Scannable:** Most visitors skim. Use bold text for key phrases, short paragraphs (2-3 sentences), and headers that tell the story even if the body is skipped.

**Mobile first:** 60%+ of traffic is mobile. Test every section on a phone screen.

## Output Format

Save to `outputs/landing-pages/`:

```markdown
# Landing Page: [Page Name]

## Meta
- Title tag: [under 60 chars]
- Meta description: [under 155 chars]
- Target audience: [persona]
- Traffic source: [where visitors come from]

## Hero
Headline: [text]
Subheadline: [text]
CTA: [button text]

## Problem
[copy]

## Solution
[benefit 1, 2, 3 with descriptions]

## Social Proof
[testimonials, logos, metrics]

## How It Works
[3 steps]

## FAQ
[5 Q&A pairs]

## Final CTA
[headline + button text + risk reversal]
```

## Do NOT
- Include navigation links that lead away from the page. Landing pages have one exit: the CTA.
- Write the headline first. Write the body, then craft the headline to match.
- Use jargon the visitor would not use in conversation.
- Make claims without proof in the same viewport.
- Include more than one CTA action (sign up AND book a demo AND download).
- Forget the meta title and description. They affect both SEO and click-through from search.

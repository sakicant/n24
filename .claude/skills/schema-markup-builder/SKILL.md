---
name: schema-markup-builder
description: Add, fix, or optimize schema markup and structured data for better search appearance. Use when implementing JSON-LD, fixing rich snippet issues, improving search result display, or auditing existing structured data.
triggers:
  - schema markup
  - structured data
  - rich snippets
  - JSON-LD
  - search appearance
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# Schema Markup Builder

You implement structured data that earns rich search results. Clean, valid JSON-LD that Google actually uses.

## Gather Context First

1. **What type of page?** Homepage, product, article, FAQ, event, local business, SaaS?
2. **What rich results do you want?** Star ratings, FAQ dropdowns, how-to steps, product info?
3. **Current markup** — Does the page already have any schema? (Check with "view source" for JSON-LD or microdata)
4. **CMS/framework** — WordPress, Next.js, custom? (Affects implementation approach)

## Step-by-Step Process

### Step 1 — Identify the Right Schema Types

| Page Type | Primary Schema | Rich Result |
|-----------|---------------|-------------|
| Homepage (SaaS) | Organization + WebSite | Sitelinks search box |
| Product/pricing | Product + Offer | Price, availability, reviews |
| Blog post | Article + BreadcrumbList | Article card, breadcrumbs |
| FAQ page | FAQPage | Expandable Q&A in search |
| How-to guide | HowTo | Step-by-step in search |
| Company page | Organization + LocalBusiness | Knowledge panel |
| Event | Event | Event listing with date/location |
| Job posting | JobPosting | Job listing in Google Jobs |
| Review page | Review + AggregateRating | Star ratings |

### Step 2 — Build the JSON-LD

Always use JSON-LD (not Microdata or RDFa):
- Place in `<head>` or before `</body>`
- One `<script type="application/ld+json">` block per schema type
- Multiple blocks per page are fine
- Always include `@context` and `@type`

### Step 3 — Fill Required and Recommended Fields

For every schema type:
1. Check Google's structured data documentation for required fields
2. Fill ALL required fields (Google ignores incomplete schema)
3. Fill recommended fields for maximum rich result eligibility
4. Never include fields with empty or placeholder values

### Step 4 — Validate

1. Paste URL or code into Google Rich Results Test
2. Fix any errors (required fields missing, wrong types)
3. Fix warnings (recommended fields missing)
4. Check Google Search Console for structured data status after deployment

## Implementation Patterns

### Static sites (Next.js, Gatsby, Hugo)
- Add JSON-LD in the page's `<Head>` component or template
- Use variables for dynamic data (product names, prices, dates)
- Generate schema at build time for static pages

### WordPress
- Use a plugin (Yoast, RankMath) for basic schema
- Add custom JSON-LD via theme's `wp_head` hook for advanced types
- Check that plugins don't duplicate schema types

### Single-page apps (React, Vue)
- Inject JSON-LD in the document head, not in component markup
- Update schema when route changes (for client-side routing)
- Pre-render or SSR for Google to see the schema reliably

## Output Format

For each schema implementation, provide:
1. **The JSON-LD code block** ready to paste
2. **Where to place it** in the HTML
3. **Validation link** — always test at https://search.google.com/test/rich-results
4. **Expected rich result** — what should appear in search after indexing

## Do NOT
- Add markup for content that isn't visible on the page (cloaking violation)
- Use Review schema for your own product (self-serving reviews get penalized)
- Include mismatched data between markup and visible content
- Forget `@context` or `@type` declarations
- Use Microdata when JSON-LD is available and cleaner
- Add AggregateRating without real, verified reviews
- Copy schema from another site without adapting it to your content

## Principles
- Schema doesn't guarantee rich results, but missing schema guarantees you won't get them
- Test every schema block before deploying. Invalid schema is worse than no schema.
- Keep it honest. Inflated ratings or fake reviews will get your rich results revoked.
- Start with the highest-impact schema type for each page and expand from there.
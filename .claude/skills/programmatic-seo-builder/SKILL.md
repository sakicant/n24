---
name: programmatic-seo-builder
description: Design programmatic SEO strategies that generate many pages from structured data. Use when building scaled content programs like directories, comparison pages, or location-based pages.
triggers:
  - programmatic SEO
  - scaled SEO pages
  - page template SEO
---

# Programmatic SEO Builder

You design programmatic SEO strategies that generate hundreds or thousands of pages from structured data without triggering thin content penalties.

## Gather Context First

Check `context/` for existing SEO or product data. Ask for what is missing:

1. **Business type** — What does the company do?
2. **Data source** — What structured data is available (database, API, spreadsheet)?
3. **Target keywords** — What search patterns are you targeting?
4. **Competitors** — Who already ranks for these terms?
5. **Current site authority** — Domain rating, existing traffic, indexed pages
6. **Technical stack** — Static site generator, CMS, custom framework?

## When Programmatic SEO Works

Use this approach when:
- There is a repeatable search pattern with thousands of keyword variations
- You have (or can build) structured data to fill each page with unique information
- The data updates or can be enriched over time
- Each page genuinely serves a search intent

Common programmatic SEO patterns:
- "[Product] vs [Product]" comparison pages
- "Best [Category] in [City]" directory pages
- "[Tool] alternatives" pages
- "[Topic] statistics [Year]" data pages
- "[Job Title] salary in [Location]" pages
- "How to [Task] with [Tool]" tutorial pages

## Strategy Design: 6-Phase Process

### Phase 1: Keyword Pattern Discovery
- Identify the repeatable query template and its variables
- Estimate total addressable keyword volume using the variable combinations
- Validate demand: check search volume for 10-20 sample queries from the pattern
- Assess competition: who ranks for these terms today, and what do their pages look like?
- Prioritize: start with the highest-volume, lowest-competition variable combinations

### Phase 2: Data Architecture
Define the data requirements per page:

- **Required fields** — What data must exist for every page (title variables, primary content)
- **Enrichment fields** — What additional data makes pages better (stats, reviews, images)
- **Dynamic fields** — What changes over time and needs automated updates
- **Unique content fields** — What prevents the page from being thin (analysis, commentary, comparisons)

Create a data schema:
```
Page: [Pattern]
Variables: [variable_1], [variable_2]
Required: title, meta_description, h1, intro_paragraph, [primary_data]
Enrichment: [stats], [reviews], [images], [related_items]
Unique: [analysis_section], [comparison_section], [faq_section]
```

### Phase 3: Page Template Design
Design the HTML template with these sections:

1. **Title tag** — "[Variable 1] [connector] [Variable 2] — [Brand]" (under 60 characters)
2. **H1** — Match the primary keyword pattern naturally
3. **Intro paragraph** — 2-3 sentences with the primary keyword and a clear value statement
4. **Primary content section** — The structured data displayed in a useful format
5. **Unique analysis section** — Content that cannot be generated from data alone
6. **FAQ section** — 3-5 questions derived from "People Also Ask" for the keyword pattern
7. **Internal links** — Related pages, category pages, and pillar content
8. **Schema markup** — JSON-LD matching the page type

### Phase 4: Internal Linking Architecture
Design a hub-and-spoke linking model:

- **Pillar pages** — Category-level pages that link to all spokes (e.g., "Best CRMs" links to all CRM comparison pages)
- **Spoke pages** — Individual programmatic pages that link back to their pillar and to 3-5 related spokes
- **Cross-linking** — Related spokes link to each other (e.g., "Salesforce vs HubSpot" links to "Salesforce vs Pipedrive")
- **Breadcrumb navigation** — Every page shows its place in the hierarchy
- **Sitemap** — Generate an XML sitemap with all programmatic URLs

### Phase 5: Quality Guardrails
Set strict thresholds to avoid thin content penalties:

- **Minimum unique content** — At least 300 words of text that is not shared across pages
- **No empty data pages** — If a page cannot be filled with meaningful data, do not generate it
- **Duplicate detection** — Check that no two pages have more than 70% content overlap
- **Noindex threshold** — Pages with fewer than X data points or below a quality score should be noindexed
- **Regular pruning** — Remove or noindex pages that get zero traffic after 90 days

### Phase 6: Launch and Iteration
- Start with 50-100 pages, not thousands. Validate that Google indexes and ranks them.
- Monitor: crawl rate, indexed pages, impressions per page, bounce rate
- Iterate on the template based on which pages rank and which do not
- Add enrichment data over time to improve existing pages
- Expand to new variable combinations only after the initial set proves the model

## Output Format

Save to `outputs/programmatic-seo-strategy.md`:

### Strategy Overview
- Keyword pattern: [template with variables]
- Estimated pages: [count at launch] / [count at full scale]
- Target monthly traffic: [estimate based on keyword volume]
- Data source: [description]

### Page Template Specification
Full template with all sections, title patterns, and schema markup.

### Data Schema
Table of all fields with source, type (required/enrichment/unique), and example values.

### Internal Linking Map
Visual or text representation of the hub-and-spoke structure.

### Quality Checklist
- [ ] Each page has 300+ words of unique content
- [ ] No two pages exceed 70% content overlap
- [ ] Schema validates in Google's Rich Results Test
- [ ] All pages have at least 3 internal links
- [ ] Sitemap is generated and submitted
- [ ] Noindex rules are configured for thin pages

### Launch Plan
Phase 1 scope, success criteria, and iteration triggers.

## Do NOT
- Generate pages with only template text and no unique value
- Ignore Google's helpful content guidelines — thin programmatic pages get sites penalized
- Skip internal linking — orphan pages do not rank
- Build on a data source you do not control or cannot update
- Launch thousands of pages at once — start small and prove the model
- Use programmatic SEO as a substitute for genuine content — the data must provide real value to the searcher

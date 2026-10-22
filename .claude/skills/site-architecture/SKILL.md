---
name: site-architecture
description: Plan or restructure a website's page hierarchy, navigation, URL structure, and internal linking. Use when the user mentions sitemap, site structure, page hierarchy, information architecture, IA, navigation design, URL structure, or "what pages do I need." Not for XML sitemaps (technical SEO — see seo-optimizer).
triggers:
  - plan site structure
  - site architecture
  - page hierarchy
  - what pages do i need
  - restructure site
  - site navigation
  - url structure
---

# Site Architecture

Plan a website's structure: page hierarchy, navigation, URL patterns, and internal linking. The goal is intuitive for users and optimized for search and AI engines.

## Gather context first

Ask if not provided:

1. **What does the company do?** What are the top 3 site goals (conversions, SEO, education, support)?
2. **New site or restructure?** If restructure, what's broken? Which existing URLs must redirect?
3. **Site type** — SaaS marketing, content/blog, e-commerce, docs, hybrid, small business?
4. **Content inventory** — how many pages exist or are planned? Which carry the most traffic or conversion weight?

## Site type starting points

| Site type | Typical depth | Key sections | URL pattern |
|-----------|--------------|--------------|-------------|
| SaaS marketing | 2-3 levels | Home, Features, Pricing, Use cases, Resources | /features/<name>, /for/<audience>, /pricing |
| Content / blog | 2-3 levels | Home, Blog, Categories, About | /blog/<slug>, /category/<slug> |
| E-commerce | 3-4 levels | Home, Categories, Products, Cart | /<category>/<subcategory>/<product> |
| Documentation | 3 levels | Getting started, Concepts, API, Tutorials | /docs/<section>/<topic> |
| Hybrid (SaaS + content) | 3 levels | Marketing pages + /blog + /docs | mix of above |

## Design principles

- **Three-click rule** — any page reachable from home in 3 or fewer clicks for cornerstone content.
- **Topic clusters** — pillar page links to detail pages; detail pages link back. Helps SEO and signals authority.
- **URL stability** — once a URL is live and indexed, don't change it. If you must, redirect 301.
- **URLs describe content, not navigation** — `/blog/seo-for-ai-search` not `/blog/2026/04/12/post-1234`.
- **Lowercase, hyphens, no trailing slashes** (or always trailing — pick one and stay consistent).
- **No mystery meat navigation** — every nav item should be a noun the user understands without context.

## Internal linking strategy

- **Pillar -> detail**: every cornerstone page (pricing, features) should link to relevant detail pages (use cases, comparison pages, tutorials).
- **Detail -> pillar**: every detail page should link back to the pillar (and to 1-2 sibling detail pages).
- **Footer link map**: list every cornerstone page in the footer. Helps crawlers and gives every page a reachable link from home.
- **Breadcrumbs**: any page deeper than level 2 should display breadcrumbs and emit BreadcrumbList JSON-LD.

## Output format

Save to `outputs/site-architecture/<date>-plan.md` with three sections:

1. **Sitemap diagram** — a markdown tree showing every planned page and its URL.
2. **Navigation plan** — what's in primary nav, secondary nav, footer.
3. **Internal linking plan** — which pages link to which (table).

If the user is restructuring, include a fourth section: **Redirect plan** — every old URL mapped to its new home with 301 redirects.

## Common mistakes

- Over-nesting (5+ levels deep). Cap at 3 unless you have a real reason.
- Mixing URL styles (`/about-us` and `/contactUs`).
- Forgetting redirects on a restructure (kills SEO authority).
- Generic page names (`/page-1`, `/services`). Be specific.
- No internal linking strategy — pages exist but don't reinforce each other.

## Cross-references

For SEO audit of an existing site, see `seo-optimizer`. For AI search optimization, see `ai-seo-optimizer` and `geo-citability-scanner`. For directory submissions, see `directory-submissions`. For competitor comparison pages (a key destination type), see `competitor-comparison-writer`. For schema markup, see `schema-markup-builder`.

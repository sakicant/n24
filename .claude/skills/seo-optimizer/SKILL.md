---
name: seo-optimizer
description: Analyze and improve SEO across content, technical, and off-page factors. Use when auditing a page or site for search performance, fixing ranking drops, or optimizing new content before publishing.
triggers:
  - optimize SEO
  - improve rankings
  - SEO audit
  - why is my page not ranking
  - search optimization
---

# SEO Optimizer

You provide actionable SEO improvements prioritized by impact. Focus on changes that move the needle, not checklists of minor tweaks.

## Gather Context First

1. What page or site is being optimized?
2. What is the target keyword or keyword cluster?
3. What is the current ranking position (if known)?
4. Who are the top 3-5 ranking competitors for this keyword?
5. Is this a new page or an existing page that needs improvement?

## SEO Audit Framework

### 1. Search Intent Analysis (highest impact)

Before any technical work, verify the page matches what searchers actually want:

- Search the target keyword and examine the top 5 results
- What format dominates? (listicle, tutorial, product page, comparison)
- What depth do top results provide? (word count, subtopics covered)
- What questions do People Also Ask reveal?
- If the page format does not match search intent, no amount of technical SEO will help

### 2. On-Page Content SEO

**Title tag:**
- Under 60 characters (Google truncates at ~580px width)
- Primary keyword near the front
- Compelling enough to earn the click (not just keyword-stuffed)
- Unique across the site (no duplicate titles)

**Meta description:**
- 150-160 characters
- Includes primary keyword naturally
- Summarizes value proposition (why should I click this?)
- Includes a call to action when appropriate

**Heading structure:**
- One H1 per page, containing the primary keyword
- H2s for major sections, targeting related keywords
- H3s for subsections (supports featured snippet capture)
- Heading hierarchy should make sense if read as an outline

**Content quality signals:**
- First paragraph contains the primary keyword and directly addresses the search query
- Content covers the topic comprehensively (check what subtopics top competitors include)
- Unique value: what does this page offer that the top 5 results do not?
- Freshness: is the content up to date? Are dates, stats, and examples current?

**Internal linking:**
- 3-5 internal links to related pages (use descriptive anchor text, not "click here")
- Linked pages should be topically relevant
- Check that important pages are reachable within 3 clicks from the homepage

### 3. Technical SEO

**Core Web Vitals:**
- LCP (Largest Contentful Paint): under 2.5 seconds
- FID/INP (Interaction to Next Paint): under 200ms
- CLS (Cumulative Layout Shift): under 0.1
- Common fixes: optimize images (WebP, lazy loading), reduce JavaScript, preload critical resources

**Crawlability:**
- `robots.txt` allows crawling of important pages and blocks irrelevant ones
- XML sitemap includes all canonical pages and is submitted to Search Console
- No orphan pages (every important page is linked from at least one other page)
- No redirect chains (A -> B -> C should be A -> C)

**Indexability:**
- Canonical tags point to the correct version of each page
- No accidental `noindex` on pages that should rank
- Duplicate content is consolidated with canonicals or 301 redirects
- Hreflang tags for multi-language sites

**Mobile:**
- Responsive design (test at 375px width minimum)
- No horizontal scrolling
- Tap targets at least 48x48px with adequate spacing
- Text readable without zooming (16px minimum body text)

**Structured data:**
- Implement relevant schema types (Article, Product, FAQ, HowTo, BreadcrumbList)
- Validate with Google's Rich Results Test
- Structured data matches visible page content (no hidden markup)

### 4. Off-Page Signals

- Backlink profile: quantity, quality, and relevance of linking domains
- Brand mentions and citations
- Social signals (not a direct ranking factor, but drives traffic and links)

## Output Format

```
## SEO Audit: [page URL or title]

**Target keyword:** [keyword]
**Current position:** [if known]
**Search intent match:** [Yes / Partial / No — explanation]

### Priority Fixes (do these first)

1. **[HIGH]** [Issue] — [Why it matters] — [How to fix]
2. **[HIGH]** [Issue] — [Why it matters] — [How to fix]

### Improvements (meaningful but not urgent)

3. **[MED]** [Issue] — [Why it matters] — [How to fix]
4. **[MED]** [Issue] — [Why it matters] — [How to fix]

### Nice to Have (minor gains)

5. **[LOW]** [Issue] — [How to fix]

### What's Already Good
- [call out what the page does well]
```

## Do NOT

- Recommend keyword stuffing or unnatural keyword density targets
- Suggest buying backlinks or using link schemes
- Ignore search intent in favor of technical fixes
- Recommend changes that hurt readability for the sake of SEO
- Provide generic advice ("improve your content"). Be specific about what to change and why.
- Overlook the basics (title tag, meta description, H1) while chasing advanced tactics

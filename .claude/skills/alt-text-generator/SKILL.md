---
name: alt-text-generator
description: Generate descriptive, accessible alt text for images at scale by combining crawl data, page context, and image analysis. Follows WCAG 2.1 AA guidelines. Use when remediating missing alt text across a website, preparing accessibility audits, or bulk-generating metadata for image libraries.
triggers:
  - generate alt text
  - fix missing alt text
  - image accessibility
  - bulk alt text
  - alt text audit
---

# Alt Text Generator

You generate accurate, accessible alt text for images by combining crawl data with page context. Every alt text helps someone using a screen reader understand what the image communicates.

## Gather Context First

1. **Input data** — Crawl export (Screaming Frog, Sitebulb, Ahrefs), list of image URLs, or a sitemap?
2. **Scope** — Full site, specific section, or a list of specific images?
3. **Current state** — How many images have missing, empty, or generic alt text?
4. **Site type** — E-commerce (product images), blog (editorial), portfolio (creative), corporate (brand)?
5. **Tone** — Descriptive and neutral (default), brand-specific, or SEO-focused?
6. **Target keywords** — Any keywords to incorporate naturally? (Never force keywords into alt text.)

## Process

### Step 1 — Triage Images

Categorize every image into one of these types:

| Type | Action | Example |
|------|--------|---------|
| **Informational** | Write descriptive alt text | Product photo, chart, infographic, team photo |
| **Decorative** | Set `alt=""` | Background texture, divider line, spacer, purely aesthetic |
| **Functional** | Describe the action, not the image | Search icon button, social media link icon, navigation arrow |
| **Complex** | Write short alt + long description | Data chart, diagram, map, architectural drawing |
| **Text in image** | Reproduce the text verbatim | Banner with text, meme, screenshot with visible text |

Use filename, URL path, surrounding HTML context, and image dimensions to classify. Small images (< 50x50px) are often decorative. Images inside `<a>` tags are often functional. Images next to headings are often informational.

### Step 2 — Gather Page Context

For each informational image, collect:

- **Page title** and **meta description** — What is this page about?
- **Nearest heading** — What section does the image appear in?
- **Surrounding text** — What paragraph or list is the image near?
- **Image filename** — Often contains useful descriptors (e.g., `blue-running-shoes-side-view.jpg`)
- **Image dimensions** — Large hero images need more descriptive alt text than thumbnails
- **Link destination** — If the image is a link, where does it go?
- **CSS class or role** — May indicate purpose (e.g., `class="hero-banner"`, `role="presentation"`)

### Step 3 — Write Alt Text

Follow these guidelines for every alt text:

**Do:**
- Describe what the image communicates, not just what it shows
- Be specific: "Red Nike Air Max 90 running shoe, side view" not "shoe"
- Keep it concise: 125 characters or fewer for most images
- Match the surrounding content's tone and context
- For product images: include brand, product name, key visual features, variant (color/size)
- For people: describe what they're doing, not demographics (unless relevant to content)
- For charts/graphs: state the key takeaway, not the raw data

**Don't:**
- Start with "Image of," "Photo of," or "Picture of" — screen readers already announce it as an image
- Stuff keywords artificially — it hurts usability and search engines detect it
- Use filenames as alt text ("IMG_4382.jpg" is not helpful)
- Describe decorative elements — mark them `alt=""` instead
- Write differently for screen readers vs sighted users — alt text should convey the same information the visual conveys

### Step 4 — Handle Special Cases

**E-commerce product images:**
- Primary image: brand + product name + key visual feature + variant
- Alternate angles: "Back view of [product]," "Close-up of [detail]"
- Lifestyle images: "[Product] being used in [context]"

**Charts and data visualizations:**
- Short alt: "Bar chart showing Q3 revenue by region. Western region leads at $4.2M."
- Provide a `longdesc` or adjacent table for complex data

**Screenshots:**
- Describe what the screenshot shows and why it matters
- If text is visible, include the key text in the alt

**Icons in buttons:**
- Describe the function: "Search," "Close menu," "Download PDF"
- If the button also has visible text, the icon should be `alt=""`

### Step 5 — Quality Review

Before delivering, verify:

- [ ] No empty alt text on informational images
- [ ] No verbose alt text on decorative images (should be `alt=""`)
- [ ] No alt text starts with "Image of" or "Photo of"
- [ ] No alt text exceeds 150 characters without reason
- [ ] No duplicate alt text across different images (unless truly identical)
- [ ] Product images include brand and product name
- [ ] Functional images describe the action, not the visual

### Step 6 — Deliver

Output format: CSV with these columns:

| Column | Description |
|--------|-------------|
| `image_url` | Full URL of the image |
| `page_url` | Page where the image appears |
| `current_alt` | Existing alt text (if any) |
| `suggested_alt` | New alt text |
| `image_type` | informational, decorative, functional, complex, text-in-image |
| `confidence` | high, medium, low (based on available context) |
| `needs_review` | true/false (flag if context was insufficient) |

Sort by `needs_review` descending so items needing human attention appear first.

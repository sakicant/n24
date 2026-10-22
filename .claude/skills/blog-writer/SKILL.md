---
name: blog-writer
description: Write engaging, well-structured blog posts optimized for search and readability. Use when drafting articles, creating thought leadership content, writing tutorials, or producing content marketing pieces.
triggers:
  - write a blog post
  - draft article
  - create content
  - write a tutorial
  - blog post about
---

# Blog Writer

You write blog posts that earn attention, deliver value, and rank in search. Every post has a job: attract a reader, teach them something, and guide them to a next step.

## Gather Context First

1. What is the topic and target keyword (or keyword cluster)?
2. Who is the reader? What do they already know? What do they need?
3. What is the goal? (drive traffic, build authority, generate leads, educate users)
4. What search intent does the target keyword serve? (informational, commercial, navigational)
5. Are there existing posts on this topic to link to or differentiate from?
6. Check `content-library/` for past pieces on related topics — match their voice and avoid repeating angles you've already published.

## Writing Process

### Step 1 — Research and Outline

Identify the search intent and structure the post around it:

- **Informational** ("how to X", "what is X"): Tutorial or explainer format
- **Commercial** ("best X for Y", "X vs Y"): Comparison or review format
- **Problem-solving** ("X not working", "fix X"): Troubleshooting format

Build the outline:
- 1 H1 (the title)
- 4-8 H2 sections (main topics)
- H3 subsections where depth is needed
- Each H2 should answer a specific question the reader might have

### Step 2 — Write the Hook (first 2-3 sentences)

The hook determines whether anyone reads past the fold. Effective patterns:

- **Problem-agitation**: State the problem, make the reader feel it, then promise the solution
- **Surprising stat**: Lead with a number that challenges assumptions
- **Direct answer**: Give the answer immediately, then explain why (works for informational intent)
- **Story**: A brief, concrete anecdote that illustrates the problem (2-3 sentences max)

### Step 3 — Write Section by Section

For each H2 section:
- Open with the key point (inverted pyramid: conclusion first)
- Support with evidence: examples, data, code snippets, screenshots, or quotes
- Keep paragraphs to 2-3 sentences
- Use bullet points and numbered lists for scannable content
- End with a transition to the next section

### Step 4 — Write the Conclusion

- Summarize the 1-3 key takeaways (do not introduce new information)
- Include a clear call to action: what should the reader do next?
- Link to related content for readers who want to go deeper

### Step 5 — Optimize for Search

- **Title tag**: Under 60 characters, keyword near the front, compelling to click
- **Meta description**: 150-160 characters, includes keyword, summarizes value proposition
- **URL slug**: Short, keyword-rich, no stop words (`/blog/react-testing-guide` not `/blog/the-complete-guide-to-testing-in-react`)
- **Image alt text**: Descriptive, includes keyword where natural
- **Internal links**: 3-5 links to related pages on the same site
- **External links**: 1-3 links to authoritative sources (builds trust with search engines)

## Blog Post Formats

**Tutorial / How-To:**
1. What you will build or accomplish
2. Prerequisites
3. Step-by-step instructions with code/screenshots
4. Final result
5. Next steps

**Listicle / Roundup:**
1. Introduction with selection criteria
2. Each item: name, description, pros, cons, best for
3. Summary comparison table
4. Recommendation

**Thought Leadership:**
1. The current state (what everyone believes)
2. The problem with the current state (evidence)
3. A new perspective or framework
4. How to apply it (concrete examples)
5. What changes if you adopt this view

**Case Study:**
1. The challenge (before state)
2. The approach (what was done and why)
3. The results (with specific numbers)
4. Lessons learned

## Output Format

```
## Blog Post Plan

**Title:** [under 60 characters]
**Meta description:** [150-160 characters]
**Target keyword:** [primary keyword]
**Search intent:** [informational / commercial / problem-solving]
**Word count target:** [800-2000 depending on depth needed]

---

[Complete blog post in markdown with H1, H2, H3 structure]
```

Save drafts to `outputs/blog/` with the slug as filename.

## Do NOT

- Write filler paragraphs that do not add information ("In today's fast-paced world...")
- Stuff keywords unnaturally. If it sounds awkward to read aloud, rewrite it.
- Use clickbait titles that the content does not deliver on
- Write introductions longer than 3-4 sentences before getting to the content
- Use passive voice when active is clearer
- End without a call to action
- Use the words: utilize, leverage, robust, comprehensive, innovative, seamless, cutting-edge, game-changing, delve

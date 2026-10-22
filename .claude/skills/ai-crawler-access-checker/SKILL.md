---
name: ai-crawler-access-checker
description: Audit robots.txt for AI crawler allowances. Detects whether GPTBot, ClaudeBot, PerplexityBot, ChatGPT-User, Google-Extended, and Bingbot can access the site. Outputs the gap and the exact lines to add.
triggers:
  - check ai crawlers
  - robots.txt audit
  - is gptbot allowed
  - block ai bots
  - allow ai bots
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# AI Crawler Access Checker

Audit a site's `robots.txt` for which AI crawlers are allowed and which are blocked. Output the gap, the implications, and the exact diff to apply.

## AI crawler list (current as of 2026)

| Bot | Owner | Used for |
|-----|-------|----------|
| GPTBot | OpenAI | Training and ChatGPT search |
| ChatGPT-User | OpenAI | Live ChatGPT browsing on user request |
| OAI-SearchBot | OpenAI | ChatGPT Search index |
| ClaudeBot | Anthropic | Training |
| Claude-Web | Anthropic | Live Claude browsing |
| PerplexityBot | Perplexity | Perplexity search index |
| Perplexity-User | Perplexity | Live Perplexity user requests |
| Google-Extended | Google | Bard / Gemini training (separate from regular Googlebot) |
| Bingbot | Microsoft | Bing search index, also feeds Copilot |
| Applebot-Extended | Apple | Apple Intelligence training |
| CCBot | Common Crawl | Training data corpus used by many LLMs |

This list changes — AI vendors add and rename bots. Refresh from each vendor's docs if it's been more than 3 months.

## Workflow

1. **Fetch `robots.txt`** from `https://<domain>/robots.txt`. If not present, the site implicitly allows all bots.
2. **Parse the rules** by user-agent. Note that `User-agent: *` covers most bots; specific user-agents override the wildcard.
3. **Check each AI bot** in the table above against the rules. Mark allowed / blocked / unspecified.
4. **Identify the gap.** Which bots are blocked or unspecified that the user probably wants allowed?
5. **Generate the diff** — exact lines to add to `robots.txt`.

## Recommended default

Most sites that want AI search visibility should explicitly allow all the bots in the table, with one exception: if the site has paid content or proprietary research the owner doesn't want to be reproduced verbatim by AI tools, blocking GPTBot / ClaudeBot / Google-Extended (the training bots) while allowing the live-browsing bots (ChatGPT-User, Claude-Web, Perplexity-User) is a defensible middle ground.

## Output format

Save the audit to `outputs/ai-crawler-audit-<date>.md` with three sections:

```
## Current state
- robots.txt at <URL> — last fetched <date>
- Allowed: <list>
- Blocked: <list>
- Unspecified (default-allow): <list>

## Gaps
- Bot X is blocked but probably should be allowed because...
- ...

## Recommended robots.txt diff

Add the following to <site>/robots.txt:

```
User-agent: GPTBot
Allow: /
...
```
```

Print the gap count and top 3 recommended changes to the terminal.

## Common mistakes

- Forgetting that the absence of a rule means "allowed" by default. `robots.txt` is opt-out for compliant bots.
- Confusing `Googlebot` (regular search) with `Google-Extended` (Bard/Gemini training). They're different.
- Blocking all bots with `User-agent: * / Disallow: /` and then wondering why the site doesn't appear in search.

## Cross-references

For the LLM-readable site summary (different concern), see `llms-txt-builder`. For the broader optimization story, see `ai-seo-optimizer` and `geo-citability-scanner`.

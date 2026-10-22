---
name: translation-qa
description: Validate translation quality and completeness across localization files. Catches missing translations, placeholder errors, glossary violations, and formatting issues. Use when reviewing translation app output, auditing multilingual content, or validating localization files before release.
triggers:
  - translation review
  - localization QA
  - check translations
  - translation audit
  - i18n validation
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# Translation QA

You audit translations for completeness, accuracy, and consistency across languages. You work with localization files in any common format and catch the issues that automated tools miss.

## Gather Context First

1. **File format** — JSON (react-intl, next-intl, i18next), PO/POT (gettext), XLIFF, YAML (Rails), ARB (Flutter), .strings (Apple), .resx (.NET), or raw text?
2. **Languages** — Source language and target language(s). How many target languages?
3. **Source of translations** — Human translator, machine translation, translation app (e.g., Weglot, Shopify Translate), or mixed?
4. **Glossary** — Is there a terminology glossary or style guide for each language?
5. **Context** — What type of content? (UI strings, marketing copy, legal, product descriptions, help docs)
6. **Known issues** — Any reported problems? (e.g., "German translations feel too formal," "missing translations on the checkout page")

## QA Process

### Step 1 — Parse and Align

Load source and target files. Align strings by key/ID.

Report:
- Total string count per language
- Strings in source but missing from target (untranslated)
- Strings in target but missing from source (orphaned — possibly from a removed feature)
- Percentage complete per language

### Step 2 — Automated Checks

Run these checks on every translated string:

**Critical (will break the UI or functionality):**

| Check | What It Catches |
|-------|----------------|
| Missing placeholders | Variables in source (`{name}`, `%s`, `{{count}}`) absent in translation |
| Extra placeholders | Translation has variables not in source |
| Broken HTML tags | Unclosed or mismatched tags in translation |
| Format specifier mismatch | `%d`, `%@`, `%1$@` not preserved exactly |
| ICU syntax errors | Invalid MessageFormat syntax (plural rules, select statements) |

**Warning (likely errors):**

| Check | What It Catches |
|-------|----------------|
| Untranslated strings | Target text identical to source (may be intentional for brand names) |
| Missing plural forms | Language requires plural variants (e.g., "one" and "other") but only one form provided |
| Number mismatch | Numeric values in source not preserved in translation |
| URL mismatch | URLs in source not preserved or localized incorrectly |
| Email mismatch | Email addresses differ between source and translation |
| Significant length change | Translation more than 200% or less than 50% of source length (may indicate truncation or missed content) |

**Style (quality improvement):**

| Check | What It Catches |
|-------|----------------|
| Punctuation mismatch | Final punctuation differs (period, question mark, exclamation) |
| Leading/trailing whitespace | Spaces that may affect UI layout |
| Double spaces | Multiple consecutive spaces |
| Capitalization | First letter case doesn't match source pattern |
| Glossary violations | Key terms not using the approved translation |

### Step 3 — Glossary Consistency

If a glossary is provided, verify:

- Every occurrence of a glossary term uses the approved translation
- The same term is translated consistently across all strings (e.g., "Dashboard" is always "Tableau de bord" in French, not sometimes "Panneau")
- Brand names, product names, and technical terms are handled according to glossary rules (often left untranslated)

If no glossary exists, extract the most frequent terms and check if they're translated consistently. Flag inconsistencies as potential glossary candidates.

### Step 4 — Context-Aware Review

For strings where automated checks pass, do a contextual review:

- **UI fit** — Will the translation fit in the UI? German and Finnish translations are often 30-40% longer than English. Flag strings over 130% of source length for UI-constrained elements (buttons, menu items, table headers).
- **Register/Formality** — Is the tone appropriate? Formal "vous" vs informal "tu" in French. "Sie" vs "du" in German. Consistency across the product.
- **Cultural adaptation** — Dates (MM/DD vs DD/MM), currency symbols, number formatting (1,000.00 vs 1.000,00), examples and metaphors that don't translate.
- **Gender and inclusivity** — Languages with grammatical gender may need neutral alternatives or dual forms.
- **Right-to-left** — If any target language is RTL (Arabic, Hebrew), flag UI strings that may need layout mirroring.

### Step 5 — Platform-Specific Checks

**Shopify Translate & Similar Apps:**
- Check all content types: products, collections, pages, blog posts, theme strings, checkout, emails
- Flag content the app can't translate (liquid template strings, metafield content)
- Verify URL handles are localized or redirected

**React/Next.js (JSON i18n):**
- Nested keys match source structure
- Interpolation syntax matches the i18n library (`{value}` vs `{{value}}` vs `%{value}`)
- Namespace organization is consistent

**Mobile (iOS/Android):**
- Plural rules follow CLDR for each language
- String arrays have matching element counts
- Format specifiers match platform conventions

### Step 6 — Report

**Summary:**
- Coverage: X% translated across N languages
- Critical issues: N (will break functionality)
- Warnings: N (likely errors)
- Style issues: N (quality improvements)

**Per-language breakdown:**
- Completion percentage
- Issue count by severity
- Top 5 issues with example strings

**Detailed issue list:**
- String key/ID
- Source text
- Target text
- Issue type and severity
- Suggested fix (where possible)

Sort by severity, then by frequency (an error pattern affecting 50 strings is higher priority than a one-off).
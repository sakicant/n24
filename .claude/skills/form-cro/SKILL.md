---
name: form-cro
description: Optimize forms that capture leads — contact forms, demo request forms, lead-magnet capture, registration. NOT signup flows (use signup-flow-optimizer for those). For paywalls / upgrade screens use paywall-upgrade-cro. For modals/popups use popup-cro.
triggers:
  - form conversion
  - lead form
  - contact form
  - form fields
  - demo request form
  - reduce form friction
---


## Read context first

Before answering, read `context/gtm.md` if it exists. It captures the company's positioning, ICP, value propositions, voice, and competitive landscape — use it and only ask the user for details that aren't already covered.

If `context/gtm.md` is missing, suggest running the `gtm-context-builder` skill once before continuing. The output of every GTM skill is sharper when this foundation is in place.


# Form CRO

Increase form completion rates. Most forms are too long, ask for the wrong fields, or break on mobile. Fix those three things and most forms convert 30-50% better.

## Gather context

Ask if not provided:

1. **Form purpose** — lead capture, demo request, contact, support, registration?
2. **Current state** — URL or screenshot. Current fields, completion rate.
3. **What happens after submit?** — Auto-reply, sales follow-up, content delivery?
4. **Source of traffic** — organic, paid, email, referral? Different traffic has different friction tolerance.
5. **Audience** — B2B mid-market vs SMB vs consumer? Different field tolerance.

## Core principles

### Field count rules
- **1 field** (email only): highest converting (~5-15% range typical for cold traffic).
- **3-4 fields**: standard for B2B lead capture (email + name + company + role typically).
- **5-7 fields**: only for high-intent forms (demo request, contact sales).
- **More than 7 fields**: progressive disclosure or multi-step (see below).

Each extra field cuts conversion ~5-10%. Validate every field actually drives downstream value.

### Required field discipline
For each candidate field, ask: does the response actually change what we do with the lead?
- If sales will call regardless of company size, don't ask for company size.
- If the auto-responder is the same for all roles, don't ask for role.
- "Phone number (optional)" still scares away half of leads. Cut it unless it actually helps.

### Multi-step pattern
For high-friction forms (10+ fields), break into 2-3 steps:
- Step 1: micro-commitment (just email + name).
- Step 2: qualifying questions (company, role, use case).
- Step 3: anything detailed (project description, timeline).

The trick: once someone commits to step 1, they're 3-5x more likely to finish all steps than they would be on a single-page version.

### Field types and inputs
- Email: `type="email"` (mobile keyboard switches).
- Phone: `type="tel"` (mobile keyboard switches). Optional unless required.
- Number: `type="number"`.
- Date: actual date picker.
- Long text: textarea, but rarely needed for capture forms.

### Validation
- Real-time validation (on blur, not on submit).
- Specific errors ("Email format incorrect" not "Invalid input").
- Don't block submission for non-critical fields.
- Don't lose user input on validation failure.

### Mobile
- Single-column. Always.
- Fields tall enough to tap (44px minimum).
- Keyboard switches per field type (see above).
- Submit button below keyboard, not hidden behind it.
- No popups blocking the form.

### Trust signals
- Privacy reassurance near the email field ("We won't spam. Unsubscribe anytime.").
- For payment / sensitive forms: security badges (SSL, payment processor logos).
- Social proof near the submit button ("Trusted by X teams").

## Workflow

### Step 1: Audit current form
- Count fields.
- Test on mobile.
- Submit a test entry; check downstream flow.
- Pull conversion rate baseline.

### Step 2: Cut what doesn't matter
For each field, justify it. Cut what doesn't drive different downstream behavior.

### Step 3: Fix the friction
- Field types correct?
- Mobile single-column?
- Validation real-time?
- Privacy reassurance?

### Step 4: Test
A/B test the new version against the old. Need ~500 submissions per variant for statistical significance for typical 5%-baseline forms; more for higher baselines.

### Step 5: Iterate
After winner, identify the next-largest conversion barrier. Test again. Compounding wins.

## Output format

Save audit + recommendations to `outputs/form-cro/<form-slug>-<date>.md`:

```
## Form CRO audit: <form name>
- URL: <url>
- Current conversion: <rate>
- Audience source: <source mix>

## Findings
1. <issue> — <evidence> — <fix>
2. ...

## Recommended new form
[Field list with justification per field]

## A/B test plan
- Variant A: current
- Variant B: <change>
- Hypothesis: <expected lift>
- Minimum runtime: <duration to reach significance>
```

## Common mistakes

- Asking for fields "in case sales needs them" without sales actually using them.
- Multi-step forms that don't actually save anything (just paginate the same questions).
- Validating on submit instead of on blur.
- Ignoring mobile.
- A/B testing too small a sample and calling a winner prematurely.

## Cross-references

For signup forms specifically (different conversion dynamics), use `signup-flow-optimizer`. For paywalls/upgrade screens, use `paywall-upgrade-cro`. For modals and popups, use `popup-cro`. For broader page-level CRO, use `page-cro`. For lead magnets feeding into the form, use `lead-magnets`.

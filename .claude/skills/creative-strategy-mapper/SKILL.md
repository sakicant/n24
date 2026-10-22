---
name: creative-strategy-mapper
description: Strategic framework for mapping pain/persona intersections, messaging angles, and awareness stages into a creative strategy matrix. Use when planning campaigns, defining messaging for a new audience, organizing creative strategy, or when a product needs structured messaging across the full funnel.
triggers:
  - map creative strategy
  - messaging angles
  - creative strategy matrix
  - campaign strategy
  - awareness stage mapping
  - pain persona mapping
allowed-tools: []
---

# Creative Strategy Mapper

Map the strategic landscape for a brand's creative work. This produces a matrix of pain points, personas, messaging angles, and awareness stages that all downstream execution (hooks, ad concepts, content) builds on.

## Writes
- `outputs/creative-strategy-[brand-or-project].md`

## Context Scan

Check for:
- Brand context documents in `outputs/` or `context/`
- Existing ICP definitions
- Prior VoC analyses or review mining outputs
- Competitor research

If no brand context exists, recommend running brand-context-builder first.

## Step 1: Define the Primary Anchor

**Default: use PAIN as the primary anchor.** Every product solves a problem or fulfills a desire. If it does not, there is no value proposition to message around.

Exception: use DESIRE for aspirational or luxury products where the functional problem is minimal.

### Why Pain Comes First

Demographic targeting alone does not communicate value.

**Weak:** "Hey busy moms, check out this water bottle."
**Strong:** "Need a water bottle that does not leak all over your car while you are running errands with kids?"

The pain or desire is what makes the message land. The demographic is who you say it to.

## Step 2: Map Pain Points or Desires

List 4-8 distinct pain points (or desires) the product addresses. For each:

1. **Name it** in 3-5 words
2. **Describe the lived experience** of someone with this pain (not the marketing version, the real version)
3. **Rate intensity** (high / medium / low) based on how much it affects daily life
4. **Note evidence source** (reviews, interviews, research, assumption)

## Step 3: Map Personas to Each Pain

For each pain point, identify 1-3 personas who experience it differently. A persona is not a demographic. It is a life context that changes how the pain manifests.

For each persona:
- **Who they are** (life stage, identity, situation)
- **How this pain shows up for them specifically**
- **What they have already tried**

## Step 4: Define Messaging Angles

At each pain x persona intersection, write a messaging angle. A messaging angle is the core truth that makes someone stop and pay attention. It is not a tagline. It is the insight that drives all creative for this intersection.

Format: one sentence that a stranger would find interesting or surprising.

## Step 5: Map Across Awareness Stages

For each messaging angle, define the approach at each stage:

| Stage | Who They Are | Strategy |
|-------|-------------|----------|
| **Unaware** | Does not know they have a problem | Introduce the pain through a relatable situation. No product mention. |
| **Problem-Aware** | Knows the problem, no solution yet | Agitate the pain. Make them feel understood. Build urgency. |
| **Solution-Aware** | Comparing options | Differentiate. Call out what has failed them before. |
| **Product-Aware** | Knows your product, has not bought | Remove objections. Social proof. Counter the reason they have not acted. |
| **Most-Aware** | Ready to buy | Direct offer, urgency, guarantee. CTA-forward. |

## Step 6: Compile the Matrix

Output a table:

| Pain/Desire | Persona | Messaging Angle | Unaware | Problem-Aware | Solution-Aware | Product-Aware | Most-Aware |
|---|---|---|---|---|---|---|---|

Then highlight the 3-5 highest-priority intersections based on:
- Pain intensity
- Audience size
- Available evidence (real language > assumptions)
- Current creative gaps (what are you not saying yet?)

## Using the Matrix

This matrix feeds directly into execution:
- **Hook writing**: pick an intersection and awareness stage, write hooks for it
- **Ad concepts**: pick an intersection, choose a creative mechanic that delivers the messaging angle
- **Content strategy**: map content topics to intersections and stages
- **Campaign planning**: group intersections into campaign themes

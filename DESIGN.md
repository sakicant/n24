---
name: N24 Real Estate
description: Property on the Šibenik coast, from Vodice to Rogoznica, drawn as one coast road.
colors:
  navy: "#13264B"
  navy-2: "#22365C"
  red: "#D2252E"
  red-dark: "#B01E26"
  sand: "#F6F3EE"
  sand-2: "#ECE6DC"
  ink: "#1A1A1A"
  ink-2: "#4A4F5A"
  line: "#D9D2C6"
  sea: "#DCE2EA"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, Times New Roman, serif"
    fontSize: "clamp(2.375rem, 4.6vw, 4.25rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, Times New Roman, serif"
    fontSize: "clamp(2rem, 3.6vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.01em"
    fontFeature: "lnum, tnum"
  title:
    fontFamily: "Cormorant Garamond, Georgia, Times New Roman, serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.15
  lead:
    fontFamily: "Manrope, Segoe UI, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "Manrope, Segoe UI, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "lnum, tnum"
  label:
    fontFamily: "Manrope, Segoe UI, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "lnum, tnum"
  button:
    fontFamily: "Manrope, Segoe UI, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.01em"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "28px"
  lg: "40px"
  gutter: "clamp(16px, 4vw, 40px)"
  section: "clamp(56px, 8vw, 104px)"
  wrap: "1240px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.red-dark}"
  button-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.sand}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "46px"
  button-navy-hover:
    backgroundColor: "{colors.navy-2}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "46px"
  button-line-hover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.sand}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.sand}"
  listing-card:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  listing-photo-tag:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.sand}"
    padding: "6px 10px"
  nav-link:
    textColor: "{colors.navy}"
    padding: "6px 0"
  band-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.sand}"
  band-sand-2:
    backgroundColor: "{colors.sand-2}"
    textColor: "{colors.ink}"
---

# Design System: N24 Real Estate

## Overview

**Creative North Star: "The Coast Road"**

N24 is a local agency on one stretch of Adriatic coast, and the system is drawn the way a good local map is drawn: a warm sand page, navy line work, and a single red mark for where you are. The signature is the coast road itself, a navy line with square km-stones for the eight places from Vodice to Rogoznica; the empty red square of the logo becomes the "you are here" frame that slides along it. Everything else is quiet so that the road, the photographs and the prices can carry the page.

Density is calm and editorial rather than portal-like: generous section padding, three-column listing grids, hairline rules instead of boxes, and full-bleed photography cropped into square-cornered frames. Type is a two-voice pairing taken straight from the logo: Cormorant Garamond for names and headlines, Manrope for every functional word and number. Figures are lining and tabular throughout, because distances, plot sizes and prices are the proof of local knowledge.

The world refuses the real-estate category default: no photo hero with a floating search box, no featured carousel, no drop shadows, no rounded cards. Photography on the current build is temporary placeholder material until the client reshoots; the frames, ratios and crops are the system, not the pictures in them.

**Key Characteristics:**
- Sand ground, navy line work and headings, ink body text, red only for what matters now.
- The coast road as navigation: a single navy line, square stops, a red frame for the selected place.
- Square corners everywhere; the logo's empty square frame is the recurring geometry.
- Flat surfaces; depth comes from tonal bands (sand, sand-2, navy) and 1px hairlines.
- Cormorant Garamond display over Manrope text, tabular lining figures for every number.

## Colors

A warm sand-and-navy coastal palette with one disciplined red, pinned by the client's logo.

### Primary
- **Harbour Navy** (navy): the system's structural colour. Headings, nav links, the coast-road line and stop outlines, the selected chip, the secondary action button, the Sell band and the footer. On sand it reads at 13.5:1.
- **Deep Harbour** (navy-2): hover state for navy buttons only.

### Secondary
- **Signal Red** (red): the logo frame and "what matters now": the selected road stop and its sliding marker, listing prices, the primary contact action (WhatsApp, Sell with N24), the mobile WhatsApp bar, the focus ring, and the frame around Tomislav's portrait. White on red is 5.2:1; red text on sand is 4.7:1, so red text stays at 1.0625rem/600 or larger (prices, selected stop names).
- **Fired Red** (red-dark): hover state for red buttons only.

### Neutral
- **Dalmatian Sand** (sand): the page ground, header, chips' ground and the text colour on navy surfaces.
- **Dry Stone** (sand-2): the alternate band (Primošten Resort section) and the ground behind images while they load.
- **Ink** (ink): body text.
- **Slate Ink** (ink-2): secondary text: ledes, meta lines, counts, km labels, descriptions (7.4:1 on sand, 6.6:1 on sand-2).
- **Dry-Wall Hairline** (line): every 1px divider and the resting chip border. Decorative only; never carries meaning by itself.
- **Shallow Sea** (sea): the wash under the coast-road line, at 0.7 opacity and faded out with a vertical mask. Not used elsewhere.

### Named Rules
**The Red Means Now Rule.** Red marks the logo, the current selection, the price and the one primary action in view. If two red things compete in one viewport for different reasons, one of them is wrong. Red is never a background band, a heading colour or decoration.

**The Navy Line Rule.** Navy draws: the road, the stop outlines, the rules above lists, the outline offset around a feature photo. Structure is a navy or hairline stroke, not a filled panel.

## Typography

**Display Font:** Cormorant Garamond (with Georgia, Times New Roman, serif), weights 500 and 600.
**Body Font:** Manrope (with Segoe UI, Arial, sans-serif), weights 400, 500 and 600.

**Character:** The logo's own pairing: a sharp, high-contrast Garamond for names of places, properties and services, against a clean geometric grotesque that does all the working text. The serif speaks; the sans informs.

### Hierarchy
- **Display** (600, clamp(2.375rem, 4.6vw, 4.25rem), 1.08, -0.02em): the page headline only, max 19ch, balanced wrap.
- **Headline** (600, clamp(2rem, 3.6vw, 3rem), 1.08): section titles. Feature sections (Resort, Sell, Contact) scale up to clamp(2.25rem, 4.2vw, 3.5–4rem) on the same face.
- **Title** (600, 1.5rem, 1.15): listing card titles, service names, fact values, mobile-menu links. Road stop names use the same face at 1.25rem; Cormorant never goes smaller than that.
- **Lead** (400, 1.0625rem, 1.65): intro paragraphs in Slate Ink, max 34ch beside the headline. A serif lead (500, clamp(1.375rem, 2vw, 1.75rem), 1.3, navy) is used once per feature section.
- **Body** (400, 1rem, 1.65): running text, max 40–52ch.
- **Label** (500, 0.8125rem): meta lines (area · type), counts, definition terms, footer column titles (600, 0.02em). Km labels drop to 0.6875rem. Sentence case; no uppercase tracking outside the logo.
- **Button** (600, 0.9375rem, 0.01em): buttons and the nav.

### Named Rules
**The Tabular Figures Rule.** Every number is lining and tabular (`font-variant-numeric: lining-nums tabular-nums`, set on body and headings). Prices, km, m² and counts must line up and never use old-style figures, even inside Cormorant.

**The Two Voices Rule.** Cormorant names things (places, properties, services, people); Manrope says everything else, including every button, label, price and form field.

## Layout

A single centred column of max 1240px with a fluid side gutter (clamp(16px, 4vw, 40px)); photography breaks out to full bleed. Sections stack as horizontal bands with vertical padding of clamp(56px, 8vw, 104px) (listings and services run slightly tighter or looser within the same clamp family). Two-column feature rows use asymmetric fractional grids (8:3 hero copy, 5:6 resort, 6:5 sell, 4:7 services and contact) with clamp(32px, 6vw, 88px) gaps and collapse to one column under 860px.

The listing grid is 3 columns with 40px row and 28px column gaps, 2 columns under 1080px and 1 under 600px. The spacing rhythm is 8 / 16 / 28 / 40px inside components.

Breakpoints: 1080px (desktop nav becomes a menu button, grid to 2 columns), 860px (single-column rows, coast road becomes a horizontally scrolling ribbon at a fixed 820px width with snap, chips scroll in one row, a fixed Call / WhatsApp bar appears at the bottom), 600px (single-column grid and service rows).

### Named Rules
**The One Road Rule.** The coast road is drawn edge to edge in its true order (Vodice, Srima, Šibenik, Brodarica, Žaborić, Grebaštica, Primošten, Rogoznica), positioned by real km. On narrow screens it scrolls; it is never reordered, wrapped or turned into a dropdown.

## Elevation & Depth

Flat. There are no box shadows anywhere in the system. Depth comes from three tonal grounds (sand for the page, sand-2 for an alternate band, navy for the Sell band and footer), from 1px hairlines in Dry-Wall Hairline, and from photography. The sticky header separates with a hairline and a 96% sand ground, not a shadow. A feature photo may carry a 1px navy outline offset by 14px, a drawn frame rather than a lift.

### Named Rules
**The Hairline Rule.** Separation is a 1px rule or a change of ground. If a surface seems to need a shadow, give it a hairline or move it onto a different band instead.

## Shapes

Square, always: 0px radius on buttons, chips, cards, images, tags and the menu button. The logo's empty square frame is the recurring geometry: road stops are 14px squares with a 2px navy border, the selected-stop marker is a 34px square with a 3px red border, and the portrait frame is a 3px red square border. Images fill 4:3 (cards) or 4:5 (portrait, feature) frames with `object-fit: cover`. Lines are 1px, with 2px reserved for the road and stop outlines and 3px for red frames.

### Named Rules
**The Square Frame Rule.** Selection and emphasis are shown with a square frame, never with a pill, a circle or a rounded corner.

## Components

### Buttons
Plain, square and confident; colour does the work.
- **Shape:** square (0px), 46px min height, 22px side padding, 8px icon gap.
- **Primary (red):** for the single primary contact action in view: WhatsApp, Message Tomislav, Sell with N24.
- **Navy:** for search and browse actions (Show N properties, See the units).
- **Line:** navy 1px outline on transparent, fills navy on hover; the secondary option beside a red button.
- **Hover / Focus:** background-colour change over 0.2s; focus is the global 2px red outline at 3px offset. No lift, no shadow.
- **Text link:** navy 600 with a 1px underline and a short trailing rule that extends from 60% to full width on hover.

### Chips
- **Style:** 40px high, 16px padding, transparent with a 1px hairline border, navy Manrope 500 at 0.875rem.
- **State:** hover darkens the border to navy; selected (`aria-pressed="true"`) fills navy with sand text. On mobile they sit in one horizontally scrolling row.

### Cards / Containers
- **Corner Style:** square (0px).
- **Background:** none; the card sits directly on the page ground. The 4:3 photo frame has a sand-2 ground while loading.
- **Shadow Strategy:** none (see Elevation & Depth). Hover scales the photo to 1.035 over 0.8s inside its frame and underlines the title.
- **Border:** a single hairline above the facts/price row.
- **Internal structure:** photo, then meta label (area · type), Cormorant title (1.5rem), then facts left and price right in Signal Red 600. "Price on request" drops to navy. An optional navy tag sits flush in the photo's top-left corner (e.g. Primošten Resort). Land listings without a photo show a navy line-drawn plot plan with the plot outlined in red.

### Navigation
- **Desktop:** sticky sand header, 72px tall, logo left, Manrope 500 navy links at 0.9375rem with a 1px navy underline on hover, red WhatsApp button at the right end.
- **Mobile (under 1080px):** a 46px square menu button with a hairline border; the three-bar icon morphs to a cross. The open menu lists links in Cormorant 1.5rem with hairlines between. Under 860px a fixed bottom bar splits Call (sand) and WhatsApp (red).

### Coast Road (signature)
The page's search. A navy 2px line over a masked Shallow Sea wash, eight square stops placed by km, labels alternating above and below the line (Cormorant name, Manrope count), km labels in 0.6875rem Slate Ink, and end labels to Zadar and Split. Hover fills the stop navy and underlines its name; selecting a stop turns it red, and a 34px red square frame slides to it over 0.55s on the expressive ease. Stops with no listings grey out. Selection filters the listing grid in place with a 0.25s opacity crossfade and writes `?area=&type=` to the URL.

### Ruled Lists
Services and contact details are ruled lists, not cards: a navy 1px top rule, hairline rows, Cormorant name with Manrope description (services) or navy 600 value with a Slate Ink label (contact). Service rows nudge 10px right on hover; contact rows turn red on hover.

## Do's and Don'ts

### Do:
- **Do** keep the page on Dalmatian Sand (#F6F3EE) with navy (#13264B) headings and line work, and ink (#1A1A1A) body text.
- **Do** spend red (#D2252E) only on the logo, the current selection, prices and the one primary contact action in view.
- **Do** keep every corner square (0px) and show selection with a square frame that echoes the logo.
- **Do** set every number with lining tabular figures, in Manrope.
- **Do** separate with 1px hairlines and tonal bands instead of shadows.
- **Do** use Cormorant Garamond 600 for names and headlines at 1.25rem or larger, and Manrope for all functional text.
- **Do** crop photography into 4:3 or 4:5 square-cornered frames or full-bleed bands, with descriptive alt text.

### Don't:
- **Don't** use rounded corners, pills or circles on buttons, chips, cards or images.
- **Don't** add box shadows or floating panels; the system is flat.
- **Don't** use red as a background band, a heading colour or decoration.
- **Don't** put a search box floating over a hero photo or add a featured carousel; the coast road is the search.
- **Don't** reorder, wrap or collapse the coast road; on phones it scrolls.
- **Don't** add uppercase letterspaced labels or kickers above headings; the only letterspaced caps are REAL ESTATE inside the logo.
- **Don't** recolour or redraw the logo: red empty square frame, N24 in Cormorant Garamond, REAL ESTATE in letterspaced Manrope (brand/logo-en-horizontal.svg, brand/logo-en-reversed.svg on navy).

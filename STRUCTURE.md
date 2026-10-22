# N24 site structure

Hub and spoke, like taxisibenik.hr: hubs target broad searches and link down to
spokes that target one specific search. English first at the site root;
Croatian and German later under `/hr/` and `/de/` with hreflang, same as
taxisibenik.

The key difference from taxisibenik: listings come from the database, not from
hand-written pages. Every listing is tagged with an **area**, a **type**, a
**deal** (sale / long-term rent) and optionally **Primošten Resort**. Area
pages, type pages and the resort page fill themselves from those tags. A
listing is entered once in the admin and shows up on every page it belongs to.

## Tier 1: Homepage

- `/` : "N24 Real Estate". One search bar (area, type, max price), featured
  listings, buy / sell entry points, the 8 areas, Primošten Resort, services
  teaser, Tomislav, contact.

## Tier 2: Hubs

| Hub | URL | Targets |
| --- | --- | --- |
| Properties for sale | `/properties-for-sale/` | real estate for sale Šibenik / Dalmatia |
| Areas | `/areas/` | real estate Šibenik riviera, links to all 8 area pages |
| Primošten Resort | `/primosten-resort/` | Primošten Resort apartments for sale |
| Long-term rentals | `/long-term-rentals/` | long term rent Šibenik |
| Services | `/services/` | real estate services Croatia |

## Tier 3: Spokes

### Area pages (main SEO targets)

The 8 areas we rank for first. More can be added later with no structural change.

| Area | URL |
| --- | --- |
| Rogoznica | `/real-estate-rogoznica/` |
| Primošten | `/real-estate-primosten/` |
| Žaborić | `/real-estate-zaboric/` |
| Grebaštica | `/real-estate-grebastica/` |
| Brodarica | `/real-estate-brodarica/` |
| Srima | `/real-estate-srima/` |
| Vodice | `/real-estate-vodice/` |
| Šibenik | `/real-estate-sibenik/` |

Each area page ranks for BOTH land and houses / villas / apartments:

- Title pattern: `Real Estate <Area> | Houses, Villas & Land for Sale | N24`.
- H1 "Real estate in <Area>", with H2 sections that name each type
  ("Houses and villas for sale in <Area>", "Land for sale in <Area>", ...).
  Those headings, plus the local text, are what let one page rank for
  "land <area>" as well as "houses for sale <area>".
- All listings in that area shown together, with type chips on top
  (All · Houses · Apartments · Villas · Land · New builds). Chips filter in place,
  no page reload, and are reflected in the URL (`?type=land`) so a filtered
  view can be shared. The filtered URLs canonicalise to the main area page.
- Local guide below the listings: location, beaches, distances (Split and
  Zadar airports, Šibenik), what property and land cost there, building rules
  worth knowing, FAQ.
- If an area has no active listings of some type, that chip is hidden. If the
  area has none at all: nearby listings plus the "sell your property here" form.

Primošten page special case: the resort's 100+ units would bury the other
Primošten listings. The resort appears there as ONE featured card
("Primošten Resort, 100+ units, from €X") linking to `/primosten-resort/`,
and its units appear in the list only when the "New builds" chip is chosen.

### Type pages (whole region)

- `/properties-for-sale/houses/`
- `/properties-for-sale/apartments/`
- `/properties-for-sale/villas/`
- `/properties-for-sale/land/` (most important: land investment is N24's specialty)
- `/properties-for-sale/new-builds/`

### Primošten Resort

- `/primosten-resort/` : the resort's own page. Story, photos, map, amenities,
  a unit table for all 100+ units (building, floor, size, bedrooms, price,
  status: available / reserved / sold) with filters, enquiry form.
- Its units are normal listings tagged "Primošten Resort", so they also appear
  in the general search, on `/properties-for-sale/new-builds/` and (via the
  featured card) on `/real-estate-primosten/`.
- primosten-resort.hr is the owner's official site and will win searches for
  the bare name. Our page targets the buying searches around it ("Primošten
  Resort apartments for sale", "buy apartment Primošten") and must use our own
  text and photos, not copies from the official site (duplicate content would
  hurt both sites).

### Listing pages

- `/property/<ref>-<short-slug>/`, for example
  `/property/n24-105-stone-house-sea-view-primosten/`.
- Breadcrumb: Home > Real estate Primošten > listing. Links back to its area,
  type and resort pages.
- Gallery, key facts, description, map, distances, enquiry form, call and
  WhatsApp buttons, similar listings.

### Service pages

- `/services/investment-consulting/`
- `/services/land-consolidation/`
- `/services/project-management/`
- `/services/architecture-and-engineering/`
- `/services/property-maintenance/`

### Buying guide (phase 2)

- `/buying-property-in-croatia/` : process, taxes and fees, foreigners' rules
  (EU vs non-EU), buying land vs a house, how N24 helps.
- Worth it for SEO: foreigners search this before they search for a place, it
  earns links, and it feeds visitors into the 8 area pages. Built after the
  core pages are live, not before.

## Utility pages

- `/sell-your-property/` : owner form (location, type, size, asking price, photos, contact).
- `/about/` : the agency since 2010, Tomislav Plenča with photo.
- `/contact/`
- `/privacy-policy/`, `/terms/`, cookie notice.
- Hidden admin panel (unlisted URL, password protected).

## Navigation

Buy · Rent · Sell · Areas · Primošten Resort · Services · About · Contact,
with call and WhatsApp always visible (sticky bar on mobile).

## Search UX

- Default: one bar (area, type, max price) and results right away.
- Results page: a few chips (type, price, bedrooms, sea view), "More filters"
  for size, plot size, distance to sea, etc.
- Filters live in the URL so results can be shared and bookmarked.

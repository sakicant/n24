# N24 website brief

Living record of what the client wants and what we have decided. Update it as
decisions are made.

## The agency

- Legal name: Nekretnine 24 d.o.o. (short: N 24 d.o.o.). In real estate since 2010.
- Address: Bože Peričića 26, 22000 Šibenik, Croatia.
- Director and main salesman: Tomislav Plenča (profile with photo on the site).
- Phone / WhatsApp: +385 95 700 7001. Email: nekretnine24@n24.hr.
- Domains: main www.realestatecroatia-n24.com (the domain the old site ranks on); n24.hr redirects to it. A .hr version of the long domain does not exist.
- Area: Šibenik and the coast, mainly between Split and Zadar.
- Business: sales, long-term rentals, new builds, land investment.
- Specialties (services): investment consulting and analysis, land consolidation
  (okrupnjavanje zemljišta: cadastral, ownership and legal analysis, contacting
  owners and heirs), project management, architecture and engineering partners,
  property maintenance.
- Buyers: locals and foreigners.

## Listings

- About 100 active listings.
- Listings are posted ONLY on this site: custom admin panel to add, edit and
  remove listings with as many details as possible.
- Search and filters: yes, but keep it light. A great default experience with
  few clicks; deeper filters only for those who want them.

## Features

- Property search, per-property enquiry, call, WhatsApp.
- "Sell with N24": form for owners offering a property.
- "Buy": leads into the listings search.
- Primošten Resort (official name, 100+ units) at `/primosten-resort/`, no
  "new developments" section. Owner's official site is primosten-resort.hr;
  Tomislav is the owner's agent and this page is his sales channel. Units live
  in the main listings database and also appear in the general search.
- SEO targets (phase 1): 8 area pages: Rogoznica, Primošten, Žaborić,
  Grebaštica, Brodarica, Srima, Vodice, Šibenik. Each ranks for land AND
  houses/villas, lists every listing in the area with type filter chips.
- Property types: houses, apartments, villas, land, new builds.

## Languages

- English first, only English until the site is done. Croatian and German later.

## Design direction

- References: https://regent.hr/ and https://sothebysrealty.hr/hr/
- Current brand: navy + signal red, logo is a red square frame with "N 24".
  Logo and colours may change: we want a more modern version. Mixing current
  colours with Leila house colours (sand, bronze, ink, Cormorant Garamond) is fine.

### Decided (2026-10-22)

- Logo: concept A, "the frame, refined". An empty red square frame (a window /
  plot boundary), the "N24" wordmark in Cormorant Garamond beside it, and
  "REAL ESTATE" letterspaced underneath (changed from "REAL ESTATE CROATIA").
  That line is in the page language: NEKRETNINE (hr), IMMOBILIEN (de).
  Wordmark is "N24" with no space.
- Homepage / general title: "N24 Real Estate".
- SEO model: hub and spoke like taxisibenik.hr, with one page per area
  (Primošten, Vodice, Brodarica, Žaborić, ...) listing that area's listings.
  See STRUCTURE.md.
- Palette 1, "navy and red, refined":
  - navy `#13264B` (primary: headings, header, footer)
  - red `#D2252E` (accent only: logo frame, main buttons, prices)
  - sand `#F6F3EE` (page background)
  - ink `#1A1A1A` (body text)
- Fonts (proposed): Cormorant Garamond for headings (shared with Leila),
  Manrope for body text, filters and prices.

## Hosting

- Preview on Vercel during the build.
- Production: same hosting as the Leila house site (same owner), on its own domain.

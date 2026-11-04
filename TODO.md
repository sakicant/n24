# N24 to do

Open items for the website. Tick them off as they are done.

## Content
- [ ] Tomislav: portrait photo and a few real details for the About page and the homepage intro; he should confirm the drafted bio.
- [ ] Photos: new shoot for the hero and all listings (current ones are temporary).
- [ ] Area pages: Tomislav to read and confirm the local texts for all 8 places.

## Links
- [ ] Footer social links still to add: Facebook, TikTok, Google Business Profile (now "#", marked data-todo in src/partials/footer.html). Instagram and LinkedIn are done.

## Legal
- [ ] Tomislav (ideally with his lawyer or accountant) to read the Privacy Policy and Terms of Use.

## Before publishing
- [ ] Upload api/check-webp.php to the host, open it once, confirm "RESULT: OK", then delete it.
- [ ] Test api/lib/images.php on the host with a real phone photo (JPG and iPhone HEIC): three WebP sizes, upright, no GPS data.
- [ ] Admin upload form uses assets/js/image-prep.js (shrinks to WebP in the browser) and saves through n24_save_listing_image().
- [x] Sample listings removed; 9 new listings added (N24-301 to N24-309) with tools/add_listings_nov2026.py (2026-11-04).
- [ ] Murter (Tisno, N24-251) and Prvić (N24-304) have no area page: they show in search only.
- [ ] Žaborić N24-301: description says renders were used; replace with real photos when available.
- [x] "Preview: ... sample listings" notes removed.

## Listings to confirm with Tomislav
- [ ] N24-107 (Primošten apartment with pool): the card says 63 m², the old description says 136.39 m² with the pool. Which is right?
- [x] N24-276 is the Olive Grove villa plot with building permit (only villa of the three for sale), €310,000.
- [x] N24-251 Tisno: filed under Murter, price €520,000, 184 m², new photos.
- [ ] Primošten Resort: list of units (building, floor, size, bedrooms, price, status) for the table on /primosten-resort/.

## Redirects (.htaccess)
- [ ] Point realestatecroatia-n24.com and n24.hr at the new hosting (main domain: www.realestatecroatia-n24.com; n24.hr redirects to it).
- [ ] After launch: test a few old URLs on the live server (e.g. /en/properties/modern-villa-primosten, /hr/kontakt) and submit the new sitemap in Google Search Console.
- [ ] When the Croatian version exists: point the /hr/ redirects at the /hr/ pages and change them from 302 to 301.
- [ ] FAQ page: the old /en/faq and /hr/pitanja-i-odgovori rank in Google (foreign buyers, taxes, agency fee). Build a FAQ page and point both there (now they go to /about/).

## Build
- [ ] Backend: PHP + MySQL admin panel, real listings, contact form email.
- [ ] Croatian and German versions: empty pages already exist under /hr/ and /de/ (built by tools/build.mjs, noindex, not in the sitemap, slugs still English). When the English site is final: translate, give each page its local slug, add hreflang and a language switcher, add them to the sitemap, and remove noindex.
- [ ] Analytics (then switch on the cookie banner in assets/js/site.js).

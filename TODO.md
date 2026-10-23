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
- [ ] Add the ~20 listings: photos through tools/photos.py (WebP in 640/1200/1920), details into the listings data; remove the sample listings.
- [ ] Remove the "Preview: ... sample listings" notes.

## Listings to confirm with Tomislav
- [ ] N24-107 (Primošten apartment with pool): the card says 63 m², the old description says 136.39 m² with the pool. Which is right?
- [ ] N24-276: listed as Land (building plot with a villa design); the old site called it a Villa.
- [ ] N24-251 is in Tisno, outside the 8 areas: it shows in search but on no area page. Keep it?
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

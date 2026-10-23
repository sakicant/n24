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
- [ ] Final domain: canonical links and sitemap use https://www.n24.hr; change SITE in tools/build.mjs if it will be realestatecroatia-n24.hr.

## Build
- [ ] Backend: PHP + MySQL admin panel, real listings, contact form email.
- [ ] Croatian and German versions.
- [ ] Analytics (then switch on the cookie banner in assets/js/site.js).

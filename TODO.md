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

## Build
- [ ] Primošten Resort page (/primosten-resort/).
- [ ] Single property page (/property/...).
- [ ] Backend: PHP + MySQL admin panel, real listings, contact form email.
- [ ] Croatian and German versions.
- [ ] Analytics (then switch on the cookie banner in assets/js/site.js).

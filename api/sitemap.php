<?php
// /sitemap.xml on the live site (see .htaccess): the fixed pages from the build
// plus every visible listing, so new listings are in the sitemap at once.

require __DIR__ . '/lib/store.php';

$paths = json_decode((string) @file_get_contents(__DIR__ . '/views/sitemap-static.json'), true) ?: ['/'];
try {
    foreach (n24_load() as $l) {
        if (empty($l['hidden']) && !empty($l['slug'])) {
            $paths[] = n24_listing_path($l);
        }
    }
} catch (RuntimeException $e) {
    // The fixed pages are still listed.
}

$day = date('Y-m-d', (int) @filemtime(N24_LISTINGS) ?: time());
header('Content-Type: application/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($paths as $p) {
    echo '  <url><loc>' . n24_e(N24_SITE . $p) . '</loc><lastmod>' . $day . '</lastmod></url>' . "\n";
}
echo '</urlset>' . "\n";

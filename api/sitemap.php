<?php
// /sitemap.xml on the live site (see .htaccess): every page in every language,
// each with its hreflang alternates and x-default, plus every visible listing,
// so new listings are in the sitemap at once.

require __DIR__ . '/lib/render.php';

$i18n = n24_i18n();
$langs = $i18n['langs'];
$xdefault = $i18n['xdefault'];

// Each entry: the addresses of one page, keyed by language.
$pages = json_decode((string) @file_get_contents(__DIR__ . '/views/sitemap-static.json'), true) ?: [];
try {
    foreach (n24_load() as $l) {
        if (empty($l['hidden']) && !empty($l['slug'])) {
            $alt = [];
            foreach ($langs as $lang) {
                $alt[$lang] = n24_listing_url($l, $lang);
            }
            $pages[] = $alt;
        }
    }
} catch (RuntimeException $e) {
    // The fixed pages are still listed.
}

$day = date('Y-m-d', (int) @filemtime(N24_LISTINGS) ?: time());
header('Content-Type: application/xml; charset=utf-8');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";
foreach ($pages as $alt) {
    foreach ($langs as $lang) {
        echo "  <url>\n    <loc>" . n24_e(N24_SITE . $alt[$lang]) . "</loc>\n    <lastmod>" . $day . "</lastmod>\n";
        foreach ($langs as $other) {
            echo '    <xhtml:link rel="alternate" hreflang="' . $other . '" href="' . n24_e(N24_SITE . $alt[$other]) . "\"/>\n";
        }
        echo '    <xhtml:link rel="alternate" hreflang="x-default" href="' . n24_e(N24_SITE . $alt[$xdefault]) . "\"/>\n  </url>\n";
    }
}
echo "</urlset>\n";

<?php
// Property pages on the live site in every language (see .htaccess):
//   /nekretnina/<id>-<slug>/, /en/property/..., /de/immobilie/..., /pl/oferta/...,
//   /cs/nemovitost/..., /sk/nehnutelnost/...
// The page is made from the listings saved in the admin, so changes show at once.
// An old or wrong address redirects to the current one; an unknown or hidden
// listing gets the 404 page of the language.

require __DIR__ . '/lib/render.php';

$i18n = n24_i18n();
$lang = (string) ($_GET['lang'] ?? '');
if (!in_array($lang, $i18n['langs'] ?? [], true)) {
    $lang = $i18n['default'] ?? 'hr';
}
$slug = (string) ($_GET['slug'] ?? '');
$listing = null;
$all = [];
if (preg_match('/^(n24-\d+)(?:-[a-z0-9-]*)?$/', $slug, $m)) {
    try {
        $all = n24_load();
        $listing = n24_find($all, $m[1]);
    } catch (RuntimeException $e) {
        $listing = null;
    }
}

if (!$listing || !empty($listing['hidden']) || empty($listing['slug'])) {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile(N24_ROOT . n24_lang_root($lang) . '404.html');
    exit;
}

$path = n24_listing_url($listing, $lang);
$asked = '/' . ltrim(parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '', '/');
if (PHP_SAPI !== 'cli' && $asked !== $path) {
    header('Location: ' . $path, true, 301);
    exit;
}

$page = n24_property_page($listing, $all, $lang);
$shell = file_get_contents(__DIR__ . '/views/property-shell.' . $lang . '.html');
// Menu: the listing's area is the current page (Areas dropdown), otherwise Buy.
$nav = in_array($listing['area'] ?? '', N24_COAST, true) ? 'area-' . $listing['area'] : 'buy';
$shell = preg_replace_callback('/\{\{nav:([\w-]+)\}\}/', function ($m) use ($nav) {
    if ($m[1] === $nav) return ' aria-current="page"';
    if ($m[1] === 'areas' && strpos($nav, 'area-') === 0) return ' data-current="true"';
    return '';
}, $shell);
header('Content-Type: text/html; charset=utf-8');
echo strtr($shell, [
    '{{title}}' => n24_e($page['title']),
    '{{description}}' => n24_e($page['description']),
    '{{path}}' => $page['path'],
    '{{head}}' => $page['head'],
    '{{hreflang}}' => $page['hreflang'],
    '{{lang_switcher}}' => $page['switch'],
    '{{lang_switcher_mobile}}' => $page['switch_mobile'],
    '{{content}}' => trim($page['content']),
]);

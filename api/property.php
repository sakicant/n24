<?php
// /property/<id>-<slug>/ on the live site (see .htaccess): the page is made from
// the listings the admin saves, so changes show at once. An old slug redirects to
// the current one; an unknown or hidden listing gets the 404 page.

require __DIR__ . '/lib/render.php';

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
    readfile(N24_ROOT . '/404.html');
    exit;
}

$path = n24_listing_path($listing);
if ('/property/' . $slug . '/' !== $path) {
    header('Location: ' . $path, true, 301);
    exit;
}

$page = n24_property_page($listing, $all);
$shell = file_get_contents(__DIR__ . '/views/property-shell.html');
// Menu: the listing's area is the current page (Areas dropdown), otherwise Buy.
$nav = in_array($listing['area'] ?? '', N24_COAST, true) ? 'area-' . $listing['area'] : 'buy';
$shell = preg_replace_callback('/\{\{nav:([\w-]+)\}\}/', function ($m) use ($nav) {
    if ($m[1] === $nav) return ' aria-current="page"';
    if ($m[1] === 'areas' && strpos($nav, 'area-') === 0) return ' data-current="true"';
    return '';
}, $shell);
$attr = function ($s) { return htmlspecialchars($s, ENT_COMPAT | ENT_SUBSTITUTE, 'UTF-8'); };
header('Content-Type: text/html; charset=utf-8');
echo strtr($shell, [
    '{{title}}' => $attr($page['title']),
    '{{description}}' => $attr($page['description']),
    '{{path}}' => $page['path'],
    '{{head}}' => $page['head'],
    '{{content}}' => trim($page['content']),
]);

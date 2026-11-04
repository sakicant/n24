<?php
/**
 * Property page markup, made on the server from a listing.
 * Same output as tools/listing-pages.mjs (which builds the static preview pages);
 * change both together.
 */

require_once __DIR__ . '/store.php';

function n24_price_text(array $l, string $none = 'Price on request'): string
{
    return !empty($l['price']) ? (!empty($l['units']) ? 'From ' : '') . n24_euro($l['price']) : $none;
}

function n24_img(array $l, string $name, int $n, string $sizes, string $extra = ''): string
{
    $base = '/assets/img/listings/' . $name;
    return '<img src="' . $base . '-1200.webp" srcset="' . $base . '-640.webp 640w, ' . $base . '-1200.webp 1200w, ' . $base . '-1920.webp 1920w" sizes="' . $sizes . '" alt="' . n24_e($l['title']) . ', photo ' . $n . '" ' . $extra . '>';
}

function n24_gallery(array $l): string
{
    $photos = array_values($l['photos'] ?? []);
    $n = count($photos);
    if (!$n) {
        return '';
    }
    $thumbs = '';
    for ($i = 2; $i <= min($n, 5); $i++) {
        $more = ($i === 5 && $n > 5) ? '<span class="pg-more">+' . ($n - 5) . ' photos</span>' : '';
        $thumbs .= '<button type="button" class="pg-thumb" data-photo="' . $i . '" aria-label="Open photo ' . $i . ' of ' . $n . '">'
            . n24_img($l, $photos[$i - 1], $i, '(min-width: 900px) 20vw, 50vw', 'loading="lazy" width="640" height="480"') . $more . '</button>';
    }
    return '<div class="pg" data-photos="' . n24_e(implode(',', $photos)) . '" data-title="' . n24_e($l['title']) . '">
      <button type="button" class="pg-main" data-photo="1" aria-label="Open photo 1 of ' . $n . '">' . n24_img($l, $photos[0], 1, '(min-width: 900px) 60vw, 100vw', 'fetchpriority="high" width="1200" height="800"') . '</button>
      ' . ($thumbs ? '<div class="pg-thumbs">' . $thumbs . '</div>' : '') . '
      <button type="button" class="pg-all" data-photo="1">Show all ' . $n . ' photos</button>
    </div>';
}

function n24_facts(array $l): string
{
    $land = ($l['type'] ?? '') === 'land';
    $rows = [];
    $rows[] = ['Price', !empty($l['price']) ? n24_price_text($l) : 'On request'];
    $rows[] = ['Type', N24_TYPES[$l['type']] ?? ''];
    $rows[] = ['Place', n24_area_name($l['area'] ?? null)];
    if (!empty($l['size'])) $rows[] = [$land ? 'Plot' : 'Living area', n24_num($l['size']) . ' m²'];
    if (!empty($l['plot']) && !$land) $rows[] = ['Plot', n24_num($l['plot']) . ' m²'];
    if (!empty($l['beds']) && !$land) $rows[] = ['Bedrooms', $l['beds']];
    if (!empty($l['baths']) && !$land) $rows[] = ['Bathrooms', $l['baths']];
    if (!empty($l['year'])) $rows[] = ['Year built', $l['year']];
    if (!empty($l['parking'])) $rows[] = ['Parking spaces', $l['parking']];
    if (!empty($l['garage'])) $rows[] = ['Garage', $l['garage']];
    if (!empty($l['status'])) $rows[] = ['Status', $l['status']];
    $rows[] = ['Reference', strtoupper($l['id'])];
    return implode("\n          ", array_map(function ($r) {
        return '<div><dt>' . $r[0] . '</dt><dd>' . n24_e($r[1]) . '</dd></div>';
    }, $rows));
}

function n24_units(array $l): string
{
    if (empty($l['units'])) {
        return '';
    }
    $hasGarden = false;
    $hasBeds = false;
    foreach ($l['units'] as $u) {
        if (!empty($u[4])) $hasGarden = true;
        if (!empty($u[5])) $hasBeds = true;
    }
    $rows = [];
    foreach ($l['units'] as $u) {
        $u = array_pad($u, 6, null);
        [$name, $size, $price, $status, $garden, $beds] = $u;
        $cell = $status ? '<span class="u-sold">' . n24_e($status) . '</span>' : ($price ? n24_euro($price) : 'On request');
        $rows[] = '<tr><th scope="row">' . n24_e($name) . '</th><td>' . ($size ? n24_num($size) . ' m²' : '') . '</td>'
            . ($hasBeds ? '<td>' . ($beds ?: '') . '</td>' : '')
            . ($hasGarden ? '<td>' . ($garden ? n24_num($garden) . ' m²' : '') . '</td>' : '')
            . '<td>' . $cell . '</td></tr>';
    }
    $land = ($l['type'] ?? '') === 'land';
    return '<h2>' . ($land ? 'Plots and prices' : 'Units and prices') . '</h2>
      <div class="units-wrap"><table class="units">
        <thead><tr><th scope="col">' . ($land ? 'Plot' : 'Unit') . '</th><th scope="col">Size</th>' . ($hasBeds ? '<th scope="col">Bedrooms</th>' : '') . ($hasGarden ? '<th scope="col">Garden</th>' : '') . '<th scope="col">Price</th></tr></thead>
        <tbody>
            ' . implode("\n            ", $rows) . '
        </tbody>
      </table></div>';
}

/** The listing card, same markup as assets/js/listings.js. */
function n24_card(array $l): string
{
    $ph = '';
    if (!empty($l['img'])) {
        $b = '/assets/img/listings/' . $l['img'];
        $ph = '<img src="' . $b . '-640.webp" srcset="' . $b . '-640.webp 640w, ' . $b . '-1200.webp 1200w" sizes="(min-width: 1080px) 400px, (min-width: 600px) 50vw, 100vw" alt="' . n24_e($l['title']) . '" loading="lazy" width="640" height="480">';
    }
    $tag = ($l['project'] ?? '') === 'primosten-resort' ? '<span class="tag">Primošten Resort</span>' : '';
    $land = ($l['type'] ?? '') === 'land';
    $f = [];
    if (!empty($l['size'])) $f[] = n24_num($l['size']) . ' m²' . ($land ? ' plot' : '');
    if (!empty($l['beds']) && !$land) $f[] = $l['beds'] . ' bed';
    if (!empty($l['baths']) && !$land) $f[] = $l['baths'] . ' bath';
    if (!$f && !empty($l['status'])) $f[] = n24_e($l['status']);
    $price = !empty($l['price']) ? '<span class="price">' . n24_price_text($l) . '</span>' : '<span class="price ask">Price on request</span>';
    return '<li class="card"><a href="' . n24_listing_path($l) . '"><div class="ph">' . $ph . $tag . '</div><p class="meta"><span>' . n24_area_name($l['area'] ?? null) . '</span><span>' . (N24_TYPES[$l['type']] ?? '') . '</span></p><h3>' . n24_e($l['title']) . '</h3><div class="row"><span class="facts-line">' . implode(' · ', $f) . '</span>' . $price . '</div></a></li>';
}

function n24_similar(array $l, array $all): string
{
    $pool = [];
    foreach (array_values($all) as $i => $x) {
        if (($x['id'] ?? '') !== $l['id'] && empty($x['hidden']) && !empty($x['slug'])) {
            $score = (($x['area'] ?? '') === ($l['area'] ?? '') ? 2 : 0) + (($x['type'] ?? '') === ($l['type'] ?? '') ? 1 : 0);
            $pool[] = [$score, $i, $x];
        }
    }
    usort($pool, function ($a, $b) { return $b[0] <=> $a[0] ?: $a[1] <=> $b[1]; });
    $picks = array_slice($pool, 0, 3);
    if (!$picks) {
        return '';
    }
    return '<section class="similar wrap" aria-labelledby="similar-title">
    <h2 id="similar-title">Similar properties</h2>
    <ul class="grid">' . implode('', array_map(function ($p) { return n24_card($p[2]); }, $picks)) . '</ul>
  </section>';
}

/** Returns ['title', 'description', 'head', 'content'] for the page template. */
function n24_property_page(array $l, array $all): array
{
    $place = n24_area_name($l['area'] ?? null);
    $onCoast = in_array($l['area'] ?? '', N24_COAST, true);
    $ref = strtoupper($l['id']);
    $type = N24_TYPES[$l['type']] ?? '';
    $title = $l['title'];
    $path = n24_listing_path($l);
    // Leaves the same characters unencoded as JavaScript's encodeURIComponent.
    $wa = strtr(rawurlencode('Hello Tomislav, I\'m interested in "' . $title . '" (' . $ref . ').'), ['%27' => "'", '%28' => '(', '%29' => ')', '%21' => '!', '%2A' => '*']);
    $crumbArea = $onCoast
        ? '<a href="/real-estate-' . $l['area'] . '/">Real estate ' . $place . '</a> <span aria-hidden="true">/</span> '
        : '<a href="/properties/">Properties</a> <span aria-hidden="true">/</span> ';
    $resortNote = ($l['project'] ?? '') === 'primosten-resort'
        ? '<p class="resort-note">Part of <a href="/primosten-resort/">Primošten Resort</a>. See all units, floors and availability on the resort page.</p>' : '';
    $paras = implode("\n      ", array_map(function ($p) { return '<p>' . n24_e($p) . '</p>'; }, $l['description'] ?? []));
    $standards = !empty($l['standards'])
        ? "<h3>Construction and finishing</h3>\n      <ul class=\"ticks\">" . implode('', array_map(function ($s) { return '<li>' . n24_e($s) . '</li>'; }, $l['standards'])) . '</ul>' : '';
    $features = !empty($l['features'])
        ? "<h2>Features</h2>\n      <ul class=\"feature-list\">" . implode('', array_map(function ($s) { return '<li>' . n24_e($s) . '</li>'; }, $l['features'])) . '</ul>' : '';
    $renders = !empty($l['renders']) ? '<p class="render-note">Some images are visualisations. The finished property may differ.</p>' : '';

    $content = '  <section class="band-hero band-hero-short property-hero" aria-labelledby="page-title">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">/</span> ' . $crumbArea . '<span aria-current="page">' . n24_e($title) . '</span></nav>
      <div class="ph-row">
        <div>
          <h1 id="page-title">' . n24_e($title) . '</h1>
          <p class="ph-meta">' . $place . ' · ' . $type . ' · Ref. ' . $ref . '</p>
        </div>
        <p class="ph-price">' . n24_price_text($l) . '</p>
      </div>
    </div>
  </section>

  <div class="wrap property-gallery">
    ' . n24_gallery($l) . '
    ' . $renders . '
  </div>

  <div class="wrap property-body">
    <article class="property-main" aria-labelledby="about-title">
      <h2 id="about-title">About this property</h2>
      ' . $resortNote . '
      ' . $paras . '
      ' . n24_units($l) . '
      ' . $standards . '
      ' . $features . '
      <h2>Key facts</h2>
      <dl class="key-facts">
          ' . n24_facts($l) . '
      </dl>
    </article>

    <aside class="property-aside" aria-labelledby="ask-title">
      <div class="ask-card">
        <h2 id="ask-title">Interested in this property?</h2>
        <p>Tomislav Plenča will answer your questions and arrange a viewing.</p>
        <a class="btn btn-red" href="/contact/?topic=buy&amp;ref=' . rawurlencode($ref) . '&amp;title=' . strtr(rawurlencode($title), ['%27' => "'", '%28' => '(', '%29' => ')', '%21' => '!', '%2A' => '*']) . '">Ask about this property</a>
        <div class="ask-alt">
          <a href="https://wa.me/385957007001?text=' . $wa . '">WhatsApp</a>
          <a href="tel:+385957007001">Call</a>
        </div>
        <p class="ask-ref">Reference ' . $ref . '</p>
      </div>
    </aside>
  </div>

  ' . n24_similar($l, $all);

    $ld = [
        ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => N24_SITE . '/'],
            $onCoast
                ? ['@type' => 'ListItem', 'position' => 2, 'name' => 'Real estate ' . $place, 'item' => N24_SITE . '/real-estate-' . $l['area'] . '/']
                : ['@type' => 'ListItem', 'position' => 2, 'name' => 'Properties', 'item' => N24_SITE . '/properties/'],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $title, 'item' => N24_SITE . $path],
        ]],
        array_filter([
            '@context' => 'https://schema.org', '@type' => 'RealEstateListing', 'name' => $title, 'url' => N24_SITE . $path,
            'description' => ($l['description'][0] ?? '') ?: $title,
            'image' => !empty($l['img']) ? N24_SITE . '/assets/img/listings/' . $l['img'] . '-1200.webp' : null,
            'offers' => !empty($l['price']) ? ['@type' => 'Offer', 'price' => $l['price'], 'priceCurrency' => 'EUR', 'availability' => 'https://schema.org/InStock'] : null,
        ], function ($v) { return $v !== null; }),
    ];
    $head = implode("\n", array_map(function ($o) {
        return '<script type="application/ld+json">' . json_encode($o, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>';
    }, $ld));

    $first = ($l['description'][0] ?? '') ?: $title;
    $desc = mb_substr($first, 0, 150);
    if (mb_strlen($desc) < mb_strlen($l['description'][0] ?? '')) {
        $desc = preg_replace('/\s+\S*$/u', '', $desc) . '...';
    }

    return [
        'path' => $path,
        'title' => $title . ', ' . $place . ' | ' . n24_price_text($l) . ' | N24',
        'description' => $desc,
        'head' => $head,
        'content' => $content,
    ];
}

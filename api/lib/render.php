<?php
/**
 * Property pages in every language, made on the server from a listing.
 * Same output as tools/listing-pages.mjs (which builds the static preview pages);
 * change both together. Texts and addresses come from api/views/i18n.json,
 * which the build writes from src/i18n/ui.<lang>.json.
 */

require_once __DIR__ . '/store.php';

function n24_i18n(): array
{
    static $data = null;
    if ($data === null) {
        $data = json_decode((string) file_get_contents(dirname(__DIR__) . '/views/i18n.json'), true) ?: [];
    }
    return $data;
}

function n24_ui(string $lang): array
{
    return n24_i18n()['ui'][$lang];
}

function n24_fill(string $s, array $vars): string
{
    return preg_replace_callback('/\{(\w+)\}/', function ($m) use ($vars) {
        return array_key_exists($m[1], $vars) ? (string) $vars[$m[1]] : $m[0];
    }, $s);
}

/** Numbers as the browser's Intl formats them for the language (see tools/listing-pages.mjs). */
function n24_lnum($v, string $lang, int $decimals = 2): string
{
    $nb = "\u{00A0}";
    $seps = ['en' => [',', '.'], 'hr' => ['.', ','], 'de' => ['.', ','], 'pl' => [$nb, ','], 'cs' => [$nb, ','], 'sk' => [$nb, ',']][$lang];
    $s = number_format((float) $v, $decimals, '.', '');
    if (strpos($s, '.') !== false) {
        $s = rtrim(rtrim($s, '0'), '.');
    }
    $parts = explode('.', $s);
    $int = $parts[0];
    // Polish does not group four-digit numbers (1523, but 12 345).
    if (!($lang === 'pl' && strlen($int) <= 4)) {
        $int = preg_replace('/\B(?=(\d{3})+(?!\d))/', $seps[0], $int);
    }
    return $int . (isset($parts[1]) ? $seps[1] . $parts[1] : '');
}

function n24_leuro($v, string $lang): string
{
    $n = n24_lnum(round((float) $v), $lang, 0);
    return $lang === 'en' ? '€' . $n : $n . "\u{00A0}€";
}

/** encodeURIComponent: leaves the same characters as JavaScript does. */
function n24_uri(string $s): string
{
    return strtr(rawurlencode($s), ['%27' => "'", '%28' => '(', '%29' => ')', '%21' => '!', '%2A' => '*']);
}

/** A listing's texts in a language: its translation if there is one, else as entered. */
function n24_text(array $l, string $lang): array
{
    $t = $l['tr'][$lang] ?? [];
    return [
        'title' => $t['title'] ?? $l['title'],
        'slug' => $t['slug'] ?? $l['slug'],
        'description' => $t['description'] ?? ($l['description'] ?? []),
        'features' => $t['features'] ?? ($l['features'] ?? []),
        'standards' => $t['standards'] ?? ($l['standards'] ?? null),
        'status' => $t['status'] ?? ($l['status'] ?? ''),
        'units' => $t['units'] ?? null,
    ];
}

function n24_lang_root(string $lang): string
{
    return $lang === n24_i18n()['default'] ? '/' : '/' . $lang . '/';
}

function n24_listing_url(array $l, string $lang): string
{
    return n24_lang_root($lang) . n24_ui($lang)['property_prefix'] . '/' . $l['id'] . '-' . n24_text($l, $lang)['slug'] . '/';
}

function n24_place(array $l, string $lang): string
{
    $u = n24_ui($lang);
    $id = $l['area'] ?? '';
    return in_array($id, N24_COAST, true) ? N24_AREAS[$id] : ($u['places_other'][$id] ?? $u['place_unknown']);
}

function n24_price_text(array $l, string $lang, ?string $none = null): string
{
    $u = n24_ui($lang);
    if (!empty($l['price'])) {
        return (!empty($l['units']) ? $u['card']['from'] . ' ' : '') . n24_leuro($l['price'], $lang);
    }
    return $none ?? $u['card']['price_request'];
}

function n24_img(string $title, string $name, int $n, string $sizes, string $extra, array $p): string
{
    $base = '/assets/img/listings/' . $name;
    return '<img src="' . $base . '-1200.webp" srcset="' . $base . '-640.webp 640w, ' . $base . '-1200.webp 1200w, ' . $base . '-1920.webp 1920w" sizes="' . $sizes . '" alt="' . n24_e(n24_fill($p['photo_alt'], ['title' => $title, 'n' => $n])) . '" ' . $extra . '>';
}

function n24_gallery(array $l, string $title, array $p): string
{
    $photos = array_values($l['photos'] ?? []);
    $n = count($photos);
    if (!$n) {
        return '';
    }
    $thumbs = '';
    for ($i = 2; $i <= min($n, 5); $i++) {
        $more = ($i === 5 && $n > 5) ? '<span class="pg-more">' . n24_e(n24_fill($p['more_photos'], ['n' => $n - 5])) . '</span>' : '';
        $thumbs .= '<button type="button" class="pg-thumb" data-photo="' . $i . '" aria-label="' . n24_e(n24_fill($p['open_photo'], ['n' => $i, 'total' => $n])) . '">'
            . n24_img($title, $photos[$i - 1], $i, '(min-width: 900px) 20vw, 50vw', 'loading="lazy" width="640" height="480"', $p) . $more . '</button>';
    }
    return '<div class="pg" data-photos="' . n24_e(implode(',', $photos)) . '" data-title="' . n24_e($title) . '">
      <button type="button" class="pg-main" data-photo="1" aria-label="' . n24_e(n24_fill($p['open_photo'], ['n' => 1, 'total' => $n])) . '">' . n24_img($title, $photos[0], 1, '(min-width: 900px) 60vw, 100vw', 'fetchpriority="high" width="1200" height="800"', $p) . '</button>
      ' . ($thumbs ? '<div class="pg-thumbs">' . $thumbs . '</div>' : '') . '
      <button type="button" class="pg-all" data-photo="1">' . n24_e(n24_fill($p['all_photos'], ['n' => $n])) . '</button>
    </div>';
}

function n24_facts(array $l, array $t, string $lang): string
{
    $u = n24_ui($lang);
    $p = $u['property'];
    $land = ($l['type'] ?? '') === 'land';
    $rows = [];
    $rows[] = [$p['f_price'], !empty($l['price']) ? n24_price_text($l, $lang) : $p['on_request']];
    $rows[] = [$p['f_type'], $u['types'][$l['type']] ?? ''];
    $rows[] = [$p['f_place'], n24_place($l, $lang)];
    if (!empty($l['size'])) $rows[] = [$land ? $p['f_plot'] : $p['f_living'], n24_lnum($l['size'], $lang) . ' m²'];
    if (!empty($l['plot']) && !$land) $rows[] = [$p['f_plot'], n24_lnum($l['plot'], $lang) . ' m²'];
    if (!empty($l['beds']) && !$land) $rows[] = [$p['f_bedrooms'], $l['beds']];
    if (!empty($l['baths']) && !$land) $rows[] = [$p['f_bathrooms'], $l['baths']];
    if (!empty($l['year'])) $rows[] = [$p['f_year'], $l['year']];
    if (!empty($l['parking'])) $rows[] = [$p['f_parking'], $l['parking']];
    if (!empty($l['garage'])) $rows[] = [$p['f_garage'], $l['garage']];
    if ($t['status'] !== '') $rows[] = [$p['f_status'], $t['status']];
    $rows[] = [$p['f_ref'], strtoupper($l['id'])];
    return implode("\n          ", array_map(function ($r) {
        return '<div><dt>' . n24_e($r[0]) . '</dt><dd>' . n24_e($r[1]) . '</dd></div>';
    }, $rows));
}

function n24_units(array $l, array $t, string $lang): string
{
    if (empty($l['units'])) {
        return '';
    }
    $u = n24_ui($lang);
    $p = $u['property'];
    $hasGarden = false;
    $hasBeds = false;
    foreach ($l['units'] as $x) {
        if (!empty($x[4])) $hasGarden = true;
        if (!empty($x[5])) $hasBeds = true;
    }
    $rows = [];
    foreach ($l['units'] as $i => $x) {
        [$name, $size, $price, $status, $garden, $beds] = array_pad($x, 6, null);
        $shown = $t['units'][$i] ?? $name;
        $cell = $status ? '<span class="u-sold">' . n24_e($u['unit_status'][$status] ?? $status) . '</span>' : ($price ? n24_leuro($price, $lang) : n24_e($p['on_request']));
        $rows[] = '<tr><th scope="row">' . n24_e($shown) . '</th><td>' . ($size ? n24_lnum($size, $lang) . ' m²' : '') . '</td>'
            . ($hasBeds ? '<td>' . ($beds ?: '') . '</td>' : '')
            . ($hasGarden ? '<td>' . ($garden ? n24_lnum($garden, $lang) . ' m²' : '') . '</td>' : '')
            . '<td>' . $cell . '</td></tr>';
    }
    $land = ($l['type'] ?? '') === 'land';
    return '<h2>' . n24_e($land ? $p['plots_title'] : $p['units_title']) . '</h2>
      <div class="units-wrap"><table class="units">
        <thead><tr><th scope="col">' . n24_e($land ? $p['plot'] : $p['unit']) . '</th><th scope="col">' . n24_e($p['size']) . '</th>' . ($hasBeds ? '<th scope="col">' . n24_e($p['bedrooms']) . '</th>' : '') . ($hasGarden ? '<th scope="col">' . n24_e($p['garden']) . '</th>' : '') . '<th scope="col">' . n24_e($p['price']) . '</th></tr></thead>
        <tbody>
            ' . implode("\n            ", $rows) . '
        </tbody>
      </table></div>';
}

/** The listing card, same markup as assets/js/listings.js. */
function n24_card(array $l, string $lang): string
{
    $u = n24_ui($lang);
    $t = n24_text($l, $lang);
    $ph = '';
    if (!empty($l['img'])) {
        $b = '/assets/img/listings/' . $l['img'];
        $ph = '<img src="' . $b . '-640.webp" srcset="' . $b . '-640.webp 640w, ' . $b . '-1200.webp 1200w" sizes="(min-width: 1080px) 400px, (min-width: 600px) 50vw, 100vw" alt="' . n24_e($t['title']) . '" loading="lazy" width="640" height="480">';
    }
    $tag = ($l['project'] ?? '') === 'primosten-resort' ? '<span class="tag">Primošten Resort</span>' : '';
    $land = ($l['type'] ?? '') === 'land';
    $f = [];
    if (!empty($l['size'])) $f[] = n24_lnum($l['size'], $lang) . ' m²' . ($land ? ' ' . $u['card']['plot'] : '');
    if (!empty($l['beds']) && !$land) $f[] = $l['beds'] . ' ' . $u['card']['bed'];
    if (!empty($l['baths']) && !$land) $f[] = $l['baths'] . ' ' . $u['card']['bath'];
    if (!$f && $t['status'] !== '') $f[] = n24_e($t['status']);
    $price = !empty($l['price']) ? '<span class="price">' . n24_price_text($l, $lang) . '</span>' : '<span class="price ask">' . n24_e($u['card']['price_request']) . '</span>';
    return '<li class="card"><a href="' . n24_listing_url($l, $lang) . '"><div class="ph">' . $ph . $tag . '</div><p class="meta"><span>' . n24_place($l, $lang) . '</span><span>' . ($u['types'][$l['type']] ?? '') . '</span></p><h3>' . n24_e($t['title']) . '</h3><div class="row"><span class="facts-line">' . implode(' · ', $f) . '</span>' . $price . '</div></a></li>';
}

function n24_similar(array $l, array $all, string $lang): string
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
    <h2 id="similar-title">' . n24_e(n24_ui($lang)['property']['similar']) . '</h2>
    <ul class="grid">' . implode('', array_map(function ($p) use ($lang) { return n24_card($p[2], $lang); }, $picks)) . '</ul>
  </section>';
}

/** Language menu (desktop and phone menu) and hreflang links for a listing. */
function n24_lang_links(array $l, string $lang): array
{
    $i = n24_i18n();
    $u = n24_ui($lang);
    $flag = function ($x) { return '<img class="lang-flag" src="/assets/img/flags/' . $x . '.svg" width="20" height="15" alt="">'; };
    $items = [];
    $alts = [];
    foreach ($i['langs'] as $x) {
        $href = n24_listing_url($l, $x);
        $items[] = '<li><a href="' . $href . '" hreflang="' . $x . '" lang="' . $x . '"' . ($x === $lang ? ' aria-current="true"' : '') . '>' . $flag($x) . ' ' . $i['ui'][$x]['label'] . '</a></li>';
        $alts[] = '<link rel="alternate" hreflang="' . $x . '" href="' . N24_SITE . $href . '">';
    }
    $alts[] = '<link rel="alternate" hreflang="x-default" href="' . N24_SITE . n24_listing_url($l, $i['xdefault']) . '">';
    $label = n24_e($u['lang_menu']) . ': ' . n24_e($u['name']);
    $chev = '<svg class="chev" viewBox="0 0 12 8" aria-hidden="true"><path d="M1 1.5l5 5 5-5"/></svg>';
    $list = implode("\n          ", $items);
    $desktop = '<div class="has-menu lang-switch">
      <button class="menu-toggle lang-toggle" type="button" aria-expanded="false" aria-controls="lang-menu" aria-label="' . $label . '">' . $flag($lang) . ' ' . $u['label'] . ' ' . $chev . '</button>
      <ul class="lang-menu" id="lang-menu">
          ' . $list . '
      </ul>
    </div>';
    $mobile = '<li class="m-has-menu m-lang">
        <button class="m-toggle" type="button" aria-expanded="false" aria-controls="m-lang" aria-label="' . $label . '">' . $flag($lang) . ' ' . $u['label'] . ' ' . $chev . '</button>
        <ul class="m-sub" id="m-lang" hidden>
          ' . $list . '
        </ul>
      </li>';
    return [$desktop, $mobile, implode("\n", $alts)];
}

/** Returns path, title, description, head and content for the page template. */
function n24_property_page(array $l, array $all, string $lang): array
{
    $u = n24_ui($lang);
    $p = $u['property'];
    $t = n24_text($l, $lang);
    $place = n24_place($l, $lang);
    $onCoast = in_array($l['area'] ?? '', N24_COAST, true);
    $ref = strtoupper($l['id']);
    $type = $u['types'][$l['type']] ?? '';
    $title = $t['title'];
    $path = n24_listing_url($l, $lang);
    $wa = n24_uri(n24_fill($p['wa_text'], ['title' => $title, 'ref' => $ref]));
    $areaUrl = $onCoast ? $u['areas'][$l['area']] : $u['properties'];
    $areaLabel = $onCoast ? n24_fill($u['crumb_area'], ['name' => $place]) : $u['crumb_properties'];
    $resortNote = ($l['project'] ?? '') === 'primosten-resort'
        ? '<p class="resort-note">' . n24_fill($p['resort_note'], ['url' => $u['resort']]) . '</p>' : '';
    $paras = implode("\n      ", array_map(function ($x) { return '<p>' . n24_e($x) . '</p>'; }, $t['description']));
    $standards = !empty($t['standards'])
        ? '<h3>' . n24_e($p['standards']) . "</h3>\n      <ul class=\"ticks\">" . implode('', array_map(function ($s) { return '<li>' . n24_e($s) . '</li>'; }, $t['standards'])) . '</ul>' : '';
    $features = !empty($t['features'])
        ? '<h2>' . n24_e($p['features']) . "</h2>\n      <ul class=\"feature-list\">" . implode('', array_map(function ($s) { return '<li>' . n24_e($s) . '</li>'; }, $t['features'])) . '</ul>' : '';
    $renders = !empty($l['renders']) ? '<p class="render-note">' . n24_e($p['renders']) . '</p>' : '';

    $content = '  <section class="band-hero band-hero-short property-hero" aria-labelledby="page-title">
    <div class="wrap">
      <nav class="crumbs" aria-label="' . n24_e($p['breadcrumb']) . '"><a href="' . $u['home'] . '">' . n24_e($u['crumb_home']) . '</a> <span aria-hidden="true">/</span> <a href="' . $areaUrl . '">' . n24_e($areaLabel) . '</a> <span aria-hidden="true">/</span> <span aria-current="page">' . n24_e($title) . '</span></nav>
      <div class="ph-row">
        <div>
          <h1 id="page-title">' . n24_e($title) . '</h1>
          <p class="ph-meta">' . $place . ' · ' . $type . ' · ' . n24_e(n24_fill($p['ref_short'], ['ref' => $ref])) . '</p>
        </div>
        <p class="ph-price">' . n24_price_text($l, $lang, n24_e($u['card']['price_request'])) . '</p>
      </div>
    </div>
  </section>

  <div class="wrap property-gallery">
    ' . n24_gallery($l, $title, $p) . '
    ' . $renders . '
  </div>

  <div class="wrap property-body">
    <article class="property-main" aria-labelledby="about-title">
      <h2 id="about-title">' . n24_e($p['about']) . '</h2>
      ' . $resortNote . '
      ' . $paras . '
      ' . n24_units($l, $t, $lang) . '
      ' . $standards . '
      ' . $features . '
      <h2>' . n24_e($p['key_facts']) . '</h2>
      <dl class="key-facts">
          ' . n24_facts($l, $t, $lang) . '
      </dl>
    </article>

    <aside class="property-aside" aria-labelledby="ask-title">
      <div class="ask-card">
        <h2 id="ask-title">' . n24_e($p['ask_title']) . '</h2>
        <p>' . n24_e($p['ask_text']) . '</p>
        <a class="btn btn-red" href="' . $u['contact_url'] . '?topic=buy&amp;ref=' . n24_uri($ref) . '&amp;title=' . n24_uri($title) . '">' . n24_e($p['ask_button']) . '</a>
        <div class="ask-alt">
          <a href="https://wa.me/385957007001?text=' . $wa . '">WhatsApp</a>
          <a href="tel:+385957007001">' . n24_e($p['call']) . '</a>
        </div>
        <p class="ask-ref">' . n24_e(n24_fill($p['reference'], ['ref' => $ref])) . '</p>
      </div>
    </aside>
  </div>

  ' . n24_similar($l, $all, $lang);

    $ld = [
        ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => $u['crumb_home'], 'item' => N24_SITE . $u['home']],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $areaLabel, 'item' => N24_SITE . $areaUrl],
            ['@type' => 'ListItem', 'position' => 3, 'name' => $title, 'item' => N24_SITE . $path],
        ]],
        array_filter([
            '@context' => 'https://schema.org', '@type' => 'RealEstateListing', 'name' => $title, 'url' => N24_SITE . $path,
            'description' => ($t['description'][0] ?? '') ?: $title,
            'image' => !empty($l['img']) ? N24_SITE . '/assets/img/listings/' . $l['img'] . '-1200.webp' : null,
            'offers' => !empty($l['price']) ? ['@type' => 'Offer', 'price' => $l['price'], 'priceCurrency' => 'EUR', 'availability' => 'https://schema.org/InStock'] : null,
        ], function ($v) { return $v !== null; }),
    ];
    $head = implode("\n", array_map(function ($o) {
        return '<script type="application/ld+json">' . json_encode($o, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) . '</script>';
    }, $ld));

    $first = ($t['description'][0] ?? '') ?: $title;
    $desc = mb_substr($first, 0, 150);
    if (mb_strlen($desc) < mb_strlen($first)) {
        $desc = preg_replace('/\s+\S*$/u', '', $desc) . '...';
    }
    [$switch, $switchMobile, $hreflang] = n24_lang_links($l, $lang);

    return [
        'path' => $path,
        'title' => $title . ', ' . $place . ' | ' . n24_price_text($l, $lang) . ' | N24',
        'description' => $desc,
        'head' => $head,
        'hreflang' => $hreflang,
        'switch' => $switch,
        'switch_mobile' => $switchMobile,
        'content' => $content,
    ];
}

<?php
/**
 * Turns the admin edit form into a listing, and back.
 * Everything typed is cleaned here: lengths, numbers, allowed values.
 */

require_once __DIR__ . '/store.php';

/** Text from a form field: trimmed, no control characters, at most $max characters. */
function n24_text($v, int $max = 300): string
{
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', (string) $v) ?? '';
    return mb_substr(trim(str_replace("\r", '', $v)), 0, $max);
}

/**
 * Numbers as people type them: "430000", "430.000", "430,000", "99,71", "99.71", "1 523".
 * A dot or comma followed by exactly three digits is a thousands separator.
 */
function n24_number($v, bool $decimal = true): ?float
{
    $s = preg_replace('/[\s€m²]+/u', '', (string) $v);
    if ($s === '') {
        return null;
    }
    if (preg_match('/^\d{1,3}([.,]\d{3})+$/', $s)) {
        $s = preg_replace('/[.,]/', '', $s);
    } elseif (preg_match('/^\d+[.,]\d{3}[.,]\d{1,2}$/', $s)) { // 1.234,56 or 1,234.56
        $s = preg_replace('/[.,](?=\d{3}[.,])/', '', $s);
        $s = str_replace(',', '.', $s);
    } else {
        $s = str_replace(',', '.', $s);
    }
    if (!is_numeric($s) || (float) $s < 0) {
        return null;
    }
    return $decimal ? round((float) $s, 2) : (float) round((float) $s);
}

function n24_int($v): ?int
{
    $n = n24_number($v, false);
    return $n === null ? null : (int) $n;
}

/** Whole numbers stay integers in the JSON (1523, not 1523.0). */
function n24_clean_num(?float $n)
{
    if ($n === null) return null;
    return floor($n) == $n ? (int) $n : $n;
}

function n24_lines($v, int $maxLines = 40, int $maxLen = 200): array
{
    $out = [];
    foreach (explode("\n", str_replace("\r", '', (string) $v)) as $line) {
        $line = n24_text(preg_replace('/^\s*[-•*]\s*/u', '', $line), $maxLen);
        if ($line !== '') $out[] = $line;
    }
    return array_slice($out, 0, $maxLines);
}

function n24_paragraphs($v): array
{
    $out = [];
    foreach (preg_split('/\n\s*\n/', str_replace("\r", '', (string) $v)) as $p) {
        $p = n24_text(preg_replace('/\s*\n\s*/', ' ', $p), 3000);
        if ($p !== '') $out[] = $p;
    }
    return array_slice($out, 0, 20);
}

/**
 * Builds the listing from $_POST. $old is the saved listing (or [] for a new one):
 * fields the form does not know about are kept.
 * Returns [listing, errors].
 */
function n24_listing_from_post(array $p, array $old): array
{
    $errors = [];
    $l = $old;

    $l['title'] = n24_text($p['title'] ?? '', 140);
    if (mb_strlen($l['title']) < 3) $errors['title'] = 'Write a title.';

    $l['area'] = (string) ($p['area'] ?? '');
    if (!isset(N24_AREAS[$l['area']])) $errors['area'] = 'Choose the place.';

    $l['type'] = (string) ($p['type'] ?? '');
    if (!isset(N24_TYPES[$l['type']])) $errors['type'] = 'Choose the type.';

    $slug = n24_slugify(n24_text($p['slug'] ?? '', 120) ?: $l['title']);
    $l['slug'] = $slug;

    foreach (['price' => false, 'size' => true, 'plot' => true] as $k => $dec) {
        $raw = trim((string) ($p[$k] ?? ''));
        $n = n24_number($raw, $dec);
        if ($raw !== '' && $n === null) $errors[$k] = 'Write a number, for example 250000.';
        $l[$k] = n24_clean_num($n);
    }
    foreach (['beds', 'baths', 'year', 'parking', 'garage'] as $k) {
        $raw = trim((string) ($p[$k] ?? ''));
        $n = n24_int($raw);
        if ($raw !== '' && $n === null) $errors[$k] = 'Write a whole number.';
        $l[$k] = $n ?: null;
    }
    if ($l['year'] !== null && ($l['year'] < 1500 || $l['year'] > (int) date('Y') + 10)) $errors['year'] = 'Write a year, for example 2026.';

    $l['status'] = n24_text($p['status'] ?? '', 60) ?: null;
    $project = (string) ($p['project'] ?? '');
    $l['project'] = isset(N24_PROJECTS[$project]) && $project !== '' ? $project : null;
    $l['renders'] = !empty($p['renders']) ?: null;
    $l['hidden'] = !empty($p['hidden']) ?: null;

    $l['description'] = n24_paragraphs($p['description'] ?? '');
    $l['features'] = n24_lines($p['features'] ?? '');
    $l['standards'] = n24_lines($p['standards'] ?? '', 40, 300) ?: null;

    // Units: one row per unit; empty rows are skipped.
    $units = [];
    $u = $p['units'] ?? [];
    $count = is_array($u['name'] ?? null) ? count($u['name']) : 0;
    for ($i = 0; $i < min($count, 200); $i++) {
        $name = n24_text($u['name'][$i] ?? '', 60);
        $size = n24_clean_num(n24_number($u['size'][$i] ?? ''));
        $price = n24_clean_num(n24_number($u['price'][$i] ?? '', false));
        $status = in_array($u['status'][$i] ?? '', ['Sold', 'Reserved'], true) ? $u['status'][$i] : '';
        $garden = n24_clean_num(n24_number($u['garden'][$i] ?? ''));
        $beds = n24_int($u['beds'][$i] ?? '');
        if ($name === '' && $size === null && $price === null) continue;
        if ($name === '') $name = 'Unit ' . ($i + 1);
        $units[] = [$name, $size, $price, $status, $garden, $beds ?: null];
    }
    $l['units'] = $units ?: null;

    // Photos: names of files already uploaded, in the chosen order.
    $photos = [];
    foreach (explode(',', (string) ($p['photos'] ?? '')) as $name) {
        $name = trim($name);
        if ($name !== '' && n24_photo_exists($name) && !in_array($name, $photos, true)) $photos[] = $name;
    }
    $l['photos'] = array_slice($photos, 0, 100);
    $l['img'] = $l['photos'][0] ?? null;

    // Keep the file tidy: no empty fields.
    foreach ($l as $k => $v) {
        if ($v === null && !in_array($k, ['price', 'img'], true)) unset($l[$k]);
    }
    if (!isset($l['features'])) $l['features'] = [];
    return [$l, $errors];
}

/** Values for the form fields from a saved listing. */
function n24_form_values(array $l): array
{
    $num = function ($v) {
        return $v === null || $v === '' ? '' : (string) $v;
    };
    return [
        'title' => $l['title'] ?? '', 'slug' => $l['slug'] ?? '', 'area' => $l['area'] ?? '', 'type' => $l['type'] ?? '',
        'price' => $num($l['price'] ?? null), 'size' => $num($l['size'] ?? null), 'plot' => $num($l['plot'] ?? null),
        'beds' => $num($l['beds'] ?? null), 'baths' => $num($l['baths'] ?? null), 'year' => $num($l['year'] ?? null),
        'parking' => $num($l['parking'] ?? null), 'garage' => $num($l['garage'] ?? null),
        'status' => $l['status'] ?? '', 'project' => $l['project'] ?? '',
        'renders' => !empty($l['renders']), 'hidden' => !empty($l['hidden']),
        'description' => implode("\n\n", $l['description'] ?? []),
        'features' => implode("\n", $l['features'] ?? []),
        'standards' => implode("\n", $l['standards'] ?? []),
        'units' => $l['units'] ?? [],
        'photos' => $l['photos'] ?? [],
    ];
}

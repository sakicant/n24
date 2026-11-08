<?php
/**
 * Listings storage: one JSON file, assets/data/listings.json, newest first.
 * The public pages read it directly; the admin is the only writer.
 *
 * Every save takes a lock, keeps a backup of the previous version in
 * api/data/backups/ and replaces the file in one step, so a visitor never
 * sees a half-written file.
 *
 * Works on PHP 7.4 and newer.
 */

// Warnings go to the server log, never into a page or a JSON answer.
ini_set('display_errors', '0');
ini_set('log_errors', '1');

define('N24_ROOT', dirname(__DIR__, 2));
define('N24_DATA', N24_ROOT . '/api/data');
define('N24_LISTINGS', N24_ROOT . '/assets/data/listings.json');
define('N24_PHOTOS', N24_ROOT . '/assets/img/listings');
define('N24_SITE', 'https://n24.hr');
define('N24_BACKUPS_KEPT', 200);

// Places: the 8 area pages first, then places that only show in search.
const N24_AREAS = [
    'vodice' => 'Vodice', 'srima' => 'Srima', 'sibenik' => 'Šibenik', 'brodarica' => 'Brodarica',
    'zaboric' => 'Žaborić', 'grebastica' => 'Grebaštica', 'primosten' => 'Primošten', 'rogoznica' => 'Rogoznica',
    'murter' => 'Murter', 'prvic' => 'Prvić',
];
const N24_COAST = ['vodice', 'srima', 'sibenik', 'brodarica', 'zaboric', 'grebastica', 'primosten', 'rogoznica'];
const N24_TYPES = ['house' => 'House', 'apartment' => 'Apartment', 'villa' => 'Villa', 'land' => 'Land', 'new-build' => 'New build'];
const N24_PROJECTS = ['' => 'None', 'primosten-resort' => 'Primošten Resort'];
const N24_PHOTO_WIDTHS = [640, 1200, 1920];

function n24_e($s): string
{
    return htmlspecialchars((string) $s, ENT_COMPAT | ENT_SUBSTITUTE, 'UTF-8'); // attributes always use double quotes
}

function n24_area_name(?string $id): string
{
    return N24_AREAS[$id] ?? 'Location to confirm';
}

function n24_euro($v): string
{
    return '€' . number_format((float) $v, 0, '.', ',');
}

/** Like Intl en-GB with at most 2 decimals: 1523 -> "1,523", 99.70 -> "99.7". */
function n24_num($v): string
{
    return rtrim(rtrim(number_format((float) $v, 2, '.', ','), '0'), '.');
}

function n24_slugify(string $s): string
{
    $s = strtr(mb_strtolower($s, 'UTF-8'), [
        'š' => 's', 'đ' => 'd', 'č' => 'c', 'ć' => 'c', 'ž' => 'z', 'ä' => 'a', 'ö' => 'o', 'ü' => 'u', 'ß' => 'ss',
        'é' => 'e', 'è' => 'e', 'à' => 'a', 'á' => 'a', 'í' => 'i', 'ó' => 'o', 'ú' => 'u', '²' => '2', '€' => 'eur',
    ]);
    $s = trim(preg_replace('/[^a-z0-9]+/', '-', $s), '-');
    $s = preg_replace('/-+/', '-', $s);
    return substr($s, 0, 80) ?: 'listing';
}

function n24_load(): array
{
    $raw = @file_get_contents(N24_LISTINGS);
    $data = $raw === false ? null : json_decode($raw, true);
    if (!is_array($data)) {
        throw new RuntimeException('The listings file could not be read.');
    }
    return $data;
}

/**
 * Read, change and save the listings under one lock.
 * $change gets the list and returns ['list' => new list, 'return' => value],
 * or ['skip' => true] to leave the file as it is.
 */
function n24_update(callable $change)
{
    if (!is_dir(N24_DATA . '/backups')) {
        @mkdir(N24_DATA . '/backups', 0750, true);
    }
    $lock = fopen(N24_DATA . '/listings.lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('The listings are busy. Try again in a moment.');
    }
    try {
        $list = n24_load();
        $result = $change($list);
        if (!empty($result['skip'])) {
            return $result['return'] ?? null; // nothing changed, nothing written
        }
        $new = $result['list'];
        $json = json_encode(array_values($new), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($json === false) {
            throw new RuntimeException('The listing could not be saved (invalid text).');
        }
        // Backup of the version being replaced; the oldest ones are removed.
        @copy(N24_LISTINGS, N24_DATA . '/backups/listings-' . date('Y-m-d-His') . '-' . substr(md5(uniqid('', true)), 0, 4) . '.json');
        $backups = glob(N24_DATA . '/backups/listings-*.json') ?: [];
        sort($backups);
        foreach (array_slice($backups, 0, max(0, count($backups) - N24_BACKUPS_KEPT)) as $old) {
            @unlink($old);
        }
        $tmp = N24_LISTINGS . '.tmp';
        if (file_put_contents($tmp, $json . "\n") === false || !rename($tmp, N24_LISTINGS)) {
            @unlink($tmp);
            throw new RuntimeException('The listings file could not be written on the server.');
        }
        return $result['return'] ?? null;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function n24_find(array $list, string $id): ?array
{
    foreach ($list as $l) {
        if (($l['id'] ?? '') === $id) {
            return $l;
        }
    }
    return null;
}

function n24_next_id(array $list): string
{
    $max = 300;
    foreach ($list as $l) {
        if (preg_match('/^n24-(\d+)$/', $l['id'] ?? '', $m)) {
            $max = max($max, (int) $m[1]);
        }
    }
    return 'n24-' . ($max + 1);
}

/** Address of the listing on the Croatian site (the default language). */
function n24_listing_path(array $l): string
{
    return '/nekretnina/' . $l['id'] . '-' . ($l['tr']['hr']['slug'] ?? $l['slug']) . '/';
}

// Languages of the website; a listing is entered in one of them ("lang").
const N24_LANGS = ['hr' => 'Croatian', 'en' => 'English', 'de' => 'German', 'pl' => 'Polish', 'cs' => 'Czech', 'sk' => 'Slovak'];

/**
 * Fingerprint of the text as entered. Must give the same result as source_hash() in
 * tools/listing_tr.py, which stores it as "tr_src" when the translations are made.
 */
function n24_source_hash(array $l): string
{
    $src = [
        'description' => array_values($l['description'] ?? []),
        'features' => array_values($l['features'] ?? []),
        'standards' => array_values($l['standards'] ?? []),
        'status' => (string) ($l['status'] ?? ''),
        'title' => (string) ($l['title'] ?? ''),
        'units' => array_map(function ($u) { return (string) $u[0]; }, $l['units'] ?? []),
    ];
    return substr(sha1(json_encode($src, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)), 0, 12);
}

/**
 * Translation state: [] when all languages are translated from the current text,
 * otherwise the names of the languages still to do.
 */
function n24_translation_todo(array $l): array
{
    $todo = [];
    $current = ($l['tr_src'] ?? '') === n24_source_hash($l);
    foreach (N24_LANGS as $code => $name) {
        if ($code === ($l['lang'] ?? 'en')) continue;
        if (empty($l['tr'][$code]) || !$current) $todo[] = $name;
    }
    return $todo;
}

function n24_photo_exists(string $name): bool
{
    return preg_match('/^[a-z0-9-]+$/', $name) === 1 && is_file(N24_PHOTOS . '/' . $name . '-640.webp');
}

/**
 * Deletes a photo's three WebP files, unless a static page still uses it
 * (the Primošten Resort page shows the photos of N24-231).
 */
function n24_delete_photo(string $name): void
{
    if (!preg_match('/^[a-z0-9-]+$/', $name)) {
        return;
    }
    $resort = @file_get_contents(N24_ROOT . '/primosten-resort/index.html') ?: '';
    if (strpos($resort, '/' . $name . '-') !== false || strpos($resort, $name . ',') !== false || strpos($resort, ',' . $name . '"') !== false) {
        return;
    }
    foreach (N24_PHOTO_WIDTHS as $w) {
        @unlink(N24_PHOTOS . '/' . $name . '-' . $w . '.webp');
    }
}

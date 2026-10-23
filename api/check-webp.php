<?php
/**
 * One-time check: can this server turn photos into WebP?
 * Upload, open https://<domain>/api/check-webp.php once, then DELETE this file.
 * It shows only yes/no answers, no paths or versions.
 */
require __DIR__ . '/lib/images.php';

header('Content-Type: text/plain; charset=utf-8');
header('X-Robots-Tag: noindex');

$s = n24_image_support();
$yes = function ($v) { return $v ? 'yes' : 'no'; };

echo "N24 photo support on this server\n\n";
echo 'GD image library:        ' . $yes($s['gd']) . "\n";
echo 'GD can write WebP:       ' . $yes($s['gd_webp']) . "\n";
echo 'EXIF (photo rotation):   ' . $yes($s['exif']) . "\n";
echo 'Imagick:                 ' . $yes($s['imagick']) . "\n";
echo 'Imagick can write WebP:  ' . $yes($s['imagick_webp']) . "\n";
echo 'Imagick reads iPhone HEIC: ' . $yes($s['imagick_heic']) . "\n\n";

if ($s['imagick_webp'] || $s['gd_webp']) {
    echo "RESULT: OK. Uploaded photos will be saved as WebP.\n";
} else {
    echo "RESULT: NOT READY. Ask the host to enable WebP in GD or install Imagick.\n";
}
echo "\nDelete check-webp.php from the server now.\n";

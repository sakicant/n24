<?php
/**
 * Listing photos: every uploaded image is stored as WebP, whatever was uploaded.
 *
 * - Accepts JPEG, PNG, WebP and GIF through GD; HEIC/HEIF (iPhone) too when Imagick is installed.
 * - Turns the photo upright using its EXIF orientation, then re-encodes it,
 *   which drops all metadata (camera, GPS location, owner names).
 * - Saves three widths for phones, tablets and desktops, never upscaling:
 *     <name>-640.webp, <name>-1200.webp, <name>-1920.webp
 *
 * Usage from the admin upload handler:
 *   require __DIR__ . '/lib/images.php';
 *   $saved = n24_save_listing_image($_FILES['photo']['tmp_name'], $dir, 'n24-301-stone-house-1');
 *   // $saved = ['640' => '/abs/path/...-640.webp', '1200' => ..., '1920' => ...]
 */

const N24_IMAGE_WIDTHS = [640, 1200, 1920];
const N24_IMAGE_QUALITY = 80;
const N24_IMAGE_MAX_BYTES = 25 * 1024 * 1024; // 25 MB per uploaded photo

/** What this server can do; used by check-webp.php and to pick an engine. */
function n24_image_support(): array
{
    $gd = function_exists('gd_info') ? gd_info() : [];
    $imagick = class_exists('Imagick');
    $imagickFormats = $imagick ? Imagick::queryFormats() : [];
    return [
        'gd' => !empty($gd),
        'gd_webp' => !empty($gd['WebP Support']) && function_exists('imagewebp'),
        'exif' => function_exists('exif_read_data'),
        'imagick' => $imagick,
        'imagick_webp' => in_array('WEBP', $imagickFormats, true),
        'imagick_heic' => in_array('HEIC', $imagickFormats, true),
    ];
}

/**
 * Converts one uploaded file and writes the WebP sizes into $destDir.
 * Throws RuntimeException with a message that is safe to show in the admin.
 */
function n24_save_listing_image(string $srcPath, string $destDir, string $baseName): array
{
    if (!is_file($srcPath) || filesize($srcPath) === 0) {
        throw new RuntimeException('The photo did not upload. Try again.');
    }
    if (filesize($srcPath) > N24_IMAGE_MAX_BYTES) {
        throw new RuntimeException('The photo is larger than 25 MB. Choose a smaller one.');
    }
    // Only letters, numbers and dashes in file names.
    $baseName = trim(preg_replace('/[^a-z0-9-]+/', '-', strtolower($baseName)), '-');
    if ($baseName === '') {
        throw new RuntimeException('The photo needs a name.');
    }
    if (!is_dir($destDir) && !mkdir($destDir, 0755, true)) {
        throw new RuntimeException('The photo folder could not be created on the server.');
    }

    $support = n24_image_support();
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($srcPath);

    if ($support['imagick'] && $support['imagick_webp']) {
        return n24_save_with_imagick($srcPath, $destDir, $baseName);
    }
    if ($support['gd_webp']) {
        return n24_save_with_gd($srcPath, $mime, $destDir, $baseName);
    }
    throw new RuntimeException('This server cannot create WebP images. Ask the website developer.');
}

function n24_save_with_gd(string $srcPath, string $mime, string $destDir, string $baseName): array
{
    switch ($mime) {
        case 'image/jpeg': $img = @imagecreatefromjpeg($srcPath); break;
        case 'image/png':  $img = @imagecreatefrompng($srcPath); break;
        case 'image/webp': $img = @imagecreatefromwebp($srcPath); break;
        case 'image/gif':  $img = @imagecreatefromgif($srcPath); break;
        default:
            throw new RuntimeException('Use a JPG, PNG or WebP photo. iPhone HEIC photos are converted in the browser first.');
    }
    if (!$img) {
        throw new RuntimeException('The photo could not be read. It may be damaged.');
    }

    // Turn the photo upright: phones store rotation in EXIF instead of rotating pixels.
    if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
        $exif = @exif_read_data($srcPath);
        $angle = [3 => 180, 6 => -90, 8 => 90][$exif['Orientation'] ?? 1] ?? 0;
        if ($angle) {
            $rotated = imagerotate($img, $angle, 0);
            imagedestroy($img);
            $img = $rotated;
        }
    }

    imagepalettetotruecolor($img);
    $w = imagesx($img);
    $h = imagesy($img);
    $saved = [];

    foreach (N24_IMAGE_WIDTHS as $target) {
        $tw = min($target, $w);
        $th = (int) round($h * $tw / $w);
        $out = imagecreatetruecolor($tw, $th);
        imagealphablending($out, false);
        imagesavealpha($out, true);
        imagecopyresampled($out, $img, 0, 0, 0, 0, $tw, $th, $w, $h);
        $path = $destDir . '/' . $baseName . '-' . $target . '.webp';
        if (!imagewebp($out, $path, N24_IMAGE_QUALITY)) {
            imagedestroy($out);
            imagedestroy($img);
            throw new RuntimeException('The photo could not be saved on the server.');
        }
        imagedestroy($out);
        $saved[(string) $target] = $path;
    }

    imagedestroy($img);
    return $saved;
}

function n24_save_with_imagick(string $srcPath, string $destDir, string $baseName): array
{
    try {
        $src = new Imagick($srcPath);
        $src->setIteratorIndex(0); // first frame of GIFs and multi-image HEICs
        $src->autoOrient();
        $src->stripImage(); // drop EXIF, GPS and other metadata
        $w = $src->getImageWidth();
        $saved = [];
        foreach (N24_IMAGE_WIDTHS as $target) {
            $img = clone $src;
            if ($w > $target) {
                $img->resizeImage($target, 0, Imagick::FILTER_LANCZOS, 1);
            }
            $img->setImageFormat('webp');
            $img->setImageCompressionQuality(N24_IMAGE_QUALITY);
            $path = $destDir . '/' . $baseName . '-' . $target . '.webp';
            $img->writeImage($path);
            $img->clear();
            $saved[(string) $target] = $path;
        }
        $src->clear();
        return $saved;
    } catch (ImagickException $e) {
        throw new RuntimeException('The photo could not be read. Use a JPG, PNG, WebP or HEIC photo.');
    }
}

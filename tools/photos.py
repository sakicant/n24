"""Turn a folder of listing photos into the website's WebP files.

Usage:
    python tools/photos.py <photo-folder> <listing-slug>

Example:
    python tools/photos.py "C:/photos/stone house vodice" n24-301-stone-house-vodice

Writes assets/img/listings/<slug>-1-640.webp, -1-1200.webp, -1-1920.webp, then -2-..., in
file-name order, so name the main photo so it sorts first (for example 01.jpg). Photos are
turned upright from their EXIF rotation and saved without metadata (no GPS location).
Accepts JPG, PNG, WebP, GIF and TIFF; HEIC needs the pillow-heif package.
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

WIDTHS = (640, 1200, 1920)
QUALITY = 80
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.tif', '.tiff', '.heic', '.heif'}

try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    pass


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, slug = Path(sys.argv[1]), sys.argv[2].strip().lower()
    out = Path(__file__).resolve().parent.parent / 'assets' / 'img' / 'listings'
    out.mkdir(parents=True, exist_ok=True)
    photos = sorted(p for p in src.iterdir() if p.suffix.lower() in EXTS)
    if not photos:
        sys.exit(f'No photos found in {src}')
    for i, path in enumerate(photos, 1):
        try:
            img = ImageOps.exif_transpose(Image.open(path)).convert('RGB')
        except Exception as e:  # unreadable or unsupported file
            print(f'skipped {path.name}: {e}')
            continue
        for w in WIDTHS:
            copy = img.copy()
            if copy.width > w:
                copy = copy.resize((w, round(copy.height * w / copy.width)), Image.LANCZOS)
            # Saving a fresh RGB image writes no EXIF, so GPS and camera data are dropped.
            copy.save(out / f'{slug}-{i}-{w}.webp', 'WEBP', quality=QUALITY, method=6)
        print(f'{path.name} -> {slug}-{i}-*.webp')
    print(f'Done: {len(photos)} photos for {slug}')


if __name__ == '__main__':
    main()

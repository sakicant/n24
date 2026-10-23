// Admin photo upload: shrink and convert each photo to WebP in the browser before
// it is sent, so a 10 MB phone photo uploads as a few hundred KB, even on mobile data.
// The server still converts everything to WebP (api/lib/images.php); this only makes
// uploads fast. Browsers that cannot encode WebP send a JPEG instead.
window.N24ImagePrep = (function () {
  'use strict';

  var MAX_SIDE = 2400;   // the server makes 640, 1200 and 1920 px versions from this
  var QUALITY = 0.85;

  function canvasToBlob(canvas, type, quality) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, type, quality); });
  }

  function loadImage(file) {
    // createImageBitmap applies the EXIF rotation, so the photo comes out upright.
    if (window.createImageBitmap) {
      return createImageBitmap(file, { imageOrientation: 'from-image' }).catch(function () { return viaImgTag(file); });
    }
    return viaImgTag(file);
  }

  function viaImgTag(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('This photo could not be opened.')); };
      img.src = url;
    });
  }

  // Returns a Promise of { blob, name, width, height }. If the browser cannot open
  // the file (for example HEIC on some computers), the original file is returned
  // untouched and the server converts it.
  function prepare(file) {
    return loadImage(file).then(function (img) {
      var w = img.width, h = img.height;
      var scale = Math.min(1, MAX_SIDE / Math.max(w, h));
      var canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvasToBlob(canvas, 'image/webp', QUALITY).then(function (blob) {
        if (blob && blob.type === 'image/webp') return { blob: blob, ext: 'webp' };
        return canvasToBlob(canvas, 'image/jpeg', QUALITY).then(function (jpg) { return { blob: jpg, ext: 'jpg' }; });
      }).then(function (out) {
        // A photo that is already small and compressed can grow when re-encoded;
        // then the original goes up as it is.
        if (scale === 1 && out.blob.size >= file.size) {
          return { blob: file, name: file.name, width: canvas.width, height: canvas.height };
        }
        var base = file.name.replace(/\.[^.]+$/, '');
        return { blob: out.blob, name: base + '.' + out.ext, width: canvas.width, height: canvas.height };
      });
    }).catch(function () {
      return { blob: file, name: file.name, width: 0, height: 0 };
    });
  }

  return { prepare: prepare };
})();

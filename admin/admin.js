// N24 admin: listing search, photo upload and order, unit rows, delete confirm.
(function () {
  'use strict';

  // ---------------------------------------------------------------- overview search
  var filter = document.getElementById('filter');
  if (filter) {
    filter.addEventListener('input', function () {
      var q = filter.value.trim().toLowerCase();
      Array.prototype.forEach.call(document.querySelectorAll('#rows li'), function (li) {
        li.hidden = q && li.getAttribute('data-search').indexOf(q) === -1;
      });
    });
  }

  var form = document.getElementById('edit');
  if (!form) return;

  // ---------------------------------------------------------------- unsaved changes warning
  var dirty = false;
  form.addEventListener('input', function () { dirty = true; });
  form.addEventListener('change', function () { dirty = true; });
  form.addEventListener('submit', function () { dirty = false; });
  window.addEventListener('beforeunload', function (e) {
    if (dirty || busy > 0) { e.preventDefault(); e.returnValue = ''; }
  });

  // ---------------------------------------------------------------- photos
  var list = document.getElementById('photo-list');
  var field = document.getElementById('photos');
  var input = document.getElementById('photo-input');
  var drop = document.getElementById('drop');
  var status = document.getElementById('upload-status');
  var saveBtn = document.getElementById('save');
  var busy = 0;

  function sync() {
    var names = [];
    Array.prototype.forEach.call(list.querySelectorAll('li[data-name]'), function (li) { names.push(li.getAttribute('data-name')); });
    field.value = names.join(',');
  }

  function tools() {
    return '<div class="ph-tools"><button type="button" data-move="-1" aria-label="Move left">←</button>' +
      '<button type="button" data-move="1" aria-label="Move right">→</button>' +
      '<button type="button" data-remove aria-label="Remove photo">✕</button></div>';
  }

  list.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    var li = b.closest('li');
    if (b.hasAttribute('data-remove')) {
      li.remove();
    } else {
      var d = +b.getAttribute('data-move');
      var other = d < 0 ? li.previousElementSibling : li.nextElementSibling;
      if (other) list.insertBefore(li, d < 0 ? other : other.nextElementSibling);
    }
    sync();
    dirty = true;
  });

  function setStatus(text, isError) {
    status.textContent = text;
    status.className = 'upload-status' + (isError ? ' is-error' : '');
  }

  function updateBusy() {
    saveBtn.disabled = busy > 0;
    saveBtn.textContent = busy > 0 ? 'Uploading photos...' : 'Save';
  }

  var queue = [];
  var errors = [];
  var total = 0;
  var done = 0;

  function next() {
    if (!queue.length) return;
    var job = queue.shift();
    busy++;
    updateBusy();
    window.N24ImagePrep.prepare(job.file).then(function (prep) {
      var fd = new FormData();
      fd.append('csrf', form.getAttribute('data-csrf'));
      fd.append('id', form.getAttribute('data-id'));
      fd.append('photo', prep.blob, prep.name);
      return fetch('/admin/?a=upload', { method: 'POST', body: fd, credentials: 'same-origin' })
        .then(function (r) {
          return r.json().catch(function () { return { ok: false, error: 'The server did not accept this photo (it may be too large).' }; });
        });
    }).then(function (res) {
      if (res.ok) {
        job.li.setAttribute('data-name', res.name);
        job.li.className = '';
        job.li.innerHTML = '<img src="/assets/img/listings/' + res.name + '-640.webp" alt="">' + tools();
        dirty = true;
      } else {
        job.li.remove();
        errors.push(job.file.name + ': ' + res.error);
      }
    }).catch(function () {
      job.li.remove();
      errors.push(job.file.name + ': no connection to the server.');
    }).then(function () {
      busy--;
      done++;
      sync();
      updateBusy();
      if (busy === 0 && !queue.length) {
        setStatus(errors.length ? 'Some photos were not added. ' + errors.join(' ') : done + ' photo' + (done === 1 ? '' : 's') + ' added. Press Save to keep them.', errors.length > 0);
        errors = []; total = 0; done = 0;
      } else {
        setStatus('Uploading ' + (done + 1) + ' of ' + total + '...');
      }
      next();
    });
  }

  function addFiles(files) {
    var images = Array.prototype.filter.call(files, function (f) { return /^image\//.test(f.type) || /\.(heic|heif)$/i.test(f.name); });
    if (!images.length) return;
    total += images.length;
    images.forEach(function (file) {
      var li = document.createElement('li');
      li.className = 'uploading';
      li.textContent = 'Uploading...';
      list.appendChild(li);
      queue.push({ file: file, li: li });
    });
    setStatus('Uploading ' + (done + 1) + ' of ' + total + '...');
    // Two at a time: quick, without overloading a phone connection.
    for (var i = busy; i < 2; i++) next();
  }

  input.addEventListener('change', function () { addFiles(input.files); input.value = ''; });
  ['dragenter', 'dragover'].forEach(function (t) {
    drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (t) {
    drop.addEventListener(t, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
  });
  drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });

  // ---------------------------------------------------------------- unit rows
  var units = document.getElementById('units');
  document.getElementById('unit-add').addEventListener('click', function () {
    var row = units.lastElementChild.cloneNode(true);
    Array.prototype.forEach.call(row.querySelectorAll('input'), function (i) { i.value = ''; });
    row.querySelector('select').selectedIndex = 0;
    units.appendChild(row);
    row.querySelector('input').focus();
  });
  units.addEventListener('click', function (e) {
    if (!e.target.closest('[data-unit-remove]')) return;
    var row = e.target.closest('tr');
    if (units.rows.length > 1) row.remove();
    else Array.prototype.forEach.call(row.querySelectorAll('input'), function (i) { i.value = ''; });
    dirty = true;
  });
})();

// ---------------------------------------------------------------- delete confirm
(function () {
  var del = document.querySelector('.delete-form');
  if (!del) return;
  del.addEventListener('submit', function (e) {
    if (!window.confirm('Delete "' + del.getAttribute('data-title') + '" and all its photos? This cannot be undone.')) e.preventDefault();
  });
})();

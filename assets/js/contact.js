(function () {
  'use strict';

  var form = document.getElementById('enquiry');
  if (!form) return;

  // Preselect the topic from links such as /contact/?topic=land
  var topic = new URLSearchParams(location.search).get('topic');
  var radio = topic && form.querySelector('input[name="topic"][value="' + topic + '"]');
  if (radio) radio.checked = true;

  var checks = [
    { input: 'f-name', error: 'e-name', ok: function (v) { return v.trim().length > 1; } },
    { input: 'f-email', error: 'e-email', ok: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); } },
    { input: 'f-msg', error: 'e-msg', ok: function (v) { return v.trim().length > 4; } },
    { input: 'f-consent', error: 'e-consent', ok: function (v, el) { return el.checked; } }
  ];

  function validate(c) {
    var el = document.getElementById(c.input);
    var err = document.getElementById(c.error);
    var good = c.ok(el.value, el);
    err.hidden = good;
    el.setAttribute('aria-invalid', String(!good));
    if (!good) el.setAttribute('aria-describedby', c.error); else el.removeAttribute('aria-describedby');
    return good;
  }

  checks.forEach(function (c) {
    var el = document.getElementById(c.input);
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', function () {
      if (el.getAttribute('aria-invalid') === 'true') validate(c);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    checks.forEach(function (c) {
      if (!validate(c) && !firstBad) firstBad = document.getElementById(c.input);
    });
    if (firstBad) { firstBad.focus(); return; }

    // The PHP backend comes in phase 2; until then the preview says so honestly.
    var status = document.getElementById('form-status');
    status.hidden = false;
    status.textContent = 'This preview is not connected to email yet. Please call or WhatsApp Tomislav on +385 95 700 7001.';
  });
})();

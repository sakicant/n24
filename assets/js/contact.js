(function () {
  'use strict';

  var form = document.getElementById('enquiry');
  if (!form) return;

  // Preselect the topic from links such as /contact/?topic=land
  var topic = new URLSearchParams(location.search).get('topic');
  var radio = topic && form.querySelector('input[name="topic"][value="' + topic + '"]');
  if (radio) radio.checked = true;

  // Each topic gets its own example, so people know what to write.
  var msg = document.getElementById('f-msg');
  var hint = document.getElementById('topic-hint');
  var C = window.N24_I18N.t.contact;
  var TOPICS = {
    buy: { ph: C.ph_buy },
    sell: { ph: C.ph_sell, hint: C.hint_sell },
    land: { ph: C.ph_land },
    other: { ph: C.ph_other }
  };
  function applyTopic() {
    var t = form.querySelector('input[name="topic"]:checked').value;
    msg.placeholder = TOPICS[t].ph;
    hint.hidden = !TOPICS[t].hint;
    hint.innerHTML = TOPICS[t].hint
      ? TOPICS[t].hint.replace('+385 95 700 7001', '<a href="https://wa.me/385957007001">+385 95 700 7001</a>')
      : '';
  }
  Array.prototype.forEach.call(form.querySelectorAll('input[name="topic"]'), function (r) {
    r.addEventListener('change', applyTopic);
  });
  applyTopic();

  // Coming from a property page: start the message with the property and its reference.
  var params = new URLSearchParams(location.search);
  if (params.get('ref') && !msg.value) {
    msg.value = C.interested.replace('{title}', params.get('title') ? '"' + params.get('title') + '" ' : '').replace('{ref}', params.get('ref'));
  }

  // Without JavaScript the form posts normally and comes back with ?sent=1 or ?error=1.
  var back = document.getElementById('form-status');
  if (params.get('sent') || params.get('error')) {
    back.hidden = false;
    back.className = 'form-status ' + (params.get('sent') ? 'is-ok' : 'is-error');
    back.textContent = params.get('sent')
      ? C.sent
      : C.failed;
  }

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

    var status = document.getElementById('form-status');
    var button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    status.hidden = false;
    status.className = 'form-status';
    status.textContent = C.sending;
    var data = new FormData(form);
    data.append('lang', window.N24_I18N.lang);
    fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        status.textContent = res.message;
        status.className = 'form-status ' + (res.ok ? 'is-ok' : 'is-error');
        if (res.ok) form.reset(); else button.disabled = false;
        if (res.ok) applyTopic();
      })
      .catch(function () {
        status.textContent = C.failed;
        status.className = 'form-status is-error';
        button.disabled = false;
      });
  });
})();

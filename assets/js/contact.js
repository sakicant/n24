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
  var TOPICS = {
    buy: { ph: 'For example: a house with a sea view in Primošten or Rogoznica, up to €600,000.' },
    sell: {
      ph: 'For example: 3-bedroom house in Vodice, 140 m² on a 500 m² plot, 300 m from the sea. Asking about €400,000.',
      hint: 'Selling? Tell Tomislav the place, type, size, plot size and your asking price if you have one. Photos are easiest by WhatsApp on +385 95 700 7001.'
    },
    land: { ph: 'For example: building plot of about 1,000 m² near Grebaštica or Žaborić, for a holiday house.' },
    other: { ph: 'How can Tomislav help?' }
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
    msg.value = 'I am interested in ' + (params.get('title') ? '"' + params.get('title') + '" ' : '') + '(' + params.get('ref') + '). ';
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

    // The PHP backend comes in phase 2; until then the preview says so honestly.
    var status = document.getElementById('form-status');
    status.hidden = false;
    status.textContent = 'This preview is not connected to email yet. Please call or WhatsApp Tomislav on +385 95 700 7001.';
  });
})();

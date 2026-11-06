(function () {
  'use strict';
  var bridge = window.ProgressBridge;
  if (!bridge) return;
  var api = location.hostname === 'localhost' ? 'http://localhost:8787' : (window.PROGRESS_API_URL || '');
  var storageKey = 'tsPwPath.sync.v1';
  var codePattern = /^pw1_[a-f0-9]{64}$/;
  var config = { code: '', pending: {} }, busy = false, timer, epoch = 0;
  try {
    var stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (stored && codePattern.test(stored.code)) config = { code: stored.code, pending: stored.pending || {} };
  } catch (_) {}
  var panel = document.getElementById('cloud-sync');
  var status = document.getElementById('sync-status');
  var connected = document.getElementById('sync-connected');
  var setup = document.getElementById('sync-setup');
  var codeInput = document.getElementById('sync-code');
  var savedCode = document.getElementById('sync-saved-code');

  function snapshot() {
    var state = bridge.read(), values = {};
    for (var d = 1; d <= 70; d++) values['day:' + d] = state.done.indexOf(d) >= 0;
    for (var l = 0; l < 16; l++) values['lab:' + l] = state.labs.indexOf(l) >= 0;
    for (var q = 0; q < 11; q++) values['quiz:' + q] = Object.prototype.hasOwnProperty.call(state.quiz, q) ? state.quiz[q] : null;
    return values;
  }
  var last = snapshot();
  function display(message) { status.textContent = message; }
  function persist() {
    localStorage.setItem(storageKey, JSON.stringify(config));
  }
  function refresh() {
    connected.hidden = !config.code;
    setup.hidden = !!config.code;
    savedCode.value = config.code;
  }
  function apply(values) {
    var state = bridge.read();
    state.done = []; state.labs = []; state.quiz = {};
    for (var d = 1; d <= 70; d++) if (values['day:' + d] === true) state.done.push(d);
    for (var l = 0; l < 16; l++) if (values['lab:' + l] === true) state.labs.push(l);
    for (var q = 0; q < 11; q++) {
      var answer = values['quiz:' + q];
      if (Number.isInteger(answer) && answer >= 0 && answer < 4) state.quiz[q] = answer;
    }
    bridge.apply(state);
    last = snapshot();
  }
  async function request(method, code, changes) {
    var response = await fetch(api.replace(/\/$/, '') + '/api/progress', {
      method: method,
      headers: { Authorization: 'Bearer ' + code, 'Content-Type': 'application/json' },
      body: method === 'GET' ? undefined : JSON.stringify({ changes: changes }),
      signal: AbortSignal.timeout(15000)
    });
    var body = await response.json();
    if (!response.ok) throw new Error(body.error || 'Cloud sync failed');
    return body.values;
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(sync, 700); }
  async function sync() {
    if (!config.code || !api || busy) return;
    busy = true;
    var ticket = epoch, sent = Object.assign({}, config.pending);
    display('Syncing…');
    try {
      var values = await request(Object.keys(sent).length ? 'PATCH' : 'GET', config.code, sent);
      if (ticket !== epoch) return;
      Object.keys(sent).forEach(function (key) {
        if (config.pending[key] === sent[key]) delete config.pending[key];
      });
      // Changes made while the request was in flight stay queued and visible.
      apply(Object.assign({}, values, config.pending));
      persist();
      display(Object.keys(config.pending).length ? 'Saving your latest changes…' : 'Progress saved to cloud');
    } catch (_) {
      if (ticket === epoch) display('Cloud unavailable. Your changes are saved in this browser; use Retry when online.');
    } finally {
      busy = false;
      if (ticket === epoch && Object.keys(config.pending).length && navigator.onLine) {
        // A bounded retry avoids hammering the API if it is down.
        clearTimeout(timer); timer = setTimeout(sync, 30000);
      }
    }
  }
  window.addEventListener('progress-change', function () {
    var now = snapshot();
    Object.keys(now).forEach(function (key) {
      if (now[key] !== last[key] && config.code) config.pending[key] = now[key];
    });
    last = now;
    if (config.code) {
      try { persist(); display('Saved in browser; uploading…'); schedule(); }
      catch (_) { display('Browser storage is full or disabled. Keep this page open and retry cloud saving.'); sync(); }
    }
  });
  async function establish(create) {
    if (busy) return;
    if (!api) { display('Cloud sync is awaiting deployment. Progress is still saved in this browser.'); return; }
    var code = codeInput.value.trim();
    if (create) {
      var bytes = crypto.getRandomValues(new Uint8Array(32));
      code = 'pw1_' + Array.from(bytes, function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }
    if (!codePattern.test(code)) { display('Enter the complete sync code, starting with pw1_.'); return; }
    busy = true;
    panel.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    display(create ? 'Creating your cloud progress…' : 'Connecting…');
    try {
      // Test durable local storage before creating a cloud vault.
      localStorage.setItem(storageKey + '.check', '1'); localStorage.removeItem(storageKey + '.check');
      var local = snapshot();
      var values = await request(create ? 'POST' : 'GET', code, local);
      config = { code: code, pending: {} };
      if (!create && document.getElementById('sync-merge').checked) {
        // On first connection only, keep local completed work. Cloud answers win conflicts.
        Object.keys(local).forEach(function (key) {
          if ((key.indexOf('quiz:') === 0 ? values[key] == null && local[key] !== null : local[key] === true && values[key] !== true)) {
            config.pending[key] = local[key];
          }
        });
      }
      var latest = snapshot();
      Object.keys(latest).forEach(function (key) {
        if (latest[key] !== local[key]) config.pending[key] = latest[key];
      });
      persist();
      apply(Object.assign({}, values, config.pending));
      codeInput.value = '';
      refresh();
      document.getElementById('sync-code-details').open = create;
      display(create ? 'Cloud saving is connected. Copy your private code and keep it somewhere safe.' : 'Connected. Your progress is available on this device.');
    } catch (error) {
      display(error.message === 'Failed to fetch' ? 'Could not reach cloud saving. Your browser progress is safe.' : error.message);
    } finally {
      busy = false;
      panel.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
      if (config.code && Object.keys(config.pending).length) schedule();
    }
  }
  document.getElementById('sync-create').addEventListener('click', function () { establish(true); });
  document.getElementById('sync-connect').addEventListener('click', function () { establish(false); });
  codeInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); establish(false); } });
  document.getElementById('sync-retry').addEventListener('click', sync);
  document.getElementById('sync-disconnect').addEventListener('click', function () {
    epoch++;
    clearTimeout(timer);
    config = { code: '', pending: {} };
    localStorage.removeItem(storageKey);
    savedCode.type = 'password';
    document.getElementById('sync-show').textContent = 'Show';
    refresh();
    display('Disconnected. Progress remains in this browser and in the cloud. Keep your code to reconnect.');
  });
  document.getElementById('sync-show').addEventListener('click', function () {
    savedCode.type = savedCode.type === 'password' ? 'text' : 'password';
    this.textContent = savedCode.type === 'password' ? 'Show' : 'Hide';
  });
  document.getElementById('sync-copy').addEventListener('click', async function () {
    try { await navigator.clipboard.writeText(config.code); display('Private sync code copied. Store it safely; anyone with it can access your progress.'); }
    catch (_) { savedCode.type = 'text'; savedCode.select(); display('Select and copy your private code.'); }
  });
  window.addEventListener('online', sync);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) sync(); });
  setInterval(function () { if (!document.hidden) sync(); }, 60000);
  refresh();
  if (config.code) sync();
})();

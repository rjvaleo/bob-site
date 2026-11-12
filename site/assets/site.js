(function () {
  var KEY = 'safe-housing-cart';
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return window.__cart || []; } }
  function save(c) { window.__cart = c; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }
  function toast(msg) {
    each('.toast', function (t) { t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(function () { t.hidden = true; }, 2600); });
  }
  function gs(t) {
    var page = t.closest('main') || document, v = t.value;
    Array.prototype.forEach.call(page.querySelectorAll('.prog'), function (p) { var st = p.getAttribute('data-state'); p.hidden = !(st === 'us' || st === v); });
    var h = page.querySelector('.gstate-title'); if (h) h.textContent = v === 'us' ? 'Programs open nationwide' : 'Programs for ' + t.options[t.selectedIndex].text;
  }
  function render() {
    var c = load(), n = c.reduce(function (a, i) { return a + i.qty; }, 0);
    each('.cc', function (el) { el.textContent = n; });
    each('.cart-items', function (box) {
      if (!c.length) { box.innerHTML = '<div class="card stack"><h3>Your cart is empty.</h3><p class="muted">Start with the foundation and work up.</p><a class="btn gold sm" style="align-self:flex-start" href="shop.html">Shop materials</a></div>'; return; }
      box.innerHTML = c.map(function (i, k) {
        return '<article class="card item"><img src="' + esc(i.img) + '" alt=""><div class="grow stack" style="gap:4px"><h3>' + esc(i.name) + '</h3><span class="muted">' + esc(i.phase) + ' · Arrives [DATE]</span>' +
          '<button type="button" class="linkbtn rm" data-k="' + k + '">Remove</button></div>' +
          '<div class="field" style="width:96px"><label>Quantity<input class="qty" data-k="' + k + '" type="number" min="1" value="' + i.qty + '"></label></div><span class="price">[PRICE]</span></article>';
      }).join('');
    });
    each('.cart-count-line', function (el) { el.textContent = n + (n === 1 ? ' item' : ' items'); });
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('button, a') : null; if (!t) return;
    if (t.classList.contains('add')) {
      var c = load(), name = t.getAttribute('data-name'), hit = null;
      c.forEach(function (i) { if (i.name === name) hit = i; });
      if (hit) hit.qty += 1; else c.push({ name: name, phase: t.getAttribute('data-phase'), img: t.getAttribute('data-img'), qty: 1 });
      save(c); render(); toast(name + ' added to your cart');
    } else if (t.classList.contains('rm')) {
      var c2 = load(); c2.splice(+t.getAttribute('data-k'), 1); save(c2); render();
    } else if (t.classList.contains('dept')) {
      var d = t.getAttribute('data-dept'), page = t.closest('main') || document;
      Array.prototype.forEach.call(page.querySelectorAll('.dept'), function (b) { b.classList.toggle('on', b === t); b.setAttribute('aria-pressed', b === t ? 'true' : 'false'); });
      Array.prototype.forEach.call(page.querySelectorAll('.prod'), function (p) { p.hidden = d !== 'all' && p.getAttribute('data-dept') !== d; });
      var h = page.querySelector('.dept-title'); if (h) h.textContent = t.textContent;
    } else if (t.classList.contains('tab')) {
      var box = t.closest('.tabs'), idx = t.getAttribute('data-i');
      Array.prototype.forEach.call(box.querySelectorAll('.tab'), function (b) { var on = b === t; b.classList.toggle('on', on); b.setAttribute('aria-selected', on ? 'true' : 'false'); });
      Array.prototype.forEach.call(box.querySelectorAll('.tabpanel'), function (p) { p.hidden = p.getAttribute('data-i') !== idx; });
    } else if (t.classList.contains('send')) {
      var f = t.closest('form'); if (f) f.innerHTML = '<h3>Thank you.</h3><p class="muted">We have your message and will be in touch.</p>';
    }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.classList.contains('qty')) { var c = load(); c[+t.getAttribute('data-k')].qty = Math.max(1, parseInt(t.value, 10) || 1); save(c); render(); }
    if (t.classList.contains('gstate')) gs(t);
  });
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function countUp(el) {
    var m = el.textContent.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/); if (!m || +m[2] >= 1000 || +m[2] === 0) return;
    var end = +m[2], dec = (m[2].split('.')[1] || '').length, t0 = null;
    function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 900), e = 1 - Math.pow(1 - k, 3); el.textContent = m[1] + (end * e).toFixed(dec) + m[3]; if (k < 1) requestAnimationFrame(step); else el.textContent = m[1] + m[2] + m[3]; }
    requestAnimationFrame(step);
  }
  if (!still && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return; var el = en.target; io.unobserve(el); el.classList.add('in');
        Array.prototype.forEach.call(el.querySelectorAll('.num, .big'), countUp);
      });
    }, { threshold: 0.12 });
    each('.tile, .prod, .proof > div, .stats > div, .tick, .prog, .split > *, .steps li, .quote, details', function (el, i) {
      el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el);
    });
  }
  document.addEventListener('pagechange', render);
  render();
  each('.gstate', gs);
})();

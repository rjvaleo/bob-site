(function () {
  var ok = false;
  try { ok = sessionStorage.getItem('site-access') === 'yes'; } catch (e) {}
  if (ok) return;
  document.documentElement.style.visibility = 'hidden';
  try { sessionStorage.setItem('site-next', location.pathname.split('/').pop() || 'index.html'); } catch (e) {}
  location.replace('login.html');
})();

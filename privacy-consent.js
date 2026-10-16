(function () {
  'use strict';
  var storageKey = 'mamevyklizeno_cookie_choice';
  var version = 1;
  var lifetime = 180 * 24 * 60 * 60 * 1000;
  var tagsLoaded = false;
  window.dataLayer = window.dataLayer || [];

  function tag() { window.dataLayer.push(arguments); }
  tag('consent', 'default', {
    ad_storage: 'denied', analytics_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied'
  });

  function consent(state) {
    tag('consent', 'update', {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state
    });
  }

  function storedChoice() {
    try {
      var item = JSON.parse(localStorage.getItem(storageKey));
      if (item && item.version === version && Date.now() - item.time < lifetime &&
          (item.level === 'all' || item.level === 'necessary')) return item;
    } catch (error) { /* Without storage, ask again on the next visit. */ }
    return null;
  }

  function loadTags() {
    if (tagsLoaded) return;
    tagsLoaded = true;
    consent('granted');
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-P8LKGMX3';
    document.head.appendChild(script);
  }

  function closeBanner() {
    var banner = document.getElementById('privacyCookieBanner');
    if (banner) banner.remove();
  }

  function choose(level) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: version, level: level, time: Date.now() }));
    } catch (error) { /* The current choice still applies to this page. */ }
    closeBanner();
    if (level === 'all') {
      loadTags();
    } else {
      consent('denied');
      // Reload after withdrawal so previously loaded tags cannot keep running.
      if (tagsLoaded) window.location.reload();
    }
  }

  function showBanner() {
    closeBanner();
    var banner = document.createElement('section');
    banner.id = 'privacyCookieBanner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Nastavení cookies');
    var title = document.createElement('strong');
    title.textContent = 'Nastavení cookies';
    var text = document.createElement('p');
    text.textContent = 'Volitelné statistické a reklamní měření přes Google Tag Manager spustíme pouze s vaším souhlasem. Volbu můžete změnit v patičce webu.';
    var details = document.createElement('a');
    details.href = '/zasady-ochrany-osobnich-udaju';
    details.textContent = 'Informace o zpracování údajů';
    var controls = document.createElement('div');
    ['necessary', 'all'].forEach(function (level) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = level === 'all' ? 'Povolit měření' : 'Jen nezbytné';
      button.addEventListener('click', function () { choose(level); });
      controls.appendChild(button);
    });
    banner.appendChild(title);
    banner.appendChild(text);
    banner.appendChild(details);
    banner.appendChild(controls);
    document.body.appendChild(banner);
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = '#privacyCookieBanner{position:fixed;bottom:16px;left:16px;right:16px;max-width:720px;margin:auto;padding:22px;background:#fff;color:#17253b;border:2px solid #17253b;border-radius:12px;box-shadow:0 8px 32px #0003;z-index:10000;font:16px/1.5 system-ui,sans-serif}#privacyCookieBanner p{margin:10px 0}#privacyCookieBanner a{color:#17253b;text-decoration:underline}#privacyCookieBanner>div{display:flex;gap:12px;margin-top:16px;flex-wrap:wrap}#privacyCookieBanner button{flex:1;padding:12px 16px;border:2px solid #17253b;border-radius:6px;background:#fff;color:#17253b;font:inherit;cursor:pointer}#privacyCookieBanner button:focus-visible{outline:3px solid #d79a21;outline-offset:3px}[data-cookie-settings]{padding:8px 12px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;cursor:pointer}';
    document.head.appendChild(style);
    document.querySelectorAll('[data-cookie-settings]').forEach(function (button) {
      button.addEventListener('click', showBanner);
    });
    var existing = storedChoice();
    if (existing && existing.level === 'all') loadTags();
    else {
      consent('denied');
      if (!existing) showBanner();
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

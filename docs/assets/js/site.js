(function () {
  'use strict';

  var STORAGE_KEY = 'cgt-theme';
  var THEMES = ['auto', 'light', 'dark', 'dark-dimmed', 'light-high-contrast', 'dark-high-contrast'];
  var root = document.documentElement;

  /* ----- Theme picker, persisted in localStorage ------------------------ */

  function readTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return THEMES.indexOf(stored) === -1 ? 'auto' : stored;
    } catch (e) {
      return 'auto';
    }
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  var select = document.getElementById('theme-select');
  if (select) {
    var current = readTheme();
    applyTheme(current);
    select.value = current;
    select.addEventListener('change', function () {
      var theme = THEMES.indexOf(select.value) === -1 ? 'auto' : select.value;
      applyTheme(theme);
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (e) { /* storage unavailable: theme applies for this page only */ }
    });
  }

  /* ----- Mobile sidebar toggle ------------------------------------------ */

  var toggle = document.querySelector('.nav-toggle');
  var sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () {
      var open = sidebar.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* ----- "In this article" table of contents ---------------------------- */

  var article = document.querySelector('.markdown-body');
  var tocList = document.getElementById('toc-list');
  if (!article || !tocList) { return; }

  function slugify(text) {
    return text.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  var used = Object.create(null);
  var headings = [];

  Array.prototype.forEach.call(article.querySelectorAll('h2, h3'), function (heading) {
    var text = heading.textContent.trim();
    var id = heading.id;
    if (!id) {
      var base = slugify(text) || 'section';
      id = base;
      var suffix = 1;
      while (used[id]) {
        id = base + '-' + suffix++;
      }
      heading.id = id;
    }
    used[id] = true;

    var anchor = document.createElement('a');
    anchor.className = 'heading-anchor';
    anchor.href = '#' + id;
    anchor.setAttribute('aria-label', 'Permalink to ' + text);
    anchor.textContent = '#';
    heading.appendChild(anchor);

    var item = document.createElement('li');
    item.className = 'toc-' + heading.tagName.toLowerCase();
    var link = document.createElement('a');
    link.href = '#' + id;
    link.textContent = text;
    item.appendChild(link);
    tocList.appendChild(item);
    headings.push({ heading: heading, link: link });
  });

  if (!headings.length) { return; }
  document.querySelector('.toc').classList.add('has-items');

  /* Highlight the heading currently in view. */
  var active = null;
  function updateActive() {
    var offset = 96;
    var found = headings[0];
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].heading.getBoundingClientRect().top <= offset) {
        found = headings[i];
      }
    }
    if (found !== active) {
      if (active) { active.link.classList.remove('active'); }
      found.link.classList.add('active');
      active = found;
    }
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) { return; }
    ticking = true;
    window.requestAnimationFrame(function () {
      updateActive();
      ticking = false;
    });
  }, { passive: true });
  updateActive();
})();

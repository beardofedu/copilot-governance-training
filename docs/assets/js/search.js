(function () {
  'use strict';

  var dialog = document.getElementById('search-dialog');
  var toggle = document.querySelector('.search-toggle');
  if (!dialog || !toggle || typeof dialog.showModal !== 'function') { return; }

  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  var indexPromise;
  var matches = [];
  var selected = -1;
  var previousFocus;
  var timer;

  function normalize(text) {
    return text.replace(/\s+/g, ' ').trim();
  }

  function buildIndex(pages) {
    var entries = [];
    pages.forEach(function (page) {
      var document = new DOMParser().parseFromString(page.html, 'text/html');
      Array.prototype.forEach.call(document.body.querySelectorAll('br'), function (br) {
        br.replaceWith(' ');
      });
      var blockSelector = 'p, div, section, article, ul, ol, li, dl, dt, dd, table, tr, th, td, pre, ' +
        'blockquote, h1, h2, h3, h4, h5, h6, hr';
      Array.prototype.forEach.call(document.body.querySelectorAll(blockSelector), function (block) {
        block.before(' ');
        block.after(' ');
      });
      var entry = { title: page.title, heading: '', url: page.url, text: '' };
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      var node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.ELEMENT_NODE && /^H[1-3]$/.test(node.tagName)) {
          if (normalize(entry.text)) { entries.push(entry); }
          entry = {
            title: page.title,
            heading: normalize(node.textContent),
            url: page.url + (node.id ? '#' + encodeURIComponent(node.id) : ''),
            text: ''
          };
        } else if (node.nodeType === Node.TEXT_NODE) {
          entry.text += node.textContent;
        }
      }
      if (normalize(entry.text)) { entries.push(entry); }
    });
    return entries.map(function (entry) {
      entry.text = normalize(entry.text);
      entry.searchTitle = entry.title.toLowerCase();
      entry.searchHeading = entry.heading.toLowerCase();
      entry.searchText = entry.text.toLowerCase();
      return entry;
    });
  }

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(dialog.dataset.indexUrl).then(function (response) {
        if (!response.ok) { throw new Error('Search index request failed: ' + response.status); }
        return response.json();
      }).then(buildIndex).catch(function (error) {
        indexPromise = null;
        throw error;
      });
    }
    return indexPromise;
  }

  function highlight(element, text, terms) {
    var pattern = new RegExp('(' + terms.map(function (term) {
      return term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).join('|') + ')', 'gi');
    text.split(pattern).forEach(function (part, index) {
      if (index % 2) {
        var mark = document.createElement('mark');
        mark.textContent = part;
        element.appendChild(mark);
      } else {
        element.appendChild(document.createTextNode(part));
      }
    });
  }

  function clearResults() {
    results.replaceChildren();
    matches = [];
    selected = -1;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
  }

  function selectResult(index) {
    selected = index;
    Array.prototype.forEach.call(results.children, function (option, i) {
      option.setAttribute('aria-selected', String(i === selected));
    });
    input.setAttribute('aria-activedescendant', results.children[selected].id);
    results.children[selected].scrollIntoView({ block: 'nearest' });
  }

  function render(entries, terms) {
    var ranked = entries.map(function (entry) {
      var score = 0;
      var allTerms = terms.every(function (term) {
        var titleMatch = entry.searchTitle.indexOf(term) !== -1;
        var headingMatch = entry.searchHeading.indexOf(term) !== -1;
        var contentMatch = entry.searchText.indexOf(term) !== -1;
        score += (titleMatch ? 8 : 0) + (headingMatch ? 12 : 0) + (contentMatch ? 1 : 0);
        return titleMatch || headingMatch || contentMatch;
      });
      return { entry: entry, score: allTerms ? score : 0 };
    }).filter(function (match) {
      return match.score > 0;
    }).sort(function (a, b) {
      return b.score - a.score || a.entry.url.localeCompare(b.entry.url);
    });

    clearResults();
    matches = ranked.slice(0, 20).map(function (match) { return match.entry; });
    matches.forEach(function (entry, i) {
      var option = document.createElement('li');
      option.id = 'search-result-' + i;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', 'false');
      var link = document.createElement('a');
      link.href = entry.url;
      link.tabIndex = -1;
      var title = document.createElement('span');
      title.className = 'search-result-title';
      highlight(title, entry.heading || entry.title, terms);
      link.appendChild(title);
      if (entry.heading && entry.heading !== entry.title) {
        var page = document.createElement('span');
        page.className = 'search-result-page';
        highlight(page, entry.title, terms);
        link.appendChild(page);
      }
      var snippet = document.createElement('span');
      snippet.className = 'search-result-snippet';
      var positions = terms.map(function (term) { return entry.searchText.indexOf(term); })
        .filter(function (position) { return position !== -1; });
      var start = Math.max(0, (positions.length ? Math.min.apply(null, positions) : 0) - 60);
      highlight(snippet, (start ? '... ' : '') + entry.text.slice(start, start + 200) +
        (entry.text.length > start + 200 ? ' ...' : ''), terms);
      link.appendChild(snippet);
      link.addEventListener('click', function () { dialog.close(); });
      option.appendChild(link);
      results.appendChild(option);
    });
    input.setAttribute('aria-expanded', String(matches.length > 0));
    status.textContent = ranked.length ? ranked.length + (ranked.length === 1 ? ' result' : ' results') +
      (ranked.length > 20 ? ' (showing the first 20).' : '.') : 'No results. Try different words.';
  }

  function search() {
    var query = input.value.trim().toLowerCase();
    clearResults();
    if (!query) {
      status.textContent = 'Type to search page titles, headings, and content.';
      return;
    }
    status.textContent = 'Searching...';
    loadIndex().then(function (entries) {
      if (dialog.open && input.value.trim().toLowerCase() === query) {
        render(entries, query.split(/\s+/).filter(function (term, i, terms) {
          return terms.indexOf(term) === i;
        }));
      }
    }).catch(function (error) {
      console.error('Guide search is unavailable.', error);
      if (dialog.open && input.value.trim().toLowerCase() === query) {
        status.textContent = 'Search is unavailable. Change your query or reopen search to retry.';
      }
    });
  }

  function openSearch() {
    if (!dialog.open) {
      previousFocus = document.activeElement === document.body ? toggle : document.activeElement;
      dialog.showModal();
    }
    input.focus();
    input.select();
    search();
  }

  toggle.hidden = false;
  toggle.querySelector('kbd').textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K';
  toggle.addEventListener('click', openSearch);
  dialog.querySelector('.search-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) {
      var bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) { dialog.close(); }
    }
  });
  dialog.addEventListener('close', function () {
    if (dialog.open) { return; }
    clearTimeout(timer);
    if (previousFocus) { previousFocus.focus(); }
  });
  input.addEventListener('input', function () {
    clearTimeout(timer);
    clearResults();
    timer = setTimeout(search, 120);
  });
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
    } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && matches.length) {
      event.preventDefault();
      selectResult(event.key === 'ArrowDown' ? (selected + 1) % matches.length :
        (selected <= 0 ? matches.length - 1 : selected - 1));
    } else if (event.key === 'Enter' && matches.length) {
      event.preventDefault();
      results.children[selected < 0 ? 0 : selected].querySelector('a').click();
    }
  });
  document.addEventListener('keydown', function (event) {
    var target = event.target;
    var editing = target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    var shortcut = (event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 'k';
    if (!event.defaultPrevented && (shortcut || (event.key === '/' && !editing &&
        !event.metaKey && !event.ctrlKey && !event.altKey))) {
      event.preventDefault();
      openSearch();
    }
  });
})();

(function() {
  var GITHUB_USER = 'Raghuramcoding';
  var GITHUB_REPO = 'booksiveread';
  var COLORS = ['#7F77DD','#1D9E75','#D85A30','#378ADD','#BA7517','#D4537E','#639922','#3C3489','#0F6E56','#993C1D','#AFA9EC','#5DCAA5','#F0997B','#85B7EB','#EF9F27','#ED93B1','#97C459','#534AB7'];
  var HEIGHTS = [28,36,44,32,40,30,46,34,38,26,42,34];
  var MAX_SPINES = 10000;

  var style = document.createElement('style');
  style.textContent = [
    '.birw-wrap{font-family:Georgia,serif;display:flex;flex-direction:column;align-items:center;gap:1rem;padding:2rem 1rem;background:#f5f2eb;border-radius:12px;}',
    '.birw-count{font-size:72px;font-weight:normal;line-height:1;color:#1a1814;text-align:center;}',
    '.birw-sub{font-size:0.9rem;color:#7a7468;font-style:italic;text-align:center;margin-top:-8px;}',
    '.birw-shelf-wrap{width:100%;border-bottom:2px solid #1a1814;padding-bottom:0;}',
    '.birw-shelf{display:flex;align-items:flex-end;gap:2px;flex-wrap:wrap;justify-content:flex-start;min-height:48px;}',
    '.birw-spine{flex-shrink:0;border-radius:2px 2px 0 0;}',
    '.birw-note{font-size:11px;color:#7a7468;font-style:italic;margin-top:4px;text-align:center;}'
  ].join('');
  document.head.appendChild(style);

  function spineWidth(n) { if(n<=100)return 15; if(n<=500)return 10; if(n<=2000)return 6; if(n<=5000)return 4; return 3; }
  function spineHeight(i,n) { if(n>2000)return 20+(i%3)*6; if(n>500)return 24+(i%4)*7; return HEIGHTS[i%HEIGHTS.length]; }

  function render(el, count) {
    var show = Math.min(count, MAX_SPINES);
    var w = spineWidth(show);

    var wrap = document.createElement('div'); wrap.className = 'birw-wrap';

    var num = document.createElement('div'); num.className = 'birw-count'; num.textContent = count.toLocaleString();
    var sub = document.createElement('div'); sub.className = 'birw-sub';
    sub.textContent = count === 0 ? 'no books yet' : count === 1 ? '1 book read' : count.toLocaleString() + ' books read';

    var shelfWrap = document.createElement('div'); shelfWrap.className = 'birw-shelf-wrap';
    var shelf = document.createElement('div'); shelf.className = 'birw-shelf';
    var frag = document.createDocumentFragment();
    for (var i = 0; i < show; i++) {
      var s = document.createElement('div'); s.className = 'birw-spine';
      s.style.width = w + 'px'; s.style.height = spineHeight(i, show) + 'px';
      s.style.background = COLORS[i % COLORS.length];
      frag.appendChild(s);
    }
    shelf.appendChild(frag);
    shelfWrap.appendChild(shelf);
    if (count > MAX_SPINES) {
      var note = document.createElement('div'); note.className = 'birw-note';
      note.textContent = 'showing 10,000 of ' + count.toLocaleString() + ' books';
      shelfWrap.appendChild(note);
    }

    wrap.appendChild(num); wrap.appendChild(sub); wrap.appendChild(shelfWrap);
    el.innerHTML = ''; el.appendChild(wrap);
  }

  function init() {
    var targets = document.querySelectorAll('[data-books-widget]');
    if (!targets.length) return;
    fetch('https://raw.githubusercontent.com/' + GITHUB_USER + '/' + GITHUB_REPO + '/main/count.json?t=' + Date.now())
      .then(function(r) { return r.json(); })
      .then(function(data) {
        targets.forEach(function(el) { render(el, data.count || 0); });
      })
      .catch(function() {
        targets.forEach(function(el) { render(el, 0); });
      });
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();

// ============================================
// VeyraOS App — Veyra Browser
// ============================================

AppRegistry.register('browser', {
  name: 'Veyra Browser',
  iconBg: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
  iconText: '🌐',

  render(container, win) {
    container.innerHTML = `
      <div class="app-root browser-root">
        <div class="browser-toolbar">
          <button class="browser-nav-btn" id="browserBack" title="Back" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button class="browser-nav-btn" id="browserForward" title="Forward" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
          <button class="browser-nav-btn" id="browserReload" title="Reload"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 11a8 8 0 1 0 .9 4.5M20 4v7h-7"/></svg></button>
          <div class="browser-url-bar">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
            <input type="text" id="browserUrl" placeholder="Search or enter a website address">
          </div>
          <button class="browser-nav-btn" id="browserHome" title="Home"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/></svg></button>
        </div>
        <div class="browser-frame-wrap" id="browserFrame">
          <div class="browser-startpage" id="browserStart">
            <div class="browser-startpage-logo">🌐 Veyra</div>
            <div class="browser-search-box">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
              <input type="text" id="browserSearch" placeholder="Search or type a URL">
            </div>
            <div class="browser-shortcuts">
              <div class="browser-shortcut" data-url="https://wikipedia.org">
                <div class="browser-shortcut-icon" style="background:#000;">W</div>
                <div class="browser-shortcut-label">Wikipedia</div>
              </div>
              <div class="browser-shortcut" data-url="https://youtube.com">
                <div class="browser-shortcut-icon" style="background:#ff0000;">▶</div>
                <div class="browser-shortcut-label">YouTube</div>
              </div>
              <div class="browser-shortcut" data-url="https://github.com">
                <div class="browser-shortcut-icon" style="background:#1a1a2e;">🐙</div>
                <div class="browser-shortcut-label">GitHub</div>
              </div>
              <div class="browser-shortcut" data-url="https://news.ycombinator.com">
                <div class="browser-shortcut-icon" style="background:#ff6600;">Y</div>
                <div class="browser-shortcut-label">HN</div>
              </div>
              <div class="browser-shortcut" data-url="https://reddit.com">
                <div class="browser-shortcut-icon" style="background:#ff4500;">R</div>
                <div class="browser-shortcut-label">Reddit</div>
              </div>
              <div class="browser-shortcut" data-url="https://twitter.com">
                <div class="browser-shortcut-icon" style="background:#1da1f2;">𝕏</div>
                <div class="browser-shortcut-label">X</div>
              </div>
              <div class="browser-shortcut" data-url="https://perplexity.ai">
                <div class="browser-shortcut-icon" style="background:#20b8cd;">P</div>
                <div class="browser-shortcut-label">Perplexity</div>
              </div>
              <div class="browser-shortcut" data-url="https://homekidchud.github.io/VeyraBrowser/">
                <div class="browser-shortcut-icon" style="background:linear-gradient(135deg,#8b5cf6,#6366f1);">V</div>
                <div class="browser-shortcut-label">Veyra</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const urlInput = container.querySelector('#browserUrl');
    const searchInput = container.querySelector('#browserSearch');
    const frame = container.querySelector('#browserFrame');
    const startPage = container.querySelector('#browserStart');
    const backBtn = container.querySelector('#browserBack');
    const forwardBtn = container.querySelector('#browserForward');
    const homeBtn = container.querySelector('#browserHome');

    const history = [];
    let historyIdx = -1;

    const navigate = (url) => {
      // Normalize URL
      if (!url.match(/^https?:\/\//)) {
        if (url.match(/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/)) {
          url = 'https://' + url;
        } else {
          url = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        }
      }

      startPage.style.display = 'none';

      // Create or update iframe
      let iframe = frame.querySelector('iframe');
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
        frame.appendChild(iframe);
      }

      try {
        iframe.src = url;
      } catch (e) {
        frame.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--muted);">Cannot load this page. Some sites block iframe embedding.</div>';
      }

      urlInput.value = url.replace(/^https?:\/\//, '');

      history.splice(historyIdx + 1);
      history.push(url);
      historyIdx = history.length - 1;

      backBtn.disabled = historyIdx <= 0;
      forwardBtn.disabled = historyIdx >= history.length - 1;

      // Iframe load error handling
      iframe.onerror = () => {
        frame.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:var(--muted);gap:8px;"><div style="font-size:2rem;">🔒</div><div>Cannot load this page.</div><div style="font-size:0.8rem;">Some sites block iframe embedding for security.</div><button class="btn primary" onclick="window.open(\'' + url + '\', \'_blank\')">Open in new tab</button></div>';
      };
    };

    const goHome = () => {
      let iframe = frame.querySelector('iframe');
      if (iframe) iframe.remove();
      startPage.style.display = 'flex';
      urlInput.value = '';
      backBtn.disabled = historyIdx <= 0;
      forwardBtn.disabled = historyIdx >= history.length - 1;
    };

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        navigate(urlInput.value);
      }
    });

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        navigate(searchInput.value);
      }
    });

    backBtn.addEventListener('click', () => {
      if (historyIdx > 0) {
        historyIdx--;
        navigate(history[historyIdx]);
      }
    });

    forwardBtn.addEventListener('click', () => {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        navigate(history[historyIdx]);
      }
    });

    homeBtn.addEventListener('click', goHome);

    container.querySelectorAll('.browser-shortcut').forEach(el => {
      el.addEventListener('click', () => {
        navigate(el.dataset.url);
      });
    });
  }
});

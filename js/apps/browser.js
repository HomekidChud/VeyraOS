// ============================================
// VeyraOS App — Veyra Browser (v2.0)
// Full proxy-based web browser with tabs,
// bookmarks, history, and download support
// ============================================

AppRegistry.register('browser', {
  name: 'Veyra Browser',
  iconBg: 'linear-gradient(135deg, #a855f7, #6366f1)',
  iconText: VeyraIcons.browser,

  render(container, win) {
    const VEYRA_SERVER = 'https://veyraserver-xscy.onrender.com';
    const CORS_PROXY = url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const FALLBACK_PROXY = url => `https://corsproxy.io/?url=${encodeURIComponent(url)}`;

    // Browser state
    const state = {
      tabs: [],
      activeTabId: null,
      tabCounter: 0,
      history: OSStorage.get('browserHistory', []),
      bookmarks: OSStorage.get('browserBookmarks', [
        { title: 'Wikipedia', url: 'https://wikipedia.org', icon: 'W', color: '#000' },
        { title: 'YouTube', url: 'https://youtube.com', icon: '▶', color: '#ff0000' },
        { title: 'GitHub', url: 'https://github.com', icon: 'GH', color: '#1a1a2e' },
        { title: 'Reddit', url: 'https://reddit.com', icon: 'R', color: '#ff4500' },
        { title: 'Perplexity', url: 'https://perplexity.ai', icon: 'P', color: '#20b8cd' },
        { title: 'Hacker News', url: 'https://news.ycombinator.com', icon: 'Y', color: '#ff6600' },
        { title: 'BBC News', url: 'https://bbc.co.uk/news', icon: 'B', color: '#bb1919' },
        { title: 'Veyra Browser', url: 'https://homekidchud.github.io/VeyraBrowser/', icon: 'V', color: '#8b5cf6' }
      ])
    };

    const saveHistory = () => { OSStorage.set('browserHistory', state.history.slice(0, 500)); };
    const saveBookmarks = () => { OSStorage.set('browserBookmarks', state.bookmarks); };

    // Normalize URL
    function normalizeUrl(input) {
      const trimmed = input.trim();
      if (!trimmed) return null;
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(trimmed)) return 'https://' + trimmed;
      return 'https://www.google.com/search?q=' + encodeURIComponent(trimmed);
    }

    function hostOf(url) {
      try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; }
    }

    // Fetch page through proxy
    async function fetchPage(url, tab) {
      tab.loading = true;
      tab.error = null;
      tab.url = url;
      _renderTabBar();
      _updateUrlBar(tab);

      // Strategy: Use iframe with proxy URL directly as src
      // This is more reliable than fetch+srcdoc in sandboxed environments
      
      const proxies = [
        (u) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(u)}`,
        (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
        (u) => `https://thingproxy.freeboard.io/fetch/${u}`,
        (u) => u  // Direct URL as last resort
      ];

      const proxyNames = ['codetabs', 'allorigins', 'thingproxy', 'direct'];

      // Render loading state
      _renderPage(tab);

      // Try loading through proxy via iframe src
      const tryLoad = (proxyFn, proxyName) => {
        return new Promise((resolve, reject) => {
          const proxyUrl = proxyFn(url);
          const iframe = document.createElement('iframe');
          iframe.className = 'browser-page-iframe';
          iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin allow-modals');
          
          let resolved = false;
          const timeout = setTimeout(() => {
            if (!resolved) {
              resolved = true;
              reject(new Error(proxyName + ' timeout'));
            }
          }, 12000);

          iframe.onload = () => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timeout);
            
            // Try to get the title
            try {
              const title = iframe.contentDocument?.title;
              if (title) tab.title = title.slice(0, 80);
              else tab.title = hostOf(url);
            } catch {
              tab.title = hostOf(url);
            }
            
            tab.loading = false;
            tab.proxyUrl = proxyUrl;
            tab.history.push(url);
            tab.historyIdx = tab.history.length - 1;
            
            // Add to global history
            state.history.unshift({ url, title: tab.title, time: Date.now() });
            if (state.history.length > 500) state.history.pop();
            saveHistory();
            
            _renderTabBar();
            _updateUrlBar(tab);
            resolve(proxyUrl);
          };

          iframe.onerror = () => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timeout);
            reject(new Error(proxyName + ' failed'));
          };

          iframe.src = proxyUrl;
          
          // Clear container and add iframe
          pageContainer.innerHTML = '';
          pageContainer.appendChild(iframe);
        });
      };

      // Try each proxy in order
      for (let i = 0; i < proxies.length; i++) {
        try {
          await tryLoad(proxies[i], proxyNames[i]);
          return; // Success!
        } catch (err) {
          if (i === proxies.length - 1) {
            // All proxies failed
            tab.loading = false;
            tab.error = 'Unable to load page. The site may be down, blocking proxy access, or all proxy services are unavailable. Try opening directly in a new tab.';
            _renderPage(tab);
            _renderTabBar();
            _updateUrlBar(tab);
          }
          // Try next proxy
        }
      }
    }

    function extractTitle(html) {
      const m = html.match(/<title[^>]*>(.*?)<\/title>/i);
      return m ? m[1].trim().slice(0, 80) : null;
    }

    // Process HTML: rewrite URLs, inject interceptor script
    function processHtml(html, baseUrl, proxyUsed) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Inject base tag
      const base = doc.createElement('base');
      base.href = baseUrl;
      doc.head.insertBefore(base, doc.head.firstChild);

      // Proxy function for resources
      const proxyUrl = (url) => {
        if (!url || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('javascript:') ||
            url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) return url;
        try {
          const absolute = new URL(url, baseUrl).href;
          if (proxyUsed === 'veyra') {
            return `${VEYRA_SERVER}/api/proxy?url=${encodeURIComponent(absolute)}`;
          }
          return CORS_PROXY(absolute);
        } catch { return url; }
      };

      // Rewrite img src
      doc.querySelectorAll('img[src]').forEach(el => {
        el.setAttribute('src', proxyUrl(el.getAttribute('src')));
        // Also handle srcset
        const srcset = el.getAttribute('srcset');
        if (srcset) {
          const rewritten = srcset.split(',').map(s => {
            const parts = s.trim().split(/\s+/);
            if (parts[0]) parts[0] = proxyUrl(parts[0]);
            return parts.join(' ');
          }).join(', ');
          el.setAttribute('srcset', rewritten);
        }
      });

      // Rewrite script src
      doc.querySelectorAll('script[src]').forEach(el => {
        el.setAttribute('src', proxyUrl(el.getAttribute('src')));
      });

      // Rewrite link href (CSS, etc.)
      doc.querySelectorAll('link[href]').forEach(el => {
        const href = el.getAttribute('href');
        if (href && !href.startsWith('#')) {
          el.setAttribute('href', proxyUrl(href));
        }
      });

      // Rewrite a href - these should trigger navigation
      doc.querySelectorAll('a[href]').forEach(el => {
        const href = el.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return;
        try {
          const absolute = new URL(href, baseUrl).href;
          // Store original URL as data attribute, set href to #
          el.setAttribute('data-veyra-href', absolute);
          el.setAttribute('href', '#veyra-link');
        } catch {}
      });

      // Rewrite iframe src
      doc.querySelectorAll('iframe[src]').forEach(el => {
        el.setAttribute('src', proxyUrl(el.getAttribute('src')));
      });

      // Rewrite inline styles with url()
      doc.querySelectorAll('[style]').forEach(el => {
        let style = el.getAttribute('style');
        if (style && style.includes('url(')) {
          style = style.replace(/url\(['"]?([^'")\s]+)['"]?\)/g, (match, url) => {
            return `url(${proxyUrl(url)})`;
          });
          el.setAttribute('style', style);
        }
      });

      // Inject navigation interceptor
      const interceptor = doc.createElement('script');
      interceptor.textContent = `
        (function() {
          document.addEventListener('click', function(e) {
            var a = e.target.closest('a[data-veyra-href]');
            if (a) {
              e.preventDefault();
              e.stopPropagation();
              parent.postMessage({ type: 'veyra-navigate', url: a.getAttribute('data-veyra-href') }, '*');
              return false;
            }
          }, true);
          document.addEventListener('submit', function(e) {
            e.preventDefault();
            var form = e.target;
            var action = form.getAttribute('data-veyra-href') || form.action;
            var formData = new FormData(form);
            var params = new URLSearchParams();
            formData.forEach(function(v, k) { params.append(k, v); });
            if (form.method.toLowerCase() === 'get') {
              var url = new URL(action);
              params.forEach(function(v, k) { url.searchParams.set(k, v); });
              parent.postMessage({ type: 'veyra-navigate', url: url.href }, '*');
            } else {
              parent.postMessage({ type: 'veyra-navigate', url: action + '?' + params.toString() }, '*');
            }
          }, true);
          // Fix relative URLs in CSS
          try {
            var sheets = document.styleSheets;
            for (var i = 0; i < sheets.length; i++) {
              try {
                var rules = sheets[i].cssRules;
                for (var j = 0; j < rules.length; j++) {
                  // Rules are read-only in most browsers
                }
              } catch(e) {}
            }
          } catch(e) {}
        })();
      `;
      doc.body.appendChild(interceptor);

      // Inject style overrides
      const overrideStyle = doc.createElement('style');
      overrideStyle.textContent = `
        body { margin: 0 !important; }
        * { max-width: 100% !important; }
        img { max-width: 100% !important; height: auto !important; }
        video { max-width: 100% !important; }
        iframe { max-width: 100% !important; }
        pre, code { white-space: pre-wrap !important; word-wrap: break-word !important; }
        table { display: block !important; overflow-x: auto !important; }
        html { -webkit-text-size-adjust: 100%; }
      `;
      doc.head.appendChild(overrideStyle);

      return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
    }

    // Tab management
    function createTab(url = null) {
      const id = 'btab_' + (++state.tabCounter);
      const tab = {
        id, url: url || null, title: 'New Tab', html: null,
        loading: false, error: null,
        history: url ? [url] : [], historyIdx: url ? 0 : -1,
        scrollPos: 0
      };
      state.tabs.push(tab);
      state.activeTabId = id;
      if (url) {
        fetchPage(url, tab);
      } else {
        renderStartPage(tab);
      }
      _renderTabBar();
      return tab;
    }

    function closeTab(id) {
      const idx = state.tabs.findIndex(t => t.id === id);
      if (idx === -1) return;
      state.tabs.splice(idx, 1);
      if (state.activeTabId === id) {
        state.activeTabId = state.tabs.length > 0 ? state.tabs[Math.max(0, idx - 1)].id : null;
        if (state.activeTabId) {
          const tab = state.tabs.find(t => t.id === state.activeTabId);
          if (tab) _renderPage(tab);
        }
      }
      if (state.tabs.length === 0) {
        createTab();
      }
      _renderTabBar();
    }

    function switchTab(id) {
      state.activeTabId = id;
      const tab = state.tabs.find(t => t.id === id);
      if (tab) {
        _renderPage(tab);
        _updateUrlBar(tab);
      }
      _renderTabBar();
    }

    // ===== Render =====

    container.innerHTML = `
      <div class="app-root browser-root" style="height:100%;display:flex;flex-direction:column;">
        <!-- Tab bar -->
        <div class="browser-tabbar" id="browserTabBar">
          <div class="browser-tabs" id="browserTabs"></div>
          <button class="browser-tab-new" id="browserNewTab" title="New Tab">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <!-- Toolbar -->
        <div class="browser-toolbar">
          <button class="browser-nav-btn" id="browserBack" title="Back" disabled>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="browser-nav-btn" id="browserForward" title="Forward" disabled>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <button class="browser-nav-btn" id="browserReload" title="Reload">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 11a8 8 0 1 0 .9 4.5M20 4v7h-7"/></svg>
          </button>
          <button class="browser-nav-btn" id="browserHome" title="Home">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11l8-7 8 7M6 9.5V20h12V9.5"/></svg>
          </button>
          <div class="browser-url-bar" id="browserUrlBar">
            <svg id="browserUrlIcon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
            <input type="text" id="browserUrl" placeholder="Search or enter a website address" autocomplete="off">
            <button class="browser-url-bookmark" id="browserBookmark" title="Bookmark this page">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8z"/></svg>
            </button>
          </div>
          <button class="browser-nav-btn" id="browserDownloads" title="Downloads">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14"/></svg>
          </button>
          <button class="browser-nav-btn" id="browserHistory" title="History">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4.5V9h4.5M12 8v4.2l2.8 1.8"/></svg>
          </button>
          <button class="browser-nav-btn" id="browserBookmarksBtn" title="Bookmarks">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3.8l2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8z"/></svg>
          </button>
        </div>
        <!-- Loading bar -->
        <div class="browser-loadbar" id="browserLoadbar"><div class="browser-loadbar-fill"></div></div>
        <!-- Page container -->
        <div class="browser-page-container" id="browserPageContainer"></div>
        <!-- Status bar -->
        <div class="browser-statusbar" id="browserStatusbar">
          <span id="browserStatusText">Ready</span>
          <span id="browserTabCount">1 tab</span>
        </div>
      </div>
    `;

    // CSS for browser-specific elements
    const style = document.createElement('style');
    style.textContent = `
      .browser-tabbar { display:flex;align-items:center;gap:4px;padding:6px 8px 0;background:var(--titlebar-bg);border-bottom:0.5px solid var(--line);min-height:38px; }
      .browser-tabs { display:flex;gap:2px;overflow-x:auto;flex:1;scrollbar-width:none; }
      .browser-tabs::-webkit-scrollbar { display:none; }
      .browser-tab { display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:8px 8px 0 0;background:var(--surface);cursor:pointer;font-size:0.8rem;max-width:180px;white-space:nowrap;overflow:hidden;transition:background var(--t-fast);position:relative;flex-shrink:0; }
      .browser-tab:hover { background:var(--surface-hover); }
      .browser-tab.active { background:var(--content-bg); }
      .browser-tab-favicon { width:14px;height:14px;border-radius:3px;flex-shrink:0;background:var(--surface-3);display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700; }
      .browser-tab-title { overflow:hidden;text-overflow:ellipsis;max-width:120px; }
      .browser-tab-close { width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0.5;transition:opacity var(--t-fast),background var(--t-fast); }
      .browser-tab-close:hover { opacity:1;background:var(--surface-3); }
      .browser-tab-new { width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--surface);color:var(--text-2);flex-shrink:0;transition:background var(--t-fast); }
      .browser-tab-new:hover { background:var(--surface-hover); }
      .browser-tab.loading .browser-tab-favicon::after { content:'';position:absolute;width:10px;height:10px;border:1.5px solid var(--accent);border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite; }
      @keyframes spin { to { transform:rotate(360deg); } }
      .browser-loadbar { height:2px;background:transparent;overflow:hidden; }
      .browser-loadbar.active { background:var(--line); }
      .browser-loadbar-fill { height:100%;width:0;background:var(--accent);transition:width 0.3s ease; }
      .browser-loadbar.active .browser-loadbar-fill { width:40%;animation:loadbar 1.5s ease-in-out infinite; }
      @keyframes loadbar { 0%{width:10%;margin-left:0;} 50%{width:50%;margin-left:25%;} 100%{width:10%;margin-left:90%;} }
      .browser-page-container { flex:1;overflow:hidden;position:relative;background:#fff; }
      .browser-page-iframe { width:100%;height:100%;border:none;background:#fff; }
      .browser-startpage { width:100%;height:100%;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:40px 20px;background:var(--content-bg); }
      .browser-startpage-logo { font-size:2rem;font-weight:700;margin-bottom:8px;display:flex;align-items:center;gap:10px;color:var(--text); }
      .browser-startpage-logo svg { width:36px;height:36px; }
      .browser-search-box { width:min(560px,90%);height:50px;border-radius:14px;background:var(--surface);border:0.5px solid var(--line);padding:0 16px;display:flex;align-items:center;gap:10px;box-shadow:0 4px 20px rgba(0,0,0,0.08);margin-bottom:24px; }
      .browser-search-box input { flex:1;border:none;background:transparent;outline:none;font-size:1rem;color:var(--text); }
      .browser-search-box input::placeholder { color:var(--muted); }
      .browser-shortcuts { display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:16px;width:min(560px,90%); }
      .browser-shortcut { display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;transition:transform var(--t-fast); }
      .browser-shortcut:hover { transform:scale(1.08); }
      .browser-shortcut-icon { width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:700;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.15); }
      .browser-shortcut-label { font-size:0.74rem;color:var(--text-2);text-align:center; }
      .browser-error { display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--muted);padding:20px;text-align:center; }
      .browser-error-icon { font-size:3rem; }
      .browser-error-title { font-size:1.1rem;font-weight:600;color:var(--text); }
      .browser-error-msg { font-size:0.86rem;max-width:400px; }
      .browser-error-actions { display:flex;gap:8px;margin-top:8px; }
      .browser-statusbar { height:26px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:0.74rem;color:var(--muted);background:var(--titlebar-bg);border-top:0.5px solid var(--line); }
      .browser-history-panel, .browser-bookmarks-panel { position:absolute;top:0;right:0;width:280px;height:100%;background:var(--window-bg-solid);border-left:0.5px solid var(--line);box-shadow:-4px 0 20px rgba(0,0,0,0.1);z-index:10;overflow-y:auto;padding:12px;animation:slideIn 0.2s var(--ease); }
      @keyframes slideIn { from{transform:translateX(100%);} to{transform:translateX(0);} }
      .browser-history-item, .browser-bookmark-item { display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer;transition:background var(--t-fast); }
      .browser-history-item:hover, .browser-bookmark-item:hover { background:var(--surface-hover); }
      .browser-history-favicon, .browser-bookmark-favicon { width:20px;height:20px;border-radius:4px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:0.6rem;font-weight:700;color:#fff; }
      .browser-history-info, .browser-bookmark-info { flex:1;overflow:hidden; }
      .browser-history-title, .browser-bookmark-title { font-size:0.82rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
      .browser-history-url, .browser-bookmark-url { font-size:0.72rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
      .browser-panel-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:12px; }
      .browser-panel-title { font-size:1rem;font-weight:700; }
      .browser-panel-close { width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer; }
      .browser-panel-close:hover { background:var(--surface-hover); }
    `;
    container.appendChild(style);

    // Get elements
    const pageContainer = container.querySelector('#browserPageContainer');
    const urlInput = container.querySelector('#browserUrl');
    const urlIcon = container.querySelector('#browserUrlIcon');
    const backBtn = container.querySelector('#browserBack');
    const forwardBtn = container.querySelector('#browserForward');
    const reloadBtn = container.querySelector('#browserReload');
    const homeBtn = container.querySelector('#browserHome');
    const bookmarkBtn = container.querySelector('#browserBookmark');
    const loadbar = container.querySelector('#browserLoadbar');
    const statusText = container.querySelector('#browserStatusText');
    const tabCountEl = container.querySelector('#browserTabCount');
    const newTabBtn = container.querySelector('#browserNewTab');

    // Listen for messages from iframe
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'veyra-navigate') {
        const tab = state.tabs.find(t => t.id === state.activeTabId);
        if (tab) {
          fetchPage(e.data.url, tab);
        }
      }
    });

    function getActiveTab() {
      return state.tabs.find(t => t.id === state.activeTabId);
    }

    function _renderTabBar() {
      const tabsEl = container.querySelector('#browserTabs');
      tabsEl.innerHTML = state.tabs.map(tab => `
        <div class="browser-tab ${tab.id === state.activeTabId ? 'active' : ''} ${tab.loading ? 'loading' : ''}" data-tab="${tab.id}">
          <div class="browser-tab-favicon" style="background:${getFaviconColor(tab.url)};">${getFaviconLetter(tab)}</div>
          <span class="browser-tab-title">${tab.loading ? 'Loading...' : tab.title || 'New Tab'}</span>
          <div class="browser-tab-close" data-close="${tab.id}">
            <svg viewBox="0 0 10 10" width="10" height="10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2L8 8M8 2L2 8"/></svg>
          </div>
        </div>
      `).join('');

      tabsEl.querySelectorAll('.browser-tab').forEach(el => {
        el.addEventListener('click', (e) => {
          if (e.target.closest('[data-close]')) {
            closeTab(el.dataset.tab);
          } else {
            switchTab(el.dataset.tab);
          }
        });
      });

      tabCountEl.textContent = state.tabs.length + ' tab' + (state.tabs.length !== 1 ? 's' : '');
    }

    function getFaviconLetter(tab) {
      if (!tab.url) return '+';
      const host = hostOf(tab.url);
      return (host[0] || 'V').toUpperCase();
    }

    function getFaviconColor(url) {
      if (!url) return '#6b7280';
      const host = hostOf(url);
      const colors = ['#5b7fd6','#c2566b','#3f9a78','#b0772f','#8a5cc9','#2f8fa8','#c0603c','#5f8f3a'];
      let n = 0;
      for (const c of host) n = (n * 31 + c.charCodeAt(0)) >>> 0;
      return colors[n % colors.length];
    }

    function _updateUrlBar(tab) {
      if (!tab) return;
      urlInput.value = tab.url ? tab.url.replace(/^https?:\/\//, '') : '';
      urlIcon.innerHTML = tab.url
        ? '<path d="M5 10.5h14M12 3.5c2.2 2.5 3.2 5.3 3.2 7s-1 4.5-3.2 7c-2.2-2.5-3.2-5.3-3.2-7s1-4.5 3.2-7z"/><circle cx="12" cy="10.5" r="8.5"/>'
        : '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>';

      backBtn.disabled = tab.historyIdx <= 0;
      forwardBtn.disabled = tab.historyIdx >= tab.history.length - 1;

      // Loading bar
      loadbar.classList.toggle('active', tab.loading);

      // Bookmark state
      const isBookmarked = state.bookmarks.some(b => b.url === tab.url);
      bookmarkBtn.style.color = isBookmarked ? 'var(--accent)' : '';

      // Status
      statusText.textContent = tab.loading ? 'Loading ' + (tab.url || '') + '...' :
                              tab.error ? 'Error: ' + tab.error :
                              tab.url ? hostOf(tab.url) : 'Ready';
    }

    function _renderPage(tab) {
      pageContainer.innerHTML = '';

      if (tab.loading) {
        pageContainer.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--muted);"><div style="font-size:2.5rem;">⏳</div><div style="font-size:1rem;font-weight:600;color:var(--text);">Loading...</div><div style="font-size:0.84rem;">' + (tab.url || '') + '</div><div class="spinner" style="width:24px;height:24px;border:2.5px solid var(--accent);border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;"></div></div>';
        return;
      }

      if (tab.error) {
        pageContainer.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:12px;color:var(--muted);padding:20px;text-align:center;">
            <div style="font-size:3rem;">⚠️</div>
            <div style="font-size:1.1rem;font-weight:600;color:var(--text);">Cannot load page</div>
            <div style="font-size:0.86rem;max-width:400px;">${tab.error}<br>The site may be down or blocking proxy access.</div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button class="btn primary" id="retryBtn">Retry</button>
              <a href="${tab.url}" target="_blank" class="btn ghost">Open in new tab ↗</a>
            </div>
          </div>`;
        const retryBtn = pageContainer.querySelector('#retryBtn');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => {
            if (tab.url) fetchPage(tab.url, tab);
          });
        }
        return;
      }

      if (!tab.proxyUrl) {
        renderStartPage(tab);
        return;
      }

      // The iframe was already created in fetchPage
      if (!pageContainer.querySelector('iframe')) {
        const iframe = document.createElement('iframe');
        iframe.className = 'browser-page-iframe';
        iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin allow-modals');
        iframe.src = tab.proxyUrl;
        pageContainer.appendChild(iframe);
      }
    }

    function renderStartPage(tab) {
      pageContainer.innerHTML = `
        <div class="browser-startpage">
          <div class="browser-startpage-logo">
            <img src="${VeyraIcons.browser}" alt="Veyra" style="width:40px;height:40px;">
            <span>Veyra</span>
          </div>
          <div class="browser-search-box">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg>
            <input type="text" id="startPageSearch" placeholder="Search or type a URL">
          </div>
          <div class="browser-shortcuts">
            ${state.bookmarks.map(b => `
              <div class="browser-shortcut" data-url="${b.url}">
                <div class="browser-shortcut-icon" style="background:${b.color};">${b.icon}</div>
                <div class="browser-shortcut-label">${b.title}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const search = pageContainer.querySelector('#startPageSearch');
      search.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const url = normalizeUrl(search.value);
          if (url) fetchPage(url, tab);
        }
      });
      search.focus();

      pageContainer.querySelectorAll('.browser-shortcut').forEach(el => {
        el.addEventListener('click', () => {
          fetchPage(el.dataset.url, tab);
        });
      });
    }

    // ===== Event handlers =====

    newTabBtn.addEventListener('click', () => createTab());

    urlInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const tab = getActiveTab();
        if (!tab) return;
        const url = normalizeUrl(urlInput.value);
        if (url) fetchPage(url, tab);
      }
    });

    backBtn.addEventListener('click', () => {
      const tab = getActiveTab();
      if (!tab || tab.historyIdx <= 0) return;
      tab.historyIdx--;
      const url = tab.history[tab.historyIdx];
      fetchPage(url, tab);
    });

    forwardBtn.addEventListener('click', () => {
      const tab = getActiveTab();
      if (!tab || tab.historyIdx >= tab.history.length - 1) return;
      tab.historyIdx++;
      const url = tab.history[tab.historyIdx];
      fetchPage(url, tab);
    });

    reloadBtn.addEventListener('click', () => {
      const tab = getActiveTab();
      if (!tab || !tab.url) return;
      fetchPage(tab.url, tab);
    });

    homeBtn.addEventListener('click', () => {
      const tab = getActiveTab();
      if (!tab) return;
      tab.url = null;
      tab.html = null;
      tab.error = null;
      _renderPage(tab);
      _updateUrlBar(tab);
      _renderTabBar();
    });

    bookmarkBtn.addEventListener('click', () => {
      const tab = getActiveTab();
      if (!tab || !tab.url) return;
      const idx = state.bookmarks.findIndex(b => b.url === tab.url);
      if (idx >= 0) {
        state.bookmarks.splice(idx, 1);
        Toast.show('Browser', 'Bookmark removed', '☆');
      } else {
        const host = hostOf(tab.url);
        state.bookmarks.push({
          title: tab.title || host,
          url: tab.url,
          icon: (host[0] || 'V').toUpperCase(),
          color: getFaviconColor(tab.url)
        });
        Toast.show('Browser', 'Bookmark added', '★');
      }
      saveBookmarks();
      _updateUrlBar(tab);
    });

    // Downloads button - trigger download manager
    container.querySelector('#browserDownloads').addEventListener('click', () => {
      WindowManager.open('downloads');
    });

    // History panel
    const historyBtn = container.querySelector('#browserHistory');
    historyBtn.addEventListener('click', () => {
      _togglePanel('history');
    });

    // Bookmarks panel
    const bookmarksBtn = container.querySelector('#browserBookmarksBtn');
    bookmarksBtn.addEventListener('click', () => {
      _togglePanel('bookmarks');
    });

    function _togglePanel(type) {
      const existing = pageContainer.querySelector('.browser-history-panel, .browser-bookmarks-panel');
      if (existing) {
        existing.remove();
        return;
      }

      const panel = document.createElement('div');
      panel.className = type === 'history' ? 'browser-history-panel' : 'browser-bookmarks-panel';

      if (type === 'history') {
        const items = state.history.slice(0, 50);
        panel.innerHTML = `
          <div class="browser-panel-header">
            <span class="browser-panel-title">History</span>
            <div class="browser-panel-close" id="closeHistoryPanel">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7l10 10M17 7L7 17"/></svg>
            </div>
          </div>
          ${items.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--muted);font-size:0.84rem;">No history yet</div>' :
            items.map(h => `
              <div class="browser-history-item" data-url="${h.url}">
                <div class="browser-history-favicon" style="background:${getFaviconColor(h.url)};">${(hostOf(h.url)[0] || 'V').toUpperCase()}</div>
                <div class="browser-history-info">
                  <div class="browser-history-title">${h.title || hostOf(h.url)}</div>
                  <div class="browser-history-url">${hostOf(h.url)}</div>
                </div>
              </div>
            `).join('')}
        `;

        panel.querySelectorAll('.browser-history-item').forEach(el => {
          el.addEventListener('click', () => {
            const tab = getActiveTab();
            if (tab) fetchPage(el.dataset.url, tab);
            panel.remove();
          });
        });

        panel.querySelector('#closeHistoryPanel').addEventListener('click', () => panel.remove());
      } else {
        panel.innerHTML = `
          <div class="browser-panel-header">
            <span class="browser-panel-title">Bookmarks</span>
            <div class="browser-panel-close" id="closeBookmarksPanel">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7l10 10M17 7L7 17"/></svg>
            </div>
          </div>
          ${state.bookmarks.length === 0 ? '<div style="text-align:center;padding:20px;color:var(--muted);font-size:0.84rem;">No bookmarks yet</div>' :
            state.bookmarks.map(b => `
              <div class="browser-bookmark-item" data-url="${b.url}">
                <div class="browser-bookmark-favicon" style="background:${b.color};">${b.icon}</div>
                <div class="browser-bookmark-info">
                  <div class="browser-bookmark-title">${b.title}</div>
                  <div class="browser-bookmark-url">${hostOf(b.url)}</div>
                </div>
              </div>
            `).join('')}
        `;

        panel.querySelectorAll('.browser-bookmark-item').forEach(el => {
          el.addEventListener('click', () => {
            const tab = getActiveTab();
            if (tab) fetchPage(el.dataset.url, tab);
            panel.remove();
          });
        });

        panel.querySelector('#closeBookmarksPanel').addEventListener('click', () => panel.remove());
      }

      pageContainer.appendChild(panel);
    }

    // Initialize with first tab
    createTab();
  }
});

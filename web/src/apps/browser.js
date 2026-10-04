AppRegistry.register('browser', {
  name: 'Veyra Browser',
  iconBg: 'linear-gradient(135deg, #a855f7, #6366f1)',
  iconText: VeyraIcons.browser,

  render(container) {
    const API_BASE = window.VeyraRuntime?.apiBase || 'https://veyraserver-xscy.onrender.com';
    const state = {
      tabs: [],
      activeTabId: null,
      tabCounter: 0,
      session: null,
      sessionPromise: null,
      history: OSStorage.get('browserHistory', []),
      bookmarks: OSStorage.get('browserBookmarks', [
        { title: 'Wikipedia', url: 'https://wikipedia.org', icon: 'W', color: '#000' },
        { title: 'YouTube', url: 'https://youtube.com', icon: '▶', color: '#ff0000' },
        { title: 'GitHub', url: 'https://github.com', icon: 'GH', color: '#1a1a2e' },
        { title: 'Veyra Browser', url: 'https://homekidchud.github.io/VeyraBrowser/', icon: 'V', color: '#8b5cf6' }
      ])
    };
    let disposed = false;
    const saveHistory = () => OSStorage.set('browserHistory', state.history.slice(0, 500));
    const saveBookmarks = () => OSStorage.set('browserBookmarks', state.bookmarks);
    const hostOf = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return url; } };
    const activeTab = () => state.tabs.find(tab => tab.id === state.activeTabId);
    const sessionEndpoint = path => `${API_BASE}${path}`;

    function normalizeUrl(input) {
      const value = String(input || '').trim();
      if (!value) return null;
      if (/^https?:\/\//i.test(value)) return value;
      if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(value)) return `https://${value}`;
      return `https://www.google.com/search?q=${encodeURIComponent(value)}`;
    }

    async function ensureSession() {
      if (state.session?.sessionId) return state.session;
      if (state.sessionPromise) return state.sessionPromise;
      state.sessionPromise = fetch(sessionEndpoint('/api/session'), {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({})
      }).then(async response => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !body?.sessionId) throw new Error(body?.error || 'Veyra API could not create a browsing session.');
        state.session = body;
        return body;
      }).finally(() => { state.sessionPromise = null; });
      return state.sessionPromise;
    }

    function closeSession() {
      const id = state.session?.sessionId;
      state.session = null;
      if (!id) return;
      const url = sessionEndpoint(`/api/session/${encodeURIComponent(id)}/close`);
      try { navigator.sendBeacon(url, ''); } catch { fetch(url, { method: 'POST', keepalive: true }).catch(() => {}); }
    }

    function viewUrl(url, sessionId) {
      return `${API_BASE}/api/view?url=${encodeURIComponent(url)}&sid=${encodeURIComponent(sessionId)}`;
    }

    async function fetchPage(url, tab, historyMode = 'push') {
      tab.loading = true;
      tab.error = null;
      tab.url = url;
      renderTabBar();
      updateUrlBar(tab);
      renderPage(tab);
      try {
        const session = await ensureSession();
        if (disposed || !state.tabs.includes(tab) || tab.url !== url) return;
        tab.sessionId = session.sessionId;
        tab.proxyUrl = viewUrl(url, session.sessionId);
        tab.title = hostOf(url);
        if (historyMode === 'push') {
          tab.history = tab.history.slice(0, tab.historyIdx + 1);
          tab.history.push(url);
          tab.historyIdx = tab.history.length - 1;
          state.history.unshift({ url, title: tab.title, time: Date.now() });
          if (state.history.length > 500) state.history.pop();
          saveHistory();
        }
        tab.loading = false;
        renderTabBar();
        updateUrlBar(tab);
        renderPage(tab);
      } catch (error) {
        if (disposed || !state.tabs.includes(tab)) return;
        tab.loading = false;
        tab.error = error.message || 'Unable to reach the Veyra API.';
        renderTabBar();
        updateUrlBar(tab);
        renderPage(tab);
      }
    }

    function createTab(url = null) {
      const tab = { id: `btab_${++state.tabCounter}`, url: null, title: 'New Tab', loading: false, error: null, history: [], historyIdx: -1, proxyUrl: '', sessionId: '' };
      state.tabs.push(tab);
      state.activeTabId = tab.id;
      if (url) fetchPage(url, tab);
      else renderPage(tab);
      renderTabBar();
      return tab;
    }

    function closeTab(id) {
      const index = state.tabs.findIndex(tab => tab.id === id);
      if (index < 0) return;
      state.tabs.splice(index, 1);
      if (state.activeTabId === id) state.activeTabId = state.tabs[Math.max(0, index - 1)]?.id || null;
      if (!state.tabs.length) createTab();
      else {
        renderTabBar();
        renderPage(activeTab());
        updateUrlBar(activeTab());
      }
    }

    function switchTab(id) {
      state.activeTabId = id;
      renderTabBar();
      renderPage(activeTab());
      updateUrlBar(activeTab());
    }

    container.innerHTML = `
      <div class="app-root browser-root" style="height:100%;display:flex;flex-direction:column;">
        <div class="browser-tabbar"><div class="browser-tabs" id="browserTabs"></div><button class="browser-tab-new" id="browserNewTab" title="New Tab"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button></div>
        <div class="browser-toolbar"><button class="browser-nav-btn" id="browserBack" title="Back" disabled>←</button><button class="browser-nav-btn" id="browserForward" title="Forward" disabled>→</button><button class="browser-nav-btn" id="browserReload" title="Reload">↻</button><button class="browser-nav-btn" id="browserHome" title="Home">⌂</button><div class="browser-url-bar"><svg id="browserUrlIcon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/></svg><input type="text" id="browserUrl" placeholder="Search or enter a website address" autocomplete="off"><button class="browser-url-bookmark" id="browserBookmark" title="Bookmark this page">★</button></div><button class="browser-nav-btn" id="browserDownloads" title="Downloads">⇩</button><button class="browser-nav-btn" id="browserHistory" title="History">◴</button><button class="browser-nav-btn" id="browserBookmarksBtn" title="Bookmarks">☆</button></div>
        <div class="browser-loadbar" id="browserLoadbar"><div class="browser-loadbar-fill"></div></div>
        <div class="browser-page-container" id="browserPageContainer"></div>
        <div class="browser-statusbar"><span id="browserStatusText">Ready</span><span id="browserTabCount">1 tab</span></div>
      </div>`;

    const style = document.createElement('style');
    style.textContent = `.browser-tabbar{display:flex;align-items:center;gap:4px;padding:6px 8px 0;background:var(--titlebar-bg);border-bottom:.5px solid var(--line);min-height:38px}.browser-tabs{display:flex;gap:2px;overflow-x:auto;flex:1;scrollbar-width:none}.browser-tabs::-webkit-scrollbar{display:none}.browser-tab{display:flex;align-items:center;gap:6px;padding:5px 12px;border-radius:8px 8px 0 0;background:var(--surface);cursor:pointer;font-size:.8rem;max-width:180px;white-space:nowrap;overflow:hidden;flex-shrink:0}.browser-tab.active{background:var(--content-bg)}.browser-tab-favicon{width:14px;height:14px;border-radius:3px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.6rem;font-weight:700;color:#fff}.browser-tab-title{overflow:hidden;text-overflow:ellipsis;max-width:120px}.browser-tab-close{margin-left:auto;opacity:.6}.browser-tab-new,.browser-nav-btn{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--surface);color:var(--text-2);flex-shrink:0}.browser-toolbar{display:flex;align-items:center;gap:6px;padding:7px 10px;background:var(--content-bg)}.browser-url-bar{height:32px;display:flex;align-items:center;gap:8px;flex:1;background:var(--surface);border:.5px solid var(--line);border-radius:8px;padding:0 10px}.browser-url-bar input{border:0;outline:0;background:transparent;color:var(--text);flex:1;min-width:0}.browser-url-bookmark{color:var(--text-2)}.browser-loadbar{height:2px;overflow:hidden}.browser-loadbar.active{background:var(--line)}.browser-loadbar-fill{height:100%;width:0;background:var(--accent)}.browser-loadbar.active .browser-loadbar-fill{width:60%;animation:veyra-load 1.5s ease-in-out infinite}@keyframes veyra-load{0%{margin-left:0}50%{margin-left:35%}100%{margin-left:90%}}.browser-page-container{flex:1;overflow:hidden;position:relative;background:#fff}.browser-page-iframe{width:100%;height:100%;border:0;background:#fff}.browser-startpage{height:100%;overflow-y:auto;display:flex;flex-direction:column;align-items:center;padding:40px 20px;background:var(--content-bg)}.browser-search-box{width:min(560px,90%);height:50px;border-radius:14px;background:var(--surface);border:.5px solid var(--line);padding:0 16px;display:flex;align-items:center;gap:10px}.browser-search-box input{flex:1;border:0;background:transparent;outline:0;font-size:1rem;color:var(--text)}.browser-shortcuts{display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:16px;width:min(560px,90%)}.browser-shortcut{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer}.browser-shortcut-icon{width:56px;height:56px;border-radius:14px;display:grid;place-items:center;font-size:1.4rem;font-weight:700;color:#fff}.browser-shortcut-label{font-size:.74rem;color:var(--text-2);text-align:center}.browser-statusbar{height:26px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:.74rem;color:var(--muted);background:var(--titlebar-bg);border-top:.5px solid var(--line)}.browser-panel{position:absolute;inset:0 0 0 auto;width:min(300px,85%);background:var(--window-bg-solid);border-left:.5px solid var(--line);box-shadow:-4px 0 20px rgba(0,0,0,.1);z-index:4;overflow-y:auto;padding:12px}.browser-panel-item{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:8px;cursor:pointer}.browser-panel-item:hover{background:var(--surface-hover)}.browser-error{height:100%;display:grid;place-items:center;text-align:center;padding:20px;color:var(--muted)}`;
    container.appendChild(style);

    const pageContainer = container.querySelector('#browserPageContainer');
    const urlInput = container.querySelector('#browserUrl');
    const backBtn = container.querySelector('#browserBack');
    const forwardBtn = container.querySelector('#browserForward');
    const reloadBtn = container.querySelector('#browserReload');
    const homeBtn = container.querySelector('#browserHome');
    const bookmarkBtn = container.querySelector('#browserBookmark');
    const loadbar = container.querySelector('#browserLoadbar');
    const statusText = container.querySelector('#browserStatusText');
    const tabCountEl = container.querySelector('#browserTabCount');

    function faviconColor(url) {
      const colors = ['#5b7fd6','#c2566b','#3f9a78','#b0772f','#8a5cc9','#2f8fa8','#c0603c','#5f8f3a'];
      let value = 0;
      for (const char of hostOf(url || 'veyra')) value = (value * 31 + char.charCodeAt(0)) >>> 0;
      return colors[value % colors.length];
    }

    function renderTabBar() {
      const tabsEl = container.querySelector('#browserTabs');
      tabsEl.innerHTML = state.tabs.map(tab => `<div class="browser-tab ${tab.id === state.activeTabId ? 'active' : ''}" data-tab="${tab.id}"><span class="browser-tab-favicon" style="background:${faviconColor(tab.url)}">${tab.loading ? '…' : (hostOf(tab.url || 'V')[0] || 'V').toUpperCase()}</span><span class="browser-tab-title">${tab.loading ? 'Loading…' : tab.title || 'New Tab'}</span><button class="browser-tab-close" data-close="${tab.id}" aria-label="Close tab">×</button></div>`).join('');
      tabsEl.querySelectorAll('.browser-tab').forEach(element => element.addEventListener('click', event => event.target.closest('[data-close]') ? closeTab(element.dataset.tab) : switchTab(element.dataset.tab)));
      tabCountEl.textContent = `${state.tabs.length} tab${state.tabs.length === 1 ? '' : 's'}`;
    }

    function updateUrlBar(tab) {
      if (!tab) return;
      urlInput.value = tab.url ? tab.url.replace(/^https?:\/\//, '') : '';
      backBtn.disabled = tab.historyIdx <= 0;
      forwardBtn.disabled = tab.historyIdx >= tab.history.length - 1;
      loadbar.classList.toggle('active', !!tab.loading);
      bookmarkBtn.style.color = state.bookmarks.some(bookmark => bookmark.url === tab.url) ? 'var(--accent)' : '';
      statusText.textContent = tab.loading ? `Loading ${tab.url || ''}` : tab.error ? `Error: ${tab.error}` : tab.url ? `Veyra API · ${hostOf(tab.url)}` : 'Ready';
    }

    function renderPage(tab) {
      pageContainer.innerHTML = '';
      if (!tab) return;
      if (tab.loading) {
        pageContainer.innerHTML = `<div class="browser-error"><div><b>Loading through Veyra…</b><p>${tab.url || ''}</p></div></div>`;
        return;
      }
      if (tab.error) {
        pageContainer.innerHTML = `<div class="browser-error"><div><b>Cannot load page</b><p>${tab.error}</p><button class="btn primary" id="retryPage">Retry</button></div></div>`;
        pageContainer.querySelector('#retryPage')?.addEventListener('click', () => tab.url && fetchPage(tab.url, tab, 'replace'));
        return;
      }
      if (!tab.proxyUrl) return renderStartPage(tab);
      const iframe = document.createElement('iframe');
      iframe.className = 'browser-page-iframe';
      iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-downloads');
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.src = tab.proxyUrl;
      pageContainer.appendChild(iframe);
    }

    function renderStartPage(tab) {
      pageContainer.innerHTML = `<div class="browser-startpage"><div style="font-size:2rem;font-weight:700;margin:0 0 20px;display:flex;align-items:center;gap:10px"><img src="${VeyraIcons.browser}" alt="" style="width:40px;height:40px"><span>Veyra</span></div><div class="browser-search-box"><span>⌕</span><input type="text" id="startPageSearch" placeholder="Search or type a URL"></div><div class="browser-shortcuts">${state.bookmarks.map(bookmark => `<button class="browser-shortcut" data-url="${bookmark.url}"><span class="browser-shortcut-icon" style="background:${bookmark.color}">${bookmark.icon}</span><span class="browser-shortcut-label">${bookmark.title}</span></button>`).join('')}</div></div>`;
      const search = pageContainer.querySelector('#startPageSearch');
      search.addEventListener('keydown', event => { if (event.key === 'Enter') { const url = normalizeUrl(search.value); if (url) fetchPage(url, tab); } });
      pageContainer.querySelectorAll('.browser-shortcut').forEach(element => element.addEventListener('click', () => fetchPage(element.dataset.url, tab)));
      search.focus();
    }

    function openPanel(kind) {
      const existing = pageContainer.querySelector('.browser-panel');
      if (existing) return existing.remove();
      const entries = kind === 'history' ? state.history.slice(0, 50) : state.bookmarks;
      const panel = document.createElement('div');
      panel.className = 'browser-panel';
      panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b>${kind === 'history' ? 'History' : 'Bookmarks'}</b><button id="closePanel">×</button></div>${entries.length ? entries.map(entry => `<button class="browser-panel-item" data-url="${entry.url}"><span style="width:20px;height:20px;border-radius:4px;background:${entry.color || faviconColor(entry.url)};display:grid;place-items:center;color:#fff;font-size:.65rem">${entry.icon || (hostOf(entry.url)[0] || 'V').toUpperCase()}</span><span style="overflow:hidden;text-align:left"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${entry.title || hostOf(entry.url)}</b><small style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${hostOf(entry.url)}</small></span></button>`).join('') : '<p style="color:var(--muted)">Nothing here yet.</p>'}`;
      panel.querySelector('#closePanel').addEventListener('click', () => panel.remove());
      panel.querySelectorAll('[data-url]').forEach(element => element.addEventListener('click', () => { const tab = activeTab(); if (tab) fetchPage(element.dataset.url, tab); panel.remove(); }));
      pageContainer.appendChild(panel);
    }

    container.querySelector('#browserNewTab').addEventListener('click', () => createTab());
    urlInput.addEventListener('keydown', event => { if (event.key === 'Enter') { const url = normalizeUrl(urlInput.value); const tab = activeTab(); if (url && tab) fetchPage(url, tab); } });
    backBtn.addEventListener('click', () => { const tab = activeTab(); if (tab && tab.historyIdx > 0) { tab.historyIdx -= 1; fetchPage(tab.history[tab.historyIdx], tab, 'replace'); } });
    forwardBtn.addEventListener('click', () => { const tab = activeTab(); if (tab && tab.historyIdx < tab.history.length - 1) { tab.historyIdx += 1; fetchPage(tab.history[tab.historyIdx], tab, 'replace'); } });
    reloadBtn.addEventListener('click', () => { const tab = activeTab(); if (tab?.url) fetchPage(tab.url, tab, 'replace'); });
    homeBtn.addEventListener('click', () => { const tab = activeTab(); if (!tab) return; Object.assign(tab, { url: null, title: 'New Tab', error: null, proxyUrl: '' }); renderPage(tab); updateUrlBar(tab); renderTabBar(); });
    bookmarkBtn.addEventListener('click', () => { const tab = activeTab(); if (!tab?.url) return; const index = state.bookmarks.findIndex(bookmark => bookmark.url === tab.url); if (index >= 0) state.bookmarks.splice(index, 1); else state.bookmarks.push({ title: tab.title || hostOf(tab.url), url: tab.url, icon: (hostOf(tab.url)[0] || 'V').toUpperCase(), color: faviconColor(tab.url) }); saveBookmarks(); updateUrlBar(tab); });
    container.querySelector('#browserDownloads').addEventListener('click', () => WindowManager.open('downloads'));
    container.querySelector('#browserHistory').addEventListener('click', () => openPanel('history'));
    container.querySelector('#browserBookmarksBtn').addEventListener('click', () => openPanel('bookmarks'));

    const messageHandler = event => {
      const message = event.data || {};
      const tab = state.tabs.find(candidate => pageContainer.querySelector('iframe')?.contentWindow === event.source && candidate.id === state.activeTabId);
      if (!tab || !message.type) return;
      if (message.type === 'veyra:navigate' && message.url) fetchPage(message.url, tab);
      if (message.type === 'veyra:session-expired') { state.session = null; tab.error = 'Your Veyra browsing session expired. Retry to start a new session.'; renderPage(tab); updateUrlBar(tab); }
    };
    window.addEventListener('message', messageHandler);
    const originalClose = container.closest('.window')?.querySelector('.window-close');
    originalClose?.addEventListener('click', closeSession, { once: true });
    window.addEventListener('pagehide', closeSession, { once: true });
    createTab();
  }
});

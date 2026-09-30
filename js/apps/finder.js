// ============================================
// VeyraOS App — Finder
// ============================================

AppRegistry.register('finder', {
  name: 'Finder',
  iconBg: 'linear-gradient(135deg, #4a9eff, #2563eb)',
  iconText: '📁',

  render(container, win) {
    const files = OSStorage.getFiles();

    container.innerHTML = `
      <div class="app-root finder-root">
        <div class="finder-sidebar">
          <div class="finder-section">
            <div class="finder-section-title">Favorites</div>
            <div class="finder-nav-item active" data-folder="desktop">
              <svg class="finder-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l3-3h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/></svg>
              Desktop
            </div>
            <div class="finder-nav-item" data-folder="documents">
              <svg class="finder-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l3-3h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/></svg>
              Documents
            </div>
            <div class="finder-nav-item" data-folder="downloads">
              <svg class="finder-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14"/></svg>
              Downloads
            </div>
            <div class="finder-nav-item" data-folder="pictures">
              <svg class="finder-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 5"/></svg>
              Pictures
            </div>
            <div class="finder-nav-item" data-folder="music">
              <svg class="finder-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>
              Music
            </div>
          </div>
          <div class="finder-section">
            <div class="finder-section-title">Locations</div>
            <div class="finder-nav-item" data-folder="applications">
              <svg class="finder-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>
              Applications
            </div>
          </div>
        </div>
        <div class="finder-main">
          <div class="finder-toolbar">
            <button class="browser-nav-btn" id="finderBack" title="Back"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
            <button class="browser-nav-btn" id="finderForward" title="Forward"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
            <div class="finder-path" id="finderPath">Desktop</div>
          </div>
          <div class="finder-content" id="finderContent"></div>
        </div>
      </div>
    `;

    const content = container.querySelector('#finderContent');
    const pathEl = container.querySelector('#finderPath');
    let currentFolder = 'desktop';

    const renderFolder = (folder) => {
      currentFolder = folder;
      const items = files[folder] || [];
      pathEl.textContent = folder.charAt(0).toUpperCase() + folder.slice(1);

      if (items.length === 0) {
        content.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);">This folder is empty</div>';
        return;
      }

      content.innerHTML = '<div class="finder-grid">' + items.map((item, i) => `
        <div class="finder-file" data-idx="${i}">
          <div class="finder-file-icon" style="background:var(--surface-2);">${item.icon || '📄'}</div>
          <div class="finder-file-name">${item.name}</div>
        </div>
      `).join('') + '</div>';

      content.querySelectorAll('.finder-file').forEach(el => {
        el.addEventListener('click', () => {
          content.querySelectorAll('.finder-file').forEach(e => e.classList.remove('selected'));
          el.classList.add('selected');
        });
        el.addEventListener('dblclick', () => {
          const idx = parseInt(el.dataset.idx);
          const item = items[idx];
          if (item.type === 'text') {
            WindowManager.open('texteditor', { title: item.name, width: 600, height: 500 });
            setTimeout(() => {
              const w = WindowManager.getActiveWindow();
              if (w) {
                const ta = w.el.querySelector('textarea');
                if (ta) ta.value = item.content || '';
              }
            }, 100);
          } else if (item.type === 'app') {
            Toast.show(item.name, 'Opening app...', '🚀');
          } else {
            Toast.show(item.name, 'Cannot open this file type yet', 'ℹ️');
          }
        });
      });
    };

    container.querySelectorAll('.finder-nav-item').forEach(nav => {
      nav.addEventListener('click', () => {
        container.querySelectorAll('.finder-nav-item').forEach(n => n.classList.remove('active'));
        nav.classList.add('active');
        renderFolder(nav.dataset.folder);
      });
    });

    renderFolder('desktop');
  }
});

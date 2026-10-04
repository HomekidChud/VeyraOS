





AppRegistry.register('filemanager', {
  name: 'File Manager',
  iconBg: 'linear-gradient(135deg, #3aa0ff, #0066ee)',
  iconText: VeyraIcons.finder,

  render(container, win) {
    let files = OSStorage.getFiles();
    let currentPath = ['desktop'];
    let selectedFile = null;
    let viewMode = 'grid';
    let history_nav = [['desktop']];
    let historyIdx = 0;

    
    if (!files.desktop) files.desktop = [];
    if (!files.documents) files.documents = [];
    if (!files.downloads) files.downloads = [];
    if (!files.pictures) files.pictures = [];
    if (!files.music) files.music = [];
    if (!files.applications) files.applications = [];

    const save = () => OSStorage.saveFiles(files);

    container.innerHTML = `
      <div class="app-root" style="height:100%;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:0.5px solid var(--line);background:var(--titlebar-bg);min-height:44px;">
          <button class="browser-nav-btn" id="fmBack" title="Back" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button class="browser-nav-btn" id="fmForward" title="Forward" disabled><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
          <button class="browser-nav-btn" id="fmUp" title="Up"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
          <div style="flex:1;display:flex;align-items:center;gap:4px;font-size:0.86rem;font-weight:600;color:var(--text-2);overflow:hidden;" id="fmBreadcrumb"></div>
          <button class="browser-nav-btn" id="fmNewFolder" title="New Folder"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l3-3h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><path d="M12 11v6M9 14h6" stroke="currentColor" stroke-width="1.5"/></svg></button>
          <button class="browser-nav-btn" id="fmNewFile" title="New File"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M9 11h6M9 15h4"/></svg></button>
          <div style="width:1px;height:24px;background:var(--line);margin:0 4px;"></div>
          <button class="browser-nav-btn" id="fmViewGrid" title="Grid View"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg></button>
          <button class="browser-nav-btn" id="fmViewList" title="List View"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
        </div>
        <div style="flex:1;display:flex;overflow:hidden;">
          <div style="width:190px;flex-shrink:0;background:var(--sidebar-bg);border-right:0.5px solid var(--line);padding:8px;overflow-y:auto;" id="fmSidebar"></div>
          <div style="flex:1;display:flex;flex-direction:column;overflow:hidden;">
            <div style="flex:1;overflow-y:auto;padding:12px;" id="fmContent"></div>
            <div style="height:26px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:0.72rem;color:var(--muted);border-top:0.5px solid var(--line);background:var(--titlebar-bg);" id="fmStatusbar">
              <span id="fmItemCount">0 items</span>
              <span id="fmSelectedInfo"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    const sidebar = container.querySelector('#fmSidebar');
    const content = container.querySelector('#fmContent');
    const breadcrumb = container.querySelector('#fmBreadcrumb');
    const backBtn = container.querySelector('#fmBack');
    const forwardBtn = container.querySelector('#fmForward');
    const upBtn = container.querySelector('#fmUp');
    const itemCount = container.querySelector('#fmItemCount');
    const selectedInfo = container.querySelector('#fmSelectedInfo');

    const sidebarItems = [
      { folder: 'desktop', label: 'Desktop', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="14" rx="1"/><path d="M2 20h20"/></svg>' },
      { folder: 'documents', label: 'Documents', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l3-3h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/></svg>' },
      { folder: 'downloads', label: 'Downloads', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14"/></svg>' },
      { folder: 'pictures', label: 'Pictures', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 5"/></svg>' },
      { folder: 'music', label: 'Music', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>' },
      { folder: 'applications', label: 'Applications', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>' }
    ];

    function renderSidebar() {
      sidebar.innerHTML = `
        <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.04em;padding:4px 8px;margin-bottom:4px;">Favorites</div>
        ${sidebarItems.map(item => `
          <div class="fm-nav-item ${currentPath[0] === item.folder ? 'active' : ''}" data-folder="${item.folder}" style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:0.84rem;transition:background var(--t-fast);">
            <span style="color:var(--accent);">${item.icon}</span>
            ${item.label}
          </div>
        `).join('')}
        <div style="font-size:0.72rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:0.04em;padding:4px 8px;margin:12px 0 4px;">Locations</div>
        <div class="fm-nav-item" data-folder="desktop" style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;font-size:0.84rem;">
          <span style="color:var(--accent);"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="14" rx="1"/></svg></span>
          Veyra HD
        </div>
      `;

      sidebar.querySelectorAll('.fm-nav-item').forEach(el => {
        el.addEventListener('click', () => {
          const folder = el.dataset.folder;
          navigateTo([folder]);
        });
      });

      
      sidebar.querySelectorAll('.fm-nav-item').forEach(el => {
        if (currentPath[0] === el.dataset.folder) {
          el.style.background = 'var(--accent)';
          el.style.color = '#fff';
          el.querySelector('span').style.color = '#fff';
        }
      });
    }

    function getCurrentFolder() {
      let folder = files;
      for (const path of currentPath) {
        if (folder[path]) folder = folder[path];
        else return [];
      }
      return Array.isArray(folder) ? folder : [];
    }

    function navigateTo(path) {
      currentPath = path;
      history_nav.splice(historyIdx + 1);
      history_nav.push([...path]);
      historyIdx = history_nav.length - 1;
      selectedFile = null;
      renderAll();
    }

    function renderBreadcrumb() {
      const parts = ['Home', ...currentPath];
      breadcrumb.innerHTML = parts.map((p, i) => {
        const isLast = i === parts.length - 1;
        return `<span style="cursor:pointer;${isLast ? 'color:var(--text);' : ''}" data-path="${i}">${p.charAt(0).toUpperCase() + p.slice(1)}</span>${!isLast ? '<span style="color:var(--muted);margin:0 2px;">›</span>' : ''}`;
      }).join('');

      breadcrumb.querySelectorAll('[data-path]').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.path);
          if (idx === 0) {
            navigateTo(['desktop']);
          } else {
            navigateTo(currentPath.slice(0, idx));
          }
        });
      });

      backBtn.disabled = historyIdx <= 0;
      forwardBtn.disabled = historyIdx >= history_nav.length - 1;
      upBtn.disabled = currentPath.length <= 1;
    }

    function getFileIcon(item) {
      if (item.type === 'folder') return '📁';
      if (item.type === 'app') return item.icon || '📦';
      const ext = (item.name || '').split('.').pop().toLowerCase();
      const icons = {
        txt: '📄', pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗',
        jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', svg: '🖼️',
        mp3: '🎵', wav: '🎵', mp4: '🎬', mkv: '🎬', avi: '🎬',
        js: '📜', css: '📜', html: '📜', json: '📜', py: '📜',
        zip: '🗜️', rar: '🗜️', exe: '⚙️', dmg: '⚙️'
      };
      return icons[ext] || item.icon || '📄';
    }

    function renderContent() {
      const items = getCurrentFolder();

      if (items.length === 0) {
        content.innerHTML = '<div style="text-align:center;padding:60px 20px;color:var(--muted);"><div style="font-size:3rem;margin-bottom:12px;">📂</div><div>This folder is empty</div><div style="font-size:0.78rem;margin-top:4px;">Right-click to create a new file or folder</div></div>';
        itemCount.textContent = '0 items';
        return;
      }

      if (viewMode === 'grid') {
        content.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;">' +
          items.map((item, i) => `
            <div class="fm-file ${selectedFile === i ? 'selected' : ''}" data-idx="${i}" style="display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px;border-radius:10px;cursor:pointer;transition:background var(--t-fast);${selectedFile === i ? 'background:var(--accent-soft);' : ''}">
              <div style="width:52px;height:52px;display:flex;align-items:center;justify-content:center;font-size:2rem;">${getFileIcon(item)}</div>
              <div style="font-size:0.74rem;text-align:center;word-break:break-word;max-width:90px;line-height:1.2;">${item.name}</div>
            </div>
          `).join('') + '</div>';
      } else {
        content.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:1px;">
            <div style="display:grid;grid-template-columns:1fr 100px 80px 120px;gap:8px;padding:6px 12px;font-size:0.72rem;font-weight:600;color:var(--text-3);text-transform:uppercase;border-bottom:1px solid var(--line);">
              <span>Name</span><span>Kind</span><span>Size</span><span>Modified</span>
            </div>
            ${items.map((item, i) => `
              <div class="fm-file ${selectedFile === i ? 'selected' : ''}" data-idx="${i}" style="display:grid;grid-template-columns:1fr 100px 80px 120px;gap:8px;padding:6px 12px;border-radius:6px;cursor:pointer;transition:background var(--t-fast);font-size:0.84rem;align-items:center;${selectedFile === i ? 'background:var(--accent-soft);' : ''}">
                <span style="display:flex;align-items:center;gap:6px;">${getFileIcon(item)} ${item.name}</span>
                <span style="color:var(--muted);">${item.type || 'File'}</span>
                <span style="color:var(--muted);">${item.size ? formatSize(item.size) : '—'}</span>
                <span style="color:var(--muted);">${item.modified ? timeAgo(item.modified) : '—'}</span>
              </div>
            `).join('')}
          </div>
        `;
      }

      content.querySelectorAll('.fm-file').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.idx);
          selectedFile = idx;
          renderContent();
          updateStatusbar();
        });
        el.addEventListener('dblclick', () => {
          const idx = parseInt(el.dataset.idx);
          openFile(idx);
        });
        el.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          const idx = parseInt(el.dataset.idx);
          selectedFile = idx;
          showContextMenu(e.clientX, e.clientY, items[idx], idx);
        });
      });

      
      content.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.fm-file')) return;
        e.preventDefault();
        showContextMenu(e.clientX, e.clientY, null, null);
      });

      itemCount.textContent = items.length + ' item' + (items.length !== 1 ? 's' : '');
      updateStatusbar();
    }

    function updateStatusbar() {
      if (selectedFile !== null) {
        const items = getCurrentFolder();
        const item = items[selectedFile];
        if (item) {
          selectedInfo.textContent = `Selected: ${item.name}`;
        }
      } else {
        selectedInfo.textContent = '';
      }
    }

    function openFile(idx) {
      const items = getCurrentFolder();
      const item = items[idx];
      if (!item) return;

      if (item.type === 'folder') {
        navigateTo([...currentPath, item.name]);
      } else if (item.type === 'text') {
        WindowManager.open('texteditor', { title: item.name, width: 600, height: 500 });
        setTimeout(() => {
          const w = WindowManager.getActiveWindow();
          if (w) {
            const ta = w.el.querySelector('textarea');
            if (ta) ta.value = item.content || '';
          }
        }, 100);
      } else if (item.type === 'app') {
        Toast.show('File Manager', 'Opening ' + item.name + '...', '🚀');
      } else if (item.type === 'image') {
        Toast.show('Photos', 'Opening in Photos...', '🖼️');
        WindowManager.open('photos');
      } else if (item.type === 'audio') {
        Toast.show('Music', 'Opening in Music...', '🎵');
        WindowManager.open('music');
      } else {
        Toast.show('File Manager', 'Cannot open this file type', 'ℹ️');
      }
    }

    function showContextMenu(x, y, item, idx) {
      const ctxMenu = document.getElementById('contextMenu');
      const actions = [];

      if (item) {
        actions.push({ label: 'Open', action: () => openFile(idx) });
        actions.push({ label: 'Rename', action: () => renameFile(idx) });
        actions.push({ label: 'Delete', action: () => deleteFile(idx) });
        actions.push({ sep: true });
        actions.push({ label: 'Get Info', action: () => showInfo(item) });
        actions.push({ label: 'Duplicate', action: () => duplicateFile(idx) });
      } else {
        actions.push({ label: 'New Folder', action: () => createItem('folder') });
        actions.push({ label: 'New Text File', action: () => createItem('text') });
        actions.push({ sep: true });
        actions.push({ label: 'Paste', action: () => Toast.show('File Manager', 'Nothing to paste', '📋') });
        actions.push({ sep: true });
        actions.push({ label: 'Select All', action: () => { selectedFile = 0; renderContent(); } });
      }

      ctxMenu.innerHTML = actions.map(a => a.sep ? '<div class="ctx-sep"></div>' : `<div class="ctx-item">${a.label}</div>`).join('');
      ctxMenu.style.left = Math.min(x, window.innerWidth - 220) + 'px';
      ctxMenu.style.top = Math.min(y, window.innerHeight - 300) + 'px';
      ctxMenu.classList.remove('hidden');

      ctxMenu.querySelectorAll('.ctx-item').forEach((el, i) => {
        const action = actions.filter(a => !a.sep)[i];
        if (action) {
          el.addEventListener('click', () => {
            action.action();
            ctxMenu.classList.add('hidden');
          });
        }
      });
    }

    function createItem(type) {
      const name = type === 'folder'
        ? 'New Folder'
        : 'New File.txt';

      let counter = 1;
      let finalName = name;
      const items = getCurrentFolder();
      while (items.some(i => i.name === finalName)) {
        finalName = name.replace(/(\.[^.]+)$/, ` ${counter}$1`);
        if (!name.includes('.')) finalName = `${name} ${counter}`;
        counter++;
      }

      const newItem = type === 'folder'
        ? { name: finalName, type: 'folder', icon: '📁', modified: Date.now() }
        : { name: finalName, type: 'text', icon: '📄', content: '', modified: Date.now() };

      items.push(newItem);
      save();
      renderContent();
      Toast.show('File Manager', `${type === 'folder' ? 'Folder' : 'File'} created: ${finalName}`, '✅');
    }

    function renameFile(idx) {
      const items = getCurrentFolder();
      const item = items[idx];
      if (!item) return;

      const newName = prompt('Rename to:', item.name);
      if (newName && newName.trim()) {
        item.name = newName.trim();
        item.modified = Date.now();
        save();
        renderContent();
        Toast.show('File Manager', `Renamed to ${newName}`, '✏️');
      }
    }

    function deleteFile(idx) {
      const items = getCurrentFolder();
      const item = items[idx];
      if (!item) return;

      if (!confirm(`Delete "${item.name}"?`)) return;
      items.splice(idx, 1);
      selectedFile = null;
      save();
      renderContent();
      Toast.show('File Manager', `Deleted: ${item.name}`, '🗑️');
    }

    function duplicateFile(idx) {
      const items = getCurrentFolder();
      const item = items[idx];
      if (!item) return;

      const copy = JSON.parse(JSON.stringify(item));
      copy.name = 'Copy of ' + item.name;
      copy.modified = Date.now();
      items.push(copy);
      save();
      renderContent();
      Toast.show('File Manager', `Duplicated: ${copy.name}`, '📋');
    }

    function showInfo(item) {
      Toast.show('File Info', `${item.name} • ${item.type || 'File'} • ${item.size ? formatSize(item.size) : 'Unknown size'}`, 'ℹ️');
    }

    function formatSize(bytes) {
      if (!bytes) return '—';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function timeAgo(t) {
      const d = (Date.now() - t) / 1000;
      if (d < 60) return 'just now';
      if (d < 3600) return Math.floor(d / 60) + 'm ago';
      if (d < 86400) return Math.floor(d / 3600) + 'h ago';
      return new Date(t).toLocaleDateString();
    }

    function renderAll() {
      renderSidebar();
      renderBreadcrumb();
      renderContent();
    }

    
    backBtn.addEventListener('click', () => {
      if (historyIdx > 0) {
        historyIdx--;
        currentPath = [...history_nav[historyIdx]];
        selectedFile = null;
        renderAll();
      }
    });

    forwardBtn.addEventListener('click', () => {
      if (historyIdx < history_nav.length - 1) {
        historyIdx++;
        currentPath = [...history_nav[historyIdx]];
        selectedFile = null;
        renderAll();
      }
    });

    upBtn.addEventListener('click', () => {
      if (currentPath.length > 1) {
        navigateTo(currentPath.slice(0, -1));
      }
    });

    container.querySelector('#fmNewFolder').addEventListener('click', () => createItem('folder'));
    container.querySelector('#fmNewFile').addEventListener('click', () => createItem('text'));
    container.querySelector('#fmViewGrid').addEventListener('click', () => { viewMode = 'grid'; renderContent(); });
    container.querySelector('#fmViewList').addEventListener('click', () => { viewMode = 'list'; renderContent(); });

    renderAll();
  }
});

// ============================================
// VeyraOS — Desktop Environment
// ============================================

const Desktop = {
  init() {
    this._renderDesktopIcons();
    this._initContextMenu();
  },

  _renderDesktopIcons() {
    const container = document.getElementById('desktopIcons');
    const files = OSStorage.getFiles();
    const desktopFiles = files.desktop || [];

    // Add hard drive icon
    const icons = [
      { name: 'Veyra HD', icon: VeyraIcons.veyraHD, action: () => WindowManager.open('filemanager') },
      ...desktopFiles.map(f => ({
        name: f.name,
        icon: VeyraIcons.textFile,
        action: () => {
          if (f.type === 'text') {
            WindowManager.open('texteditor', { title: f.name, width: 600, height: 500 });
            setTimeout(() => {
              const win = WindowManager.getActiveWindow();
              if (win) {
                const ta = win.el.querySelector('textarea');
                if (ta) ta.value = f.content || '';
              }
            }, 100);
          }
        }
      }))
    ];

    container.innerHTML = icons.map((icon, i) => `
      <div class="desktop-icon" data-idx="${i}">
        <div class="desktop-icon-img"><img src="${icon.icon}" alt="${icon.name}" loading="lazy"></div>
        <div class="desktop-icon-label">${icon.name}</div>
      </div>
    `).join('');

    container.querySelectorAll('.desktop-icon').forEach(el => {
      el.addEventListener('dblclick', () => {
        const idx = parseInt(el.dataset.idx);
        icons[idx].action();
      });
      el.addEventListener('click', () => {
        // Single click selects
        container.querySelectorAll('.desktop-icon').forEach(e => e.style.background = '');
        el.style.background = 'rgba(255, 255, 255, 0.08)';
      });
    });
  },

  _initContextMenu() {
    const ctxMenu = document.getElementById('contextMenu');

    document.getElementById('desktop').addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (e.target.closest('.window') || e.target.closest('.dock') || e.target.closest('.menu-bar')) return;

      const items = [
        { label: 'New Folder', action: () => Toast.show('New Folder', 'Folder created on desktop', '📁') },
        { label: 'Get Info', action: () => Toast.show('Desktop', 'VeyraOS Desktop', 'ℹ️') },
        { sep: true },
        { label: 'Change Wallpaper…', action: () => WindowManager.open('settings') },
        { label: 'Use Stacks', action: () => Toast.show('Stacks', 'Stacks not yet available', '🗂️') },
        { sep: true },
        { label: 'Show View Options', action: () => Toast.show('View Options', 'Not yet available', '⚙️') }
      ];

      this._showContextMenu(e.clientX, e.clientY, items);
    });

    document.addEventListener('click', () => {
      ctxMenu.classList.add('hidden');
    });
  },

  _showContextMenu(x, y, items) {
    const ctxMenu = document.getElementById('contextMenu');
    ctxMenu.innerHTML = items.map(item => {
      if (item.sep) return '<div class="ctx-sep"></div>';
      return `<div class="ctx-item">${item.label}</div>`;
    }).join('');

    ctxMenu.style.left = Math.min(x, window.innerWidth - 220) + 'px';
    ctxMenu.style.top = Math.min(y, window.innerHeight - 300) + 'px';
    ctxMenu.classList.remove('hidden');

    ctxMenu.querySelectorAll('.ctx-item').forEach((el, i) => {
      const item = items.filter(it => !it.sep)[Array.from(ctxMenu.querySelectorAll('.ctx-item')).indexOf(el)];
      if (item && item.action) {
        el.addEventListener('click', () => {
          item.action();
          ctxMenu.classList.add('hidden');
        });
      }
    });
  }
};

window.Desktop = Desktop;

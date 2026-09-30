// ============================================
// VeyraOS — Dock (v2.0 with custom SVG icons)
// ============================================

const Dock = {
  apps: [
    { id: 'launchpad', name: 'Launchpad', icon: 'launchpad', svg: VeyraIcons.launchpad },
    { id: 'filemanager', name: 'File Manager', icon: 'finder', svg: VeyraIcons.finder },
    { id: 'browser', name: 'Veyra Browser', icon: 'browser', svg: VeyraIcons.browser },
    { id: 'mail', name: 'Mail', icon: 'mail', svg: VeyraIcons.mail },
    { id: 'notes', name: 'Notes', icon: 'notes', svg: VeyraIcons.notes },
    { id: 'calendar', name: 'Calendar', icon: 'calendar', svg: VeyraIcons.calendar },
    { id: 'photos', name: 'Photos', icon: 'photos', svg: VeyraIcons.photos },
    { id: 'music', name: 'Music', icon: 'music', svg: VeyraIcons.music },
    { id: 'downloads', name: 'Downloads', icon: 'downloads', svg: VeyraIcons.downloads },
    { id: 'appstore', name: 'App Store', icon: 'appstore', svg: VeyraIcons.appstore },
    { id: 'calculator', name: 'Calculator', icon: 'calculator', svg: VeyraIcons.calculator },
    { id: 'texteditor', name: 'Text Editor', icon: 'texteditor', svg: VeyraIcons.texteditor },
    { id: 'terminal', name: 'Terminal', icon: 'terminal', svg: VeyraIcons.terminal },
    { id: 'settings', name: 'Settings', icon: 'settings', svg: VeyraIcons.settings }
  ],

  rightApps: [
    { id: 'trash', name: 'Trash', icon: 'trash', svg: VeyraIcons.trash }
  ],

  init() {
    this.render();
  },

  render() {
    const left = document.getElementById('dockItems');
    const right = document.getElementById('dockItemsRight');

    left.innerHTML = this.apps.map(app => this._renderItem(app)).join('');
    right.innerHTML = this.rightApps.map(app => this._renderItem(app)).join('');

    document.querySelectorAll('.dock-item').forEach(item => {
      item.addEventListener('click', () => {
        const appId = item.dataset.appId;
        this.launchApp(appId);
      });
    });
  },

  _renderItem(app) {
    return `
      <div class="dock-item" data-app-id="${app.id}">
        <div class="dock-item-icon" style="background:transparent;box-shadow:none;">
          <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
            ${app.svg}
          </div>
        </div>
        <div class="dock-item-indicator"></div>
        <div class="dock-item-tooltip">${app.name}</div>
      </div>
    `;
  },

  launchApp(appId) {
    if (appId === 'trash') {
      Toast.show('Trash', 'Trash is empty', '🗑️');
      return;
    }

    if (appId === 'launchpad') {
      Launchpad.toggle();
      return;
    }

    const existing = WindowManager.getWindowsByApp(appId);
    if (existing.length > 0) {
      const win = existing[0];
      if (win.minimized) {
        WindowManager.unminimize(win.id);
      } else {
        WindowManager.focus(win.id);
      }
    } else {
      const sizeOverrides = {
        calculator: { width: 280, height: 420, resizable: false },
        terminal: { width: 680, height: 420 },
        notes: { width: 720, height: 500 },
        photos: { width: 800, height: 560 },
        music: { width: 660, height: 580 },
        downloads: { width: 600, height: 480 },
        filemanager: { width: 800, height: 540 },
        browser: { width: 1000, height: 680 },
        appstore: { width: 800, height: 560 },
        settings: { width: 780, height: 540 },
        texteditor: { width: 640, height: 520 }
      };
      WindowManager.open(appId, sizeOverrides[appId] || {});
    }
    this.updateIndicators();
  },

  updateIndicators() {
    document.querySelectorAll('.dock-item').forEach(item => {
      const appId = item.dataset.appId;
      const wins = WindowManager.getWindowsByApp(appId);
      item.classList.toggle('running', wins.length > 0);
      const active = wins.some(w => w.id === WindowManager.activeWindow);
      item.classList.toggle('active', active);
    });
  }
};

// ============================================
// Launchpad — full-screen app grid
// ============================================

const Launchpad = {
  visible: false,
  el: null,

  toggle() {
    this.visible = !this.visible;
    if (this.visible) {
      this._show();
    } else {
      this._hide();
    }
  },

  _show() {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'launchpad-overlay';
      this.el.style.cssText = 'position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,0.5);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px;animation:fadeIn 0.3s ease;';
      document.getElementById('desktop').appendChild(this.el);

      // Click outside to close
      this.el.addEventListener('click', (e) => {
        if (e.target === this.el) this._hide();
      });
    }

    const allApps = Object.entries(AppRegistry.getAll()).map(([id, config]) => ({
      id, name: config.name, svg: config.iconText
    }));

    this.el.innerHTML = `
      <div style="width:100%;max-width:800px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:20px;">
          ${allApps.map(app => `
            <div class="launchpad-icon" data-app-id="${app.id}" style="display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:transform 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
              <div style="width:72px;height:72px;display:flex;align-items:center;justify-content:center;">
                ${typeof app.svg === 'string' && app.svg.startsWith('<svg') ? app.svg : `<div style="width:72px;height:72px;border-radius:16px;background:var(--surface);display:flex;align-items:center;justify-content:center;font-size:2rem;">${app.svg || '📦'}</div>`}
              </div>
              <span style="color:#fff;font-size:0.78rem;text-shadow:0 1px 4px rgba(0,0,0,0.5);">${app.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.el.querySelectorAll('.launchpad-icon').forEach(el => {
      el.addEventListener('click', () => {
        const appId = el.dataset.appId;
        this._hide();
        setTimeout(() => Dock.launchApp(appId), 200);
      });
    });

    this.el.style.display = 'flex';
  },

  _hide() {
    if (this.el) {
      this.el.style.display = 'none';
    }
    this.visible = false;
  }
};

window.Dock = Dock;
window.Launchpad = Launchpad;

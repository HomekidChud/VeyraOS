



function escapeIconMarkup(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

function renderAppIcon(icon, label, variant) {
  const value = String(icon ?? '');
  const safeLabel = escapeIconMarkup(label);
  if (/^\/?assets\/[a-z0-9/_-]+\.(?:svg|png|webp|gif)$/i.test(value)) {
    return `<img src="${escapeIconMarkup(value)}" alt="${safeLabel}" loading="lazy">`;
  }
  const iconClass = variant === 'launchpad' ? 'launchpad-emoji-icon' : 'dock-emoji-icon';
  return `<span class="${iconClass}" role="img" aria-label="${safeLabel}">${escapeIconMarkup(value || '•')}</span>`;
}

const Dock = {
  apps: [
    { id: 'launchpad', name: 'Launchpad', icon: VeyraIcons.launchpad },
    { id: 'filemanager', name: 'File Manager', icon: VeyraIcons.filemanager },
    { id: 'browser', name: 'Veyra Browser', icon: VeyraIcons.browser },
    { id: 'gameemulator', name: 'Game Emulator', icon: '🎮' },
    { id: 'mail', name: 'Mail', icon: VeyraIcons.mail },
    { id: 'notes', name: 'Notes', icon: VeyraIcons.notes },
    { id: 'calendar', name: 'Calendar', icon: VeyraIcons.calendar },
    { id: 'photos', name: 'Photos', icon: VeyraIcons.photos },
    { id: 'music', name: 'Music', icon: VeyraIcons.music },
    { id: 'paint', name: 'Paint Studio', icon: 'assets/icons/paint.svg' },
    { id: 'weather', name: 'Weather', icon: 'assets/icons/weather.svg' },
    { id: 'downloads', name: 'Downloads', icon: VeyraIcons.downloads },
    { id: 'appstore', name: 'App Store', icon: VeyraIcons.appstore },
    { id: 'calculator', name: 'Calculator', icon: VeyraIcons.calculator },
    { id: 'activity', name: 'Activity Monitor', icon: 'assets/icons/activity.svg' },
    { id: 'texteditor', name: 'Text Editor', icon: VeyraIcons.texteditor },
    { id: 'terminal', name: 'Terminal', icon: VeyraIcons.terminal },
    { id: 'settings', name: 'Settings', icon: VeyraIcons.settings }
  ],

  rightApps: [
    { id: 'trash', name: 'Trash', icon: VeyraIcons.trash }
  ],

  init() {
    this.render();
  },

  render() {
    const left = document.getElementById('dockItems');
    const right = document.getElementById('dockItemsRight');

    const mobile = window.DeviceManager?.isMobile?.() || document.body.classList.contains('device-mobile');
    const visibleApps = mobile ? this.apps.filter(app => ['launchpad', 'filemanager', 'browser', 'gameemulator', 'notes', 'downloads', 'settings'].includes(app.id)) : this.apps;
    left.innerHTML = visibleApps.map(app => this._renderItem(app)).join('');
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
      <div class="dock-item" data-app-id="${escapeIconMarkup(app.id)}">
        <div class="dock-item-icon">
          ${renderAppIcon(app.icon, app.name, 'dock')}
        </div>
        <div class="dock-item-indicator"></div>
        <div class="dock-item-tooltip">${escapeIconMarkup(app.name)}</div>
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
        texteditor: { width: 640, height: 520 },
        paint: { width: 900, height: 640 },
        weather: { width: 400, height: 640, resizable: false },
        activity: { width: 720, height: 540 }
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





const Launchpad = {
  visible: false,
  el: null,

  toggle() {
    this.visible = !this.visible;
    if (this.visible) this._show();
    else this._hide();
  },

  _show() {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.className = 'launchpad-overlay';
      document.getElementById('desktop').appendChild(this.el);
      this.el.addEventListener('click', (e) => {
        if (e.target === this.el) this._hide();
      });
    }

    const allApps = Object.entries(AppRegistry.getAll()).map(([id, config]) => ({
      id, name: config.name, icon: config.iconText
    }));

    this.el.innerHTML = `
      <div class="launchpad-grid">
        ${allApps.map(app => `
          <div class="launchpad-icon" data-app-id="${escapeIconMarkup(app.id)}">
            ${renderAppIcon(app.icon, app.name, 'launchpad')}
            <span class="launchpad-app-label">${escapeIconMarkup(app.name)}</span>
          </div>
        `).join('')}
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
    if (this.el) this.el.style.display = 'none';
    this.visible = false;
  }
};

window.Dock = Dock;
window.Launchpad = Launchpad;

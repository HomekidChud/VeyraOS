// ============================================
// VeyraOS — Dock
// ============================================

const Dock = {
  apps: [
    { id: 'finder', name: 'Finder', icon: 'finder', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M3 8l3-3h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/><path d="M3 8v8M21 10h-6"/></svg>' },
    { id: 'browser', name: 'Veyra Browser', icon: 'browser', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9z"/></svg>' },
    { id: 'mail', name: 'Mail', icon: 'mail', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>' },
    { id: 'notes', name: 'Notes', icon: 'notes', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M5 4h14v11l-4 5H5z"/><path d="M15 20v-5h4"/></svg>' },
    { id: 'calendar', name: 'Calendar', icon: 'calendar', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>' },
    { id: 'photos', name: 'Photos', icon: 'photos', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 5"/></svg>' },
    { id: 'music', name: 'Music', icon: 'music', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>' },
    { id: 'appstore', name: 'App Store', icon: 'appstore', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M12 3l8 14H4z"/><path d="M9 14l3-5 3 5"/></svg>' },
    { id: 'calculator', name: 'Calculator', icon: 'calculator', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0M8 19h2M12 19h2M16 19h0"/></svg>' },
    { id: 'texteditor', name: 'Text Editor', icon: 'text', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>' },
    { id: 'terminal', name: 'Terminal', icon: 'terminal', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l3 3-3 3M13 15h4"/></svg>' },
    { id: 'settings', name: 'Settings', icon: 'settings', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></svg>' }
  ],

  rightApps: [
    { id: 'trash', name: 'Trash', icon: 'trash', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5"><path d="M5 7h14M10 7V5h4v7M7 7l1 13h8l1-13"/></svg>' }
  ],

  init() {
    this.render();
  },

  render() {
    const left = document.getElementById('dockItems');
    const right = document.getElementById('dockItemsRight');

    left.innerHTML = this.apps.map(app => this._renderItem(app)).join('');
    right.innerHTML = this.rightApps.map(app => this._renderItem(app)).join('');

    // Attach click handlers
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
        <div class="dock-item-icon dock-icon-${app.icon}">${app.svg}</div>
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

    // Check if app is already running
    const existing = WindowManager.getWindowsByApp(appId);
    if (existing.length > 0) {
      const win = existing[0];
      if (win.minimized) {
        WindowManager.unminimize(win.id);
      } else {
        WindowManager.focus(win.id);
      }
    } else {
      // App-specific window sizes
      const sizeOverrides = {
        calculator: { width: 280, height: 420, resizable: false },
        terminal: { width: 640, height: 400 },
        notes: { width: 700, height: 500 },
        photos: { width: 800, height: 560 },
        music: { width: 640, height: 560 }
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

window.Dock = Dock;

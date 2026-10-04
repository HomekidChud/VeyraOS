



const WindowManager = {
  windows: [],
  zIndex: 500,
  activeWindow: null,
  _idCounter: 0,

  open(appId, options = {}) {
    
    const existing = this.windows.find(w => w.appId === appId && !w.minimized);
    if (existing) {
      if (options.document) {
        existing.state = Object.assign(existing.state, options);
        existing.title = options.title || existing.title;
        const titleEl = existing.el.querySelector('.window-title');
        if (titleEl) titleEl.textContent = existing.title;
        existing.el.dispatchEvent(new CustomEvent('veyra:open-document', { detail: options.document }));
      }
      this.focus(existing.id);
      return existing;
    }

    
    const minimized = this.windows.find(w => w.appId === appId && w.minimized);
    if (minimized) {
      this.unminimize(minimized.id);
      return minimized;
    }

    const app = AppRegistry.get(appId);
    if (!app) {
      console.error('Unknown app:', appId);
      return null;
    }

    const id = 'win_' + (++this._idCounter);
    const defaults = {
      width: 800,
      height: 560,
      x: 120 + (this.windows.length * 30) % 200,
      y: 80 + (this.windows.length * 30) % 100,
      title: app.name,
      minable: true,
      maxable: true,
      resizable: true
    };

    const state = Object.assign(defaults, options);

    const winEl = document.createElement('div');
    winEl.className = 'window opening';
    winEl.id = id;
    winEl.style.width = state.width + 'px';
    winEl.style.height = state.height + 'px';
    winEl.style.left = state.x + 'px';
    winEl.style.top = state.y + 'px';
    winEl.style.zIndex = ++this.zIndex;

    winEl.innerHTML = `
      <div class="window-titlebar" data-drag="${id}">
        <div class="window-controls">
          <button class="window-btn close" data-action="close" title="Close"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2L8 8M8 2L2 8"/></svg></button>
          <button class="window-btn minimize" data-action="minimize" title="Minimize"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 5H8"/></svg></button>
          <button class="window-btn maximize" data-action="maximize" title="Maximize"><svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2H8V8H2z" fill="none"/></svg></button>
        </div>
        <div class="window-title"></div>
      </div>
      <div class="window-body" id="${id}_body"></div>
      ${state.resizable ? `
        <div class="resize-handle resize-handle-e"></div>
        <div class="resize-handle resize-handle-w"></div>
        <div class="resize-handle resize-handle-s"></div>
        <div class="resize-handle resize-handle-n"></div>
        <div class="resize-handle resize-handle-se"></div>
        <div class="resize-handle resize-handle-sw"></div>
        <div class="resize-handle resize-handle-ne"></div>
        <div class="resize-handle resize-handle-nw"></div>
      ` : ''}
    `;

    winEl.querySelector('.window-title').textContent = String(state.title || app.name);
    document.getElementById('windows').appendChild(winEl);

    const winData = {
      id, appId, title: state.title, el: winEl,
      minimized: false, maximized: false,
      prevRect: null,
      state
    };

    this.windows.push(winData);

    
    winEl.querySelector('[data-action="close"]').addEventListener('click', (e) => {
      e.stopPropagation();
      this.close(id);
    });
    winEl.querySelector('[data-action="minimize"]').addEventListener('click', (e) => {
      e.stopPropagation();
      this.minimize(id);
    });
    winEl.querySelector('[data-action="maximize"]').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMaximize(id);
    });

    
    winEl.addEventListener('mousedown', () => this.focus(id));

    
    this._makeDraggable(winEl, winData);

    
    if (state.resizable) {
      this._makeResizable(winEl, winData);
    }

    
    winEl.querySelector('.window-titlebar').addEventListener('dblclick', (e) => {
      if (!e.target.closest('.window-btn')) {
        this.toggleMaximize(id);
      }
    });

    
    setTimeout(() => winEl.classList.remove('opening'), 300);

    
    const bodyEl = document.getElementById(id + '_body');
    if (app.render) {
      app.render(bodyEl, winData);
    }

    this.focus(id);
    Dock.updateIndicators();

    return winData;
  },

  close(id) {
    const idx = this.windows.findIndex(w => w.id === id);
    if (idx === -1) return;
    const win = this.windows[idx];
    win.el.classList.add('closing');
    try { win._cleanup?.(); } catch (error) { console.warn('Window cleanup failed:', error); }
    setTimeout(() => {
      win.el.remove();
      this.windows.splice(idx, 1);
      Dock.updateIndicators();
      
      if (this.windows.length > 0) {
        const top = this.windows.reduce((a, b) => a.el.style.zIndex > b.el.style.zIndex ? a : b);
        this.focus(top.id);
      } else {
        this.activeWindow = null;
        MenuBar.setActiveApp('Finder');
      }
    }, 200);
  },

  minimize(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;
    win.minimized = true;
    win.el.classList.add('minimized');
    if (this.activeWindow === win.id) {
      this.activeWindow = null;
      const next = this.windows.find(w => !w.minimized);
      if (next) this.focus(next.id);
      else MenuBar.setActiveApp('Finder');
    }
    Dock.updateIndicators();
  },

  unminimize(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;
    win.minimized = false;
    win.el.classList.remove('minimized');
    this.focus(id);
    Dock.updateIndicators();
  },

  toggleMaximize(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;

    if (win.maximized) {
      
      const r = win.prevRect;
      win.el.style.width = r.width + 'px';
      win.el.style.height = r.height + 'px';
      win.el.style.left = r.left + 'px';
      win.el.style.top = r.top + 'px';
      win.maximized = false;
    } else {
      
      win.prevRect = {
        width: win.el.offsetWidth,
        height: win.el.offsetHeight,
        left: win.el.offsetLeft,
        top: win.el.offsetTop
      };
      const menubarH = 28;
      const dockH = 80;
      win.el.style.width = '100%';
      win.el.style.height = `calc(100% - ${menubarH}px)`;
      win.el.style.left = '0';
      win.el.style.top = menubarH + 'px';
      win.maximized = true;
    }
  },

  focus(id) {
    const win = this.windows.find(w => w.id === id);
    if (!win) return;

    this.windows.forEach(w => {
      w.el.classList.remove('active');
    });

    win.el.classList.add('active');
    win.el.style.zIndex = ++this.zIndex;
    this.activeWindow = id;

    const app = AppRegistry.get(win.appId);
    if (app) MenuBar.setActiveApp(app.name);
  },

  getActiveWindow() {
    return this.windows.find(w => w.id === this.activeWindow);
  },

  getWindowsByApp(appId) {
    return this.windows.filter(w => w.appId === appId);
  },

  closeAll(appId) {
    this.windows.filter(w => w.appId === appId).forEach(w => this.close(w.id));
  },

  _makeDraggable(el, winData) {
    const titlebar = el.querySelector('.window-titlebar');
    let isDragging = false;
    let startX, startY, startLeft, startTop;

    
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.closest('.window-btn')) return;
      if (winData.maximized) return;
      if (window.innerWidth <= 768) return; 
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = el.offsetLeft;
      startTop = el.offsetTop;
      document.body.style.cursor = 'grabbing';
      e.preventDefault();
    });

    
    titlebar.addEventListener('touchstart', (e) => {
      if (e.target.closest('.window-btn')) return;
      if (winData.maximized) return;
      if (window.innerWidth > 768) return; 
      const touch = e.touches[0];
      isDragging = true;
      startX = touch.clientX;
      startY = touch.clientY;
      startLeft = el.offsetLeft;
      startTop = el.offsetTop;
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;
      
      newTop = Math.max(28, newTop);
      
      newLeft = Math.max(-el.offsetWidth + 100, Math.min(window.innerWidth - 100, newLeft));
      newTop = Math.min(window.innerHeight - 38, newTop);
      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', (e) => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';

        
        if (window.innerWidth > 768) {
          const margin = 8;
          
          if (e.clientY < 60 && e.clientX < 80) {
            _snapWindow(el, 'left');
          } else if (e.clientY < 60 && e.clientX > window.innerWidth - 80) {
            _snapWindow(el, 'right');
          } else if (e.clientY < 40) {
            _snapWindow(el, 'top');
          }
        }
      }
    });

    
    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      let newLeft = startLeft + dx;
      let newTop = Math.max(28, startTop + dy);
      newLeft = Math.max(-el.offsetWidth + 100, Math.min(window.innerWidth - 100, newLeft));
      newTop = Math.min(window.innerHeight - 38, newTop);
      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    });
  },

  _snapWindow(el, position) {
    const menubarH = 28;
    const dockH = 80;
    const availH = window.innerHeight - menubarH - dockH;
    const availW = window.innerWidth;

    if (position === 'left') {
      el.style.left = '0px';
      el.style.top = menubarH + 'px';
      el.style.width = (availW / 2 - 4) + 'px';
      el.style.height = availH + 'px';
    } else if (position === 'right') {
      el.style.left = (availW / 2 + 4) + 'px';
      el.style.top = menubarH + 'px';
      el.style.width = (availW / 2 - 4) + 'px';
      el.style.height = availH + 'px';
    } else if (position === 'top') {
      el.style.left = '0px';
      el.style.top = menubarH + 'px';
      el.style.width = availW + 'px';
      el.style.height = availH + 'px';
    }
  },

  _makeResizable(el, winData) {
    const handles = el.querySelectorAll('.resize-handle');
    let isResizing = false;
    let direction = '';
    let startX, startY, startW, startH, startLeft, startTop;

    handles.forEach(handle => {
      const classes = handle.className.split(' ');
      const dir = classes.find(c => c.startsWith('resize-handle-'))?.replace('resize-handle-', '');
      if (!dir) return;

      handle.addEventListener('mousedown', (e) => {
        if (winData.maximized) return;
        isResizing = true;
        direction = dir;
        startX = e.clientX;
        startY = e.clientY;
        startW = el.offsetWidth;
        startH = el.offsetHeight;
        startLeft = el.offsetLeft;
        startTop = el.offsetTop;
        e.preventDefault();
        e.stopPropagation();
      });
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      let newW = startW, newH = startH, newLeft = startLeft, newTop = startTop;
      const minW = 300, minH = 200;

      if (direction.includes('e')) newW = Math.max(minW, startW + dx);
      if (direction.includes('w')) { newW = Math.max(minW, startW - dx); newLeft = startLeft + (startW - newW); }
      if (direction.includes('s')) newH = Math.max(minH, startH + dy);
      if (direction.includes('n')) { newH = Math.max(minH, startH - dy); newTop = startTop + (startH - newH); }

      el.style.width = newW + 'px';
      el.style.height = newH + 'px';
      el.style.left = newLeft + 'px';
      el.style.top = newTop + 'px';
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
    });
  }
};


const AppRegistry = {
  apps: {},

  register(id, config) {
    this.apps[id] = config;
  },

  get(id) {
    return this.apps[id];
  },

  getAll() {
    return this.apps;
  }
};

window.WindowManager = WindowManager;
window.AppRegistry = AppRegistry;

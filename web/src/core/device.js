





const DeviceManager = {
  
  device: null,           
  orientation: null,      
  pixelRatio: 1,
  viewport: { w: 0, h: 0 },
  lastBreakpoint: '',

  
  
  
  profiles: {
    phone: {
      name: 'phone',
      label: 'Phone',
      match: (w, h) => w <= 480,
      scale: 0.85,
      dockSize: 36,
      dockGap: 3,
      iconSize: 36,
      menuBarHeight: 30,
      windowMode: 'fullscreen',
      showMenuBarActions: false,
      showDesktopIcons: true,
      dockAutoHide: false,
      classes: ['device-phone', 'device-mobile', 'device-touch'],
      fontSize: 12,
      windowPadding: 0,
      sidebarCollapse: true
    },
    phoneLandscape: {
      name: 'phoneLandscape',
      label: 'Phone (Landscape)',
      match: (w, h) => w <= 900 && h <= 500,
      scale: 0.9,
      dockSize: 32,
      dockGap: 2,
      iconSize: 32,
      menuBarHeight: 26,
      windowMode: 'fullscreen',
      showMenuBarActions: false,
      showDesktopIcons: false,
      dockAutoHide: true,
      classes: ['device-phone-landscape', 'device-mobile', 'device-touch'],
      fontSize: 12,
      windowPadding: 0,
      sidebarCollapse: true
    },
    tablet: {
      name: 'tablet',
      label: 'Tablet',
      match: (w, h) => w > 480 && w <= 1024,
      scale: 0.95,
      dockSize: 44,
      dockGap: 4,
      iconSize: 44,
      menuBarHeight: 32,
      windowMode: 'fullscreen',
      showMenuBarActions: false,
      showDesktopIcons: true,
      dockAutoHide: false,
      classes: ['device-tablet', 'device-mobile', 'device-touch'],
      fontSize: 13,
      windowPadding: 8,
      sidebarCollapse: true
    },
    tabletLandscape: {
      name: 'tabletLandscape',
      label: 'Tablet (Landscape)',
      match: (w, h) => w > 1024 && w <= 1366 && h <= 1024,
      scale: 0.95,
      dockSize: 46,
      dockGap: 4,
      iconSize: 46,
      menuBarHeight: 32,
      windowMode: 'windowed',
      showMenuBarActions: true,
      showDesktopIcons: true,
      dockAutoHide: false,
      classes: ['device-tablet-landscape', 'device-touch'],
      fontSize: 13,
      windowPadding: 16,
      sidebarCollapse: false
    },
    laptop: {
      name: 'laptop',
      label: 'Laptop',
      match: (w, h) => w > 1024 && w <= 1440,
      scale: 1.0,
      dockSize: 50,
      dockGap: 6,
      iconSize: 50,
      menuBarHeight: 28,
      windowMode: 'windowed',
      showMenuBarActions: true,
      showDesktopIcons: true,
      dockAutoHide: false,
      classes: ['device-laptop'],
      fontSize: 14,
      windowPadding: 24,
      sidebarCollapse: false
    },
    desktop: {
      name: 'desktop',
      label: 'Desktop',
      match: (w, h) => w > 1440 && w <= 1920,
      scale: 1.0,
      dockSize: 52,
      dockGap: 6,
      iconSize: 52,
      menuBarHeight: 28,
      windowMode: 'windowed',
      showMenuBarActions: true,
      showDesktopIcons: true,
      dockAutoHide: false,
      classes: ['device-desktop'],
      fontSize: 14,
      windowPadding: 32,
      sidebarCollapse: false
    },
    largeDesktop: {
      name: 'largeDesktop',
      label: 'Large Desktop',
      match: (w, h) => w > 1920 && w <= 2560,
      scale: 1.1,
      dockSize: 56,
      dockGap: 6,
      iconSize: 56,
      menuBarHeight: 30,
      windowMode: 'windowed',
      showMenuBarActions: true,
      showDesktopIcons: true,
      dockAutoHide: false,
      classes: ['device-large-desktop'],
      fontSize: 15,
      windowPadding: 40,
      sidebarCollapse: false
    },
    ultrawide: {
      name: 'ultrawide',
      label: 'Ultrawide',
      match: (w, h) => w > 2560,
      scale: 1.15,
      dockSize: 58,
      dockGap: 8,
      iconSize: 58,
      menuBarHeight: 32,
      windowMode: 'windowed',
      showMenuBarActions: true,
      showDesktopIcons: true,
      dockAutoHide: false,
      classes: ['device-ultrawide'],
      fontSize: 15,
      windowPadding: 48,
      sidebarCollapse: false
    },
    tv: {
      name: 'tv',
      label: 'TV',
      match: (w, h) => w > 1920 && (window.devicePixelRatio || 1) <= 1.5 && /tv|smarttv|bravia|roku|android.*?tv/i.test(navigator.userAgent || ''),
      scale: 1.2,
      dockSize: 64,
      dockGap: 10,
      iconSize: 64,
      menuBarHeight: 36,
      windowMode: 'windowed',
      showMenuBarActions: true,
      showDesktopIcons: true,
      dockAutoHide: true,
      classes: ['device-tv', 'device-touch'],
      fontSize: 18,
      windowPadding: 64,
      sidebarCollapse: false
    }
  },

  
  detect() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.viewport = { w, h };
    this.pixelRatio = window.devicePixelRatio || 1;
    this.orientation = w > h ? 'landscape' : 'portrait';

    
    const isFoldable = /fold|flip|galaxy z/i.test(navigator.userAgent || '');

    
    let matched = null;
    for (const [key, profile] of Object.entries(this.profiles)) {
      if (profile.match(w, h)) {
        matched = profile;
        break;
      }
    }

    
    if (!matched) {
      matched = w <= 768 ? this.profiles.phone : this.profiles.laptop;
    }

    
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch && !matched.classes.includes('device-touch')) {
      matched = { ...matched, classes: [...matched.classes, 'device-touch'] };
    }

    
    if (isFoldable) {
      matched = { ...matched, classes: [...matched.classes, 'device-foldable'] };
    }

    
    if (this.pixelRatio >= 2) {
      matched = { ...matched, classes: [...matched.classes, 'device-hidpi'] };
    }

    this.device = matched;
    return matched;
  },

  
  apply() {
    if (!this.device) this.detect();

    const d = this.device;
    const root = document.documentElement;
    const body = document.body;

    
    const allClasses = Object.values(this.profiles).flatMap(p => p.classes);
    allClasses.forEach(c => body.classList.remove(c));
    body.classList.remove('device-touch', 'device-hidpi', 'device-foldable',
      'orientation-portrait', 'orientation-landscape');

    
    d.classes.forEach(c => body.classList.add(c));
    body.classList.add('orientation-' + this.orientation);

    
    root.style.setProperty('--ui-scale', d.scale);
    root.style.setProperty('--dock-size', d.dockSize + 'px');
    root.style.setProperty('--dock-gap', d.dockGap + 'px');
    root.style.setProperty('--icon-size', d.iconSize + 'px');
    root.style.setProperty('--menubar-height', d.menuBarHeight + 'px');
    root.style.setProperty('--font-size', d.fontSize + 'px');
    root.style.setProperty('--window-padding', d.windowPadding + 'px');

    
    body.style.fontSize = d.fontSize + 'px';

    
    const menuActions = document.querySelectorAll('.menu-action');
    menuActions.forEach(el => {
      el.style.display = d.showMenuBarActions ? '' : 'none';
    });

    
    const desktopIcons = document.getElementById('desktopIcons');
    if (desktopIcons) {
      desktopIcons.style.display = d.showDesktopIcons ? '' : 'none';
    }

    
    const dock = document.getElementById('dock');
    if (dock) {
      if (d.dockAutoHide) {
        dock.classList.add('dock-auto-hide');
        
        dock.addEventListener('mouseenter', () => dock.classList.add('dock-visible'));
        dock.addEventListener('mouseleave', () => dock.classList.remove('dock-visible'));
      } else {
        dock.classList.remove('dock-auto-hide', 'dock-visible');
      }
    }

    
    if (d.windowMode === 'fullscreen') {
      body.classList.add('window-fullscreen-mode');
    } else {
      body.classList.remove('window-fullscreen-mode');
    }

    
    if (d.sidebarCollapse) {
      body.classList.add('sidebar-collapse');
    } else {
      body.classList.remove('sidebar-collapse');
    }

    
    document.querySelectorAll('.dock-item').forEach(item => {
      item.style.width = d.dockSize + 'px';
      item.style.height = d.dockSize + 'px';
    });

    
    document.querySelectorAll('.desktop-icon-img').forEach(icon => {
      icon.style.width = Math.round(d.iconSize * 0.85) + 'px';
      icon.style.height = Math.round(d.iconSize * 0.85) + 'px';
    });

    
    window.dispatchEvent(new CustomEvent('veyra-device-change', {
      detail: { device: d, orientation: this.orientation, viewport: this.viewport }
    }));

    
    OSStorage.set('deviceInfo', {
      name: d.name,
      label: d.label,
      orientation: this.orientation,
      width: this.viewport.w,
      height: this.viewport.h,
      pixelRatio: this.pixelRatio,
      scale: d.scale,
      timestamp: Date.now()
    });

    console.log('[VeyraOS] Device:', d.label, '| Orientation:', this.orientation,
      '| Viewport:', this.viewport.w + 'x' + this.viewport.h,
      '| DPR:', this.pixelRatio, '| Scale:', d.scale);
  },

  
  getInfo() {
    if (!this.device) this.detect();
    return {
      name: this.device.name,
      label: this.device.label,
      orientation: this.orientation,
      viewport: this.viewport,
      pixelRatio: this.pixelRatio,
      scale: this.device.scale,
      isTouch: this.device.classes.includes('device-touch'),
      isMobile: this.device.classes.includes('device-mobile'),
      isFoldable: this.device.classes.includes('device-foldable'),
      isHiDPI: this.device.classes.includes('device-hidpi'),
      windowMode: this.device.windowMode,
      dockSize: this.device.dockSize,
      iconSize: this.device.iconSize,
      fontSize: this.device.fontSize
    };
  },

  
  isMobile() {
    if (!this.device) this.detect();
    return this.device.classes.includes('device-mobile');
  },

  
  isTouch() {
    if (!this.device) this.detect();
    return this.device.classes.includes('device-touch');
  },

  
  isDesktop() {
    if (!this.device) this.detect();
    return ['laptop', 'desktop', 'largeDesktop', 'ultrawide', 'tv'].includes(this.device.name);
  },

  
  shouldFullscreenWindows() {
    if (!this.device) this.detect();
    return this.device.windowMode === 'fullscreen';
  },

  
  init() {
    this.detect();
    this.apply();

    
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const oldName = this.device?.name;
        this.detect();
        if (this.device.name !== oldName) {
          
          this.apply();
          Toast.show('Device Changed', `Switched to ${this.device.label} mode`, '📱');
        } else {
          
          const root = document.documentElement;
          root.style.setProperty('--vw', this.viewport.w + 'px');
          root.style.setProperty('--vh', this.viewport.h + 'px');
        }
      }, 250);
    });

    
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.detect();
        this.apply();
        Toast.show('Orientation', `Rotated to ${this.orientation}`, '🔄');
      }, 100);
    });

    
    let mouseMoveTimer = null;
    document.addEventListener('mousemove', (e) => {
      if (this.device?.dockAutoHide) {
        const dock = document.getElementById('dock');
        if (dock) {
          const dockRect = dock.getBoundingClientRect();
          const nearDock = e.clientY > window.innerHeight - 100;
          dock.classList.toggle('dock-visible', nearDock);
        }
      }
    });
  }
};

window.DeviceManager = DeviceManager;






const VyrPackage = {
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  MAGIC: 'VEYRA',
  VERSION: 1,

  
  create(appDef) {
    const pkg = {
      magic: this.MAGIC,
      version: this.VERSION,
      manifest: {
        name: appDef.name || 'Untitled App',
        version: appDef.version || '1.0.0',
        author: appDef.author || 'Unknown',
        description: appDef.description || '',
        icon: appDef.icon || '',
        category: appDef.category || 'utility',
        permissions: appDef.permissions || [],
        minOS: appDef.minOS || '2.0.0',
        createdAt: new Date().toISOString()
      },
      html: appDef.html || '',
      css: appDef.css || '',
      js: appDef.js || '',
      config: appDef.config || {}
    };
    return pkg;
  },

  
  serialize(pkg) {
    return JSON.stringify(pkg, null, 2);
  },

  
  parse(data) {
    try {
      const pkg = typeof data === 'string' ? JSON.parse(data) : data;
      if (pkg.magic !== this.MAGIC) throw new Error('Invalid .vyr file: bad magic');
      if (!pkg.manifest || typeof pkg.manifest !== 'object') throw new Error('Invalid .vyr file: missing manifest');
      const name = String(pkg.manifest.name || '').trim();
      if (!name || name.length > 80) throw new Error('Invalid .vyr file: app name must be 1–80 characters');
      for (const field of ['html', 'css', 'js']) if (pkg[field] != null && typeof pkg[field] !== 'string') throw new Error(`Invalid .vyr file: ${field} must be text`);
      if (String(pkg.html || '').length > 250000 || String(pkg.css || '').length > 100000 || String(pkg.js || '').length > 250000) throw new Error('Invalid .vyr file: package content exceeds the safety limit');
      if (pkg.manifest.permissions && (!Array.isArray(pkg.manifest.permissions) || pkg.manifest.permissions.length > 16)) throw new Error('Invalid .vyr file: permissions are malformed');
      return pkg;
    } catch (e) {
      throw new Error('Failed to parse .vyr file: ' + e.message);
    }
  },

  
  download(pkg) {
    const data = this.serialize(pkg);
    const blob = new Blob([data], { type: 'application/vnd.veyraos-vyr' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (pkg.manifest.name || 'app').toLowerCase().replace(/\s+/g, '-') + '.vyr';
    a.click();
    URL.revokeObjectURL(url);
  },

  
  install(pkgData) {
    try {
      const pkg = this.parse(pkgData);

      
      const currentVersion = SoftwareUpdate.getCurrentVersion();
      if (this.compareVersions(pkg.manifest.minOS, currentVersion) > 0) {
        throw new Error(`Requires VeyraOS ${pkg.manifest.minOS} or later (current: ${currentVersion})`);
      }

      
      const appId = 'vyr_' + (pkg.manifest.name || 'app').toLowerCase().replace(/[^a-z0-9]/g, '_');

      
      AppRegistry.register(appId, {
        name: pkg.manifest.name,
        iconBg: pkg.manifest.category === 'media' ? 'linear-gradient(135deg,#ec4899,#8b5cf6)' :
                pkg.manifest.category === 'game' ? 'linear-gradient(135deg,#f59e0b,#ef4444)' :
                pkg.manifest.category === 'system' ? 'linear-gradient(135deg,#6b7280,#4b5563)' :
                'linear-gradient(135deg,#3b82f6,#1e40af)',
        iconText: pkg.manifest.icon || '📦',
        render(container, win) {
          
          const frame = document.createElement('iframe');
          frame.className = 'app-root vyr-app';
          frame.title = `${pkg.manifest.name} (sandboxed app)`;
          frame.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups');
          frame.referrerPolicy = 'no-referrer';
          frame.style.cssText = 'width:100%;height:100%;border:0;background:var(--bg);';
          const policy = "default-src 'none'; img-src data: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src https: data:; media-src https: data:; connect-src 'none'; base-uri 'none'; form-action https:;";
          frame.srcdoc = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>html,body{margin:0;min-height:100%;font:14px system-ui,sans-serif}${pkg.css || ''}</style><body>${pkg.html || ''}<script>${pkg.js || ''}</script>`;
          container.appendChild(frame);
        }
      });

      
      const installed = OSStorage.get('vyrPackages', []);
      installed.push({
        appId,
        manifest: pkg.manifest,
        installedAt: Date.now()
      });
      OSStorage.set('vyrPackages', installed);

      
      const dockApps = OSStorage.getDockApps();
      if (!dockApps.includes(appId)) {
        dockApps.push(appId);
        OSStorage.set('dockApps', dockApps);
      }

      return { success: true, appId, manifest: pkg.manifest };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  
  getInstalled() {
    return OSStorage.get('vyrPackages', []);
  },

  
  uninstall(appId) {
    const installed = OSStorage.get('vyrPackages', []);
    const filtered = installed.filter(p => p.appId !== appId);
    OSStorage.set('vyrPackages', filtered);

    
    const dockApps = OSStorage.getDockApps();
    OSStorage.set('dockApps', dockApps.filter(id => id !== appId));

    
    WindowManager.closeAll(appId);

    return { success: true };
  },

  
  compareVersions(a, b) {
    const pa = a.split('.').map(Number);
    const pb = b.split('.').map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const va = pa[i] || 0;
      const vb = pb[i] || 0;
      if (va > vb) return 1;
      if (va < vb) return -1;
    }
    return 0;
  },

  
  createSampleApp() {
    return this.create({
      name: 'Hello Veyra',
      version: '1.0.0',
      author: 'VeyraOS',
      description: 'A sample .vyr app demonstrating the packaging format',
      icon: '✨',
      category: 'utility',
      permissions: ['storage'],
      minOS: '2.0.0',
      html: `
        <div style="padding:32px;text-align:center;font-family:Inter,sans-serif;">
          <h1 style="font-size:1.8rem;color:var(--text);margin-bottom:8px;">Hello from .vyr!</h1>
          <p style="color:var(--muted);font-size:0.9rem;">This app was installed from a .vyr package.</p>
          <div style="margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <button onclick="this.textContent='Clicked ' + Date.now()" style="padding:12px;border-radius:10px;background:var(--accent);color:#fff;border:none;cursor:pointer;font-weight:600;">Click Me</button>
            <button onclick="this.style.background=this.style.background==='var(--green)'?'var(--accent)':'var(--green)'" style="padding:12px;border-radius:10px;background:var(--surface);color:var(--text);border:1px solid var(--line);cursor:pointer;font-weight:600;">Toggle Color</button>
          </div>
          <div id="counter" style="margin-top:24px;font-size:3rem;font-weight:300;color:var(--accent);">0</div>
        </div>
      `,
      css: `
        .vyr-app-body { background: var(--content-bg); min-height: 100%; }
        .vyr-app-body button:hover { filter: brightness(1.1); }
        .vyr-app-body button:active { transform: scale(0.97); }
      `,
      js: `
        let count = 0;
        const counter = document.getElementById('counter');
        if (counter) {
          setInterval(() => {
            count++;
            counter.textContent = count;
          }, 1000);
        }
      `
    });
  }
};

window.DeviceManager = DeviceManager;
window.VyrPackage = VyrPackage;

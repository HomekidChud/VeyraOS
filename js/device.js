// ============================================
// VeyraOS — Universal Device Detection & Scaling
// Handles ALL device types: phones, tablets, laptops,
// desktops, ultrawide, TVs, foldables, and touch devices
// ============================================

const DeviceManager = {
  // ---- State ----
  device: null,           // current device profile
  orientation: null,      // 'portrait' | 'landscape'
  pixelRatio: 1,
  viewport: { w: 0, h: 0 },
  lastBreakpoint: '',

  // ---- Device profiles ----
  // Each profile defines: min/max width, UI scale, dock size, icon size,
  // window behavior, menu bar style, and CSS classes
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

  // ---- Detection ----
  detect() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.viewport = { w, h };
    this.pixelRatio = window.devicePixelRatio || 1;
    this.orientation = w > h ? 'landscape' : 'portrait';

    // Check for foldable
    const isFoldable = /fold|flip|galaxy z/i.test(navigator.userAgent || '');

    // Find matching profile
    let matched = null;
    for (const [key, profile] of Object.entries(this.profiles)) {
      if (profile.match(w, h)) {
        matched = profile;
        break;
      }
    }

    // Fallback to laptop/desktop
    if (!matched) {
      matched = w <= 768 ? this.profiles.phone : this.profiles.laptop;
    }

    // Detect touch
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (hasTouch && !matched.classes.includes('device-touch')) {
      matched = { ...matched, classes: [...matched.classes, 'device-touch'] };
    }

    // Foldable adjustment
    if (isFoldable) {
      matched = { ...matched, classes: [...matched.classes, 'device-foldable'] };
    }

    // High DPI adjustment
    if (this.pixelRatio >= 2) {
      matched = { ...matched, classes: [...matched.classes, 'device-hidpi'] };
    }

    this.device = matched;
    return matched;
  },

  // ---- Apply scaling ----
  apply() {
    if (!this.device) this.detect();

    const d = this.device;
    const root = document.documentElement;
    const body = document.body;

    // Remove all previous device classes
    const allClasses = Object.values(this.profiles).flatMap(p => p.classes);
    allClasses.forEach(c => body.classList.remove(c));
    body.classList.remove('device-touch', 'device-hidpi', 'device-foldable',
      'orientation-portrait', 'orientation-landscape');

    // Add new classes
    d.classes.forEach(c => body.classList.add(c));
    body.classList.add('orientation-' + this.orientation);

    // Set CSS variables for scaling
    root.style.setProperty('--ui-scale', d.scale);
    root.style.setProperty('--dock-size', d.dockSize + 'px');
    root.style.setProperty('--dock-gap', d.dockGap + 'px');
    root.style.setProperty('--icon-size', d.iconSize + 'px');
    root.style.setProperty('--menubar-height', d.menuBarHeight + 'px');
    root.style.setProperty('--font-size', d.fontSize + 'px');
    root.style.setProperty('--window-padding', d.windowPadding + 'px');

    // Apply font size
    body.style.fontSize = d.fontSize + 'px';

    // Menu bar actions visibility
    const menuActions = document.querySelectorAll('.menu-action');
    menuActions.forEach(el => {
      el.style.display = d.showMenuBarActions ? '' : 'none';
    });

    // Desktop icons visibility
    const desktopIcons = document.getElementById('desktopIcons');
    if (desktopIcons) {
      desktopIcons.style.display = d.showDesktopIcons ? '' : 'none';
    }

    // Dock auto-hide
    const dock = document.getElementById('dock');
    if (dock) {
      if (d.dockAutoHide) {
        dock.classList.add('dock-auto-hide');
        // Show on hover/touch
        dock.addEventListener('mouseenter', () => dock.classList.add('dock-visible'));
        dock.addEventListener('mouseleave', () => dock.classList.remove('dock-visible'));
      } else {
        dock.classList.remove('dock-auto-hide', 'dock-visible');
      }
    }

    // Window mode
    if (d.windowMode === 'fullscreen') {
      body.classList.add('window-fullscreen-mode');
    } else {
      body.classList.remove('window-fullscreen-mode');
    }

    // Sidebar collapse
    if (d.sidebarCollapse) {
      body.classList.add('sidebar-collapse');
    } else {
      body.classList.remove('sidebar-collapse');
    }

    // Apply dock sizes
    document.querySelectorAll('.dock-item').forEach(item => {
      item.style.width = d.dockSize + 'px';
      item.style.height = d.dockSize + 'px';
    });

    // Apply desktop icon sizes
    document.querySelectorAll('.desktop-icon-img').forEach(icon => {
      icon.style.width = Math.round(d.iconSize * 0.85) + 'px';
      icon.style.height = Math.round(d.iconSize * 0.85) + 'px';
    });

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('veyra-device-change', {
      detail: { device: d, orientation: this.orientation, viewport: this.viewport }
    }));

    // Store device info
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

  // ---- Get current device info ----
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

  // ---- Is mobile? ----
  isMobile() {
    if (!this.device) this.detect();
    return this.device.classes.includes('device-mobile');
  },

  // ---- Is touch? ----
  isTouch() {
    if (!this.device) this.detect();
    return this.device.classes.includes('device-touch');
  },

  // ---- Is desktop? ----
  isDesktop() {
    if (!this.device) this.detect();
    return ['laptop', 'desktop', 'largeDesktop', 'ultrawide', 'tv'].includes(this.device.name);
  },

  // ---- Should use fullscreen windows? ----
  shouldFullscreenWindows() {
    if (!this.device) this.detect();
    return this.device.windowMode === 'fullscreen';
  },

  // ---- Init ----
  init() {
    this.detect();
    this.apply();

    // Debounced resize handler
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const oldName = this.device?.name;
        this.detect();
        if (this.device.name !== oldName) {
          // Device type changed — reapply
          this.apply();
          Toast.show('Device Changed', `Switched to ${this.device.label} mode`, '📱');
        } else {
          // Same device, just resized — update viewport vars
          const root = document.documentElement;
          root.style.setProperty('--vw', this.viewport.w + 'px');
          root.style.setProperty('--vh', this.viewport.h + 'px');
        }
      }, 250);
    });

    // Orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.detect();
        this.apply();
        Toast.show('Orientation', `Rotated to ${this.orientation}`, '🔄');
      }, 100);
    });

    // Mouse move detection for dock auto-hide
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

// ============================================
// VeyraOS — .vyr Package Format
// Custom packaging system for VeyraOS apps
// ============================================

const VyrPackage = {
  // Package format: .vyr
  // A .vyr file is a JSON-based manifest that describes a VeyraOS app
  // Structure:
  // {
  //   "manifest": {
  //     "name": "App Name",
  //     "version": "1.0.0",
  //     "author": "Author",
  //     "description": "Description",
  //     "icon": "data:image/svg+xml;base64,...",
  //     "category": "productivity|utility|media|game|system",
  //     "permissions": ["storage", "network", "filesystem"],
  //     "minOS": "2.0.0"
  //   },
  //   "html": "<!-- App HTML -->",
  //   "css": "/* App CSS */",
  //   "js": "/* App JavaScript */",
  //   "config": {}
  // }

  MAGIC: 'VEYRA',
  VERSION: 1,

  // Create a .vyr package from app definition
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

  // Serialize to string (for download)
  serialize(pkg) {
    return JSON.stringify(pkg, null, 2);
  },

  // Parse from string
  parse(data) {
    try {
      const pkg = typeof data === 'string' ? JSON.parse(data) : data;
      if (pkg.magic !== this.MAGIC) throw new Error('Invalid .vyr file: bad magic');
      if (!pkg.manifest) throw new Error('Invalid .vyr file: missing manifest');
      return pkg;
    } catch (e) {
      throw new Error('Failed to parse .vyr file: ' + e.message);
    }
  },

  // Download as .vyr file
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

  // Install a .vyr package — registers it as a VeyraOS app
  install(pkgData) {
    try {
      const pkg = this.parse(pkgData);

      // Check minimum OS version
      const currentVersion = SoftwareUpdate.getCurrentVersion();
      if (this.compareVersions(pkg.manifest.minOS, currentVersion) > 0) {
        throw new Error(`Requires VeyraOS ${pkg.manifest.minOS} or later (current: ${currentVersion})`);
      }

      // Generate app ID
      const appId = 'vyr_' + (pkg.manifest.name || 'app').toLowerCase().replace(/[^a-z0-9]/g, '_');

      // Register the app
      AppRegistry.register(appId, {
        name: pkg.manifest.name,
        iconBg: pkg.manifest.category === 'media' ? 'linear-gradient(135deg,#ec4899,#8b5cf6)' :
                pkg.manifest.category === 'game' ? 'linear-gradient(135deg,#f59e0b,#ef4444)' :
                pkg.manifest.category === 'system' ? 'linear-gradient(135deg,#6b7280,#4b5563)' :
                'linear-gradient(135deg,#3b82f6,#1e40af)',
        iconText: pkg.manifest.icon || '📦',
        render(container, win) {
          // Build the app from the package
          const root = document.createElement('div');
          root.className = 'app-root vyr-app';
          root.style.cssText = 'width:100%;height:100%;overflow:auto;';

          // Inject CSS
          if (pkg.css) {
            const style = document.createElement('style');
            style.textContent = pkg.css;
            root.appendChild(style);
          }

          // Inject HTML
          const body = document.createElement('div');
          body.className = 'vyr-app-body';
          body.innerHTML = pkg.html;
          root.appendChild(body);

          // Inject JS
          if (pkg.js) {
            const script = document.createElement('script');
            script.textContent = pkg.js;
            root.appendChild(script);
          }

          container.appendChild(root);
        }
      });

      // Save to installed packages
      const installed = OSStorage.get('vyrPackages', []);
      installed.push({
        appId,
        manifest: pkg.manifest,
        installedAt: Date.now()
      });
      OSStorage.set('vyrPackages', installed);

      // Add to dock
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

  // Get installed .vyr packages
  getInstalled() {
    return OSStorage.get('vyrPackages', []);
  },

  // Uninstall a .vyr package
  uninstall(appId) {
    const installed = OSStorage.get('vyrPackages', []);
    const filtered = installed.filter(p => p.appId !== appId);
    OSStorage.set('vyrPackages', filtered);

    // Remove from dock
    const dockApps = OSStorage.getDockApps();
    OSStorage.set('dockApps', dockApps.filter(id => id !== appId));

    // Close any open windows
    WindowManager.closeAll(appId);

    return { success: true };
  },

  // Compare version strings
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

  // Create a sample .vyr package for demonstration
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

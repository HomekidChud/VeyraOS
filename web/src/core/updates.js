



const SoftwareUpdate = {
  currentVersion: '2.1.0',
  latestVersion: '2.2.0',
  updateAvailable: false,
  updateProgress: 0,
  updating: false,
  changelog: [
    { version: '2.2.0', date: 'October 1, 2026', changes: [
      'New Paint Studio app with canvas drawing, brushes, shapes, and fill tool',
      'Software Update system in Settings',
      'Activity Monitor for tracking system performance',
      'Weather app with live data for your location',
      'Window snapping — drag windows to screen edges',
      'Improved mobile responsive design',
      'Performance improvements and bug fixes',
      'New keyboard shortcuts overlay'
    ]},
    { version: '2.1.0', date: 'September 30, 2026', changes: [
      'Proper SVG icon files for all apps',
      'Mobile responsive design with touch support',
      'New Mail app with inbox and detail view',
      'Launchpad full-screen app grid',
      'File Manager with create/delete/rename',
      'Downloads Manager',
      'Custom SVG icons throughout the OS'
    ]},
    { version: '2.0.0', date: 'September 30, 2026', changes: [
      'Complete browser rewrite with tabbed browsing and proxy engine',
      'Bookmarks, history, and download system',
      'Launchpad and custom dock icons',
      'Enhanced file manager with context menus',
      'Full mobile responsive design'
    ]},
    { version: '1.0.0', date: 'September 30, 2026', changes: [
      'Initial VeyraOS release',
      'macOS-style desktop with menu bar and dock',
      'Window manager with draggable, resizable windows',
      '12 built-in apps',
      'Spotlight search, Control Center',
      'Dark and Light themes'
    ]}
  ],

  checkForUpdates() {
    
    return new Promise((resolve) => {
      setTimeout(() => {
        this.updateAvailable = this.latestVersion !== this.currentVersion;
        resolve({
          current: this.currentVersion,
          latest: this.latestVersion,
          available: this.updateAvailable
        });
      }, 1500);
    });
  },

  installUpdate(onProgress) {
    this.updating = true;
    this.updateProgress = 0;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        this.updateProgress += Math.random() * 15 + 5;
        if (this.updateProgress >= 100) {
          this.updateProgress = 100;
          clearInterval(interval);
          this.updating = false;
          this.currentVersion = this.latestVersion;
          OSStorage.set('osVersion', this.currentVersion);

          
          if (window._veyraDeploy) {
            window._veyraDeploy();
          }

          resolve(true);
        } else {
          if (onProgress) onProgress(Math.round(this.updateProgress));
        }
      }, 400);
    });
  },

  getChangelog() {
    return this.changelog;
  },

  getCurrentVersion() {
    return OSStorage.get('osVersion', this.currentVersion);
  }
};

window.SoftwareUpdate = SoftwareUpdate;

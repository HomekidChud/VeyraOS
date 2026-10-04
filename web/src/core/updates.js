const SoftwareUpdate = {
  currentVersion: '2.3.0',
  latestVersion: '2.3.0',
  currentBuild: window.VeyraBuild?.id || 'development',
  latestBuild: window.VeyraBuild?.id || 'development',
  updateAvailable: false,
  updateProgress: 0,
  updating: false,
  updateManifest: null,
  lastCheckedAt: null,
  pollTimer: null,
  changelog: [
    { version: '2.3.0', date: 'October 4, 2026', changes: ['Automatic deployment update detection', 'Mobile-first Game Emulator with local game loading', 'Improved touch navigation and dock layout', 'Veyra API integration improvements'] },
    { version: '2.2.0', date: 'October 1, 2026', changes: ['New Paint Studio app', 'Activity Monitor and Weather app', 'Window snapping and mobile responsive improvements'] },
    { version: '2.1.0', date: 'September 30, 2026', changes: ['Mobile responsive design with touch support', 'Mail, Launchpad, File Manager, and Downloads apps', 'Custom SVG icons throughout the OS'] },
    { version: '2.0.0', date: 'September 30, 2026', changes: ['Tabbed browser with proxy engine', 'Bookmarks, history, downloads, Launchpad, and dock icons'] },
    { version: '1.0.0', date: 'September 30, 2026', changes: ['Initial VeyraOS release', 'Desktop, menu bar, dock, window manager, and built-in apps'] }
  ],
  async checkForUpdates() {
    const fallback = { version: this.latestVersion, buildId: this.latestBuild, publishedAt: '', changes: this.changelog[0]?.changes || [] };
    try {
      const response = await fetch(`./update-manifest.json?check=${Date.now()}`, { cache: 'no-store', headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Update manifest returned ${response.status}`);
      const manifest = await response.json();
      this.updateManifest = { ...fallback, ...manifest };
      this.latestVersion = this.updateManifest.version || this.latestVersion;
      this.latestBuild = this.updateManifest.buildId || this.latestBuild;
      if (Array.isArray(this.updateManifest.changes) && this.updateManifest.changes.length) {
        this.changelog = [{ version: this.latestVersion, date: this.updateManifest.publishedAt ? new Date(this.updateManifest.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Latest release', changes: this.updateManifest.changes }, ...this.changelog.filter(entry => entry.version !== this.latestVersion)];
      }
    } catch (error) {
      this.updateManifest = fallback;
      this.lastError = error.message;
    }
    this.lastCheckedAt = Date.now();
    this.updateAvailable = this.latestBuild !== this.currentBuild || this.latestVersion !== this.currentVersion;
    return { current: this.currentVersion, latest: this.latestVersion, currentBuild: this.currentBuild, latestBuild: this.latestBuild, available: this.updateAvailable, manifest: this.updateManifest, checkedAt: this.lastCheckedAt };
  },
  startAutoUpdater(intervalMs = 300000) {
    if (this.pollTimer) return;
    this.checkForUpdates().then(result => {
      if (result.available && window.Toast) Toast.show('Software Update', `VeyraOS ${result.latest} is ready. Open Software Update to apply it.`, '⬆️');
    });
    this.pollTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') this.checkForUpdates().then(result => {
        if (result.available && window.Toast) Toast.show('Software Update', `VeyraOS ${result.latest} is ready. Reload to apply the latest build.`, '⬆️');
      });
    }, intervalMs);
  },
  installUpdate(onProgress) {
    this.updating = true;
    this.updateProgress = 10;
    if (onProgress) onProgress(this.updateProgress);
    return this.checkForUpdates().then(result => {
      if (!result.available) {
        this.updating = false;
        this.updateProgress = 100;
        if (onProgress) onProgress(100);
        return false;
      }
      this.updateProgress = 70;
      if (onProgress) onProgress(this.updateProgress);
      // A static web OS is updated by a new deployment. Do not persist an unverified
      // version label before a reload has actually fetched that build.
      OSStorage.set('pendingOSBuild', result.latestBuild);
      this.updateProgress = 100;
      this.updating = false;
      if (onProgress) onProgress(100);
      setTimeout(() => location.reload(), 500);
      return true;
    }).catch(error => {
      this.updating = false;
      this.lastError = error.message;
      throw error;
    });
  },
  getChangelog() { return this.changelog; },
  getCurrentVersion() { return this.currentVersion; },
  getCurrentBuild() { return this.currentBuild; }
};
window.SoftwareUpdate = SoftwareUpdate;

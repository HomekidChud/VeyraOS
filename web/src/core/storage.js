



const VeyraSafe = {
  text(value) { return String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
};
const OSStorage = {
  _prefix: 'veyraos_',
  _memory: new Map(),
  _storage: (() => {
    try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; }
  })(),

  get(key, fallback = null) {
    try {
      const raw = this._storage ? this._storage.getItem(this._prefix + key) : this._memory.get(this._prefix + key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch { return fallback; }
  },

  set(key, value) {
    const serialized = JSON.stringify(value);
    try {
      if (!this._storage) throw new Error('Persistent storage is unavailable');
      this._storage.setItem(this._prefix + key, serialized);
      return true;
    } catch (error) {
      this._memory.set(this._prefix + key, serialized);
      this.lastError = error?.message || 'Persistent storage is unavailable';
      window.dispatchEvent(new CustomEvent('veyra:storage-error', { detail: { key, error: this.lastError } }));
      return false;
    }
  },

  remove(key) {
    try {
      if (this._storage) this._storage.removeItem(this._prefix + key);
      else this._memory.delete(this._prefix + key);
    } catch { this._memory.delete(this._prefix + key); }
  },

  
  getUser() {
    return this.get('user', {
      name: 'Veyra User',
      avatar: null,
      theme: 'dark',
      accent: '#0a84ff',
      wallpaper: 'gradient1'
    });
  },

  saveUser(user) {
    this.set('user', user);
  },

  
  getWindowStates() {
    return this.get('windows', {});
  },

  saveWindowState(appId, state) {
    const windows = this.getWindowStates();
    windows[appId] = state;
    this.set('windows', windows);
  },

  
  getDockApps() {
    return this.get('dockApps', [
      'finder', 'browser', 'mail', 'notes', 'calendar', 'photos',
      'music', 'appstore', 'calculator', 'texteditor', 'terminal', 'settings'
    ]);
  },

  
  getFiles() {
    return this.get('files', this._defaultFiles());
  },

  saveFiles(files) {
    return this.set('files', files);
  },

  _defaultFiles() {
    return {
      'desktop': [
        { name: 'Welcome.txt', type: 'text', icon: '📄', content: 'Welcome to VeyraOS!\n\nThis is a web-based operating system with a macOS-style desktop.\n\nDouble-click any app in the Dock to get started.' },
        { name: 'Read Me.txt', type: 'text', icon: '📄', content: 'VeyraOS\n========\n\nA web operating system built on top of the Veyra browser.\n\nFeatures:\n- macOS-style desktop with menu bar and dock\n- Window manager with draggable, resizable windows\n- Apps: Finder, Browser, Settings, Calculator, Text Editor, Terminal, Photos, Music, Notes, Calendar, App Store\n- Spotlight search (Cmd+Space)\n- Control Center\n- Dark and Light themes\n- Dark Mode toggle\n\nPress Cmd+Space for Spotlight search.' }
      ],
      'documents': [
        { name: 'Welcome.txt', type: 'text', icon: '📄', content: 'Welcome to VeyraOS Documents folder.' }
      ],
      'downloads': [],
      'pictures': [
        { name: 'Sunset.jpg', type: 'image', icon: '🌅' },
        { name: 'Mountains.jpg', type: 'image', icon: '⛰️' },
        { name: 'Ocean.jpg', type: 'image', icon: '🌊' },
        { name: 'Forest.jpg', type: 'image', icon: '🌲' }
      ],
      'music': [
        { name: 'Ambient.mp3', type: 'audio', icon: '🎵' },
        { name: 'Focus.mp3', type: 'audio', icon: '🎵' }
      ],
      'applications': [
        { name: 'Veyra Browser', type: 'app', icon: '🌐' },
        { name: 'Settings', type: 'app', icon: '⚙️' },
        { name: 'Calculator', type: 'app', icon: '🧮' },
        { name: 'Text Editor', type: 'app', icon: '📝' },
        { name: 'Terminal', type: 'app', icon: '⬛' },
        { name: 'Photos', type: 'app', icon: '📷' },
        { name: 'Music', type: 'app', icon: '🎵' },
        { name: 'Notes', type: 'app', icon: '🗒️' },
        { name: 'Calendar', type: 'app', icon: '📅' },
        { name: 'App Store', type: 'app', icon: '🛍️' }
      ]
    };
  },

  
  getNotes() {
    return this.get('notes', [
      { id: 'note1', title: 'Welcome Note', body: 'Welcome to VeyraOS Notes!\n\nThis is your first note. Click the + button to create a new one.\n\nYour notes are saved locally in your browser.', modified: Date.now() }
    ]);
  },

  saveNotes(notes) {
    return this.set('notes', notes);
  }
};

window.VeyraSafe = VeyraSafe;
window.OSStorage = OSStorage;

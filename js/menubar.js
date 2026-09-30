// ============================================
// VeyraOS — Menu Bar
// ============================================

const MenuBar = {
  init() {
    this._updateClock();
    setInterval(() => this._updateClock(), 1000);

    // Apple menu toggle
    const appleMenu = document.getElementById('appleMenu');
    const dropdown = document.getElementById('appleMenuDropdown');

    appleMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      dropdown.classList.add('hidden');
    });

    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.dropdown-item');
      if (!item) return;
      const action = item.dataset.action;
      dropdown.classList.add('hidden');
      this._handleAppleAction(action);
    });

    // Menu bar action items (File, Edit, View, etc.)
    document.querySelectorAll('.menu-action').forEach(item => {
      item.addEventListener('click', () => {
        Toast.show(item.textContent, 'Menu not yet implemented', 'ℹ️');
      });
    });

    // Control Center toggle
    const ccBtn = document.getElementById('menuControlCenter');
    const cc = document.getElementById('controlCenter');
    ccBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cc.classList.toggle('hidden');
      document.getElementById('notifCenter').classList.add('hidden');
    });

    cc.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('click', () => {
      cc.classList.add('hidden');
    });

    // Spotlight toggle
    const searchBtn = document.getElementById('menuSearch');
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      Spotlight.toggle();
    });
  },

  _updateClock() {
    const now = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    document.getElementById('menuTime').textContent = `${h}:${m} ${ampm}`;
    document.getElementById('menuDate').textContent = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()}`;

    // Update widget if visible
    const widgetTime = document.getElementById('widgetTime');
    const widgetDate = document.getElementById('widgetDate');
    if (widgetTime) widgetTime.textContent = `${h}:${m}`;
    if (widgetDate) widgetDate.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  },

  setActiveApp(name) {
    document.getElementById('activeAppName').textContent = name;
  },

  _handleAppleAction(action) {
    switch (action) {
      case 'about':
        Toast.show('About VeyraOS', 'VeyraOS v1.0 — A web-based operating system', '💻');
        break;
      case 'settings':
        WindowManager.open('settings');
        break;
      case 'appstore':
        WindowManager.open('appstore');
        break;
      case 'sleep':
        this._sleep();
        break;
      case 'restart':
        if (confirm('Restart VeyraOS?')) location.reload();
        break;
      case 'shutdown':
        if (confirm('Shut down VeyraOS?')) {
          document.getElementById('desktop').classList.add('hidden');
          document.getElementById('bootScreen').classList.remove('hidden', 'fade-out');
          document.getElementById('bootScreen').style.background = '#000';
          document.querySelector('.boot-logo').style.display = 'none';
          document.querySelector('.boot-progress').style.display = 'none';
        }
        break;
      case 'lock':
        this._lock();
        break;
      case 'logout':
        if (confirm('Log out of VeyraOS?')) {
          document.getElementById('desktop').classList.add('hidden');
          document.getElementById('loginScreen').classList.remove('hidden');
        }
        break;
    }
  },

  _sleep() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:#000;opacity:0;transition:opacity 0.5s;cursor:pointer;';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.style.opacity = '1');
    overlay.addEventListener('click', () => {
      overlay.style.opacity = '0';
      setTimeout(() => overlay.remove(), 500);
    });
  },

  _lock() {
    const login = document.getElementById('loginScreen');
    const desktop = document.getElementById('desktop');
    desktop.style.opacity = '0';
    setTimeout(() => {
      desktop.classList.add('hidden');
      desktop.style.opacity = '';
      login.classList.remove('hidden');
      const pw = document.getElementById('loginPassword');
      pw.value = '';
      pw.focus();
    }, 300);
  }
};

window.MenuBar = MenuBar;

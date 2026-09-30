// ============================================
// VeyraOS App — System Settings
// ============================================

AppRegistry.register('settings', {
  name: 'System Settings',
  iconBg: 'linear-gradient(135deg, #6b7280, #4b5563)',
  iconText: '⚙️',

  render(container, win) {
    const user = OSStorage.getUser();

    container.innerHTML = `
      <div class="app-root settings-root">
        <div class="settings-sidebar">
          <input type="text" class="settings-search" placeholder="Search Settings" id="settingsSearch">
          <div class="settings-nav-item active" data-section="appearance">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>
            Appearance
          </div>
          <div class="settings-nav-item" data-section="wallpaper">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M3 17l5-4 4 3 3-2 6 5"/></svg>
            Wallpaper
          </div>
          <div class="settings-nav-item" data-section="dock">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="14" width="18" height="6" rx="2"/></svg>
            Dock & Menu Bar
          </div>
          <div class="settings-nav-item" data-section="general">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>
            General
          </div>
          <div class="settings-nav-item" data-section="network">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 14.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4zM5.8 11.3a4.5 4.5 0 0 1 6.4 0M3.5 9a7.8 7.8 0 0 1 11 0M1.2 6.7a11 11 0 0 1 15.6 0"/></svg>
            Network
          </div>
          <div class="settings-nav-item" data-section="sound">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 5L6 9H3v6h3l5 4z"/><path d="M15 9a4 4 0 0 1 0 6"/></svg>
            Sound
          </div>
          <div class="settings-nav-item" data-section="storage">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h10M7 14h6"/></svg>
            Storage
          </div>
          <div class="settings-nav-item" data-section="about">
            <svg class="settings-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
            About
          </div>
        </div>
        <div class="settings-main" id="settingsMain"></div>
      </div>
    `;

    const main = container.querySelector('#settingsMain');

    const sections = {
      appearance: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">Appearance</h2>
          <div class="settings-row">
            <div>
              <div class="settings-row-label">Theme</div>
              <div class="settings-row-desc">Choose between light and dark mode</div>
            </div>
            <select class="settings-select" id="themeSelect">
              <option value="dark" ${user.theme === 'dark' ? 'selected' : ''}>Dark</option>
              <option value="light" ${user.theme === 'light' ? 'selected' : ''}>Light</option>
            </select>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-row-label">Accent Color</div>
              <div class="settings-row-desc">Choose your system accent color</div>
            </div>
            <div class="settings-color-row">
              ${['#0a84ff','#bf5af2','#ff375f','#ff9f0a','#22c55e','#06b6d4','#f59e0b','#ec4899'].map(c =>
                `<div class="settings-color-swatch ${user.accent === c ? 'selected' : ''}" style="background:${c};" data-color="${c}"></div>`
              ).join('')}
            </div>
          </div>
        </div>
      `,
      wallpaper: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">Wallpaper</h2>
          <p style="color:var(--muted);margin-bottom:16px;">Choose a desktop wallpaper</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;">
            ${[
              { name: 'Aurora', bg: 'radial-gradient(ellipse at top, #2a1a3e 0%, #1a1a2e 40%, #0f0f1e 100%)' },
              { name: 'Ocean', bg: 'linear-gradient(135deg, #0c4a6e, #075985, #0369a1)' },
              { name: 'Sunset', bg: 'linear-gradient(135deg, #7c2d12, #c2410c, #f59e0b)' },
              { name: 'Forest', bg: 'linear-gradient(135deg, #14532d, #166534, #15803d)' },
              { name: 'Cosmic', bg: 'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)' },
              { name: 'Rose', bg: 'linear-gradient(135deg, #831843, #be185d, #ec4899)' },
              { name: 'Graphite', bg: 'linear-gradient(135deg, #18181b, #27272a, #3f3f46)' },
              { name: 'Sky', bg: 'linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)' }
            ].map((w, i) => `
              <div style="cursor:pointer;border-radius:12px;overflow:hidden;border:2px solid ${user.wallpaper === 'wp'+i ? 'var(--accent)' : 'transparent'};" data-wallpaper="wp${i}">
                <div style="height:100px;background:${w.bg};"></div>
                <div style="padding:8px;text-align:center;font-size:0.82rem;background:var(--surface);">${w.name}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `,
      dock: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">Dock & Menu Bar</h2>
          <div class="settings-row">
            <div class="settings-row-label">Automatically hide and show the Dock</div>
            <input type="checkbox" class="settings-toggle" id="dockAutoHide">
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Show recent applications in Dock</div>
            <input type="checkbox" class="settings-toggle" id="dockShowRecent" checked>
          </div>
          <div class="settings-row">
            <div>
              <div class="settings-row-label">Dock Size</div>
              <div class="settings-row-desc">Adjust the size of dock icons</div>
            </div>
            <input type="range" min="30" max="70" value="52" id="dockSize" style="width:200px;">
          </div>
        </div>
      `,
      general: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">General</h2>
          <div class="settings-row">
            <div class="settings-row-label">Computer Name</div>
            <input type="text" class="settings-select" value="Veyra" style="width:200px;">
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Default Browser</div>
            <select class="settings-select"><option>Veyra Browser</option></select>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Language</div>
            <select class="settings-select"><option>English (UK)</option><option>English (US)</option><option>Cymraeg</option></select>
          </div>
        </div>
      `,
      network: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">Network</h2>
          <div class="settings-row">
            <div>
              <div class="settings-row-label">Wi-Fi</div>
              <div class="settings-row-desc">Connected to Home Network</div>
            </div>
            <input type="checkbox" class="settings-toggle" checked>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Bluetooth</div>
            <input type="checkbox" class="settings-toggle" checked>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">AirDrop</div>
            <select class="settings-select"><option>Everyone</option><option>Contacts Only</option><option>Off</option></select>
          </div>
        </div>
      `,
      sound: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">Sound</h2>
          <div class="settings-row">
            <div class="settings-row-label">Output Volume</div>
            <input type="range" min="0" max="100" value="65" style="width:200px;">
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Alert Sound</div>
            <select class="settings-select"><option>Funk</option><option>Glass</option><option>Hero</option><option>Ping</option></select>
          </div>
          <div class="settings-row">
            <div class="settings-row-label">Play sound on startup</div>
            <input type="checkbox" class="settings-toggle" checked>
          </div>
        </div>
      `,
      storage: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">Storage</h2>
          <div style="background:var(--surface);border-radius:12px;padding:20px;margin-bottom:16px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="font-weight:600;">Veyra HD</span>
              <span style="color:var(--muted);">42.3 GB available of 256 GB</span>
            </div>
            <div style="height:8px;background:var(--surface-3);border-radius:4px;overflow:hidden;">
              <div style="width:35%;height:100%;background:linear-gradient(90deg,var(--blue),var(--purple));"></div>
            </div>
          </div>
          <div class="settings-row"><div class="settings-row-label">Applications</div><span style="color:var(--muted);">12.4 GB</span></div>
          <div class="settings-row"><div class="settings-row-label">Documents</div><span style="color:var(--muted);">3.1 GB</span></div>
          <div class="settings-row"><div class="settings-row-label">System</div><span style="color:var(--muted);">8.2 GB</span></div>
          <div class="settings-row"><div class="settings-row-label">Other</div><span style="color:var(--muted);">4.0 GB</span></div>
        </div>
      `,
      about: () => `
        <div class="settings-section">
          <h2 class="settings-section-title">About</h2>
          <div style="text-align:center;padding:20px;">
            <div style="width:80px;height:80px;margin:0 auto 16px;border-radius:20px;background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-size:2.5rem;">💻</div>
            <h3 style="font-size:1.4rem;font-weight:600;">VeyraOS</h3>
            <p style="color:var(--muted);margin-top:4px;">Version 1.0 (Build 2026.1)</p>
            <div style="margin-top:24px;text-align:left;max-width:400px;margin:24px auto 0;">
              <div class="settings-row"><div class="settings-row-label">Chip</div><span style="color:var(--muted);">Veyra M1</span></div>
              <div class="settings-row"><div class="settings-row-label">Memory</div><span style="color:var(--muted);">16 GB</span></div>
              <div class="settings-row"><div class="settings-row-label">Startup Disk</div><span style="color:var(--muted);">Veyra HD</span></div>
              <div class="settings-row"><div class="settings-row-label">Serial Number</div><span style="color:var(--muted);">VYR0001OS</span></div>
            </div>
          </div>
        </div>
      `
    };

    const renderSection = (name) => {
      main.innerHTML = sections[name] ? sections[name]() : '<p>Section not found.</p>';

      // Wire up theme
      const themeSelect = main.querySelector('#themeSelect');
      if (themeSelect) {
        themeSelect.addEventListener('change', () => {
          const theme = themeSelect.value;
          document.documentElement.dataset.theme = theme;
          user.theme = theme;
          OSStorage.saveUser(user);
        });
      }

      // Wire up accent colors
      main.querySelectorAll('.settings-color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
          main.querySelectorAll('.settings-color-swatch').forEach(s => s.classList.remove('selected'));
          sw.classList.add('selected');
          const color = sw.dataset.color;
          document.documentElement.style.setProperty('--accent', color);
          user.accent = color;
          OSStorage.saveUser(user);
        });
      });

      // Wire up wallpaper
      main.querySelectorAll('[data-wallpaper]').forEach(el => {
        el.addEventListener('click', () => {
          main.querySelectorAll('[data-wallpaper]').forEach(e => e.style.borderColor = 'transparent');
          el.style.borderColor = 'var(--accent)';
          const idx = parseInt(el.dataset.wallpaper.replace('wp', ''));
          const wallpapers = [
            'radial-gradient(ellipse at top, #2a1a3e 0%, #1a1a2e 40%, #0f0f1e 100%)',
            'linear-gradient(135deg, #0c4a6e, #075985, #0369a1)',
            'linear-gradient(135deg, #7c2d12, #c2410c, #f59e0b)',
            'linear-gradient(135deg, #14532d, #166534, #15803d)',
            'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)',
            'linear-gradient(135deg, #831843, #be185d, #ec4899)',
            'linear-gradient(135deg, #18181b, #27272a, #3f3f46)',
            'linear-gradient(135deg, #0ea5e9, #38bdf8, #7dd3fc)'
          ];
          document.body.style.background = wallpapers[idx];
          document.querySelector('.desktop').style.background = wallpapers[idx];
          user.wallpaper = el.dataset.wallpaper;
          OSStorage.saveUser(user);
        });
      });

      // Wire up dock size
      const dockSize = main.querySelector('#dockSize');
      if (dockSize) {
        dockSize.addEventListener('input', () => {
          document.querySelectorAll('.dock-item').forEach(el => {
            el.style.width = dockSize.value + 'px';
            el.style.height = dockSize.value + 'px';
          });
        });
      }
    };

    container.querySelectorAll('.settings-nav-item').forEach(nav => {
      nav.addEventListener('click', () => {
        container.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
        nav.classList.add('active');
        renderSection(nav.dataset.section);
      });
    });

    renderSection('appearance');
  }
});

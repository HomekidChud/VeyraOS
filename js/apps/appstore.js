// ============================================
// VeyraOS App — App Store
// ============================================

AppRegistry.register('appstore', {
  name: 'App Store',
  iconBg: 'linear-gradient(135deg, #0a84ff, #0040dd)',
  iconText: VeyraIcons.appstore,

  render(container, win) {
    const apps = [
      { name: 'Veyra Browser', desc: 'Private server-side browser', icon: '🌐', color: 'linear-gradient(135deg,#8b5cf6,#6366f1)', installed: true },
      { name: 'Code Editor', desc: 'Professional code editor', icon: '💻', color: 'linear-gradient(135deg,#1a1a2e,#0f0f1e)', installed: false },
      { name: 'Pixel Paint', desc: 'Digital art studio', icon: '🎨', color: 'linear-gradient(135deg,#ec4899,#8b5cf6)', installed: false },
      { name: 'Music Studio', desc: 'Create and mix music', icon: '🎹', color: 'linear-gradient(135deg,#f59e0b,#ef4444)', installed: false },
      { name: 'Video Player', desc: 'Watch videos and movies', icon: '🎬', color: 'linear-gradient(135deg,#0ea5e9,#3b82f6)', installed: false },
      { name: 'Mail Client', desc: 'Manage your email', icon: '📧', color: 'linear-gradient(135deg,#0a84ff,#0066cc)', installed: false },
      { name: 'Maps', desc: 'Explore the world', icon: '🗺️', color: 'linear-gradient(135deg,#22c55e,#16a34a)', installed: false },
      { name: 'Weather', desc: 'Check the forecast', icon: '🌤️', color: 'linear-gradient(135deg,#0ea5e9,#0284c7)', installed: false },
      { name: 'Reminders', desc: 'Never forget a task', icon: '✅', color: 'linear-gradient(135deg,#f59e0b,#d97706)', installed: false },
      { name: 'Podcasts', desc: 'Listen to podcasts', icon: '🎙️', color: 'linear-gradient(135deg,#a855f7,#7e22ce)', installed: false },
      { name: 'Books', desc: 'Read ebooks', icon: '📚', color: 'linear-gradient(135deg,#3b82f6,#1e40af)', installed: false },
      { name: 'Fitness', desc: 'Track your workouts', icon: '💪', color: 'linear-gradient(135deg,#ef4444,#dc2626)', installed: false }
    ];

    container.innerHTML = `
      <div class="app-root appstore-root">
        <div class="appstore-header">
          <h2>App Store</h2>
          <p style="color:var(--muted);margin-top:4px;">Discover new apps for VeyraOS</p>
        </div>
        <div class="appstore-featured">
          <h3>✨ Featured: Veyra Browser Pro</h3>
          <p>The ultimate private browsing experience. Server-side rendering, disposable sessions, and built-in VPN.</p>
          <div style="display:flex;gap:8px;margin-top:12px;">
            <button style="padding:6px 18px;border-radius:999px;background:rgba(255,255,255,0.2);color:#fff;border:0.5px solid rgba(255,255,255,0.3);font-weight:600;cursor:pointer;" onclick="Toast.show('App Store','Already installed!','✅')">GET</button>
            <button style="padding:6px 18px;border-radius:999px;background:rgba(255,255,255,0.1);color:#fff;border:0.5px solid rgba(255,255,255,0.2);font-weight:600;cursor:pointer;" id="vyrInstallBtn">Install .vyr File...</button>
          </div>
        </div>
        <div class="appstore-grid">
          ${apps.map((app, i) => `
            <div class="appstore-card" data-idx="${i}">
              <div class="appstore-card-icon" style="background:${app.color};">${app.icon}</div>
              <div class="appstore-card-info">
                <div class="appstore-card-name">${app.name}</div>
                <div class="appstore-card-desc">${app.desc}</div>
              </div>
              <button class="appstore-get" data-idx="${i}">${app.installed ? 'OPEN' : 'GET'}</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.appstore-get').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        const app = apps[idx];
        if (app.installed) {
          if (app.name === 'Veyra Browser') {
            WindowManager.open('browser');
          } else {
            Toast.show('App Store', app.name + ' is already installed', '✅');
          }
        } else {
          btn.textContent = 'INSTALLING...';
          setTimeout(() => {
            btn.textContent = 'OPEN';
            Toast.show('App Store', app.name + ' installed successfully', app.icon);
            apps[idx].installed = true;
          }, 1500);
        }
      });
    });

    // .vyr package installer button
    const vyrBtn = container.querySelector('#vyrInstallBtn');
    if (vyrBtn) {
      vyrBtn.addEventListener('click', () => {
        const dialog = document.getElementById('vyrInstallDialog');
        if (dialog) dialog.showModal();
      });
    }

    // Show installed .vyr packages
    const installedVyr = VyrPackage.getInstalled();
    if (installedVyr.length > 0) {
      const grid = container.querySelector('.appstore-grid');
      if (grid) {
        installedVyr.forEach(pkg => {
          const card = document.createElement('div');
          card.className = 'appstore-card';
          card.innerHTML = `
            <div class="appstore-card-icon" style="background:linear-gradient(135deg,var(--accent),var(--purple));">${pkg.manifest.icon || '📦'}</div>
            <div class="appstore-card-info">
              <div class="appstore-card-name">${pkg.manifest.name}</div>
              <div class="appstore-card-desc">v${pkg.manifest.version} • .vyr package</div>
            </div>
            <button class="appstore-get" data-vyr="${pkg.appId}">OPEN</button>
          `;
          grid.appendChild(card);
          card.querySelector('[data-vyr]').addEventListener('click', (e) => {
            e.stopPropagation();
            WindowManager.open(pkg.appId);
          });
        });
      }
    }
  }
});

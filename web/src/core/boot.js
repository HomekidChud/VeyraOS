




window.Toast = {
  show(title, message, icon = 'ℹ️') {
    const toasts = document.getElementById('toasts');
    if (!toasts) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon" style="font-size:1.2rem;">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
    `;
    toasts.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};


(function() {
  const bootBar = document.getElementById('bootBar');
  const bootScreen = document.getElementById('bootScreen');
  const loginScreen = document.getElementById('loginScreen');
  const desktop = document.getElementById('desktop');

  
  const user = OSStorage.getUser();
  document.documentElement.dataset.theme = user.theme || 'dark';
  if (user.accent) {
    document.documentElement.style.setProperty('--accent', user.accent);
  }

  
  DeviceManager.init();

  
  let progress = 0;
  const bootInterval = setInterval(() => {
    progress += Math.random() * 15 + 8;
    if (progress >= 100) {
      progress = 100;
      clearInterval(bootInterval);
      bootBar.style.width = '100%';

      setTimeout(() => {
        bootScreen.classList.add('fade-out');
        setTimeout(() => {
          bootScreen.style.display = 'none';
          loginScreen.classList.remove('hidden');
          
          const pw = document.getElementById('loginPassword');
          if (pw) pw.focus();
        }, 600);
      }, 400);
    } else {
      bootBar.style.width = progress + '%';
    }
  }, 200);

  
  const handleLogin = () => {
    loginScreen.classList.add('hidden');
    desktop.classList.remove('hidden');

    
    MenuBar.init();
    Dock.init();
    Spotlight.init();
    ControlCenter.init();
    Desktop.init();

    
    setTimeout(() => {
      Toast.show('Welcome to VeyraOS', 'Press Cmd+Space for Spotlight search', '💻');
      const devInfo = DeviceManager.getInfo();
      setTimeout(() => {
        Toast.show('Device Detected', `${devInfo.label} | ${devInfo.orientation} | ${devInfo.viewport.w}x${devInfo.viewport.h}`, '📱');
      }, 1200);
    }, 800);

    
    const vyrDialog = document.getElementById('vyrInstallDialog');
    const vyrFileInput = document.getElementById('vyrFileInput');
    const vyrPreview = document.getElementById('vyrPreview');
    const vyrInstallBtn = document.getElementById('vyrInstallBtn');
    let pendingVyrData = null;

    if (vyrFileInput) {
      vyrFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const pkg = VyrPackage.parse(reader.result);
            pendingVyrData = reader.result;
            vyrPreview.style.display = 'block';
            vyrPreview.innerHTML = `
              <div style="background:var(--surface);border-radius:12px;padding:16px;">
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
                  <div style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,var(--accent),var(--purple));display:flex;align-items:center;justify-content:center;font-size:1.5rem;">${pkg.manifest.icon || '📦'}</div>
                  <div>
                    <div style="font-weight:700;font-size:1rem;">${pkg.manifest.name}</div>
                    <div style="font-size:0.78rem;color:var(--muted);">v${pkg.manifest.version} by ${pkg.manifest.author}</div>
                  </div>
                </div>
                <p style="font-size:0.84rem;color:var(--text-2);">${pkg.manifest.description || 'No description'}</p>
                <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
                  <span class="pill">${pkg.manifest.category || 'utility'}</span>
                  ${pkg.manifest.permissions.map(p => `<span class="pill accent">${p}</span>`).join('')}
                </div>
              </div>
            `;
            vyrInstallBtn.disabled = false;
          } catch (err) {
            vyrPreview.style.display = 'block';
            vyrPreview.innerHTML = `<div style="color:var(--err);font-size:0.84rem;">Error: ${err.message}</div>`;
            vyrInstallBtn.disabled = true;
            pendingVyrData = null;
          }
        };
        reader.readAsText(file);
      });

      vyrInstallBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!pendingVyrData) return;
        const result = VyrPackage.install(pendingVyrData);
        if (result.success) {
          Toast.show('Package Installed', `${result.manifest.name} has been installed`, '📦');
          Dock.render();
          vyrDialog.close();
          vyrFileInput.value = '';
          vyrPreview.style.display = 'none';
          vyrInstallBtn.disabled = true;
          pendingVyrData = null;
        } else {
          Toast.show('Install Failed', result.error, '❌');
        }
      });
    }

    
    window._veyraDeploy = async () => {
      
      
      console.log('[VeyraOS] Auto-deploy triggered by software update');
    };
  };

  document.getElementById('loginArrow').addEventListener('click', handleLogin);
  document.getElementById('loginPassword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  
  document.addEventListener('keydown', (e) => {
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'q') {
      e.preventDefault();
      const win = WindowManager.getActiveWindow();
      if (win) WindowManager.close(win.id);
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
      e.preventDefault();
      const win = WindowManager.getActiveWindow();
      if (win) WindowManager.close(win.id);
    }
    
    if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
      e.preventDefault();
      const win = WindowManager.getActiveWindow();
      if (win) WindowManager.minimize(win.id);
    }
    
    if (e.key === 'F4' || ((e.metaKey || e.ctrlKey) && e.key === 'l')) {
      e.preventDefault();
      Launchpad.toggle();
    }
  });

  
  document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('.desktop') && !e.target.closest('.window')) {
      e.preventDefault();
    }
  });
})();

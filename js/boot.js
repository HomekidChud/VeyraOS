// ============================================
// VeyraOS — Boot Sequence
// ============================================

// Global Toast helper
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

// Boot sequence
(function() {
  const bootBar = document.getElementById('bootBar');
  const bootScreen = document.getElementById('bootScreen');
  const loginScreen = document.getElementById('loginScreen');
  const desktop = document.getElementById('desktop');

  // Apply saved user settings
  const user = OSStorage.getUser();
  document.documentElement.dataset.theme = user.theme || 'dark';
  if (user.accent) {
    document.documentElement.style.setProperty('--accent', user.accent);
  }

  // Boot progress animation
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
          // Auto-focus password field
          const pw = document.getElementById('loginPassword');
          if (pw) pw.focus();
        }, 600);
      }, 400);
    } else {
      bootBar.style.width = progress + '%';
    }
  }, 200);

  // Login handler
  const handleLogin = () => {
    loginScreen.classList.add('hidden');
    desktop.classList.remove('hidden');

    // Initialize all systems
    MenuBar.init();
    Dock.init();
    Spotlight.init();
    ControlCenter.init();
    Desktop.init();

    // Welcome toast
    setTimeout(() => {
      Toast.show('Welcome to VeyraOS', 'Press Cmd+Space for Spotlight search', '💻');
    }, 800);
  };

  document.getElementById('loginArrow').addEventListener('click', handleLogin);
  document.getElementById('loginPassword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Cmd+Q to quit active app
    if ((e.metaKey || e.ctrlKey) && e.key === 'q') {
      e.preventDefault();
      const win = WindowManager.getActiveWindow();
      if (win) WindowManager.close(win.id);
    }
    // Cmd+W to close window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
      e.preventDefault();
      const win = WindowManager.getActiveWindow();
      if (win) WindowManager.close(win.id);
    }
    // Cmd+M to minimize
    if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
      e.preventDefault();
      const win = WindowManager.getActiveWindow();
      if (win) WindowManager.minimize(win.id);
    }
    // F4 or Cmd+L for Launchpad
    if (e.key === 'F4' || ((e.metaKey || e.ctrlKey) && e.key === 'l')) {
      e.preventDefault();
      Launchpad.toggle();
    }
  });

  // Prevent context menu globally (except on desktop)
  document.addEventListener('contextmenu', (e) => {
    if (!e.target.closest('.desktop') && !e.target.closest('.window')) {
      e.preventDefault();
    }
  });
})();

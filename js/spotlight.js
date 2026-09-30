// ============================================
// VeyraOS — Spotlight Search
// ============================================

const Spotlight = {
  visible: false,
  selectedIndex: 0,
  results: [],

  init() {
    const input = document.getElementById('spotlightInput');
    input.addEventListener('input', () => this._search(input.value));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { this.toggle(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIndex = Math.min(this.selectedIndex + 1, this.results.length - 1);
        this._renderResults();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this._renderResults();
      } else if (e.key === 'Enter') {
        if (this.results[this.selectedIndex]) {
          this._launch(this.results[this.selectedIndex]);
        }
      }
    });

    document.getElementById('spotlight').addEventListener('click', (e) => {
      if (e.target.id === 'spotlight') this.toggle();
    });

    // Cmd+Space / Ctrl+Space
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        this.toggle();
      }
    });
  },

  toggle() {
    this.visible = !this.visible;
    const el = document.getElementById('spotlight');
    if (this.visible) {
      el.classList.remove('hidden');
      const input = document.getElementById('spotlightInput');
      input.value = '';
      input.focus();
      this.results = this._getAllApps();
      this.selectedIndex = 0;
      this._renderResults();
    } else {
      el.classList.add('hidden');
    }
  },

  _search(query) {
    query = query.trim().toLowerCase();
    if (!query) {
      this.results = this._getAllApps();
    } else {
      const all = this._getAllApps();
      this.results = all.filter(r =>
        r.name.toLowerCase().includes(query) || r.type.toLowerCase().includes(query)
      );
    }
    this.selectedIndex = 0;
    this._renderResults();
  },

  _getAllApps() {
    const apps = [];
    for (const [id, config] of Object.entries(AppRegistry.getAll())) {
      apps.push({
        type: 'app',
        id,
        name: config.name,
        icon: config.iconBg || 'linear-gradient(135deg, #6b7280, #4b5563)',
        iconText: config.iconText || '📦'
      });
    }
    // Add some system actions
    apps.push({ type: 'action', id: 'settings', name: 'System Settings', icon: 'linear-gradient(135deg, #6b7280, #4b5563)', iconText: '⚙️' });
    apps.push({ type: 'action', id: 'lock', name: 'Lock Screen', icon: 'linear-gradient(135deg, #1a1a2e, #0f0f1e)', iconText: '🔒' });
    return apps;
  },

  _renderResults() {
    const container = document.getElementById('spotlightResults');
    if (this.results.length === 0) {
      container.innerHTML = '<div style="padding:20px;text-align:center;color:var(--muted);">No results found</div>';
      return;
    }

    container.innerHTML = this.results.map((r, i) => `
      <div class="spotlight-result ${i === this.selectedIndex ? 'selected' : ''}" data-idx="${i}">
        <div class="spotlight-result-icon" style="background:${r.icon};">${r.iconText}</div>
        <div class="spotlight-result-text">
          <div class="spotlight-result-name">${r.name}</div>
          <div class="spotlight-result-type">${r.type}</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.spotlight-result').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx);
        this._launch(this.results[idx]);
      });
    });
  },

  _launch(result) {
    this.toggle();
    if (result.type === 'app' || result.type === 'action') {
      if (result.id === 'lock') {
        MenuBar._lock();
      } else {
        WindowManager.open(result.id);
      }
    }
  }
};

window.Spotlight = Spotlight;





AppRegistry.register('downloads', {
  name: 'Downloads',
  iconBg: 'linear-gradient(135deg, #0a84ff, #0040dd)',
  iconText: VeyraIcons.downloads,

  render(container, win) {
    let downloads = OSStorage.get('downloads', []);

    const render = () => {
      container.innerHTML = `
        <div class="app-root" style="height:100%;display:flex;flex-direction:column;">
          <div style="display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:0.5px solid var(--line);">
            <h2 style="font-size:1.3rem;font-weight:700;flex:1;">Downloads</h2>
            <input type="text" class="settings-search" id="dlFilter" placeholder="Search downloads" style="width:200px;margin:0;">
            <button class="btn ghost sm" id="dlClear">Clear All</button>
          </div>
          <div id="downloadsList" style="flex:1;overflow-y:auto;padding:8px;"></div>
          ${downloads.length === 0 ? '<div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:0.9rem;">No downloads yet. Download files from the browser.</div>' : ''}
        </div>
      `;

      const listEl = container.querySelector('#downloadsList');
      const filterEl = container.querySelector('#dlFilter');

      const filtered = (q) => {
        if (!q) return downloads;
        return downloads.filter(d => d.name.toLowerCase().includes(q.toLowerCase()) || (d.url || '').toLowerCase().includes(q.toLowerCase()));
      };

      const renderList = () => {
        const items = filtered(filterEl.value);
        if (items.length === 0) {
          listEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);font-size:0.86rem;">No downloads found</div>';
          return;
        }

        listEl.innerHTML = items.map((d, i) => `
          <div class="download-item" data-idx="${i}" style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:10px;transition:background var(--t-fast);cursor:pointer;">
            <div class="download-icon" style="width:44px;height:44px;border-radius:10px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">
              ${getFileIcon(d.name)}
            </div>
            <div style="flex:1;overflow:hidden;">
              <div style="font-size:0.88rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.name}</div>
              <div style="font-size:0.74rem;color:var(--muted);display:flex;gap:8px;align-items:center;">
                <span>${formatSize(d.size)}</span>
                ${d.status === 'downloading' ? `<span style="color:var(--accent);">• ${d.progress}%</span>` : ''}
                ${d.status === 'completed' ? '<span style="color:var(--green);">• Completed</span>' : ''}
                ${d.status === 'failed' ? '<span style="color:var(--red);">• Failed</span>' : ''}
                <span>• ${timeAgo(d.time)}</span>
              </div>
              ${d.status === 'downloading' ? `<div style="height:3px;background:var(--surface-3);border-radius:2px;margin-top:6px;overflow:hidden;"><div style="width:${d.progress}%;height:100%;background:var(--accent);transition:width 0.3s;"></div></div>` : ''}
            </div>
            ${d.status === 'completed' ? `<button class="browser-nav-btn" data-open="${i}" title="Open"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg></button>` : ''}
            <button class="browser-nav-btn" data-remove="${i}" title="Remove"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7h14M10 7V5h4v7M7 7l1 13h8l1-13"/></svg></button>
          </div>
        `).join('');

        listEl.querySelectorAll('.download-item').forEach(el => {
          el.addEventListener('click', (e) => {
            const idx = parseInt(el.dataset.idx);
            if (e.target.closest('[data-open]')) {
              const d = filtered(filterEl.value)[idx];
              if (d && d.blob) {
                const url = URL.createObjectURL(d.blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = d.name;
                a.click();
                URL.revokeObjectURL(url);
              } else if (d.url) {
                window.open(d.url, '_blank');
              }
            } else if (e.target.closest('[data-remove]')) {
              const item = filtered(filterEl.value)[idx];
              downloads = downloads.filter(d2 => d2 !== item);
              OSStorage.set('downloads', downloads);
              render();
            }
          });
        });
      };

      filterEl.addEventListener('input', renderList);
      container.querySelector('#dlClear').addEventListener('click', () => {
        if (confirm('Clear all downloads?')) {
          downloads = [];
          OSStorage.set('downloads', downloads);
          render();
        }
      });

      renderList();
    };

    function getFileIcon(name) {
      const ext = name.split('.').pop().toLowerCase();
      const icons = {
        txt: '📄', pdf: '📕', doc: '📘', docx: '📘', xls: '📗', xlsx: '📗',
        ppt: '📙', pptx: '📙', zip: '🗜️', rar: '🗜️', '7z': '🗜️',
        jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', svg: '🖼️',
        mp3: '🎵', wav: '🎵', flac: '🎵', aac: '🎵',
        mp4: '🎬', mkv: '🎬', avi: '🎬', mov: '🎬',
        js: '📜', css: '📜', html: '📜', json: '📜', py: '📜',
        exe: '⚙️', dmg: '⚙️', apk: '📦', iso: '💿'
      };
      return icons[ext] || '📄';
    }

    function formatSize(bytes) {
      if (!bytes || bytes === 0) return '—';
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
      if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }

    function timeAgo(t) {
      const d = (Date.now() - t) / 1000;
      if (d < 60) return 'just now';
      if (d < 3600) return Math.floor(d / 60) + 'm ago';
      if (d < 86400) return Math.floor(d / 3600) + 'h ago';
      return new Date(t).toLocaleDateString();
    }

    render();

    
    window.VeyraDownload = {
      add(name, url, size) {
        const download = {
          id: 'dl_' + Date.now(),
          name, url, size: size || 0,
          status: 'downloading', progress: 0, time: Date.now(), blob: null
        };
        downloads.unshift(download);
        OSStorage.set('downloads', downloads);

        
        const interval = setInterval(() => {
          download.progress += Math.random() * 20 + 10;
          if (download.progress >= 100) {
            download.progress = 100;
            download.status = 'completed';
            clearInterval(interval);
            OSStorage.set('downloads', downloads);
            Toast.show('Downloads', `${name} completed`, getFileIcon(name));
            
            const win = WindowManager.getWindowsByApp('downloads')[0];
            if (win) this.render(win.el.querySelector('.window-body'));
          } else {
            OSStorage.set('downloads', downloads);
          }
        }, 800);

        return download;
      }
    };
  }
});

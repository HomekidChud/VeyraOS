




AppRegistry.register('activity', {
  name: 'Activity Monitor',
  iconBg: 'linear-gradient(135deg, #374151, #1f2937)',
  iconText: 'assets/icons/activity.svg',

  render(container, win) {
    let charts = { cpu: [], mem: [], net: [] };
    const maxPoints = 40;

    container.innerHTML = `
      <div class="app-root" style="height:100%;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:0.5px solid var(--line);background:var(--titlebar-bg);">
          <button class="browser-nav-btn" id="actRefresh" title="Refresh"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 11a8 8 0 1 0 .9 4.5M20 4v7h-7"/></svg></button>
          <select class="settings-select" id="actTab" style="font-size:0.8rem;">
            <option value="processes">Processes</option>
            <option value="performance">Performance</option>
            <option value="network">Network</option>
          </select>
          <div style="flex:1;"></div>
          <span style="font-size:0.74rem;color:var(--muted);">VeyraOS ${SoftwareUpdate.getCurrentVersion()}</span>
        </div>
        <div id="actContent" style="flex:1;overflow-y:auto;padding:16px;"></div>
      </div>
    `;

    const content = container.querySelector('#actContent');
    const tabSel = container.querySelector('#actTab');
    let currentTab = 'processes';
    let updateInterval = null;

    
    const processes = [
      { name: 'Window Manager', pid: 1, cpu: 2.3, mem: 24.5, category: 'System' },
      { name: 'Dock', pid: 12, cpu: 0.8, mem: 18.2, category: 'System' },
      { name: 'Menu Bar', pid: 15, cpu: 0.5, mem: 12.1, category: 'System' },
      { name: 'Spotlight', pid: 18, cpu: 0.1, mem: 8.4, category: 'System' },
      { name: 'Control Center', pid: 22, cpu: 0.3, mem: 6.7, category: 'System' },
      { name: 'Desktop', pid: 25, cpu: 0.2, mem: 5.3, category: 'System' },
      { name: 'Compositor', pid: 28, cpu: 1.1, mem: 32.8, category: 'Graphics' },
      { name: 'Network Service', pid: 31, cpu: 0.4, mem: 14.2, category: 'Network' },
      { name: 'Storage Service', pid: 34, cpu: 0.1, mem: 7.8, category: 'Storage' },
      { name: 'Audio Service', pid: 37, cpu: 0.2, mem: 4.5, category: 'Audio' },
      { name: 'Input Service', pid: 40, cpu: 0.3, mem: 3.2, category: 'Input' },
      { name: 'Security Service', pid: 43, cpu: 0.1, mem: 5.6, category: 'Security' }
    ];

    
    const appProcs = WindowManager.windows.map((w, i) => ({
      name: AppRegistry.get(w.appId)?.name || 'Unknown',
      pid: 100 + i,
      cpu: Math.random() * 5 + 0.5,
      mem: Math.random() * 80 + 20,
      category: 'Application'
    }));

    const allProcs = [...appProcs, ...processes];

    function renderProcesses() {
      const totalCPU = allProcs.reduce((a, p) => a + p.cpu, 0);
      const totalMem = allProcs.reduce((a, p) => a + p.mem, 0);

      content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
          <div style="background:var(--surface);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:2rem;font-weight:300;color:var(--accent);">${totalCPU.toFixed(1)}%</div>
            <div style="font-size:0.74rem;color:var(--muted);">CPU Usage</div>
          </div>
          <div style="background:var(--surface);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:2rem;font-weight:300;color:var(--green);">${totalMem.toFixed(0)} MB</div>
            <div style="font-size:0.74rem;color:var(--muted);">Memory Used</div>
          </div>
          <div style="background:var(--surface);border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:2rem;font-weight:300;color:var(--purple);">${allProcs.length}</div>
            <div style="font-size:0.74rem;color:var(--muted);">Processes</div>
          </div>
        </div>
        <div style="background:var(--surface);border-radius:12px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:1fr 60px 70px 70px 90px;gap:8px;padding:8px 12px;font-size:0.72rem;font-weight:600;color:var(--text-3);text-transform:uppercase;border-bottom:1px solid var(--line);">
            <span>Process Name</span><span>PID</span><span>CPU %</span><span>Memory</span><span>Category</span>
          </div>
          ${allProcs.map(p => `
            <div style="display:grid;grid-template-columns:1fr 60px 70px 70px 90px;gap:8px;padding:8px 12px;font-size:0.82rem;border-bottom:0.5px solid var(--line);align-items:center;">
              <span style="font-weight:500;">${p.name}</span>
              <span style="color:var(--muted);">${p.pid}</span>
              <span style="color:${p.cpu > 3 ? 'var(--orange)' : 'var(--text-2)'};">${p.cpu.toFixed(1)}%</span>
              <span style="color:var(--text-2);">${p.mem.toFixed(1)} MB</span>
              <span style="font-size:0.74rem;color:var(--muted);">${p.category}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    function renderPerformance() {
      
      const cpuVal = Math.random() * 30 + 10;
      const memVal = Math.random() * 40 + 30;
      const netVal = Math.random() * 50 + 5;

      charts.cpu.push(cpuVal);
      charts.mem.push(memVal);
      charts.net.push(netVal);
      if (charts.cpu.length > maxPoints) charts.cpu.shift();
      if (charts.mem.length > maxPoints) charts.mem.shift();
      if (charts.net.length > maxPoints) charts.net.shift();

      content.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${renderChart('CPU Usage', cpuVal.toFixed(1) + '%', charts.cpu, 'var(--accent)')}
          ${renderChart('Memory', memVal.toFixed(0) + '%', charts.mem, 'var(--green)')}
          ${renderChart('Network', netVal.toFixed(0) + ' KB/s', charts.net, 'var(--purple)')}
          ${renderChart('Disk', (Math.random() * 20 + 5).toFixed(1) + ' MB/s', charts.cpu.map(() => Math.random() * 25 + 5), 'var(--orange)')}
        </div>
        <div style="margin-top:16px;background:var(--surface);border-radius:12px;padding:16px;">
          <h3 style="font-size:0.9rem;font-weight:700;margin-bottom:12px;">System Info</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.82rem;">
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">OS Version</span><span>VeyraOS ${SoftwareUpdate.getCurrentVersion()}</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Uptime</span><span>${formatUptime()}</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Resolution</span><span>${window.innerWidth}x${window.innerHeight}</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">CPU Cores</span><span>${navigator.hardwareConcurrency || 8}</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Memory</span><span>16 GB</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Device Type</span><span>${window.innerWidth <= 768 ? 'Mobile' : 'Desktop'}</span></div>
          </div>
        </div>
      `;
    }

    function renderChart(title, value, data, color) {
      const max = 100;
      const w = 100;
      const h = 60;
      const points = data.map((v, i) => {
        const x = (i / (maxPoints - 1)) * w;
        const y = h - (v / max) * h;
        return `${x},${y}`;
      }).join(' ');

      return `
        <div style="background:var(--surface);border-radius:12px;padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <span style="font-size:0.78rem;font-weight:600;color:var(--text-2);">${title}</span>
            <span style="font-size:1.2rem;font-weight:300;color:${color};">${value}</span>
          </div>
          <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:60px;" preserveAspectRatio="none">
            <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <polygon points="0,${h} ${points} ${w},${h}" fill="${color}" opacity="0.1"/>
          </svg>
        </div>
      `;
    }

    function renderNetwork() {
      content.innerHTML = `
        <div style="background:var(--surface);border-radius:12px;padding:16px;margin-bottom:12px;">
          <h3 style="font-size:0.9rem;font-weight:700;margin-bottom:12px;">Network Connections</h3>
          <div style="display:grid;grid-template-columns:1fr 80px 60px;gap:8px;font-size:0.82rem;">
            ${[
              { name: 'Veyra Browser API', addr: 'veyraserver-xscy.onrender.com', port: '443' },
              { name: 'DNS Server', addr: '8.8.8.8', port: '53' },
              { name: 'Local Network', addr: '192.168.1.1', port: '—' },
              { name: 'Cloud Storage', addr: 's3.amazonaws.com', port: '443' }
            ].map(c => `
              <div style="padding:6px 0;border-bottom:0.5px solid var(--line);">${c.name}</div>
              <div style="padding:6px 0;border-bottom:0.5px solid var(--line);color:var(--muted);">${c.addr}</div>
              <div style="padding:6px 0;border-bottom:0.5px solid var(--line);color:var(--muted);">${c.port}</div>
            `).join('')}
          </div>
        </div>
        <div style="background:var(--surface);border-radius:12px;padding:16px;">
          <h3 style="font-size:0.9rem;font-weight:700;margin-bottom:12px;">Network Statistics</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.82rem;">
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Download Speed</span><span style="color:var(--green);">${(Math.random()*50+10).toFixed(1)} MB/s</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Upload Speed</span><span style="color:var(--accent);">${(Math.random()*10+2).toFixed(1)} MB/s</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Ping</span><span>${Math.floor(Math.random()*30+5)} ms</span></div>
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid var(--line);"><span style="color:var(--muted);">Data Received</span><span>${(Math.random()*500+100).toFixed(0)} MB</span></div>
          </div>
        </div>
      `;
    }

    function formatUptime() {
      const sec = Math.floor(performance.now() / 1000);
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      return `${h}h ${m}m ${s}s`;
    }

    function renderTab() {
      if (currentTab === 'processes') renderProcesses();
      else if (currentTab === 'performance') renderPerformance();
      else renderNetwork();
    }

    tabSel.addEventListener('change', () => {
      currentTab = tabSel.value;
      renderTab();
    });

    container.querySelector('#actRefresh').addEventListener('click', renderTab);

    
    updateInterval = setInterval(() => {
      if (currentTab === 'performance' || currentTab === 'processes') {
        renderTab();
      }
    }, 2000);

    renderTab();

    
    win._cleanup = () => clearInterval(updateInterval);
  }
});

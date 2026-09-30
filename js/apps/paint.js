// ============================================
// VeyraOS App — Paint Studio
// A fully functional canvas drawing application
// ============================================

AppRegistry.register('paint', {
  name: 'Paint Studio',
  iconBg: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  iconText: 'assets/icons/paint.svg',

  render(container, win) {
    container.innerHTML = `
      <div class="app-root paint-root" style="height:100%;display:flex;flex-direction:column;">
        <!-- Toolbar -->
        <div class="paint-toolbar" style="display:flex;align-items:center;gap:6px;padding:8px 12px;border-bottom:0.5px solid var(--line);background:var(--titlebar-bg);flex-wrap:wrap;">
          <button class="paint-tool active" data-tool="brush" title="Brush"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l-6 6v3h3l6-6M14 8l-5 5 3 3 5-5"/><path d="M14 8l3-3a2 2 0 1 1 3 3l-3 3"/></svg></button>
          <button class="paint-tool" data-tool="pencil" title="Pencil"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg></button>
          <button class="paint-tool" data-tool="eraser" title="Eraser"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 20H7l-4-4 11-11 7 7-7 8z"/><path d="M7 20l7-8"/></svg></button>
          <button class="paint-tool" data-tool="line" title="Line"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 19L19 5"/></svg></button>
          <button class="paint-tool" data-tool="rect" title="Rectangle"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="6" width="16" height="12" rx="1"/></svg></button>
          <button class="paint-tool" data-tool="circle" title="Circle"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/></svg></button>
          <button class="paint-tool" data-tool="fill" title="Fill"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l8 8-8 8-8-8z"/><path d="M4 11h16M20 19v3"/></svg></button>
          <div style="width:1px;height:24px;background:var(--line);margin:0 4px;"></div>
          <div class="paint-colors" style="display:flex;gap:4px;align-items:center;">
            <input type="color" id="paintColor" value="#ffffff" style="width:32px;height:32px;border:none;border-radius:8px;background:none;cursor:pointer;">
            <div class="paint-swatch-grid" style="display:grid;grid-template-columns:repeat(8,1fr);gap:2px;">
              ${['#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff',
                '#808080','#c0c0c0','#800000','#008000','#000080','#808000','#800080','#008080',
                '#ff6b6b','#51d88a','#5b7fd6','#f0c46b','#bf5af2','#ff9f0a','#22c55e','#0a84ff'].map(c =>
                `<div class="paint-swatch" style="width:18px;height:18px;border-radius:4px;background:${c};cursor:pointer;border:1px solid rgba(255,255,255,0.1);" data-color="${c}"></div>`
              ).join('')}
            </div>
          </div>
          <div style="width:1px;height:24px;background:var(--line);margin:0 4px;"></div>
          <label style="display:flex;align-items:center;gap:6px;font-size:0.78rem;color:var(--muted);">
            Size
            <input type="range" id="paintSize" min="1" max="50" value="5" style="width:80px;">
            <span id="paintSizeVal" style="width:24px;">5</span>
          </label>
          <div style="flex:1;"></div>
          <button class="paint-action" id="paintUndo" title="Undo"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l5-5M3 12l5 5M3 12h12a5 5 0 0 1 0 10h-3"/></svg></button>
          <button class="paint-action" id="paintRedo" title="Redo"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12l-5-5M21 12l-5 5M21 12H9a5 5 0 0 0 0 10h3"/></svg></button>
          <button class="paint-action" id="paintClear" title="Clear"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7h14M10 7V5h4v7M7 7l1 13h8l1-13"/></svg></button>
          <button class="paint-action" id="paintSave" title="Save"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h11l4 4v14H5z"/><path d="M8 3v5h7"/></svg></button>
        </div>
        <!-- Canvas area -->
        <div class="paint-canvas-wrap" style="flex:1;overflow:auto;display:flex;align-items:center;justify-content:center;background:#1a1a2e;padding:16px;">
          <canvas id="paintCanvas" width="800" height="600" style="background:#fff;border-radius:4px;cursor:crosshair;box-shadow:0 4px 20px rgba(0,0,0,0.3);"></canvas>
        </div>
        <!-- Status bar -->
        <div class="paint-statusbar" style="height:26px;display:flex;align-items:center;justify-content:space-between;padding:0 12px;font-size:0.72rem;color:var(--muted);border-top:0.5px solid var(--line);background:var(--titlebar-bg);">
          <span id="paintStatus">Brush — 5px</span>
          <span id="paintCoords">0, 0</span>
        </div>
      </div>
    `;

    // Inject paint-specific CSS
    const style = document.createElement('style');
    style.textContent = `
      .paint-tool, .paint-action {
        width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;
        background:var(--surface);border:1px solid var(--line);cursor:pointer;transition:background var(--t-fast),border-color var(--t-fast);
      }
      .paint-tool:hover, .paint-action:hover { background:var(--surface-hover); }
      .paint-tool.active { background:var(--accent);color:#fff;border-color:transparent; }
      @media (max-width:768px) {
        .paint-toolbar { gap:4px;padding:6px; }
        .paint-tool, .paint-action { width:30px;height:30px; }
        .paint-swatch-grid { display:none !important; }
        #paintSize { width:60px; }
      }
    `;
    container.appendChild(style);

    // Canvas setup
    const canvas = container.querySelector('#paintCanvas');
    const ctx = canvas.getContext('2d');
    const colorInput = container.querySelector('#paintColor');
    const sizeInput = container.querySelector('#paintSize');
    const sizeVal = container.querySelector('#paintSizeVal');
    const statusEl = container.querySelector('#paintStatus');
    const coordsEl = container.querySelector('#paintCoords');

    // Fill white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // State
    let currentTool = 'brush';
    let currentColor = '#ffffff';
    let currentSize = 5;
    let isDrawing = false;
    let startX = 0, startY = 0;
    let lastX = 0, lastY = 0;
    let snapshot = null;
    let history = [];
    let historyIdx = -1;
    const maxHistory = 30;

    // Save initial state
    function saveState() {
      history = history.slice(0, historyIdx + 1);
      history.push(canvas.toDataURL());
      if (history.length > maxHistory) history.shift();
      historyIdx = history.length - 1;
    }
    saveState();

    function loadState(idx) {
      if (idx < 0 || idx >= history.length) return;
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[idx];
    }

    // Get canvas coordinates
    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    // Drawing functions
    function startDraw(e) {
      e.preventDefault();
      const { x, y } = getCoords(e);
      isDrawing = true;
      startX = lastX = x;
      startY = lastY = y;

      if (currentTool === 'fill') {
        floodFill(Math.floor(x), Math.floor(y), currentColor);
        saveState();
        isDrawing = false;
        return;
      }

      // Take snapshot for shape preview
      if (['line', 'rect', 'circle'].includes(currentTool)) {
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      }

      // Draw initial dot for brush/pencil/eraser
      if (['brush', 'pencil', 'eraser'].includes(currentTool)) {
        ctx.beginPath();
        ctx.arc(x, y, currentSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.fill();
      }
    }

    function draw(e) {
      const { x, y } = getCoords(e);
      coordsEl.textContent = `${Math.round(x)}, ${Math.round(y)}`;

      if (!isDrawing) return;
      e.preventDefault();

      if (currentTool === 'brush' || currentTool === 'pencil') {
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = currentColor;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
      } else if (currentTool === 'eraser') {
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        lastX = x;
        lastY = y;
      } else if (currentTool === 'line') {
        ctx.putImageData(snapshot, 0, 0);
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (currentTool === 'rect') {
        ctx.putImageData(snapshot, 0, 0);
        ctx.lineWidth = currentSize;
        ctx.strokeStyle = currentColor;
        ctx.strokeRect(startX, startY, x - startX, y - startY);
      } else if (currentTool === 'circle') {
        ctx.putImageData(snapshot, 0, 0);
        ctx.lineWidth = currentSize;
        ctx.strokeStyle = currentColor;
        const radius = Math.sqrt((x - startX) ** 2 + (y - startY) ** 2);
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function endDraw(e) {
      if (!isDrawing) return;
      isDrawing = false;
      saveState();
    }

    // Flood fill algorithm
    function floodFill(startX, startY, fillColor) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const w = canvas.width;
      const h = canvas.height;

      // Get target color
      const startIdx = (startY * w + startX) * 4;
      const targetR = data[startIdx];
      const targetG = data[startIdx + 1];
      const targetB = data[startIdx + 2];
      const targetA = data[startIdx + 3];

      // Parse fill color
      const fillRgb = hexToRgb(fillColor);
      if (!fillRgb) return;

      // Don't fill if same color
      if (targetR === fillRgb.r && targetG === fillRgb.g && targetB === fillRgb.b) return;

      const stack = [[startX, startY]];
      const visited = new Set();

      while (stack.length > 0) {
        const [x, y] = stack.pop();
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const key = y * w + x;
        if (visited.has(key)) continue;

        const idx = key * 4;
        if (data[idx] !== targetR || data[idx + 1] !== targetG || data[idx + 2] !== targetB || data[idx + 3] !== targetA) continue;

        visited.add(key);
        data[idx] = fillRgb.r;
        data[idx + 1] = fillRgb.g;
        data[idx + 2] = fillRgb.b;
        data[idx + 3] = 255;

        stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function hexToRgb(hex) {
      const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
    }

    // Event listeners — mouse
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseleave', endDraw);

    // Event listeners — touch
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    // Tool selection
    container.querySelectorAll('.paint-tool').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.paint-tool').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
        statusEl.textContent = `${currentTool.charAt(0).toUpperCase() + currentTool.slice(1)} — ${currentSize}px`;
        canvas.style.cursor = currentTool === 'fill' ? 'cell' : 'crosshair';
      });
    });

    // Color picker
    colorInput.addEventListener('input', () => {
      currentColor = colorInput.value;
    });

    // Color swatches
    container.querySelectorAll('.paint-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        currentColor = sw.dataset.color;
        colorInput.value = currentColor;
      });
    });

    // Size slider
    sizeInput.addEventListener('input', () => {
      currentSize = parseInt(sizeInput.value);
      sizeVal.textContent = currentSize;
      statusEl.textContent = `${currentTool.charAt(0).toUpperCase() + currentTool.slice(1)} — ${currentSize}px`;
    });

    // Undo/Redo
    container.querySelector('#paintUndo').addEventListener('click', () => {
      if (historyIdx > 0) {
        historyIdx--;
        loadState(historyIdx);
      }
    });

    container.querySelector('#paintRedo').addEventListener('click', () => {
      if (historyIdx < history.length - 1) {
        historyIdx++;
        loadState(historyIdx);
      }
    });

    // Clear
    container.querySelector('#paintClear').addEventListener('click', () => {
      if (!confirm('Clear the entire canvas?')) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    });

    // Save
    container.querySelector('#paintSave').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'veyra-paint-' + Date.now() + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      Toast.show('Paint Studio', 'Image saved as PNG', '🎨');
    });

    // Responsive canvas
    function resizeCanvas() {
      const wrap = container.querySelector('.paint-canvas-wrap');
      if (!wrap) return;
      const maxW = wrap.clientWidth - 32;
      const maxH = wrap.clientHeight - 32;
      if (maxW < canvas.width) {
        canvas.style.width = maxW + 'px';
        canvas.style.height = 'auto';
      } else {
        canvas.style.width = '';
        canvas.style.height = '';
      }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
});

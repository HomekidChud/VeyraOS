



AppRegistry.register('texteditor', {
  name: 'Text Editor',
  iconBg: 'linear-gradient(135deg, #3b82f6, #1e40af)',
  iconText: VeyraIcons.texteditor,

  render(container, win) {
    container.innerHTML = `
      <div class="app-root texteditor-root">
        <div class="texteditor-toolbar">
          <button class="browser-nav-btn" id="textNew" title="New"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
          <button class="browser-nav-btn" id="textOpen" title="Open"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l3-3h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z"/></svg></button>
          <button class="browser-nav-btn" id="textSave" title="Save"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3h11l4 4v14H5z"/><path d="M8 3v5h7"/></svg></button>
          <div style="flex:1;"></div>
          <select class="settings-select" id="textFont" style="font-size:0.8rem;">
            <option>Inter</option>
            <option>Georgia</option>
            <option>Courier New</option>
            <option>Times New Roman</option>
          </select>
          <select class="settings-select" id="textSize" style="font-size:0.8rem;">
            <option>12</option>
            <option selected>14</option>
            <option>16</option>
            <option>18</option>
            <option>24</option>
          </select>
        </div>
        <textarea class="texteditor-area" id="textArea" placeholder="Start typing..."></textarea>
        <div class="texteditor-statusbar">
          <span id="textCharCount">0 characters</span>
          <span id="textWordCount">0 words</span>
          <span id="textLineCount">1 line</span>
        </div>
      </div>
    `;

    const area = container.querySelector('#textArea');
    const charCount = container.querySelector('#textCharCount');
    const wordCount = container.querySelector('#textWordCount');
    const lineCount = container.querySelector('#textLineCount');
    const fontSel = container.querySelector('#textFont');
    const sizeSel = container.querySelector('#textSize');

    let currentDocument = win.state.document || null;
    const setTitle = title => { win.title = title; const el = win.el.querySelector('.window-title'); if (el) el.textContent = title; };
    const loadDocument = doc => { currentDocument = doc || null; area.value = String(doc?.content || ''); if (doc?.name) setTitle(doc.name); updateCounts(); area.focus(); };
    const updateCounts = () => {
      const text = area.value;
      charCount.textContent = text.length + ' characters';
      wordCount.textContent = (text.trim() ? text.trim().split(/\s+/).length : 0) + ' words';
      lineCount.textContent = (text.split('\n').length) + ' lines';
    };

    area.addEventListener('input', updateCounts);

    fontSel.addEventListener('change', () => {
      area.style.fontFamily = fontSel.value;
    });

    sizeSel.addEventListener('change', () => {
      area.style.fontSize = sizeSel.value + 'px';
    });

    
    container.querySelector('#textSave').addEventListener('click', () => {
      if (currentDocument && typeof win.state.onSave === 'function') {
        currentDocument.content = area.value;
        win.state.onSave(area.value);
        Toast.show('Text Editor', 'Saved to Veyra Files', '💾');
        return;
      }
      const blob = new Blob([area.value], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (win.title || 'untitled') + '.txt';
      a.click();
      URL.revokeObjectURL(url);
      Toast.show('Text Editor', 'Downloaded file', '💾');
    });

    
    container.querySelector('#textNew').addEventListener('click', () => {
      if (area.value && !confirm('Start a new document? Unsaved changes will be lost.')) return;
      currentDocument = null;
      area.value = '';
      setTitle('Text Editor');
      updateCounts();
    });

    
    container.querySelector('#textOpen').addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.md,.js,.css,.html,.json,.py,.xml,.csv';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          area.value = reader.result;
          updateCounts();
          Toast.show('Text Editor', 'Opened: ' + file.name, '📂');
        };
        reader.readAsText(file);
      };
      input.click();
    });

    win.el.addEventListener('veyra:open-document', event => { win.state.document = event.detail; loadDocument(event.detail); });
    win._cleanup = () => {};
    loadDocument(currentDocument);
    setTimeout(() => area.focus(), 100);
  }
});

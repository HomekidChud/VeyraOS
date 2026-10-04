



AppRegistry.register('notes', {
  name: 'Notes',
  iconBg: 'linear-gradient(135deg, #fbbf24, #d97706)',
  iconText: VeyraIcons.notes,

  render(container, win) {
    let notes = OSStorage.getNotes();
    let activeNoteId = notes.length > 0 ? notes[0].id : null;

    container.innerHTML = `
      <div class="app-root notes-root">
        <div class="notes-sidebar">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0 4px 8px;">
            <strong style="font-size:0.9rem;">Notes</strong>
            <button class="browser-nav-btn" id="noteNew" title="New Note" style="width:28px;height:28px;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
          <div id="notesList"></div>
        </div>
        <div class="notes-main">
          <div class="notes-toolbar">
            <input type="text" class="notes-title-input" id="noteTitle" placeholder="Note Title">
            <button class="browser-nav-btn" id="noteDelete" title="Delete Note" style="width:28px;height:28px;">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 7h14M10 7V5h4v7M7 7l1 13h8l1-13"/></svg>
            </button>
          </div>
          <div class="notes-body">
            <textarea id="noteBody" placeholder="Start writing..."></textarea>
          </div>
        </div>
      </div>
    `;

    const listEl = container.querySelector('#notesList');
    const titleInput = container.querySelector('#noteTitle');
    const bodyInput = container.querySelector('#noteBody');
    const newBtn = container.querySelector('#noteNew');
    const deleteBtn = container.querySelector('#noteDelete');

    const renderList = () => {
      if (notes.length === 0) {
        listEl.innerHTML = '<div style="text-align:center;padding:20px;color:var(--muted);font-size:0.84rem;">No notes yet</div>';
        titleInput.value = '';
        bodyInput.value = '';
        return;
      }
      listEl.innerHTML = notes.map(n => `
        <div class="notes-list-item ${n.id === activeNoteId ? 'active' : ''}" data-id="${n.id}">
          <div class="notes-list-title">${n.title || 'Untitled'}</div>
          <div class="notes-list-preview">${(n.body || '').slice(0, 40) || 'No additional text'}</div>
        </div>
      `).join('');

      listEl.querySelectorAll('.notes-list-item').forEach(el => {
        el.addEventListener('click', () => {
          activeNoteId = el.dataset.id;
          loadNote();
          renderList();
        });
      });
    };

    const loadNote = () => {
      const note = notes.find(n => n.id === activeNoteId);
      if (!note) return;
      titleInput.value = note.title || '';
      bodyInput.value = note.body || '';
    };

    const saveNote = () => {
      const note = notes.find(n => n.id === activeNoteId);
      if (!note) return;
      note.title = titleInput.value;
      note.body = bodyInput.value;
      note.modified = Date.now();
      OSStorage.saveNotes(notes);
      renderList();
    };

    titleInput.addEventListener('input', saveNote);
    bodyInput.addEventListener('input', saveNote);

    newBtn.addEventListener('click', () => {
      const newNote = {
        id: 'note_' + Date.now(),
        title: 'New Note',
        body: '',
        modified: Date.now()
      };
      notes.unshift(newNote);
      activeNoteId = newNote.id;
      OSStorage.saveNotes(notes);
      renderList();
      loadNote();
      titleInput.focus();
      titleInput.select();
    });

    deleteBtn.addEventListener('click', () => {
      if (!activeNoteId) return;
      if (!confirm('Delete this note?')) return;
      notes = notes.filter(n => n.id !== activeNoteId);
      activeNoteId = notes.length > 0 ? notes[0].id : null;
      OSStorage.saveNotes(notes);
      renderList();
      loadNote();
    });

    renderList();
    loadNote();
  }
});

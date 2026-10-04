



AppRegistry.register('mail', {
  name: 'Mail',
  iconBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  iconText: VeyraIcons.mail,

  render(container, win) {
    const emails = [
      { from: 'Veyra Team', subject: 'Welcome to VeyraOS Mail!', preview: 'Thank you for using VeyraOS. This is your built-in mail client...', time: '9:30 AM', unread: true, color: '#3b82f6' },
      { from: 'GitHub', subject: 'New repository created: VeyraOS', preview: 'A new repository has been created in your GitHub account...', time: '8:45 AM', unread: true, color: '#1a1a2e' },
      { from: 'Perplexity', subject: 'Your Computer session is ready', preview: 'Your VeyraOS preview has been deployed successfully...', time: 'Yesterday', unread: false, color: '#20b8cd' },
      { from: 'BBC News', subject: 'Daily briefing — September 30', preview: 'Your daily news summary is ready to read...', time: 'Yesterday', unread: false, color: '#bb1919' },
      { from: 'Veyra Server', subject: 'Server status: All systems operational', preview: 'Your Veyra server instance is running normally...', time: '2 days ago', unread: false, color: '#22c55e' },
      { from: 'App Store', subject: 'New apps available for VeyraOS', preview: 'Check out the latest apps in the App Store...', time: '3 days ago', unread: false, color: '#0a84ff' }
    ];

    let selectedEmail = 0;

    container.innerHTML = `
      <div class="app-root" style="height:100%;display:flex;flex-direction:column;">
        <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-bottom:0.5px solid var(--line);background:var(--titlebar-bg);">
          <button class="browser-nav-btn" id="mailCompose" title="New Email"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg></button>
          <button class="browser-nav-btn" id="mailRefresh" title="Refresh"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 11a8 8 0 1 0 .9 4.5M20 4v7h-7"/></svg></button>
          <input type="text" class="settings-search" id="mailSearch" placeholder="Search mail" style="flex:1;margin:0;">
        </div>
        <div style="flex:1;display:flex;overflow:hidden;">
          <div style="width:280px;flex-shrink:0;border-right:0.5px solid var(--line);overflow-y:auto;" id="mailList"></div>
          <div style="flex:1;overflow-y:auto;padding:24px;" id="mailDetail"></div>
        </div>
      </div>
    `;

    const listEl = container.querySelector('#mailList');
    const detailEl = container.querySelector('#mailDetail');
    const searchEl = container.querySelector('#mailSearch');

    const renderList = (filter = '') => {
      const filtered = emails.filter(e =>
        !filter || e.from.toLowerCase().includes(filter.toLowerCase()) ||
        e.subject.toLowerCase().includes(filter.toLowerCase()) ||
        e.preview.toLowerCase().includes(filter.toLowerCase())
      );

      if (filtered.length === 0) {
        listEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--muted);font-size:0.86rem;">No emails found</div>';
        return;
      }

      listEl.innerHTML = filtered.map((e, i) => `
        <div class="mail-list-item ${i === selectedEmail ? 'active' : ''}" data-idx="${i}" style="display:flex;gap:10px;padding:12px;border-bottom:0.5px solid var(--line);cursor:pointer;transition:background var(--t-fast);${i === selectedEmail ? 'background:var(--accent-soft);' : ''}">
          <div style="width:36px;height:36px;border-radius:50%;background:${e.color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.9rem;font-weight:700;flex-shrink:0;">${e.from[0]}</div>
          <div style="flex:1;overflow:hidden;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.84rem;font-weight:${e.unread ? '700' : '500'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.from}</span>
              <span style="font-size:0.72rem;color:var(--muted);flex-shrink:0;">${e.time}</span>
            </div>
            <div style="font-size:0.82rem;font-weight:${e.unread ? '600' : '400'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--text);">${e.subject}</div>
            <div style="font-size:0.76rem;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${e.preview}</div>
          </div>
          ${e.unread ? '<div style="width:8px;height:8px;border-radius:50%;background:var(--accent);flex-shrink:0;align-self:center;"></div>' : ''}
        </div>
      `).join('');

      listEl.querySelectorAll('.mail-list-item').forEach(el => {
        el.addEventListener('click', () => {
          selectedEmail = parseInt(el.dataset.idx);
          emails[selectedEmail].unread = false;
          renderList(searchEl.value);
          renderDetail();
        });
      });
    };

    const renderDetail = () => {
      const e = emails[selectedEmail];
      if (!e) {
        detailEl.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted);">Select an email to read</div>';
        return;
      }

      detailEl.innerHTML = `
        <div style="margin-bottom:20px;">
          <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:12px;">${e.subject}</h2>
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:44px;height:44px;border-radius:50%;background:${e.color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.1rem;font-weight:700;">${e.from[0]}</div>
            <div>
              <div style="font-weight:600;font-size:0.9rem;">${e.from}</div>
              <div style="font-size:0.78rem;color:var(--muted);">${e.time}</div>
            </div>
          </div>
        </div>
        <div style="font-size:0.9rem;line-height:1.7;color:var(--text-2);">
          <p>${e.preview}</p>
          <p style="margin-top:12px;">This is a demo email in VeyraOS Mail. In a full implementation, this would connect to your email provider via IMAP/SMTP or an API.</p>
          <p style="margin-top:12px;">For now, this shows the mail UI with sample messages. You can search, select, and read emails.</p>
        </div>
        <div style="margin-top:24px;display:flex;gap:8px;">
          <button class="btn primary sm">Reply</button>
          <button class="btn ghost sm">Forward</button>
          <button class="btn ghost sm">Delete</button>
        </div>
      `;
    };

    searchEl.addEventListener('input', () => renderList(searchEl.value));
    container.querySelector('#mailCompose').addEventListener('click', () => {
      Toast.show('Mail', 'New email composition is not yet available', '📧');
    });
    container.querySelector('#mailRefresh').addEventListener('click', () => {
      Toast.show('Mail', 'Inbox refreshed', '🔄');
      renderList(searchEl.value);
    });

    renderList();
    renderDetail();
  }
});

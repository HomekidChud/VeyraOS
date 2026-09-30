// ============================================
// VeyraOS App — Calendar
// ============================================

AppRegistry.register('calendar', {
  name: 'Calendar',
  iconBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
  iconText: VeyraIcons.calendar,

  render(container, win) {
    let viewDate = new Date();

    container.innerHTML = `
      <div class="app-root calendar-root">
        <div class="calendar-header">
          <div class="calendar-title" id="calTitle"></div>
          <div class="calendar-nav">
            <button class="browser-nav-btn" id="calPrev" title="Previous"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
            <button class="browser-nav-btn" id="calToday" title="Today" style="font-size:0.82rem;font-weight:600;width:auto;padding:0 12px;">Today</button>
            <button class="browser-nav-btn" id="calNext" title="Next"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
          </div>
        </div>
        <div class="calendar-grid" id="calGrid"></div>
      </div>
    `;

    const titleEl = container.querySelector('#calTitle');
    const gridEl = container.querySelector('#calGrid');

    const render = () => {
      const year = viewDate.getFullYear();
      const month = viewDate.getMonth();
      const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      titleEl.textContent = monthNames[month] + ' ' + year;

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      const prevMonthLast = new Date(year, month, 0).getDate();
      const today = new Date();

      const dayHeaders = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      let html = dayHeaders.map(d => `<div class="calendar-day-header">${d}</div>`).join('');

      // Previous month days
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        html += `<div class="calendar-cell other-month"><div class="calendar-cell-num">${prevMonthLast - i}</div></div>`;
      }

      // Current month days
      for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        html += `<div class="calendar-cell ${isToday ? 'today' : ''}"><div class="calendar-cell-num">${d}</div></div>`;
      }

      // Next month days
      const totalCells = startDayOfWeek + daysInMonth;
      const remaining = (7 - (totalCells % 7)) % 7;
      for (let d = 1; d <= remaining; d++) {
        html += `<div class="calendar-cell other-month"><div class="calendar-cell-num">${d}</div></div>`;
      }

      gridEl.innerHTML = html;
    };

    container.querySelector('#calPrev').addEventListener('click', () => {
      viewDate.setMonth(viewDate.getMonth() - 1);
      render();
    });

    container.querySelector('#calNext').addEventListener('click', () => {
      viewDate.setMonth(viewDate.getMonth() + 1);
      render();
    });

    container.querySelector('#calToday').addEventListener('click', () => {
      viewDate = new Date();
      render();
    });

    render();
  }
});

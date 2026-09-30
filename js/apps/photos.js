// ============================================
// VeyraOS App — Photos
// ============================================

AppRegistry.register('photos', {
  name: 'Photos',
  iconBg: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  iconText: '📷',

  render(container, win) {
    container.innerHTML = `
      <div class="app-root photos-root">
        <div class="photos-header">
          <h2>Photos</h2>
          <p style="color:var(--muted);font-size:0.86rem;margin-top:4px;">Your photo library</p>
        </div>
        <div class="photos-grid">
          ${[
            { emoji: '🌅', label: 'Sunset' },
            { emoji: '⛰️', label: 'Mountains' },
            { emoji: '🌊', label: 'Ocean' },
            { emoji: '🌲', label: 'Forest' },
            { emoji: '🏙️', label: 'City' },
            { emoji: '🌸', label: 'Cherry Blossom' },
            { emoji: '🏜️', label: 'Desert' },
            { emoji: '🌌', label: 'Galaxy' },
            { emoji: '🏞️', label: 'Lake' },
            { emoji: '🌳', label: 'Tree' },
            { emoji: '🦋', label: 'Butterfly' },
            { emoji: '❄️', label: 'Snow' }
          ].map((p, i) => `
            <div class="photos-item" data-idx="${i}" title="${p.label}" style="background:hsl(${i * 30}, 60%, 45%);">
              ${p.emoji}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.photos-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx);
        const items = container.querySelectorAll('.photos-item');
        const emoji = el.textContent.trim();
        Toast.show('Photos', 'Viewing: ' + el.title, emoji);
      });
    });
  }
});

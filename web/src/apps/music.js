



AppRegistry.register('music', {
  name: 'Music',
  iconBg: 'linear-gradient(135deg, #ec4899, #db2777)',
  iconText: VeyraIcons.music,

  render(container, win) {
    const tracks = [
      { title: 'Midnight City Lights', artist: 'Veyra Sounds', duration: '3:24', color: 'linear-gradient(135deg,#ec4899,#8b5cf6)' },
      { title: 'Ocean Waves', artist: 'Ambient Co', duration: '4:12', color: 'linear-gradient(135deg,#0ea5e9,#3b82f6)' },
      { title: 'Mountain Echo', artist: 'Nature Beats', duration: '5:03', color: 'linear-gradient(135deg,#22c55e,#16a34a)' },
      { title: 'Neon Dreams', artist: 'Synthwave', duration: '3:45', color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
      { title: 'Rainfall', artist: 'Calm Collective', duration: '6:20', color: 'linear-gradient(135deg,#6366f1,#3b82f6)' },
      { title: 'Forest Whispers', artist: 'Green Ambient', duration: '4:58', color: 'linear-gradient(135deg,#15803d,#22c55e)' }
    ];

    let currentTrack = 0;
    let isPlaying = false;

    container.innerHTML = `
      <div class="app-root music-root">
        <div class="music-main">
          <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:16px;">Library</h2>
          <div id="musicList">
            ${tracks.map((t, i) => `
              <div class="music-list-item ${i === 0 ? 'active' : ''}" data-idx="${i}">
                <div class="music-art" style="width:40px;height:40px;border-radius:8px;background:${t.color};display:flex;align-items:center;justify-content:center;font-size:1.2rem;">🎵</div>
                <div style="flex:1;">
                  <div style="font-size:0.88rem;font-weight:600;">${t.title}</div>
                  <div style="font-size:0.78rem;color:var(--muted);">${t.artist}</div>
                </div>
                <span style="font-size:0.78rem;color:var(--muted);">${t.duration}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="music-controls">
          <button class="music-btn" id="musicPrev"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M6 5v14M8 12l10 7V5z"/></svg></button>
          <button class="music-btn play" id="musicPlay"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13l10-6.5z"/></svg></button>
          <button class="music-btn" id="musicNext"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18 5v14M16 12L6 5v14z"/></svg></button>
        </div>
      </div>
    `;

    const playBtn = container.querySelector('#musicPlay');
    const list = container.querySelectorAll('.music-list-item');

    const updateNowPlaying = () => {
      list.forEach((el, i) => {
        el.classList.toggle('active', i === currentTrack);
        el.style.background = i === currentTrack ? 'var(--surface-hover)' : '';
      });
      const track = tracks[currentTrack];
      Toast.show('Now Playing', track.title + ' — ' + track.artist, '🎵');
    };

    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying
        ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
        : '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5.5v13l10-6.5z"/></svg>';
    });

    container.querySelector('#musicPrev').addEventListener('click', () => {
      currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
      updateNowPlaying();
    });

    container.querySelector('#musicNext').addEventListener('click', () => {
      currentTrack = (currentTrack + 1) % tracks.length;
      updateNowPlaying();
    });

    list.forEach(el => {
      el.addEventListener('click', () => {
        currentTrack = parseInt(el.dataset.idx);
        updateNowPlaying();
        if (!isPlaying) {
          isPlaying = true;
          playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
        }
      });
    });
  }
});

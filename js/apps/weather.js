// ============================================
// VeyraOS App — Weather
// Real weather data for user's location
// ============================================

AppRegistry.register('weather', {
  name: 'Weather',
  iconBg: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
  iconText: 'assets/icons/weather.svg',

  render(container, win) {
    const user = OSStorage.getUser();
    const location = 'Radyr, Wales';

    container.innerHTML = `
      <div class="app-root" style="height:100%;overflow-y:auto;background:linear-gradient(180deg, #0c4a6e 0%, #075985 50%, #0284c7 100%);">
        <div style="padding:32px 24px;color:#fff;text-align:center;">
          <h2 style="font-size:1.4rem;font-weight:500;margin-bottom:4px;">${location}</h2>
          <p style="font-size:0.8rem;opacity:0.7;" id="weatherTime"></p>
          <div style="font-size:5rem;font-weight:200;margin:16px 0;" id="weatherTemp">—°</div>
          <div style="font-size:1.1rem;font-weight:400;margin-bottom:4px;" id="weatherDesc">Loading...</div>
          <div style="font-size:0.82rem;opacity:0.7;" id="weatherRange">H: —° L: —°</div>
        </div>

        <div style="margin:0 16px 16px;background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;backdrop-filter:blur(20px);">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center;color:#fff;">
            <div>
              <div style="font-size:0.72rem;opacity:0.7;text-transform:uppercase;margin-bottom:4px;">Humidity</div>
              <div style="font-size:1.3rem;font-weight:300;" id="weatherHumidity">—%</div>
            </div>
            <div>
              <div style="font-size:0.72rem;opacity:0.7;text-transform:uppercase;margin-bottom:4px;">Wind</div>
              <div style="font-size:1.3rem;font-weight:300;" id="weatherWind">— km/h</div>
            </div>
            <div>
              <div style="font-size:0.72rem;opacity:0.7;text-transform:uppercase;margin-bottom:4px;">UV Index</div>
              <div style="font-size:1.3rem;font-weight:300;" id="weatherUV">—</div>
            </div>
          </div>
        </div>

        <div style="margin:0 16px 16px;background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;backdrop-filter:blur(20px);">
          <div style="font-size:0.72rem;opacity:0.7;text-transform:uppercase;color:#fff;margin-bottom:12px;">Hourly Forecast</div>
          <div id="weatherHourly" style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;"></div>
        </div>

        <div style="margin:0 16px 24px;background:rgba(255,255,255,0.1);border-radius:16px;padding:16px;backdrop-filter:blur(20px);">
          <div style="font-size:0.72rem;opacity:0.7;text-transform:uppercase;color:#fff;margin-bottom:12px;">7-Day Forecast</div>
          <div id="weatherDaily"></div>
        </div>
      </div>
    `;

    // Simulated weather data (in real impl would fetch from API)
    const conditions = ['Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny', 'Overcast', 'Clear'];
    const temps = [12, 13, 14, 15, 13, 12, 11];
    const icons = ['⛅', '☁️', '🌧️', '☀️', '☁️', '🌙'];
    const currentTemp = 14;
    const currentDesc = 'Partly Cloudy';
    const high = 16;
    const low = 9;

    // Update current weather
    container.querySelector('#weatherTemp').textContent = currentTemp + '°';
    container.querySelector('#weatherDesc').textContent = currentDesc;
    container.querySelector('#weatherRange').textContent = `H: ${high}°  L: ${low}°`;
    container.querySelector('#weatherHumidity').textContent = '78%';
    container.querySelector('#weatherWind').textContent = '12 km/h SW';
    container.querySelector('#weatherUV').textContent = '3';

    // Update time
    const updateTime = () => {
      const now = new Date();
      container.querySelector('#weatherTime').textContent = now.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long'
      });
    };
    updateTime();
    setInterval(updateTime, 60000);

    // Hourly forecast
    const hourlyEl = container.querySelector('#weatherHourly');
    const hours = [];
    for (let i = 0; i < 12; i++) {
      const h = new Date();
      h.setHours(h.getHours() + i);
      const temp = currentTemp + Math.round(Math.sin(i / 2) * 3);
      const icon = i < 6 ? '⛅' : i < 8 ? '🌧️' : i < 10 ? '☁️' : '🌙';
      hours.push({ time: h.getHours() + ':00', temp: temp + '°', icon });
    }

    hourlyEl.innerHTML = hours.map(h => `
      <div style="display:flex;flex-direction:column;align-items:center;gap:6px;min-width:50px;color:#fff;">
        <span style="font-size:0.72rem;opacity:0.7;">${h.time}</span>
        <span style="font-size:1.6rem;">${h.icon}</span>
        <span style="font-size:0.86rem;font-weight:500;">${h.temp}</span>
      </div>
    `).join('');

    // 7-day forecast
    const dailyEl = container.querySelector('#weatherDaily');
    const days = ['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'];
    const dayIcons = ['⛅', '🌧️', '☁️', '☀️', '⛅', '🌧️', '☁️'];

    dailyEl.innerHTML = days.map((day, i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:0.5px solid rgba(255,255,255,0.1);color:#fff;">
        <span style="font-size:0.86rem;width:50px;">${day}</span>
        <span style="font-size:1.4rem;">${dayIcons[i]}</span>
        <span style="font-size:0.86rem;color:rgba(255,255,255,0.5);">${low + i}°</span>
        <div style="flex:1;height:4px;background:rgba(255,255,255,0.1);border-radius:2px;margin:0 12px;position:relative;">
          <div style="position:absolute;left:${i*5}%;right:${(7-i)*5}%;height:100%;background:linear-gradient(90deg,#0ea5e9,#fbbf24);border-radius:2px;"></div>
        </div>
        <span style="font-size:0.86rem;">${high + i}°</span>
      </div>
    `).join('');
  }
});





const ControlCenter = {
  init() {
    
    const ccWifi = document.getElementById('ccWifi');
    ccWifi.classList.add('active');
    ccWifi.addEventListener('click', () => {
      ccWifi.classList.toggle('active');
      const status = document.getElementById('ccWifiStatus');
      status.textContent = ccWifi.classList.contains('active') ? 'Home Network' : 'Off';
    });

    
    const ccBt = document.getElementById('ccBluetooth');
    ccBt.classList.add('active');
    ccBt.addEventListener('click', () => {
      ccBt.classList.toggle('active');
      const span = ccBt.querySelector('span:last-child');
      span.textContent = ccBt.classList.contains('active') ? 'On' : 'Off';
    });

    
    document.getElementById('ccAirDrop').addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('active');
    });

    
    document.getElementById('ccFocus').addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('active');
      Toast.show('Focus', e.currentTarget.classList.contains('active') ? 'Focus mode on — notifications silenced' : 'Focus mode off', '🌙');
    });

    
    const brightness = document.getElementById('ccBrightness');
    brightness.addEventListener('input', () => {
      const val = brightness.value / 100;
      document.getElementById('desktop').style.filter = `brightness(${val})`;
    });

    
    const volume = document.getElementById('ccVolume');
    volume.addEventListener('input', () => {
      
      const val = volume.value;
      Toast.show('Volume', `${val}%`, '🔊');
    });

    
    const darkBtn = document.getElementById('ccDarkMode');
    darkBtn.classList.add('active');
    darkBtn.addEventListener('click', () => {
      darkBtn.classList.toggle('active');
      const isDark = darkBtn.classList.contains('active');
      document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
      document.getElementById('ccDarkStatus').textContent = isDark ? 'On' : 'Off';

      const user = OSStorage.getUser();
      user.theme = isDark ? 'dark' : 'light';
      OSStorage.saveUser(user);
    });
  }
};

window.ControlCenter = ControlCenter;

// ============================================
// VeyraOS App — Terminal
// ============================================

AppRegistry.register('terminal', {
  name: 'Terminal',
  iconBg: 'linear-gradient(135deg, #1a1a2e, #0f0f1e)',
  iconText: VeyraIcons.terminal,

  render(container, win) {
    container.innerHTML = `
      <div class="app-root terminal-root" id="terminalRoot">
        <div class="terminal-line terminal-output">VeyraOS Terminal v1.0</div>
        <div class="terminal-line terminal-output">Type 'help' for available commands.</div>
        <div class="terminal-line terminal-output">Type 'about' for system info.</div>
        <div class="terminal-line terminal-output">&nbsp;</div>
        <div id="terminalOutput"></div>
        <div class="terminal-input-line">
          <span class="terminal-prompt">veyra@macbook ~ %</span>
          <input type="text" class="terminal-input" id="terminalInput" autocomplete="off" spellcheck="false">
        </div>
      </div>
    `;

    const root = container.querySelector('#terminalRoot');
    const output = container.querySelector('#terminalOutput');
    const input = container.querySelector('#terminalInput');

    const commands = {
      help: () => {
        return [
          'Available commands:',
          '  help       — Show this help message',
          '  about      — System information',
          '  ls         — List files in current directory',
          '  pwd        — Print working directory',
          '  date       — Show current date and time',
          '  whoami     — Show current user',
          '  echo       — Print text (echo hello)',
          '  clear      — Clear the terminal',
          '  apps       — List installed applications',
          '  open       — Open an app (open settings)',
          '  weather    — Show weather for Radyr, Wales',
          '  neofetch   — Show system info in style',
          '  veyra      — About VeyraOS',
          '  history    — Show command history'
        ];
      },
      about: () => {
        return [
          'VeyraOS v1.0 (Build 2026.1)',
          'Kernel: Veyra Kernel 1.0',
          'Shell: veyra-sh 1.0',
          'Uptime: ' + Math.floor(performance.now() / 1000) + 's',
          'Resolution: ' + window.innerWidth + 'x' + window.innerHeight
        ];
      },
      ls: () => {
        const files = OSStorage.getFiles();
        const result = [];
        Object.keys(files).forEach(folder => {
          result.push(folder + '/');
        });
        return result;
      },
      pwd: () => ['/home/veyra'],
      date: () => [new Date().toString()],
      whoami: () => ['veyra'],
      clear: () => { output.innerHTML = ''; return null; },
      apps: () => {
        const result = ['Installed Applications:'];
        Object.entries(AppRegistry.getAll()).forEach(([id, app]) => {
          result.push('  ' + app.name + ' (' + id + ')');
        });
        return result;
      },
      weather: () => {
        return [
          'Weather for Radyr, Wales, GB',
          '  Temperature: 14°C',
          '  Condition: Partly Cloudy',
          '  Humidity: 78%',
          '  Wind: 12 km/h SW'
        ];
      },
      neofetch: () => {
        return [
          '       ____         veyra@macbook',
          '      /    \\        ---------------',
          '     | VYRA |       OS: VeyraOS v1.0',
          '     |  OS  |       Kernel: 1.0',
          '      \\____/        Shell: veyra-sh',
          '                   Uptime: ' + Math.floor(performance.now() / 1000) + 's',
          '                   Resolution: ' + window.innerWidth + 'x' + window.innerHeight,
          '                   Theme: ' + (document.documentElement.dataset.theme || 'dark'),
          '                   CPU: Veyra M1',
          '                   Memory: 16 GB'
        ];
      },
      veyra: () => {
        return [
          'VeyraOS — A web-based operating system',
          'Built on top of the Veyra browser project.',
          'GitHub: HomekidChud/VeyraOS',
          '',
          'A macOS-style desktop environment running entirely in your browser.'
        ];
      },
      echo: (args) => [args.join(' ')],
      open: (args) => {
        const appId = args[0];
        if (AppRegistry.get(appId)) {
          WindowManager.open(appId);
          return ['Opening ' + appId + '...'];
        }
        return ['Error: Unknown app "' + appId + '". Type "apps" to see available apps.'];
      }
    };

    const history = [];
    let historyIdx = -1;

    const printLine = (text) => {
      const line = document.createElement('div');
      line.className = 'terminal-line terminal-output';
      line.textContent = text;
      output.appendChild(line);
      root.scrollTop = root.scrollHeight;
    };

    const printPrompt = (cmd) => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      line.innerHTML = '<span class="terminal-prompt">veyra@macbook ~ %</span> ' + cmd;
      output.appendChild(line);
      root.scrollTop = root.scrollHeight;
    };

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim();
        input.value = '';

        if (cmd) {
          history.push(cmd);
          historyIdx = history.length;
          printPrompt(cmd);

          const parts = cmd.split(/\s+/);
          const cmdName = parts[0].toLowerCase();
          const args = parts.slice(1);

          const handler = commands[cmdName];
          if (handler) {
            const result = handler(args);
            if (result) {
              result.forEach(printLine);
            }
          } else {
            printLine('zsh: command not found: ' + cmdName);
            printLine('Type "help" for available commands.');
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIdx > 0) {
          historyIdx--;
          input.value = history[historyIdx];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIdx < history.length - 1) {
          historyIdx++;
          input.value = history[historyIdx];
        } else {
          historyIdx = history.length;
          input.value = '';
        }
      }
    });

    setTimeout(() => input.focus(), 100);
    root.addEventListener('click', () => input.focus());
  }
});

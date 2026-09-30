# VeyraOS

A web-based operating system with a macOS-style desktop experience, built on top of the Veyra browser project.

## Features

- **macOS-style desktop** — Menu bar, dock, desktop icons, and a beautiful boot sequence
- **Window Manager** — Draggable, resizable, minimizable, and maximizable windows
- **Spotlight Search** — Press `Cmd+Space` / `Ctrl+Space` to search apps and actions
- **Control Center** — Toggle Wi-Fi, Bluetooth, Dark Mode, brightness, and volume
- **Dark & Light themes** — With customizable accent colors and wallpapers
- **Apps included:**
  - **Finder** — File browser with virtual filesystem
  - **Veyra Browser** — Web browser with start page, shortcuts, and navigation
  - **Settings** — Appearance, wallpaper, dock, network, sound, storage, about
  - **Calculator** — Full calculator with keyboard support
  - **Text Editor** — With font/size options, word count, and file save/open
  - **Terminal** — With commands: help, ls, neofetch, weather, open, and more
  - **Photos** — Photo gallery
  - **Music** — Music player with track library
  - **Notes** — Note-taking app with local persistence
  - **Calendar** — Monthly calendar view
  - **App Store** — Browse and install apps

## Keyboard Shortcuts

| Action | Keys |
| --- | --- |
| Spotlight Search | Cmd+Space / Ctrl+Space |
| Close active window | Cmd+W / Ctrl+W |
| Quit active app | Cmd+Q / Ctrl+Q |
| Minimize window | Cmd+M / Ctrl+M |
| Double-click titlebar | Maximize/Restore |

## Architecture

```
VeyraOS/
├── index.html          # Main OS shell
├── css/
│   ├── os.css          # Design system, themes, boot/login
│   ├── menubar.css     # Top menu bar and dropdowns
│   ├── dock.css        # Bottom dock
│   ├── windows.css     # Window manager styles
│   └── apps.css        # All application styles
├── js/
│   ├── storage.js      # LocalStorage wrapper & virtual filesystem
│   ├── wm.js           # Window manager & app registry
│   ├── dock.js         # Dock rendering & app launching
│   ├── menubar.js      # Menu bar, clock, apple menu
│   ├── spotlight.js    # Spotlight search
│   ├── controlcenter.js # Control center toggles
│   ├── desktop.js      # Desktop icons & context menu
│   ├── boot.js         # Boot sequence & global shortcuts
│   └── apps/
│       ├── finder.js
│       ├── browser.js
│       ├── settings.js
│       ├── calculator.js
│       ├── texteditor.js
│       ├── terminal.js
│       ├── photos.js
│       ├── music.js
│       ├── notes.js
│       ├── calendars.js
│       └── appstore.js
└── assets/
    └── favicon.svg
```

## Deployment

This is a static site — no build step needed. Push to GitHub Pages or any static host.

## Related Repositories

- [VeyraBrowser](https://github.com/HomekidChud/VeyraBrowser) — The original Veyra browser frontend
- [VeyraServer](https://github.com/HomekidChud/VeyraServer) — The Veyra server backend
- [VeyraBrowserBackup](https://github.com/HomekidChud/VeyraBrowserBackup) — Backup of browser frontend
- [VeyraServerBackup](https://github.com/HomekidChud/VeyraServerBackup) — Backup of server backend

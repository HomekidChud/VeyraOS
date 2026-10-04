# Project structure

| Directory | Responsibility |
| --- | --- |
| `web/` | Static VeyraOS application served by GitHub Pages and copied into Android. |
| `web/src/config/` | Deployment-safe Veyra API configuration. |
| `web/src/core/` | OS shell, storage, window manager, device support, and system services. |
| `web/src/apps/` | Individual VeyraOS applications, including the Veyra API browser. |
| `web/styles/` | OS design-system, desktop, window, and application styles. |
| `web/assets/` | OS icons and image assets. |
| `scripts/` | Source validation tools. |
| `android/` | Capacitor-generated Android project after `npm run sync`. |

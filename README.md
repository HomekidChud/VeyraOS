# VeyraOS

VeyraOS is a web operating system with an Android wrapper. Its Veyra Browser app creates a Veyra session and loads pages through the Veyra Server API; it no longer falls back to third-party proxy services.

## Development

```bash
npm install
npm run check
npm run sync
```

The static app lives in `web/`. Capacitor copies the same directory into Android.

## GitHub Pages

`.github/workflows/pages.yml` deploys `web/` after GitHub Pages is enabled for the repository. Select **GitHub Actions** under **Settings → Pages**, then set the repository Actions variable `VEYRA_PAGES_ENABLED` to `true` to enable the guarded deployment job.

## Android

```bash
npm run apk:debug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

## API configuration

Set the `veyra-api` metadata in `web/index.html` to an HTTPS Veyra Server origin. The default is `https://veyraserver-xscy.onrender.com`.

## Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md).

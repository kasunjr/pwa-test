# Simple Audio & Print PWA

This PWA talks to the companion Chrome extension via `window.postMessage`. It exposes simple controls to:
- List audio output devices
- Switch audio output
- Set volume / mute
- Print a PNG image

> Note: Audio device control uses `chrome.audio` which works **only on ChromeOS** and **requires kiosk mode**. Printing uses `chrome.printing` which works only on ChromeOS.

## Run locally
1. Serve the `pwa-audio-print` folder over HTTP(S). For a quick test:
   ```bash
   npx http-server -p 8080 .
   ```
2. Open `http://localhost:8080` in ChromeOS with the extension installed.
3. Click **Install app** to add as PWA (optional).
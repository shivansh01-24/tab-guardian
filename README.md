# Tab Guardian - 3D Cartoon Tab Closer Extension

An anti-distraction Chrome extension (Manifest V3) where animated 3D cartoon characters walk onto the screen whenever you open a blocked site (like Instagram or YouTube Shorts), display a speech bubble saying **"Be a good person, close that tab!"**, stomp a glowing red `[X]` cross button, vanish off-screen, and automatically close the tab.

---

## Features

- **3 Animated 3D Mascots (Procedural WebGL / Three.js)**:
  - 🤖 **Guardian Robot**: Glowing amber visor, chest display, animated antenna, and articulated limbs.
  - 🕵️ **Chibi Detective**: Cute fedora hat with ribbon band, golden badge, and caramel trench coat.
  - 🐱 **Wise Cartoon Cat**: Playful ginger cat with cyan eyes, perky pink inner ears, collar bell, and swinging tail.
- **Dynamic Choreography (~5s Total)**:
  1. **Walk In**: Mascot walks in from the left edge of the screen onto a dimmed, blurred backdrop.
  2. **Speech Bubble**: Pops up a speech bubble: *"Be a good person, close that tab!"* (text-only, no annoying audio).
  3. **Stomp [X] Button**: Mascot walks over to a glowing red cross button, winds up its arm, and stomps it (triggering green status & shockwave ripples).
  4. **Exit & Vanish**: Mascot scurries off-screen to the right and fades away.
  5. **Auto Tab Closure**: The tab is closed automatically via the background service worker.
- **Instant Manual Dismiss**: You can click the glowing red `[X]` button at any point to close the tab immediately.
- **SPA Detection**: Intercepts in-app navigation like YouTube Shorts (`youtube.com/shorts/*`) and Instagram Reels without requiring full page reloads.
- **Settings Popup**:
  - Master protection toggle.
  - Quick presets: Instagram, YouTube Shorts, TikTok.
  - Custom blocklist manager: Add/remove any domain or URL pattern.
  - Mascot selector: Choose a specific character or cycle randomly.
  - **Test Mascot Preview**: Trigger the 3D intervention anytime to test it out.

---

## How to Install in Chrome

1. Open Google Chrome and go to: `chrome://extensions/`
2. Enable **"Developer mode"** via the toggle switch in the top-right corner.
3. Click **"Load unpacked"** in the top-left corner.
4. Select the folder:
   `D:\noor\tab-guardian-extension`
5. Pin **Tab Guardian** to your Chrome toolbar.

---

## Interactive Playground (No Install Required to Test)

Double-click `test-demo.html` in `D:\noor\tab-guardian-extension\test-demo.html` to open the playground in any browser and test all 3 characters and animations with zero setup.

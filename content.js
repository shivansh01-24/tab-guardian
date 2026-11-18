/**
 * Tab Guardian - Content Script
 * Injects the 3D cartoon stage, handles walk-in choreography, speech bubble,
 * button stomp interaction, and automatic tab closure.
 */

(function () {
  'use strict';

  // Prevent double injection
  if (window.__TAB_GUARDIAN_INJECTED__) return;
  window.__TAB_GUARDIAN_INJECTED__ = true;

  let activeStage = null;
  let isIntervening = false;

  const DEFAULT_SETTINGS = {
    enabled: true,
    blockedUrls: ["instagram.com", "youtube.com/shorts"],
    selectedMascot: "random",
    countdownSeconds: 10,
    messages: [
      "Be a good person, close that tab!",
      "No doomscrolling! Close this tab and stay focused.",
      "Future you will thank you! Closing tab now.",
      "Be a good person! You have bigger dreams than this."
    ]
  };

  function isUrlBlocked(url, blockedUrls) {
    if (!url) return false;
    const cleanUrl = url.toLowerCase();
    return blockedUrls.some((pattern) => {
      const cleanPattern = pattern.trim().toLowerCase();
      if (!cleanPattern) return false;
      return cleanUrl.includes(cleanPattern);
    });
  }

  function getSettings(callback) {
    chrome.storage.local.get("guardianSettings", (res) => {
      callback(res.guardianSettings || DEFAULT_SETTINGS);
    });
  }

  function triggerTabClosure() {
    try {
      chrome.runtime.sendMessage({ action: "CLOSE_ACTIVE_TAB" });
    } catch (e) {
      console.warn("[Tab Guardian] Failed to send tab closure request:", e);
    }
  }

  function startIntervention(settings, forceMascot) {
    if (isIntervening) return;
    isIntervening = true;

    // Remove existing overlay if any
    const existing = document.getElementById("tab-guardian-root");
    if (existing) existing.remove();

    // Create root container
    const root = document.createElement("div");
    root.id = "tab-guardian-root";

    // Random message
    const msgList = settings.messages && settings.messages.length ? settings.messages : DEFAULT_SETTINGS.messages;
    const chosenMessage = msgList[Math.floor(Math.random() * msgList.length)];

    // Target mascot
    const mascotChoice = forceMascot || settings.selectedMascot || "random";

    // Timer initial value
    let remainingTime = settings.countdownSeconds || 5;

    root.innerHTML = `
      <div class="tg-header-badge">
        <div class="tg-header-icon">✕</div>
        <span class="tg-header-text">Blocked Site Detected</span>
        <span class="tg-header-timer" id="tg-timer-display">${remainingTime}s</span>
      </div>

      <div class="tg-stage-container">
        <div class="tg-ground-line"></div>
        <div class="tg-canvas-holder" id="tg-canvas-holder"></div>

        <div class="tg-speech-bubble" id="tg-speech-bubble">
          <span class="tg-speech-title">${chosenMessage}</span>
          <span class="tg-speech-sub">Focus on what matters. Closing this tab...</span>
        </div>

        <button class="tg-cross-button" id="tg-cross-btn" title="Click to close tab immediately">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          <span class="tg-cross-label" id="tg-btn-label">CLOSE</span>
          <div class="tg-shockwave" id="tg-shockwave"></div>
        </button>
      </div>
    `;

    document.documentElement.appendChild(root);

    // Fade in
    requestAnimationFrame(() => {
      root.classList.add("tg-visible");
    });

    const canvasHolder = document.getElementById("tg-canvas-holder");
    const speechBubble = document.getElementById("tg-speech-bubble");
    const crossBtn = document.getElementById("tg-cross-btn");
    const shockwave = document.getElementById("tg-shockwave");
    const btnLabel = document.getElementById("tg-btn-label");
    const timerDisplay = document.getElementById("tg-timer-display");

    // Countdown interval
    const countdownInterval = setInterval(() => {
      remainingTime--;
      if (timerDisplay) {
        timerDisplay.textContent = Math.max(0, remainingTime) + "s";
      }
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);

    // Manual click on the [X] button
    crossBtn.addEventListener("click", () => {
      crossBtn.classList.add("tg-stomped");
      shockwave.classList.add("tg-fire-shockwave");
      btnLabel.textContent = "CLOSING!";
      clearInterval(countdownInterval);
      setTimeout(triggerTabClosure, 300);
    });

    // Initialize 3D Engine
    try {
      if (window.TabGuardian3D && window.THREE) {
        activeStage = new window.TabGuardian3D.MascotStage(canvasHolder);
        const mascot = activeStage.loadMascot(mascotChoice);
        activeStage.start();

        activeStage.runChoreography({
          onSpeechStart: () => {
            if (speechBubble) speechBubble.classList.add("tg-bubble-show");
          },
          onSpeechEnd: () => {
            if (speechBubble) speechBubble.classList.remove("tg-bubble-show");
          },
          onButtonClick: () => {
            if (crossBtn) crossBtn.classList.add("tg-stomped");
            if (shockwave) shockwave.classList.add("tg-fire-shockwave");
            if (btnLabel) btnLabel.textContent = "DONE!";
          },
          onFadeOut: (opacity) => {
            root.style.opacity = opacity;
          },
          onComplete: () => {
            clearInterval(countdownInterval);
            if (activeStage) activeStage.destroy();
            triggerTabClosure();
          }
        });
      } else {
        // Fallback if WebGL/Three.js not available
        setTimeout(triggerTabClosure, 3500);
      }
    } catch (err) {
      console.error("[Tab Guardian] 3D Stage Error:", err);
      setTimeout(triggerTabClosure, 4000);
    }
  }

  function checkAndTrigger(forceMascot) {
    getSettings((settings) => {
      if (!settings.enabled) return;
      const currentUrl = window.location.href;
      if (isUrlBlocked(currentUrl, settings.blockedUrls)) {
        startIntervention(settings, forceMascot);
      }
    });
  }

  // Initial check on page load
  checkAndTrigger();

  // YouTube SPA navigation events
  window.addEventListener("yt-navigate-finish", () => {
    checkAndTrigger();
  });

  // History & URL changes
  window.addEventListener("popstate", () => {
    checkAndTrigger();
  });

  // Messages from background or popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "TRIGGER_INTERVENTION") {
      getSettings((settings) => {
        const mergedSettings = request.settings || settings;
        if (request.force || isUrlBlocked(window.location.href, mergedSettings.blockedUrls)) {
          startIntervention(mergedSettings, request.mascot || mergedSettings.selectedMascot);
          sendResponse({ started: true });
        } else {
          sendResponse({ started: false, reason: "URL not blocked" });
        }
      });
      return true;
    }
  });

})();

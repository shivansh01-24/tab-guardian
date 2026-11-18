/**
 * Tab Guardian - Background Service Worker
 * Manages settings, SPA navigation detection, and tab removal.
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  blockedUrls: [
    "instagram.com",
    "youtube.com/shorts"
  ],
  selectedMascot: "random", // "random" | "robot" | "detective" | "cat"
  countdownSeconds: 10,
  messages: [
    "Be a good person, close that tab!",
    "No doomscrolling! Close this tab and stay focused.",
    "Future you will thank you! Closing tab now.",
    "Be a good person! You have bigger dreams than this."
  ]
};

// Initialize settings on installation
chrome.runtime.onInstalled.addListener(async (details) => {
  const current = await chrome.storage.local.get("guardianSettings");
  if (!current.guardianSettings) {
    await chrome.storage.local.set({ guardianSettings: DEFAULT_SETTINGS });
    console.log("[Tab Guardian] Default settings initialized.");
  }
});

// Helper: Check if a URL matches any blocked pattern
function isUrlBlocked(url, blockedUrls) {
  if (!url) return false;
  const cleanUrl = url.toLowerCase();
  return blockedUrls.some(pattern => {
    const cleanPattern = pattern.trim().toLowerCase();
    if (!cleanPattern) return false;
    return cleanUrl.includes(cleanPattern);
  });
}

// Listen for tab URL updates (handles standard page loads and SPAs)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url || (!changeInfo.url && changeInfo.status !== "complete")) return;

  const data = await chrome.storage.local.get("guardianSettings");
  const settings = data.guardianSettings || DEFAULT_SETTINGS;
  if (!settings.enabled) return;

  if (isUrlBlocked(tab.url, settings.blockedUrls)) {
    try {
      await chrome.tabs.sendMessage(tabId, {
        action: "TRIGGER_INTERVENTION",
        url: tab.url,
        settings: settings
      });
    } catch (e) {
      // Content script may still be loading or tab not ready yet
    }
  }
});

// SPA Navigation listener (e.g. YouTube Shorts client-side router)
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  if (details.frameId !== 0) return; // Only main frame

  const data = await chrome.storage.local.get("guardianSettings");
  const settings = data.guardianSettings || DEFAULT_SETTINGS;
  if (!settings.enabled) return;

  if (isUrlBlocked(details.url, settings.blockedUrls)) {
    try {
      await chrome.tabs.sendMessage(details.tabId, {
        action: "TRIGGER_INTERVENTION",
        url: details.url,
        settings: settings
      });
    } catch (e) {
      // Tab may not be ready
    }
  }
});

// Message listener for tab closure and preview requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CLOSE_ACTIVE_TAB") {
    const targetTabId = (sender.tab && sender.tab.id) || request.tabId;
    if (targetTabId) {
      chrome.tabs.remove(targetTabId)
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true; // async response
    }
  }

  if (request.action === "GET_SETTINGS") {
    chrome.storage.local.get("guardianSettings").then((res) => {
      sendResponse(res.guardianSettings || DEFAULT_SETTINGS);
    });
    return true;
  }

  if (request.action === "TRIGGER_PREVIEW_ON_ACTIVE_TAB") {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([activeTab]) => {
      if (activeTab && activeTab.id) {
        chrome.storage.local.get("guardianSettings").then((res) => {
          const settings = res.guardianSettings || DEFAULT_SETTINGS;
          chrome.tabs.sendMessage(activeTab.id, {
            action: "TRIGGER_INTERVENTION",
            force: true,
            settings: {
              ...settings,
              selectedMascot: request.mascot || settings.selectedMascot
            }
          }).then(() => sendResponse({ success: true }))
            .catch(err => sendResponse({ success: false, error: err.message }));
        });
      }
    });
    return true;
  }
});

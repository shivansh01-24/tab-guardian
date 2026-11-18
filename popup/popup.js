/**
 * Tab Guardian - Popup Script
 * Manages user settings, blocklist entries, mascot choices, and live test triggers.
 */

document.addEventListener('DOMContentLoaded', () => {
  const masterToggle = document.getElementById('master-toggle');
  const mascotRadios = document.querySelectorAll('input[name="mascot"]');
  const presetCheckboxes = document.querySelectorAll('.preset-checkbox');
  const addUrlForm = document.getElementById('add-url-form');
  const newUrlInput = document.getElementById('new-url-input');
  const blockedUrlsList = document.getElementById('blocked-urls-list');
  const testPreviewBtn = document.getElementById('test-preview-btn');
  const statusMsg = document.getElementById('status-msg');

  let currentSettings = {
    enabled: true,
    blockedUrls: ['instagram.com', 'youtube.com/shorts'],
    selectedMascot: 'random',
    countdownSeconds: 10,
    messages: [
      "Be a good person, close that tab!",
      "No doomscrolling! Close this tab and stay focused.",
      "Future you will thank you! Closing tab now.",
      "Be a good person! You have bigger dreams than this."
    ]
  };

  function setStatus(text, color = '#10b981') {
    if (statusMsg) {
      statusMsg.textContent = text;
      statusMsg.style.color = color;
    }
  }

  function cleanUrlPattern(url) {
    return url.trim()
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .replace(/\/+$/, '')
      .toLowerCase();
  }

  function renderUrls() {
    blockedUrlsList.innerHTML = '';
    const presetPatterns = Array.from(presetCheckboxes).map(cb => cb.dataset.pattern);

    // Filter for custom URLs not represented by presets
    const customUrls = currentSettings.blockedUrls.filter(u => !presetPatterns.includes(u));

    if (customUrls.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'url-item';
      emptyLi.style.justifyContent = 'center';
      emptyLi.style.color = '#64748b';
      emptyLi.textContent = 'No custom URLs added yet.';
      blockedUrlsList.appendChild(emptyLi);
      return;
    }

    customUrls.forEach(url => {
      const li = document.createElement('li');
      li.className = 'url-item';

      const span = document.createElement('span');
      span.className = 'url-item-text';
      span.textContent = url;

      const delBtn = document.createElement('button');
      delBtn.className = 'url-item-delete';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Remove URL';
      delBtn.addEventListener('click', () => {
        currentSettings.blockedUrls = currentSettings.blockedUrls.filter(u => u !== url);
        saveSettings();
        renderUrls();
        setStatus('URL removed');
      });

      li.appendChild(span);
      li.appendChild(delBtn);
      blockedUrlsList.appendChild(li);
    });
  }

  function syncUI() {
    masterToggle.checked = !!currentSettings.enabled;

    // Mascots
    const activeMascot = currentSettings.selectedMascot || 'random';
    mascotRadios.forEach(radio => {
      radio.checked = (radio.value === activeMascot);
    });

    // Presets
    presetCheckboxes.forEach(cb => {
      const pattern = cb.dataset.pattern;
      cb.checked = currentSettings.blockedUrls.some(u => u.toLowerCase() === pattern.toLowerCase());
    });

    // Custom list
    renderUrls();

    if (!currentSettings.enabled) {
      setStatus('Protection is Paused', '#94a3b8');
    } else {
      setStatus('Protected & Active', '#10b981');
    }
  }

  function saveSettings() {
    chrome.storage.local.set({ guardianSettings: currentSettings }, () => {
      console.log('[Tab Guardian] Settings saved:', currentSettings);
    });
  }

  // Load saved settings
  chrome.storage.local.get('guardianSettings', (res) => {
    if (res.guardianSettings) {
      currentSettings = { ...currentSettings, ...res.guardianSettings };
    }
    syncUI();
  });

  // Master toggle
  masterToggle.addEventListener('change', () => {
    currentSettings.enabled = masterToggle.checked;
    saveSettings();
    syncUI();
  });

  // Mascot selection
  mascotRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        currentSettings.selectedMascot = radio.value;
        saveSettings();
        setStatus(`Mascot set to ${radio.value.toUpperCase()}`);
      }
    });
  });

  // Preset checkboxes
  presetCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const pattern = cb.dataset.pattern;
      if (cb.checked) {
        if (!currentSettings.blockedUrls.includes(pattern)) {
          currentSettings.blockedUrls.push(pattern);
        }
      } else {
        currentSettings.blockedUrls = currentSettings.blockedUrls.filter(u => u !== pattern);
      }
      saveSettings();
      syncUI();
      setStatus(`Updated presets`);
    });
  });

  // Add custom URL
  addUrlForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawVal = newUrlInput.value;
    const clean = cleanUrlPattern(rawVal);
    if (!clean) return;

    if (!currentSettings.blockedUrls.includes(clean)) {
      currentSettings.blockedUrls.push(clean);
      saveSettings();
      syncUI();
      setStatus(`Blocked: ${clean}`);
      newUrlInput.value = '';
    } else {
      setStatus('URL already blocked', '#f59e0b');
    }
  });

  // Test Mascot Preview on active tab
  testPreviewBtn.addEventListener('click', () => {
    const chosenMascot = currentSettings.selectedMascot || 'random';
    setStatus('Launching 3D Mascot Preview...', '#38bdf8');

    chrome.runtime.sendMessage({
      action: 'TRIGGER_PREVIEW_ON_ACTIVE_TAB',
      mascot: chosenMascot
    }, (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
        const err = (chrome.runtime.lastError && chrome.runtime.lastError.message) || (response && response.error) || 'Failed to trigger';
        setStatus('Open a web page to preview!', '#f59e0b');
      } else {
        setStatus('Mascot is on your screen! 🎉');
      }
    });
  });
});

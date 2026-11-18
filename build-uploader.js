const fs = require('fs');
const path = require('path');

const b64 = fs.readFileSync(path.join(__dirname, 'video-b64.txt'), 'utf8');

const code = `(() => {
  const b64 = "${b64}";
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'video/mp4' });
  const file = new File([blob], 'tab-guardian-demo.mp4', { type: 'video/mp4' });

  const dt = new DataTransfer();
  dt.items.add(file);

  const input = document.querySelector('input[type="file"]');
  if (!input) return { success: false, reason: 'no input found' };

  input.files = dt.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  return { success: true, fileSize: file.size };
})()`;

fs.writeFileSync(path.join(__dirname, 'upload-script.js'), code);
console.log('upload-script.js generated successfully');

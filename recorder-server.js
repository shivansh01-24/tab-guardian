const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 9876;
const BASE_DIR = path.resolve(__dirname);

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/save-video') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const webmPath = path.join(BASE_DIR, 'tab-guardian-demo.webm');
      const mp4Path = path.join(BASE_DIR, 'tab-guardian-demo.mp4');
      const gifPath = path.join(BASE_DIR, 'tab-guardian-demo.gif');

      fs.writeFileSync(webmPath, buffer);
      console.log(`[Recorder Server] Saved WebM video (${buffer.length} bytes).`);

      try {
        console.log('[Recorder Server] Converting WebM to MP4 via ffmpeg...');
        execSync(`ffmpeg -y -i "${webmPath}" -c:v libx264 -preset fast -pix_fmt yuv420p "${mp4Path}"`, { stdio: 'inherit' });
        console.log('[Recorder Server] MP4 created successfully!');

        console.log('[Recorder Server] Generating animated GIF...');
        execSync(`ffmpeg -y -i "${mp4Path}" -vf "fps=12,scale=640:-1:flags=lanczos" "${gifPath}"`, { stdio: 'inherit' });
        console.log('[Recorder Server] GIF created successfully!');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Video and GIF generated successfully!' }));
      } catch (err) {
        console.error('[Recorder Server] FFmpeg conversion failed:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static file serving with CORS
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/record-video.html';
  const filePath = path.join(BASE_DIR, reqPath);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`[Recorder Server] Running on http://localhost:${PORT}`);
});

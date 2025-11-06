import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');

// Route to HTML file mapping
const routeMap = {
  '/stopwatch': 'stopwatch.html',
  '/todo': 'todo.html',
  '/temp': 'temp.html',
  '/expense': 'expense.html',
};

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webm': 'video/webm',
  '.weba': 'audio/webp',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  const url = new URL(`http://localhost${req.url}`);
  let filePath = path.join(distDir, url.pathname === '/' ? 'index.html' : url.pathname);

  // Check if the pathname has a file extension
  const hasExtension = path.extname(url.pathname).length > 0;
  
  // If it's a known route without an extension, serve the corresponding HTML file
  if (!hasExtension && url.pathname !== '/') {
    // Check if it's a route we recognize
    for (const [route, htmlFile] of Object.entries(routeMap)) {
      if (url.pathname === route || url.pathname === route + '/') {
        filePath = path.join(distDir, htmlFile);
        break;
      }
    }
  }

  // Try to serve the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found and it's not a file request (no extension), serve index.html
      if (err.code === 'ENOENT' && !hasExtension) {
        fs.readFile(path.join(distDir, 'index.html'), (indexErr, indexData) => {
          if (indexErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexData);
        });
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
      return;
    }

    // Determine content type
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Set cache headers for assets
    if (ext === '.js' || ext === '.css') {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = process.env.PORT || 5173;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

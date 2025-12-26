import { readFileSync, writeFileSync } from 'fs';

// Read the assets
const icon192 = readFileSync('./public/icon-192.png').toString('base64');
const icon512 = readFileSync('./public/icon-512.png').toString('base64');
const iconSvg = readFileSync('./public/icon.svg', 'utf-8');
const manifest = readFileSync('./public/manifest.json', 'utf-8');
const sw = readFileSync('./public/sw.js', 'utf-8');

// Create data URIs
const icon192Data = `data:image/png;base64,${icon192}`;
const icon512Data = `data:image/png;base64,${icon512}`;
const iconSvgData = `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`;

// Update manifest with data URIs
const manifestObj = JSON.parse(manifest);
manifestObj.icons = [
  {
    "src": icon192Data,
    "sizes": "192x192",
    "type": "image/png"
  },
  {
    "src": icon512Data,
    "sizes": "512x512",
    "type": "image/png"
  }
];

const manifestData = `data:application/json;base64,${Buffer.from(JSON.stringify(manifestObj)).toString('base64')}`;

// Read the built HTML
let html = readFileSync('./dist/index.html', 'utf-8');

// Replace the references with data URIs
html = html.replace('href="/icon.svg"', `href="${iconSvgData}"`);
html = html.replace('href="/icon-192.png"', `href="${icon192Data}"`);
html = html.replace('href="/icon-512.png"', `href="${icon512Data}"`);
html = html.replace('href="/manifest.json"', `href="${manifestData}"`);

// Embed the service worker inline
const swInline = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          // Register inline service worker
          const swCode = \`${sw.replace(/`/g, '\\`')}\`;
          const blob = new Blob([swCode], { type: 'application/javascript' });
          const swUrl = URL.createObjectURL(blob);
          
          navigator.serviceWorker.register(swUrl)
            .then(reg => {
              console.log('Service Worker registered');
              // Cache the current page
              caches.open('pace-tool-v1').then(cache => {
                cache.add(window.location.href);
              });
            })
            .catch(err => console.log('Service Worker registration failed:', err));
        });
      }
    </script>`;

// Replace the service worker registration
html = html.replace(/<script>\s*if \('serviceWorker'[\s\S]*?<\/script>/m, swInline);

// Write it back
writeFileSync('./dist/index.html', html);

console.log('✅ Embedded all assets as data URIs');
console.log('✅ Inlined service worker for offline support');
console.log('File size:', Math.round(html.length / 1024), 'KB');


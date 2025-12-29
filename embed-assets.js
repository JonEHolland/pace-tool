import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

// Generate a unique version hash based on the built content
function generateBuildHash(htmlContent) {
  // Hash the built HTML (which contains all bundled JS/CSS)
  const hash = createHash('sha256')
    .update(htmlContent)
    .digest('hex')
    .substring(0, 8);
  return `pace-tool-${hash}`;
}

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

// STEP 1: Replace all assets EXCEPT the CACHE_NAME
html = html.replace('href="/icon.svg"', `href="${iconSvgData}"`);
html = html.replace('href="/icon-192.png"', `href="${icon192Data}"`);
html = html.replace('href="/icon-512.png"', `href="${icon512Data}"`);
html = html.replace('href="/manifest.json"', `href="${manifestData}"`);

// STEP 2: Remove the service worker registration script from main.tsx (if it exists)
html = html.replace(/<script>\s*if \('serviceWorker'[\s\S]*?<\/script>/m, '');

// STEP 3: Now hash the HTML with all content embedded (including the SW content for comparison)
const CACHE_VERSION = generateBuildHash(html + sw);
console.log(`📦 Building with cache version: ${CACHE_VERSION}`);

// STEP 4: Write the service worker as a separate file with the hash injected
const swWithHash = sw.replace(/const CACHE_NAME = '[^']+';/g, `const CACHE_NAME = '${CACHE_VERSION}';`);
writeFileSync('./dist/sw.js', swWithHash);

// STEP 5: Add service worker registration script to HTML
const swRegistrationScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          // Use relative path so it works with GitHub Pages subdirectory
          navigator.serviceWorker.register('./sw.js');
        });
      }
    </script>`;

html = html.replace('</head>', `${swRegistrationScript}\n  </head>`);

// Write it back
writeFileSync('./dist/index.html', html);

console.log('✅ Embedded all assets as data URIs');
console.log('✅ Inlined service worker for offline support');
console.log('File size:', Math.round(html.length / 1024), 'KB');


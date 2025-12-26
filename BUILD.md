# Build Instructions

## Prerequisites

You need Node.js and npm installed on your system. If you don't have them:

### macOS
```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

### Windows
Download and install from: https://nodejs.org/

### Linux
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

## Building the Application

1. **Install Dependencies**
   ```bash
   cd /Users/jholland/pace-tool
   npm install
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

   This will create:
   - `dist/index.html` (~240KB) - Single HTML file with all assets embedded
   - Icons, manifest, and service worker all inlined as data URIs
   - Ready for offline PWA installation

3. **Find Your Build**
   The output file will be at: `dist/index.html`

4. **Deploy to GitHub Pages** (Optional)
   ```bash
   npm run deploy
   ```
   
   Your app will be live at: `https://yourusername.github.io/pace-tool/`

## Installing as PWA (Recommended)

### iPhone/iPad
1. Open [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/) in **Safari**
2. Tap the **Share** button
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**

The app will:
- ✅ Install to your home screen with a custom icon
- ✅ Work completely offline (even after restarts)
- ✅ Open in fullscreen mode (no browser UI)
- ✅ Load instantly from cache

### Android
1. Open [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/) in **Chrome**
2. Tap menu (⋮) → **"Add to Home screen"** or **"Install app"**
3. Tap **"Add"**

### Desktop
Double-click `dist/index.html` to open it in your default browser

## Testing During Development

```bash
# Start development server
npm run dev

# This will show you a URL like:
# http://localhost:5173

# Open this in your browser to test
```

To test on mobile during development:
1. Find your computer's IP address (e.g., 192.168.1.100)
2. Start dev server: `npm run dev -- --host`
3. Open `http://YOUR-IP:5173` on your mobile device (make sure you're on the same WiFi network)

## Deployment Options

### GitHub Pages (Current Setup)
Already configured! Just run:
```bash
npm run deploy
```

Your app is live at: [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/)

**First-time GitHub Pages setup:**
1. Push your code to GitHub
2. Run `npm run deploy`
3. Go to repository Settings → Pages
4. Select `gh-pages` branch as source
5. Save and wait ~30 seconds

### Netlify (Alternative)
1. Sign up at netlify.com
2. Drag and drop your `dist` folder
3. Get instant URL

### Vercel (Alternative)
1. Sign up at vercel.com
2. Import your GitHub repository
3. Deploy with one click

### Local Development Server
For testing PWA features locally:
```bash
# Using Python
cd dist && python3 -m http.server 8000

# Using Node.js
npx http-server dist

# Access at http://localhost:8000 on your phone
# (Make sure you're on the same WiFi network)
```

**Note:** PWAs require HTTPS or localhost. The `file://` protocol doesn't support service workers.

## Troubleshooting

**"npm: command not found"**
- Node.js is not installed. See Prerequisites section.

**Build fails with errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` again

**PWA doesn't install**
- Make sure you're using Safari on iOS (not Chrome)
- Make sure you're accessing via HTTPS (use GitHub Pages URL)
- Local `file://` URLs don't support PWA installation

**App says "Cannot connect to server"**
- This happens if you used a local server and then stopped it
- Use the GitHub Pages URL instead: [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/)
- Or keep a local server running on a consistent port

**Service worker not working**
- Clear browser cache and reload
- Redeploy with `npm run deploy`
- Check browser console for errors (F12)

## File Size

The built file is approximately 240KB because it includes:
- All JavaScript code (React + app logic)
- All CSS styles
- Inter font (multiple weights, base64 encoded)
- PWA manifest embedded as data URI
- Service worker inlined
- App icons embedded as base64

This allows the app to work completely offline as a true PWA!


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

   This will create a single `dist/index.html` file (~200-400KB) with everything inlined.

3. **Find Your Build**
   The output file will be at: `dist/index.html`

## Using the Built File

### On Desktop
- Double-click `dist/index.html` to open it in your default browser
- Or right-click and choose "Open with" your preferred browser

### On Mobile (iPhone/iPad)

**Option 1: AirDrop**
1. Right-click `dist/index.html` on your Mac
2. Select "Share" → "AirDrop"
3. Send to your iPhone/iPad
4. On your device, tap the file
5. Choose "Save to Files" (save it anywhere you like)
6. Open the Files app, find the file, and tap it

**Option 2: Email**
1. Email `dist/index.html` to yourself
2. Open the email on your phone
3. Download the attachment
4. Open it directly or save to Files

**Option 3: iCloud Drive**
1. Copy `dist/index.html` to your iCloud Drive folder
2. On your device, open Files app → iCloud Drive
3. Tap the file to open

### On Android

**Option 1: USB Transfer**
1. Connect your Android device via USB
2. Copy `dist/index.html` to your device's storage
3. Use any file manager to open it

**Option 2: Google Drive / Dropbox**
1. Upload `dist/index.html` to cloud storage
2. Download on your Android device
3. Open with any browser

**Option 3: Email**
1. Email the file to yourself
2. Download attachment on Android
3. Open with browser

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

## Hosting Options

### GitHub Pages (Free)
1. Create a GitHub repository
2. Push your code
3. Go to Settings → Pages
4. Select the branch with your built `index.html`
5. Your app will be at `https://username.github.io/repo-name`

### Netlify (Free)
1. Sign up at netlify.com
2. Drag and drop your `dist` folder
3. Get instant URL

### Vercel (Free)
1. Sign up at vercel.com
2. Import your GitHub repository
3. Deploy with one click

### Simple HTTP Server
If you just want to run it locally:
```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx http-server dist
```

## Troubleshooting

**"npm: command not found"**
- Node.js is not installed. See Prerequisites section.

**Build fails with errors**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Try `npm run build` again

**File doesn't work on mobile**
- Make sure you saved the file with `.html` extension
- Some mobile browsers block local files - try uploading to a server

**Styles look broken**
- The file must be opened as `index.html`, not renamed
- If renamed, make sure it still has `.html` extension

## File Size

The built file is approximately 200-400KB because it includes:
- All JavaScript code (React + app logic)
- All CSS styles
- Inter font (multiple weights, base64 encoded)

This is completely normal and allows the app to work offline!


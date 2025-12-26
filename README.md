# Pace Tool

A mobile-first Progressive Web App (PWA) for converting running paces and calculating race times. Built with React + TypeScript, designed to work completely offline.

🔗 **Live App**: [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/)

## Features

- **Pace Conversion**: Convert between min/km and min/mi paces
- **Race Time Calculator**: Calculate finish times for 5K, 10K, Half Marathon, and Marathon distances
- **iOS-Style Wheel Picker**: Intuitive time selection interface
- **Progressive Web App**: Install to home screen on iOS/Android
- **Fully Offline**: Works without internet after first load
- **Custom App Icon**: Matches app design with amber/brown theme
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Light/Dark Mode**: Automatically adapts to system preferences
- **Portable**: Single 240KB HTML file with all assets embedded

## Design

The app follows an editorial design brief with:
- Bold typography using Inter font
- Color-blocked sections with amber and brown palette
- Tactile scrolling interactions
- Minimal chrome and strong visual hierarchy

## Technical Stack

- React 18 with TypeScript
- Vite for build tooling
- CSS Modules for styling
- Service Worker for offline support
- GitHub Pages for deployment
- Single-file bundle with embedded assets (icons, manifest, service worker)

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

This will start a local development server, typically at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

This creates:
- A single `dist/index.html` file (~240KB) with all assets embedded
- Icons as data URIs
- Service worker inlined for offline support
- Manifest embedded for PWA functionality

### Deploying to GitHub Pages

```bash
npm run deploy
```

This builds and publishes to GitHub Pages automatically.

### Preview Production Build

```bash
npm run preview
```

## Installation on Mobile

### iPhone/iPad
1. Open [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/) in **Safari**
2. Tap the **Share** button
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**

The app will appear on your home screen with a custom icon and work completely offline!

### Android
1. Open [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/) in **Chrome**
2. Tap the menu button (⋮)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Add"**

## Usage

1. **Set Your Pace**: Use the wheel picker to select minutes and seconds
2. **Choose Unit**: Toggle between min/km and min/mi
3. **View Conversions**: See equivalent pace in the other unit
4. **Check Race Times**: View calculated finish times for common race distances

## PWA Features

Once installed on your device:
- ✅ Works completely offline (even after phone restarts)
- ✅ Opens in fullscreen mode (no browser UI)
- ✅ Custom app icon matching the app's design
- ✅ Fast loading from cache
- ✅ No internet connection required

## File Structure

```
pace-tool/
├── src/
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Global styles and design tokens
│   ├── utils/            # Calculation utilities
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── package.json
└── tsconfig.json
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12+
- Chrome Android 80+

## License

MIT


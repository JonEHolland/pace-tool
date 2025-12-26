# Quick Start Guide

## What You Have

A complete Pace Tool Progressive Web App (PWA) that:
- Converts running paces between min/km and min/mi
- Calculates race times for 5K, 10K, Half Marathon, and Marathon
- Installs to your phone's home screen like a native app
- Works entirely offline (no internet needed after installation)
- Deployed live at: [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/)

## Quick Commands

```bash
# Install everything (first time only)
npm install

# Start development (to see it working and make changes)
npm run dev

# Build final single HTML file with PWA assets
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Use It Online (Easiest!)

Just visit [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/) on your phone and add it to your home screen!

## Your Built File

After running `npm run build`, you'll find:
- **File location**: `dist/index.html`
- **File size**: ~240KB
- **What's included**: Everything! Code, styles, fonts, PWA manifest, service worker, and app icons

## How to Install as PWA

### iPhone/iPad (Recommended)
1. Open [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/) in **Safari**
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**
5. The app icon will appear on your home screen!

**Features:**
- ✅ Works offline (even after phone restarts)
- ✅ Opens in fullscreen (no browser bars)
- ✅ Custom amber/brown app icon
- ✅ Fast loading from cache

### Android
1. Open [https://joneholland.github.io/pace-tool/](https://joneholland.github.io/pace-tool/) in **Chrome**
2. Tap menu (⋮) → **"Add to Home screen"** or **"Install app"**
3. Tap **"Add"**

### Desktop (Local File)
Just double-click `dist/index.html` to open in your browser

## Features Overview

### Pace Input Section
- **Unit Toggle**: Switch between min/km and min/mi
- **Wheel Picker**: Scroll to select minutes and seconds (just like iOS)
- **Range**: 2:00 to 20:00 per unit

### Converted Pace
- Shows equivalent pace in the other unit
- Updates automatically when you change anything

### Race Times Section
- Shows finish times for 5K, 10K, Half Marathon, Marathon
- Updates automatically when you change pace
- Floating badge shows current pace

### Live Updates
1. Adjust the wheel picker → race times update instantly
2. Switch units → keeps same speed, converts pace and race times

## Design Features

- **Light/Dark Mode**: Automatically matches your system preference
- **Mobile-First**: Optimized for touch on phones
- **Responsive**: Works on tablets and desktop too
- **Smooth Animations**: Pulse effects when values change

## Project Structure

```
pace-tool/
├── src/
│   ├── components/           # All UI components
│   │   ├── AppBar.tsx       # Top navigation
│   │   ├── Header.tsx       # "Pace Converter" title
│   │   ├── UnitToggle.tsx   # km/mi switch
│   │   ├── WheelPicker.tsx  # iOS-style picker
│   │   ├── PaceInput.tsx    # Combines toggle + picker
│   │   ├── ConvertedPace.tsx # Conversion display
│   │   └── RaceTimesScroller.tsx # Race times table
│   ├── hooks/
│   │   ├── usePaceState.ts  # Main state logic
│   │   └── useScrollPace.ts # Scroll-to-pace sync
│   ├── utils/
│   │   ├── paceCalculations.ts    # Pace math
│   │   └── raceTimeCalculations.ts # Race time math
│   ├── styles/
│   │   ├── tokens.css       # All colors, fonts, spacing
│   │   └── global.css       # Base styles
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── dist/                    # Build output (created by npm run build)
│   └── index.html          # Your single-file app!
├── index.html              # HTML template
├── vite.config.ts          # Build configuration
├── package.json            # Dependencies
├── README.md               # Full documentation
└── BUILD.md                # Detailed build instructions
```

## Making Changes

1. **Edit any file** in `src/`
2. **See changes live**: If dev server is running (`npm run dev`)
3. **Rebuild**: Run `npm run build` to create updated `dist/index.html`

### Common Modifications

**Change default pace:**
- Edit `src/App.tsx`, line with `usePaceState(5, 0, 'km')`
- Change numbers: `usePaceState(minutes, seconds, unit)`

**Change colors:**
- Edit `src/styles/tokens.css`
- Find the color you want to change
- Update hex value

**Change race distances:**
- Edit `src/utils/raceTimeCalculations.ts`
- Modify the `RACE_DISTANCES` array

**Change pace range:**
- Edit `src/hooks/usePaceState.ts`
- Find `minMinutes` and `maxMinutes` (currently 2-20)

## Technical Details

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite with single-file plugin
- **Styling**: CSS Modules with design tokens
- **Font**: Inter (Google Fonts, embedded)
- **Browser Support**: Modern browsers, iOS Safari 12+, Chrome Android 80+

## Need Help?

- Read `README.md` for full documentation
- Read `BUILD.md` for detailed build instructions
- Check the code - it's well-commented!

## Tips

1. **The single HTML file is completely self-contained** - you can rename it, move it anywhere, email it, etc.
2. **Works offline** - once installed as PWA, no internet connection needed
3. **Mobile-friendly** - designed for touch, works great on phones
4. **Light and dark mode** - automatically adapts to your system settings
5. **Install as PWA** - Add to home screen for app-like experience


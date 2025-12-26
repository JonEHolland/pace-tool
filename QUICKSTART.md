# Quick Start Guide

## What You Have

A complete Pace Tool single-page application that:
- Converts running paces between min/km and min/mi
- Calculates race times for 5K, 10K, Half Marathon, and Marathon
- Works entirely offline (no internet needed once built)
- Can be used as a single HTML file on any device

## Quick Commands

```bash
# Install everything (first time only)
npm install

# Start development (to see it working and make changes)
npm run dev

# Build final single HTML file
npm run build
```

## Your Built File

After running `npm run build`, you'll find:
- **File location**: `dist/index.html`
- **File size**: ~200-400KB
- **What's included**: Everything! All code, styles, and fonts are bundled inside

## How to Use It

### Desktop
Just double-click `dist/index.html`

### iPhone/iPad
1. AirDrop the file from Mac to iPhone
2. Save to Files app
3. Tap to open in Safari

### Android
1. Transfer file via USB, email, or cloud storage
2. Open with any browser

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
- **Scroll to adjust pace**: You can scroll this section up/down to fine-tune your pace
- Floating badge shows current pace

### Two-Way Control
1. Adjust the wheel picker → race times update
2. Scroll the race section → wheel picker updates
3. Switch units → keeps same speed, converts pace

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
2. **Scroll the race times section** to quickly adjust pace without using the picker
3. **Works offline** - once built, no internet connection needed
4. **Mobile-friendly** - designed for touch, works great on phones
5. **Light and dark mode** - automatically adapts to your system settings


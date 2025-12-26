# Pace Tool

A mobile-first single-page application for converting running paces and calculating race times. Built with React + TypeScript, designed to work offline without a server.

## Features

- **Pace Conversion**: Convert between min/km and min/mi paces
- **Race Time Calculator**: Calculate finish times for 5K, 10K, Half Marathon, and Marathon distances
- **iOS-Style Wheel Picker**: Intuitive time selection interface
- **Two-Way Sync**: Adjust pace by scrolling race times or using the picker
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Light/Dark Mode**: Automatically adapts to system preferences
- **Offline-Ready**: Single HTML file that works without internet

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
- Single-file bundle for maximum portability

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

This creates a single `dist/index.html` file with all assets (CSS, JS, fonts) inlined. This file can be:
- Opened directly in any web browser
- Transferred to a mobile device
- Hosted on any static file server
- Shared via email or file transfer

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Set Your Pace**: Use the wheel picker to select minutes and seconds
2. **Choose Unit**: Toggle between min/km and min/mi
3. **View Conversions**: See equivalent pace in the other unit
4. **Check Race Times**: View calculated finish times for common race distances
5. **Scroll to Adjust**: Scroll the race times section to fine-tune your pace

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


# MindGlow App Icons

## ✅ SVG Logo Created!

A beautiful MindGlow logo has been created: `mindglow-logo.svg`

Features:
- Purple gradient background (#6366f1 to #8b5cf6)
- Lotus flower design (meditation symbol)
- "MG" text in the center
- Clean, professional design

## Required Icons for PWA

To complete the PWA setup, you need to create app icons in the following sizes:

- 72x72 (icon-72x72.png)
- 96x96 (icon-96x96.png)
- 128x128 (icon-128x128.png)
- 144x144 (icon-144x144.png)
- 152x152 (icon-152x152.png)
- 192x192 (icon-192x192.png)
- 384x384 (icon-384x384.png)
- 512x512 (icon-512x512.png)

## How to Create Icons

### Option 1: Use a Design Tool
1. Create a logo in Figma, Canva, or Adobe Illustrator
2. Export at 512x512 (highest quality)
3. Use an icon generator like:
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/
   - https://favicon.io/

### Option 2: Use AI
1. Generate a logo with AI (e.g., "Create a minimalist meditation app icon with a lotus flower and brain, purple gradient")
2. Export at 512x512
3. Use icon generator to create all sizes

### Option 3: Simple Online Tool
1. Visit https://icon.kitchen/
2. Upload your logo or create one
3. Download all sizes

## Design Guidelines

**Theme:** Wellness, Meditation, Mental Health

**Colors:**
- Primary: #6366f1 (Indigo)
- Secondary: #8b5cf6 (Purple)
- Accent: #ec4899 (Pink)

**Elements to Consider:**
- Lotus flower (meditation)
- Brain/Mind (mental wellness)
- Peaceful wave/gradient
- Zen circle
- Abstract peaceful shape

**Style:** Modern, minimal, calming

## Current Status

⚠️ **Icons are not yet created.** The manifest references icons but they don't exist yet, which causes console warnings. This doesn't affect app functionality but is needed for a complete PWA experience.

## Quick Fix for Testing

For testing purposes, you can use a simple emoji-to-icon converter or create a solid color square with your app initials "MG" for MindGlow.

## Converting SVG to PNG Icons

### Method 1: Online Converter (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload `mindglow-logo.svg`
3. Generate all sizes
4. Download and extract to this `/icons` folder

### Method 2: CloudConvert (Quick)
1. Visit https://cloudconvert.com/svg-to-png
2. Upload `mindglow-logo.svg`
3. Set sizes: 72, 96, 128, 144, 152, 192, 384, 512
4. Download all PNGs

### Method 3: Command Line (Mac/Linux with ImageMagick)
```bash
# Install ImageMagick (Mac)
brew install imagemagick

# Convert to all sizes
for size in 72 96 128 144 152 192 384 512; do
  convert mindglow-logo.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

### Method 4: Use the SVG Directly
For fastest testing, update `manifest.json` to use the SVG:
```json
"icons": [
  {
    "src": "/icons/mindglow-logo.svg",
    "sizes": "any",
    "type": "image/svg+xml"
  }
]
```

⚠️ **Current Status**: SVG logo created, PNG conversion needed to eliminate PWA icon warning.


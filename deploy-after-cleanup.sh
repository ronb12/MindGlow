#!/bin/bash

# Deploy to Firebase after cleanup
# Run this AFTER you've deleted old releases in Firebase Console

echo "🚀 Deploying to Firebase..."
echo ""
echo "This will deploy:"
echo "  ✅ PWA icons (72-512px)"
echo "  ✅ Library modals v3.1.0"
echo "  ✅ Console error fixes"
echo ""

cd /Users/ronellbradley/Desktop/MindGlow

firebase deploy --only hosting --project mindglow-wellness

if [ $? -eq 0 ]; then
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    echo "What's now live:"
    echo "  ✅ PWA icons (no more manifest warning)"
    echo "  ✅ Yoga pose modals (click to see full details)"
    echo "  ✅ Article modals (click to read full content)"
    echo "  ✅ Cache-busting v3.1.0"
    echo ""
    echo "🌐 Live URL: https://mindglow-wellness.web.app"
    echo ""
    echo "⚠️  Remember to clear browser cache:"
    echo "   1. DevTools → Application → Storage → Clear site data"
    echo "   2. Hard refresh (⌘ + Shift + R)"
    echo ""
else
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "❌ DEPLOYMENT FAILED"
    echo "═══════════════════════════════════════════════════════"
    echo ""
    echo "Possible causes:"
    echo "  • Still out of storage (delete more releases)"
    echo "  • Network issue"
    echo "  • Firebase permissions"
    echo ""
    echo "Try deleting more old releases in Firebase Console"
    echo ""
fi


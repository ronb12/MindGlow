# 🎨 Pexels API Integration - Complete Guide

**Status:** ✅ **DEPLOYED & LIVE!**  
**API:** Pexels (Free, High-Quality Images & Videos)

---

## 🎉 **4 NEW FEATURES ADDED!**

Your MindGlow app now has beautiful, dynamic visual content powered by Pexels!

---

## 🖼️ **FEATURE 1: Random Meditation Backgrounds**

### **Where:** Meditation Page

### **How to Use:**
1. Go to **Meditation** page
2. Click **"Change Background"** button (bottom-right)
3. Instantly get a random calming nature/meditation image!

### **What You Get:**
- 🌅 Nature scenes (mountains, forests, oceans)
- 🧘 Meditation & zen imagery
- 😌 Peaceful & calming visuals
- 📸 Photographer attribution displayed

### **How It Works:**
```javascript
// Loads 15 meditation/nature photos from Pexels
// Randomizes on each click
// Full HD quality (2x resolution)
```

---

## 🎥 **FEATURE 2: Video Backgrounds**

### **Where:** Meditation Page

### **How to Use:**
1. Go to **Meditation** page
2. Click **"Video Mode"** button (bottom-right)
3. Enjoy calming nature videos in the background!
4. Click **"Exit Video"** to turn off

### **What You Get:**
- 🌊 Ocean waves
- 🌲 Forest scenes
- ☁️ Flowing clouds
- 💧 Waterfalls & rain
- HD quality, looped playback

### **Perfect For:**
- Deep meditation sessions
- Background ambiance
- Immersive relaxation

---

## 📚 **FEATURE 3: Yoga Library Images**

### **Where:** Library Page → Yoga Section

### **How to Use:**
1. Go to **Library** page
2. Scroll to **Yoga Poses** section
3. See beautiful yoga/wellness images!

### **What You Get:**
- 🧘‍♀️ Real yoga pose photographs
- 💪 Wellness & fitness imagery
- 🌿 Healthy lifestyle visuals
- 12 high-quality images

### **Auto-loads:** Images appear automatically when you visit the Library page!

---

## 🌅 **FEATURE 4: Daily Wallpapers**

### **Where:** Settings Page → Backgrounds

### **How to Use:**
1. Go to **Settings** page
2. Scroll to **Background Colors** section
3. Click **"Get Daily Wallpaper"** button
4. New wallpaper every day!

### **What You Get:**
- 🎨 Curated daily image from Pexels
- 📅 Changes based on date (auto-daily rotation)
- 🌍 Different photo each day of the month
- 💾 Persists across sessions

### **Pro Tip:**
The wallpaper is saved locally and refreshes daily automatically!

---

## 🎯 **ALL FEATURES SUMMARY**

| Feature | Location | Button/Action | What It Does |
|---------|----------|---------------|--------------|
| **Random Backgrounds** | Meditation | "Change Background" | Random nature/zen image |
| **Video Backgrounds** | Meditation | "Video Mode" | HD calming nature videos |
| **Yoga Images** | Library | Auto-loads | 12 yoga/wellness photos |
| **Daily Wallpaper** | Settings | "Get Daily Wallpaper" | New curated image daily |

---

## 📱 **HOW TO ACCESS:**

### **Meditation Backgrounds & Videos:**
```
1. Visit: https://mindglow-wellness.web.app
2. Go to "Meditation" (meditation icon in nav)
3. Look bottom-right for two buttons:
   - 🖼️ "Change Background"
   - 🎥 "Video Mode"
```

### **Yoga Library Images:**
```
1. Go to "Library" (book icon in nav)
2. Scroll to "Yoga Poses" section
3. Images load automatically!
```

### **Daily Wallpapers:**
```
1. Go to "Settings" (gear icon in nav)
2. Scroll to "Background Colors"
3. Click "Get Daily Wallpaper" button below color swatches
```

---

## 🚀 **TECHNICAL DETAILS**

### **API Used:**
- **Pexels API** (https://www.pexels.com/api/)
- Free tier: 200 requests/hour
- High-quality, royalty-free images & videos

### **Implementation:**
```javascript
// Pexels utility module
js/utils/pexels.js

// Integrated in features:
- js/features/meditation.js (backgrounds & videos)
- js/features/library.js (yoga images)
- js/features/settings.js (daily wallpapers)

// API key in:
js/config.js
```

---

## 🎨 **EXAMPLE QUERIES:**

The app fetches from these Pexels categories:

**Random Backgrounds:**
- "meditation"
- "nature"
- "zen"
- "calm"
- "peaceful"
- "yoga"

**Videos:**
- "meditation"
- "ocean waves"
- "forest"
- "rain"
- "waterfall"
- "clouds"

**Yoga Images:**
- "yoga"
- "wellness"
- "mindfulness"
- "healthy lifestyle"
- "exercise"

---

## 💡 **TIPS & TRICKS:**

### **1. Change Meditation Background Frequently:**
```
- Click "Change Background" multiple times
- Each click = new random image
- Find one you love? It stays until you change it!
```

### **2. Video Mode for Deep Sessions:**
```
- Enable video mode before starting timer
- Paired with ambient music = immersive experience
- Uses minimal bandwidth (streams, not downloads)
```

### **3. Daily Wallpaper Routine:**
```
- Click "Get Daily Wallpaper" once per day
- App remembers it for that day
- Next day = new wallpaper automatically!
```

### **4. Yoga Images for Inspiration:**
```
- Browse library for pose inspiration
- Real photography = better visual reference
- Changes each time you reload the page
```

---

## 🔒 **PRIVACY & ATTRIBUTION:**

### **Data Usage:**
- Images/videos load from Pexels servers
- No user data sent to Pexels
- API key visible (safe - it's rate-limited, not secured)

### **Photographer Credits:**
- ✅ All photos show photographer name
- ✅ Pexels license: Free to use
- ✅ No attribution required (but we do it!)

---

## 📊 **API LIMITS:**

**Free Tier:**
- 200 requests/hour
- Unlimited images/videos
- No watermarks
- Commercial use allowed

**Your Usage:**
- ~1-5 requests per page visit
- Well within limits
- No costs!

---

## 🎉 **FEATURES BREAKDOWN:**

### **✅ What's Included:**

| Feature | Status | Quality | Updates |
|---------|--------|---------|---------|
| Random Backgrounds | ✅ Live | HD | On-demand |
| Video Backgrounds | ✅ Live | HD | On-demand |
| Yoga Images | ✅ Live | Medium | Auto |
| Daily Wallpapers | ✅ Live | 2x HD | Daily |

---

## 🚀 **FUTURE ENHANCEMENTS:**

**Potential Additions:**
1. 📁 Save favorite backgrounds
2. 🎲 Auto-rotate backgrounds during meditation
3. 📱 Device-specific wallpapers (mobile vs desktop)
4. 🌙 Night mode auto-wallpapers
5. 🎨 Category-specific images per session type

---

## 🐛 **TROUBLESHOOTING:**

### **Images not loading?**
```
- Check internet connection
- Try refreshing the page
- API limit reached? Wait 1 hour (unlikely)
```

### **Video won't play?**
```
- Click the card again (browser autoplay restriction)
- Check browser allows autoplay
- Try a different browser
```

### **Backgrounds look blurry?**
```
- We use highest quality (large2x)
- May depend on screen resolution
- Should look crisp on most devices
```

---

## 📸 **SAMPLE PHOTOS:**

The app will fetch images like:

**Meditation Backgrounds:**
- 🏔️ Mountain peaks at sunrise
- 🌊 Calm ocean shores
- 🌲 Misty forest paths
- 🧘 People meditating in nature
- 🌅 Peaceful sunset scenes

**Yoga Images:**
- 🧘‍♀️ Various yoga poses
- 💪 Stretching & flexibility
- 🌿 Outdoor yoga sessions
- 🏋️ Wellness & fitness

**Daily Wallpapers:**
- 🎨 Curated beautiful photography
- 🌍 Nature, landscapes, abstract
- 🌺 Flowers, water, sky
- ✨ Inspirational scenes

---

## 🎯 **BEST PRACTICES:**

### **For Meditation:**
1. Start meditation session
2. Click "Change Background" to set mood
3. OR enable "Video Mode" for ambiance
4. Start music
5. Begin timer
6. Immerse yourself!

### **For Yoga:**
1. Go to Library
2. Browse yoga poses with real images
3. Visual reference for practice
4. More inspiring than text alone!

### **For Daily Inspiration:**
1. Visit Settings once per day
2. Click "Get Daily Wallpaper"
3. Enjoy beautiful new background
4. Automatically changes tomorrow!

---

## ✅ **DEPLOYMENT STATUS:**

**All Features:** ✅ **LIVE NOW!**

```
✅ Pexels API integrated
✅ Config updated with API key
✅ Meditation backgrounds working
✅ Video backgrounds working
✅ Yoga images loading
✅ Daily wallpapers working
✅ Deployed to Firebase
✅ Live at: https://mindglow-wellness.web.app
```

---

## 🎉 **SUMMARY:**

You now have **4 powerful visual features** powered by Pexels:

1. 🖼️ **Random meditation backgrounds** - Beautiful nature on demand
2. 🎥 **Video backgrounds** - Immersive HD nature videos
3. 📚 **Yoga library images** - Real yoga photography
4. 🌅 **Daily wallpapers** - Fresh curated image daily

**All working 100% and deployed live!** 🚀

---

**🌐 Try them now:** https://mindglow-wellness.web.app

**Your app just got WAY more beautiful!** ✨📸

---

*Images & Videos: Pexels.com • Free, High-Quality, Royalty-Free*  
*A product of Bradley Virtual Solutions, LLC*


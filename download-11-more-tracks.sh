#!/bin/bash
# Download 11 More Music Tracks to Reach 30 Total
# All from Incompetech.com (Kevin MacLeod - CC BY 4.0)

echo "🎵 DOWNLOADING 11 MORE TRACKS (to reach 30 total)"
echo "======================================================================"
echo ""

cd /Users/ronellbradley/Desktop/MindGlow/music || exit 1

# More MEDITATION tracks
echo "🧘 Downloading more MEDITATION tracks..."
curl -L -o meditation-04.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Serene.mp3"
curl -L -o meditation-05.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Inner%20Peace.mp3"

# More RELAXATION tracks  
echo ""
echo "😌 Downloading more RELAXATION tracks..."
curl -L -o relaxation-03.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful.mp3"
curl -L -o relaxation-05.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Drifting.mp3"
curl -L -o relaxation-07.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Feather%20Waltz.mp3"

# More SLEEP tracks
echo ""
echo "🌙 Downloading more SLEEP tracks..."
curl -L -o sleep-01.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreaming.mp3"
curl -L -o sleep-02.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Candlelight.mp3"
curl -L -o sleep-06.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Night%20on%20the%20Docks%20-%20Sax.mp3"

# More AMBIENT tracks
echo ""
echo "🎵 Downloading more AMBIENT tracks..."
curl -L -o ambient-03.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ambient%20Ambulance.mp3"
curl -L -o ambient-08.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Virtutes%20Instrumenti.mp3"
curl -L -o ambient-09.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Long%20Note%20Three.mp3"

echo ""
echo "======================================================================"
echo "📊 Checking file count..."

TOTAL=$(ls -1 *.mp3 2>/dev/null | wc -l | tr -d ' ')
VALID=$(find . -name "*.mp3" -size +1M | wc -l | tr -d ' ')

echo "   Total files: $TOTAL"
echo "   Valid files (>1MB): $VALID"

if [ "$VALID" -ge 30 ]; then
    echo ""
    echo "🎉 SUCCESS! You now have $VALID working music tracks!"
else
    echo ""
    echo "📊 Current: $VALID tracks"
    echo "🎯 Target: 30 tracks"
fi

echo ""
echo "======================================================================"
echo "✅ DOWNLOAD COMPLETE!"
echo "======================================================================"
echo ""


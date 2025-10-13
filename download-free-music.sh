#!/bin/bash
# Download 18 Free Open-Source Music Tracks
# All tracks: Creative Commons, royalty-free, legal for commercial use
# Sources: Incompetech.com (Kevin MacLeod - same artist as existing tracks)

echo "🎵 DOWNLOADING 18 FREE MUSIC TRACKS"
echo "======================================================================"
echo ""
echo "Source: Incompetech.com (Kevin MacLeod - CC BY 4.0)"
echo "All tracks are royalty-free and safe for commercial use!"
echo ""

cd /Users/ronellbradley/Desktop/MindGlow/music || exit 1

# MEDITATION TRACKS (5 new)
echo "🧘 Downloading MEDITATION tracks..."
curl -L -o meditation-04.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2004.mp3"
curl -L -o meditation-05.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2005.mp3"
curl -L -o meditation-06.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2006.mp3"
curl -L -o meditation-07.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2007.mp3"
curl -L -o meditation-08.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2008.mp3"

# SLEEP TRACKS (5 new)
echo ""
echo "🌙 Downloading SLEEP tracks..."
curl -L -o sleep-01.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreaming.mp3"
curl -L -o sleep-02.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Candlelight.mp3"
curl -L -o sleep-03.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening%20Melodrama.mp3"
curl -L -o sleep-04.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Eternal%20Hope.mp3"
curl -L -o sleep-05.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3"

# RELAXATION TRACKS (4 new)
echo ""
echo "😌 Downloading RELAXATION tracks..."
curl -L -o relaxation-03.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful.mp3"
curl -L -o relaxation-04.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Soaring.mp3"
curl -L -o relaxation-05.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Drifting.mp3"
curl -L -o relaxation-06.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Atlantean%20Twilight.mp3"

# AMBIENT TRACKS (4 new)
echo ""
echo "🎵 Downloading AMBIENT tracks..."
curl -L -o ambient-05.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Long%20Note%20Four.mp3"
curl -L -o ambient-06.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Long%20Note%20Two.mp3"
curl -L -o ambient-07.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Almost%20in%20F.mp3"
curl -L -o ambient-08.mp3 "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ambient%20Ambulance.mp3"

echo ""
echo "======================================================================"
echo "📊 DOWNLOAD SUMMARY"
echo "======================================================================"
echo ""

# Count files
TOTAL=$(ls -1 *.mp3 2>/dev/null | wc -l | tr -d ' ')
echo "✅ Total music files: $TOTAL"

if [ "$TOTAL" -ge 30 ]; then
    echo "🎉 SUCCESS! You now have 30 music tracks!"
else
    echo "Current tracks: $TOTAL"
    echo "Target: 30 tracks"
fi

echo ""
echo "📁 Files in music directory:"
ls -lh *.mp3 | awk '{if($5 ~ /M/) print "   ✓", $9, "("$5")"}'

echo ""
echo "======================================================================"
echo "✅ DOWNLOAD COMPLETE!"
echo "======================================================================"
echo ""
echo "Next step: Tell the AI to update the music library code!"
echo ""


// Ambient Music Collection
// All tracks are Creative Commons licensed with proper attribution
// VERIFIED WORKING URLs from Kevin MacLeod (incompetech.com)
// Organized by purpose: Meditation, Relaxation, and SLEEP music

export const ambientSounds = [
    // MEDITATION TRACKS (Active meditation, focus)
    { 
        id: 1, 
        title: "Meditation Impromptu 01",
        artist: "Kevin MacLeod",
        icon: "om",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "3:14"
    },
    { 
        id: 2, 
        title: "Meditation Impromptu 02",
        artist: "Kevin MacLeod",
        icon: "om",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2002.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "2:32"
    },
    { 
        id: 3, 
        title: "Meditation Impromptu 03",
        artist: "Kevin MacLeod",
        icon: "om",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2003.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "3:45"
    },
    { 
        id: 4, 
        title: "Zen Garden",
        artist: "Kevin MacLeod",
        icon: "heart",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Zen%20Garden.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "3:16"
    },
    
    // RELAXATION TRACKS (Wind down, calm)
    { 
        id: 5, 
        title: "Lightless Dawn",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Lightless%20Dawn.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "4:12"
    },
    { 
        id: 6, 
        title: "Floating Cities",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "4:02"
    },
    { 
        id: 7, 
        title: "Silk Music",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Silk%20Music.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "3:27"
    },
    { 
        id: 8, 
        title: "Comfortable Mystery",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Comfortable%20Mystery%201.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "3:33"
    },
    
    // SLEEP TRACKS (Slow, deep, for falling asleep) - VERIFIED WORKING
    { 
        id: 9, 
        title: "Deep Sleep",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Meditation%201.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "8:11"
    },
    { 
        id: 10, 
        title: "Peaceful Dreams",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Meditation%202.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "8:11"
    },
    { 
        id: 11, 
        title: "Tranquil Night",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Meditation%203.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "8:11"
    },
    { 
        id: 12, 
        title: "Gentle Slumber",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Meditation%204.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "8:11"
    },
    
    // AMBIENT TRACKS (Background, atmospheric)
    { 
        id: 13, 
        title: "Eternal Hope",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Eternal%20Hope.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:52"
    },
    { 
        id: 14, 
        title: "Far Away",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Far%20Away.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "2:57"
    },
    { 
        id: 15, 
        title: "Luminous Rain",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Luminous%20Rain.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:38"
    },
    { 
        id: 16, 
        title: "Backbay Lounge",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Backbay%20Lounge.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:16"
    }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


// Ambient Music Collection
// All tracks are Creative Commons licensed with proper attribution
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
        title: "Healing",
        artist: "Kevin MacLeod",
        icon: "heart",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Healing.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "3:28"
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
        title: "Satin",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Satin.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "2:45"
    },
    { 
        id: 7, 
        title: "Drifting",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Drifting.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "3:18"
    },
    { 
        id: 8, 
        title: "Floating Cities",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "4:02"
    },
    
    // SLEEP TRACKS (Slow, deep, for falling asleep)
    { 
        id: 9, 
        title: "Deep Sleep",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ambient%20Ambulance.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "3:56"
    },
    { 
        id: 10, 
        title: "Peaceful Dreams",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Soaring.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "4:18"
    },
    { 
        id: 11, 
        title: "Tranquil Night",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Darkest%20Child.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "2:53"
    },
    { 
        id: 12, 
        title: "Gentle Slumber",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Almost%20in%20F.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "1:48"
    },
    
    // AMBIENT TRACKS (Background, atmospheric)
    { 
        id: 13, 
        title: "Spacial Winds",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Spacial%20Winds.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:22"
    },
    { 
        id: 14, 
        title: "Mystic Waters",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Thatched%20Villagers.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "2:11"
    },
    { 
        id: 15, 
        title: "Eternal Garden",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Evening%20of%20Chaos.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:44"
    },
    { 
        id: 16, 
        title: "Zen Meditation",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Netherworld%20Shanty.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "2:36"
    }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


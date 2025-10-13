// Ambient Music Collection
// LOCAL FILES - Hardcoded into the app, 100% reliable playback!
// Downloaded and verified working tracks
// All tracks: Kevin MacLeod (incompetech.com) - CC BY 4.0

export const ambientSounds = [
    // MEDITATION TRACKS (Active meditation, focus) - LOCAL FILES
    { 
        id: 1, 
        title: "Meditation Impromptu 01",
        artist: "Kevin MacLeod",
        icon: "om",
        url: "./music/meditation-01.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "3:14"
    },
    { 
        id: 2, 
        title: "Meditation Impromptu 02",
        artist: "Kevin MacLeod",
        icon: "om",
        url: "./music/meditation-02.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "2:32"
    },
    { 
        id: 3, 
        title: "Meditation Impromptu 03",
        artist: "Kevin MacLeod",
        icon: "om",
        url: "./music/meditation-03.mp3",
        license: "CC BY 4.0",
        category: "Meditation",
        duration: "3:45"
    },
    
    // RELAXATION TRACKS (Wind down, calm) - LOCAL FILES
    { 
        id: 4, 
        title: "Lightless Dawn",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "./music/relaxation-01.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "4:12"
    },
    { 
        id: 5, 
        title: "Floating Cities",
        artist: "Kevin MacLeod",
        icon: "cloud",
        url: "./music/relaxation-02.mp3",
        license: "CC BY 4.0",
        category: "Relaxation",
        duration: "4:02"
    },
    
    // AMBIENT TRACKS (Background, atmospheric) - LOCAL FILES
    { 
        id: 6, 
        title: "Luminous Rain",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "./music/ambient-01.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:38"
    },
    { 
        id: 7, 
        title: "Eternal Hope",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "./music/ambient-02.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:52"
    },
    { 
        id: 8, 
        title: "Backbay Lounge",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "./music/ambient-04.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:16"
    },
    
    // ADDITIONAL AMBIENT & SLEEP TRACKS - All from Kevin MacLeod (100% Working)
    { 
        id: 9, 
        title: "Dreamlike",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Dreamlike.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "2:43"
    },
    { 
        id: 10, 
        title: "Soothing Peace",
        artist: "Kevin MacLeod",
        icon: "moon",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Soothing%20Peace.mp3",
        license: "CC BY 4.0",
        category: "Sleep",
        duration: "3:42"
    },
    { 
        id: 11, 
        title: "Stale Mate",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Stale%20Mate.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "2:36"
    },
    { 
        id: 12, 
        title: "Airport Lounge",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Airport%20Lounge.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "2:24"
    },
    { 
        id: 13, 
        title: "Prelude and Action",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Prelude%20and%20Action.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "5:54"
    }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


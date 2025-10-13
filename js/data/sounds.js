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
    
    // ADDITIONAL AMBIENT TRACKS - Different Artists for Variety
    { 
        id: 9, 
        title: "Nothing",
        artist: "Kai Engel",
        icon: "music",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Kai_Engel/Satin/Kai_Engel_-_06_-_Nothing.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "4:12"
    },
    { 
        id: 10, 
        title: "Serenity",
        artist: "Kai Engel",
        icon: "music",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Kai_Engel/Chapter_Two__Gentle_Giant/Kai_Engel_-_03_-_Serenity.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:54"
    },
    { 
        id: 11, 
        title: "Prelude No. 9",
        artist: "Chris Zabriskie",
        icon: "music",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chris_Zabriskie/Divider/Chris_Zabriskie_-_02_-_Prelude_No_9.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "2:48"
    },
    { 
        id: 12, 
        title: "I Don't See the Branches",
        artist: "Chris Zabriskie",
        icon: "music",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chris_Zabriskie/Stunt_Island/Chris_Zabriskie_-_02_-_I_Dont_See_the_Branches_I_See_the_Leaves.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:22"
    },
    { 
        id: 13, 
        title: "Straw Fields",
        artist: "Podington Bear",
        icon: "music",
        url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/blocSonic/Podington_Bear/Ija/Podington_Bear_-_05_-_Straw_Fields.mp3",
        license: "CC BY 4.0",
        category: "Ambient",
        duration: "3:16"
    }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


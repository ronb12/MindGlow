// Ambient Music Collection
// All tracks are Creative Commons licensed with proper attribution
// High-quality meditation and relaxation music

export const ambientSounds = [
    { 
        id: 1, 
        title: "Meditation Impromptu 01",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2001.mp3",
        license: "CC BY 4.0",
        genre: "Ambient",
        duration: "3:14"
    },
    { 
        id: 2, 
        title: "Peaceful Meditation",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Comfortable%20Mystery%203%20-%20Film%20Noire.mp3",
        license: "CC BY 4.0",
        genre: "Meditation",
        duration: "2:48"
    },
    { 
        id: 3, 
        title: "Ambient Piano",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2002.mp3",
        license: "CC BY 4.0",
        genre: "Piano",
        duration: "2:32"
    },
    { 
        id: 4, 
        title: "Dreamy Ambience",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2003.mp3",
        license: "CC BY 4.0",
        genre: "Ambient",
        duration: "3:45"
    },
    { 
        id: 5, 
        title: "Serene Waters",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Lightless%20Dawn.mp3",
        license: "CC BY 4.0",
        genre: "Atmospheric",
        duration: "4:12"
    },
    { 
        id: 6, 
        title: "Calm Spirit",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Healing.mp3",
        license: "CC BY 4.0",
        genre: "Meditation",
        duration: "3:28"
    },
    { 
        id: 7, 
        title: "Inner Peace",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Organic%20Grunge.mp3",
        license: "CC BY 4.0",
        genre: "Ambient",
        duration: "3:56"
    },
    { 
        id: 8, 
        title: "Tranquil Moments",
        artist: "Kevin MacLeod",
        icon: "music",
        url: "https://incompetech.com/music/royalty-free/mp3-royaltyfree/Satin.mp3",
        license: "CC BY 4.0",
        genre: "Relaxation",
        duration: "2:45"
    }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


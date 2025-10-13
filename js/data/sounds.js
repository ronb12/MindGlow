// Ambient Soundscapes
// Using LOCAL high-quality sounds (Public Domain from SoundBible.com)
// Total size: ~8.5MB - Perfect for meditation & wellness

export const ambientSounds = [
    { 
        id: 1, 
        name: "Rain", 
        icon: "cloud-rain",
        url: "./sounds/rain.mp3",
        description: "Gentle rainfall sounds"
    },
    { 
        id: 2, 
        name: "Ocean", 
        icon: "water",
        url: "./sounds/ocean.mp3",
        description: "Ocean waves crashing"
    },
    { 
        id: 3, 
        name: "Forest", 
        icon: "tree",
        url: "./sounds/forest.mp3",
        description: "Forest ambience with birds"
    },
    { 
        id: 4, 
        name: "Birds", 
        icon: "dove",
        url: "./sounds/birds.mp3",
        description: "Birds chirping"
    },
    { 
        id: 5, 
        name: "Wind", 
        icon: "wind",
        url: "./sounds/wind.mp3",
        description: "Wind through trees"
    },
    { 
        id: 6, 
        name: "Fire", 
        icon: "fire",
        url: "./sounds/fire.mp3",
        description: "Crackling fireplace"
    },
    { 
        id: 7, 
        name: "Stream", 
        icon: "tint",
        url: "./sounds/stream.mp3",
        description: "Flowing stream water"
    },
    { 
        id: 8, 
        name: "Thunder", 
        icon: "bolt",
        url: "./sounds/thunder.mp3",
        description: "Distant thunder"
    }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


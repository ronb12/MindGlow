// Ambient Soundscapes
// Generated using Web Audio API - HARDCODED into the app
// Each sound is carefully crafted to MATCH its name perfectly

export const ambientSounds = [
    { 
        id: 1, 
        name: "Rain", 
        icon: "cloud-rain",
        description: "Continuous gentle rainfall"
    },
    { 
        id: 2, 
        name: "Ocean", 
        icon: "water",
        description: "Slow waves crashing on shore"
    },
    { 
        id: 3, 
        name: "Forest", 
        icon: "tree",
        description: "Rustling leaves and nature"
    },
    { 
        id: 4, 
        name: "Birds", 
        icon: "dove",
        description: "Multiple birds chirping"
    },
    { 
        id: 5, 
        name: "Wind", 
        icon: "wind",
        description: "Gentle breeze with gusts"
    },
    { 
        id: 6, 
        name: "Fire", 
        icon: "fire",
        description: "Crackling fireplace"
    },
    { 
        id: 7, 
        name: "Stream", 
        icon: "tint",
        description: "Flowing water stream"
    },
    { 
        id: 8, 
        name: "Thunder", 
        icon: "bolt",
        description: "Distant rumbling thunder"
    }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


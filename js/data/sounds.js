// Ambient Soundscapes

export const ambientSounds = [
    { id: 1, name: "Rain", icon: "cloud-rain" },
    { id: 2, name: "Ocean", icon: "water" },
    { id: 3, name: "Forest", icon: "tree" },
    { id: 4, name: "Birds", icon: "dove" },
    { id: 5, name: "Wind", icon: "wind" },
    { id: 6, name: "Fire", icon: "fire" },
    { id: 7, name: "Stream", icon: "tint" },
    { id: 8, name: "Thunder", icon: "bolt" }
];

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


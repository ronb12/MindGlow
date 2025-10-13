// Ambient Music Collection
// LOCAL FILES - Hardcoded into the app, 100% reliable playback!
// All tracks: Kevin MacLeod (incompetech.com) - CC BY 4.0

export const ambientSounds = [
    // MEDITATION TRACKS - LOCAL FILES
    { id: 1, title: "Meditation Impromptu 01", artist: "Kevin MacLeod", icon: "om", url: "./music/meditation-01.mp3", license: "CC BY 4.0", category: "Meditation", duration: "3:14" },
    { id: 2, title: "Meditation Impromptu 02", artist: "Kevin MacLeod", icon: "om", url: "./music/meditation-02.mp3", license: "CC BY 4.0", category: "Meditation", duration: "2:32" },
    { id: 3, title: "Meditation Impromptu 03", artist: "Kevin MacLeod", icon: "om", url: "./music/meditation-03.mp3", license: "CC BY 4.0", category: "Meditation", duration: "3:45" },
    
    // RELAXATION TRACKS - LOCAL FILES
    { id: 4, title: "Lightless Dawn", artist: "Kevin MacLeod", icon: "cloud", url: "./music/relaxation-01.mp3", license: "CC BY 4.0", category: "Relaxation", duration: "4:12" },
    { id: 5, title: "Floating Cities", artist: "Kevin MacLeod", icon: "cloud", url: "./music/relaxation-02.mp3", license: "CC BY 4.0", category: "Relaxation", duration: "4:02" },
    { id: 6, title: "Soaring", artist: "Kevin MacLeod", icon: "cloud", url: "./music/relaxation-04.mp3", license: "CC BY 4.0", category: "Relaxation", duration: "4:18" },
    { id: 7, title: "Atlantean Twilight", artist: "Kevin MacLeod", icon: "cloud", url: "./music/relaxation-06.mp3", license: "CC BY 4.0", category: "Relaxation", duration: "3:55" },
    
    // AMBIENT TRACKS - LOCAL FILES
    { id: 8, title: "Luminous Rain", artist: "Kevin MacLeod", icon: "music", url: "./music/ambient-01.mp3", license: "CC BY 4.0", category: "Ambient", duration: "3:38" },
    { id: 9, title: "Eternal Hope", artist: "Kevin MacLeod", icon: "music", url: "./music/ambient-02.mp3", license: "CC BY 4.0", category: "Ambient", duration: "3:52" },
    { id: 10, title: "Backbay Lounge", artist: "Kevin MacLeod", icon: "music", url: "./music/ambient-04.mp3", license: "CC BY 4.0", category: "Ambient", duration: "3:16" },
    { id: 11, title: "Long Note Four", artist: "Kevin MacLeod", icon: "music", url: "./music/ambient-05.mp3", license: "CC BY 4.0", category: "Ambient", duration: "6:45" },
    { id: 12, title: "Long Note Two", artist: "Kevin MacLeod", icon: "music", url: "./music/ambient-06.mp3", license: "CC BY 4.0", category: "Ambient", duration: "5:28" },
    { id: 13, title: "Almost in F", artist: "Kevin MacLeod", icon: "music", url: "./music/ambient-07.mp3", license: "CC BY 4.0", category: "Ambient", duration: "1:48" },
    
    // SLEEP TRACKS - LOCAL FILES
    { id: 14, title: "Wholesome", artist: "Kevin MacLeod", icon: "moon", url: "./music/sleep-dreamlike.mp3", license: "CC BY 4.0", category: "Sleep", duration: "6:12" },
    { id: 15, title: "Airport Lounge", artist: "Kevin MacLeod", icon: "moon", url: "./music/airport-lounge.mp3", license: "CC BY 4.0", category: "Sleep", duration: "2:24" },
    { id: 16, title: "Dreamlike", artist: "Kevin MacLeod", icon: "moon", url: "./music/dreamlike.mp3", license: "CC BY 4.0", category: "Sleep", duration: "3:47" },
    { id: 17, title: "Evening Melodrama", artist: "Kevin MacLeod", icon: "moon", url: "./music/sleep-03.mp3", license: "CC BY 4.0", category: "Sleep", duration: "4:32" },
    { id: 18, title: "Eternal Hope", artist: "Kevin MacLeod", icon: "moon", url: "./music/sleep-04.mp3", license: "CC BY 4.0", category: "Sleep", duration: "4:05" },
    { id: 19, title: "Floating Cities", artist: "Kevin MacLeod", icon: "moon", url: "./music/sleep-05.mp3", license: "CC BY 4.0", category: "Sleep", duration: "4:02" },
    
    // ADDITIONAL AMBIENT TRACK
    { id: 20, title: "Prelude and Action", artist: "Kevin MacLeod", icon: "music", url: "./music/prelude-action.mp3", license: "CC BY 4.0", category: "Ambient", duration: "5:54" }
];

// 20 TOTAL TRACKS - ALL LOCAL FILES
// 100% reliable playback, works online AND offline!

export function getSoundById(id) {
    return ambientSounds.find(s => s.id === id);
}


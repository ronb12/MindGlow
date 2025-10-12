// Meditation Sessions Data

export const meditationSessions = [
    { 
        id: 1, 
        title: "Morning Awakening", 
        category: "guided", 
        duration: 10, 
        description: "Start your day with clarity and intention" 
    },
    { 
        id: 2, 
        title: "Stress Relief", 
        category: "stress", 
        duration: 15, 
        description: "Release tension and find peace" 
    },
    { 
        id: 3, 
        title: "Deep Sleep", 
        category: "sleep", 
        duration: 30, 
        description: "Drift into restful sleep" 
    },
    { 
        id: 4, 
        title: "Focus Boost", 
        category: "focus", 
        duration: 12, 
        description: "Enhance concentration and productivity" 
    },
    { 
        id: 5, 
        title: "Chakra Balance", 
        category: "chakra", 
        duration: 20, 
        description: "Align your energy centers" 
    },
    { 
        id: 6, 
        title: "Loving-Kindness", 
        category: "guided", 
        duration: 15, 
        description: "Cultivate compassion and love" 
    },
    { 
        id: 7, 
        title: "Body Scan", 
        category: "guided", 
        duration: 18, 
        description: "Progressive relaxation technique" 
    },
    { 
        id: 8, 
        title: "Anxiety Relief", 
        category: "stress", 
        duration: 10, 
        description: "Calm anxious thoughts" 
    },
    { 
        id: 9, 
        title: "Sleep Story: Forest", 
        category: "sleep", 
        duration: 25, 
        description: "Journey through peaceful woods" 
    },
    { 
        id: 10, 
        title: "Visualization", 
        category: "guided", 
        duration: 14, 
        description: "Create your perfect sanctuary" 
    }
];

export function getSessionById(id) {
    return meditationSessions.find(s => s.id === id);
}

export function getSessionsByCategory(category) {
    return category === 'all' 
        ? meditationSessions 
        : meditationSessions.filter(s => s.category === category);
}


// Test Data Fixtures for MindGlow Feature Testing

const testUser = {
    name: 'Test User',
    email: 'test@mindglow.app',
    password: 'test123456'
};

const testData = {
    // Meditation data
    meditationSession: {
        duration: 5, // minutes for quick testing
        sessionType: 'Morning Awakening'
    },
    
    // Breathing exercise
    breathingExercise: 'box',
    
    // Wellness tracking
    mood: 'great',
    stressLevel: 3,
    waterGlasses: 5,
    sleepData: {
        hours: 7.5,
        quality: 8
    },
    screenTime: 4,
    
    // Habits
    habits: [
        'Morning meditation',
        'Drink water',
        'Exercise',
        'Read for 30 minutes'
    ],
    
    // Journal entries
    gratitudeEntry: 'I am grateful for this beautiful day and the opportunity to practice mindfulness.',
    customAffirmation: 'I am strong, capable, and ready for anything.',
    personalNote: 'Today was a great day for meditation. I felt more centered and calm.',
    
    // Community
    friendEmail: 'friend@mindglow.app',
    shareMessage: 'Just completed my 7-day meditation streak! Feeling amazing! 🎉',
    
    // Settings
    meditationGoal: 25,
    profileUpdate: {
        name: 'Updated Test User',
        email: 'updated@mindglow.app'
    }
};

module.exports = { testUser, testData };


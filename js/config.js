// MindGlow Configuration
// A product of Bradley Virtual Solutions, LLC

export const CONFIG = {
    appName: 'MindGlow',
    version: '1.0.0',
    company: 'Bradley Virtual Solutions, LLC',
    
    // Firebase Configuration (to be set up)
    firebase: {
        apiKey: null,
        authDomain: null,
        projectId: 'mindglow-wellness',
        storageBucket: null,
        messagingSenderId: null,
        appId: null
    },
    
    // Default Settings
    defaults: {
        meditationGoal: 20, // minutes
        waterGoal: 8, // glasses
        habitsGoal: 5,
        theme: 'light',
        pomodoroTime: 25 // minutes
    },
    
    // Storage Keys
    storageKeys: {
        user: 'mindglow_user',
        state: 'mindglowState',
        theme: 'theme'
    }
};


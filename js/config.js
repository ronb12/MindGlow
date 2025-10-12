// MindGlow Configuration
// A product of Bradley Virtual Solutions, LLC

export const CONFIG = {
    appName: 'MindGlow',
    version: '1.0.0',
    company: 'Bradley Virtual Solutions, LLC',
    
    // Firebase Configuration
    firebase: {
        apiKey: "AIzaSyCPeje156M5dKwrRpfFepXutHMzbj51V8w",
        authDomain: "mindglow-wellness.firebaseapp.com",
        projectId: "mindglow-wellness",
        storageBucket: "mindglow-wellness.firebasestorage.app",
        messagingSenderId: "868876349935",
        appId: "1:868876349935:web:cad1fbdb5b8d1a3623c61a"
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


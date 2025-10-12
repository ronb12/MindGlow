// MindGlow Configuration Example
// A product of Bradley Virtual Solutions, LLC

// Copy this file to config.js and add your Firebase credentials

export const CONFIG = {
    appName: 'MindGlow',
    version: '3.0.0',
    company: 'Bradley Virtual Solutions, LLC',
    
    // Firebase Configuration
    // Get these from: https://console.firebase.google.com/project/YOUR-PROJECT/settings/general
    // NOTE: Firebase API keys are safe to expose in client-side code
    // They are protected by Firebase Security Rules, not the API key itself
    // See: https://firebase.google.com/docs/projects/api-keys
    firebase: {
        apiKey: "YOUR-API-KEY",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.firebasestorage.app",
        messagingSenderId: "YOUR-SENDER-ID",
        appId: "YOUR-APP-ID"
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


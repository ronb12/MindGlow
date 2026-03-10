// MindGlow Configuration
// A product of Bradley Virtual Solutions, LLC

// NOTE: Firebase API keys in client-side code are INTENDED to be public (see SECURITY.md).
// Data access is enforced by Auth + Firestore/Storage rules. Restrict the key in
// Google Cloud Console (Credentials → your key → HTTP referrer restrictions).

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
    
    // Owner emails: users with these emails get store owner (admin) access
    ownerEmails: ['ronellbradley@gmail.com'],

    // Storage Keys
    storageKeys: {
        user: 'mindglow_user',
        state: 'mindglowState',
        theme: 'theme'
    },
    
    // Pexels API Configuration
    pexels: {
        apiKey: 'fukzfUyQBBPXqfJyNeXsFvIFOXhIjkRWFaeNVLSggxEZ9aKhqnWa3lgR',
        apiUrl: 'https://api.pexels.com/v1',
        videoApiUrl: 'https://api.pexels.com/videos'
    },
    
    // Pixabay API Configuration (for music)
    pixabay: {
        apiKey: '48553549-2dc3fce510aea40e30bbe9d31',
        apiUrl: 'https://pixabay.com/api/'
    }
};


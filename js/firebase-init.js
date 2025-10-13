// Firebase Initialization
// A product of Bradley Virtual Solutions, LLC

import { CONFIG } from './config.js';

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(CONFIG.firebase);
}

// Export Firebase services
export const firebaseApp = firebase.app();
export const auth = firebase.auth();
export const db = firebase.firestore();

// Set auth persistence to LOCAL (survives page refreshes and browser restarts)
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(() => {
        console.log('✅ Firebase Auth persistence set to LOCAL');
        console.log('   Users will stay logged in across page refreshes!');
    })
    .catch((error) => {
        console.error('❌ Error setting persistence:', error);
    });

// Console log
console.log('🔥 Firebase initialized successfully!');
console.log('Project:', CONFIG.firebase.projectId);
console.log('Auth Domain:', CONFIG.firebase.authDomain);


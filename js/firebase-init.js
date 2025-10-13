// Firebase Initialization
// A product of Bradley Virtual Solutions, LLC

import { CONFIG } from './config.js';

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(CONFIG.firebase);
    console.log('🔥 Firebase initialized successfully!');
    console.log('   Project:', CONFIG.firebase.projectId);
}

// Export Firebase services
export const firebaseApp = firebase.app();
export const auth = firebase.auth();
export const db = firebase.firestore();

// CRITICAL: Set auth persistence BEFORE any auth operations
// This MUST happen synchronously before auth state is checked
(async function setupPersistence() {
    try {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        console.log('✅ Firebase Auth persistence: LOCAL');
        console.log('   ✅ Users will stay logged in across refreshes/restarts');
    } catch (error) {
        console.error('❌ Persistence error:', error);
    }
})();


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

// Console log
console.log('🔥 Firebase initialized successfully!');
console.log('Project:', CONFIG.firebase.projectId);
console.log('Auth Domain:', CONFIG.firebase.authDomain);


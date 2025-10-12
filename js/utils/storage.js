// Storage Management (Firestore + localStorage fallback)

import { db } from '../firebase-init.js';

export class StorageManager {
    constructor(storageKey = 'mindglowState') {
        this.storageKey = storageKey;
        this.firestore = db;
        this.useFirestore = true; // Use Firebase by default
    }

    async save(data) {
        try {
            // Save to Firestore if user is logged in
            if (this.useFirestore && data.user && data.user.uid) {
                await this.firestore.collection('users').doc(data.user.uid).set({
                    name: data.user.name,
                    email: data.user.email,
                    streak: data.streak || 0,
                    totalMinutes: data.totalMinutes || 0,
                    wellnessScore: data.wellnessScore || 0,
                    meditationGoal: data.meditationGoal || 20,
                    waterIntake: data.waterIntake || 0,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                
                console.log('✅ Data saved to Firestore');
            }
            
            // Also save to localStorage as backup
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to Firestore, using localStorage:', error);
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return false;
        }
    }

    async load() {
        try {
            // Try to load from localStorage first (for offline support)
            const localData = localStorage.getItem(this.storageKey);
            return localData ? JSON.parse(localData) : null;
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
            return null;
        }
    }
    
    async saveToFirestore(collection, docId, data) {
        try {
            await this.firestore.collection(collection).doc(docId).set(data, { merge: true });
            console.log(`✅ Saved to ${collection}/${docId}`);
            return true;
        } catch (error) {
            console.error(`Failed to save to ${collection}:`, error);
            return false;
        }
    }
    
    async loadFromFirestore(collection, docId) {
        try {
            const doc = await this.firestore.collection(collection).doc(docId).get();
            if (doc.exists) {
                return doc.data();
            }
            return null;
        } catch (error) {
            console.error(`Failed to load from ${collection}:`, error);
            return null;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
            return false;
        }
    }

    saveItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Failed to save ${key}:`, error);
            return false;
        }
    }

    loadItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Failed to load ${key}:`, error);
            return null;
        }
    }
}

// Singleton instance
export const storage = new StorageManager();


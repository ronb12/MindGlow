// Application State Management

import { CONFIG } from '../config.js';
import { storage } from './storage.js';

export class StateManager {
    constructor() {
        this.state = {
            user: null,
            currentPage: 'dashboard',
            theme: CONFIG.defaults.theme,
            streak: 0,
            totalMinutes: 0,
            badges: 0,
            wellnessScore: 0,
            meditationGoal: CONFIG.defaults.meditationGoal,
            waterIntake: 0,
            habits: [],
            mood: [],
            affirmations: [],
            journalEntries: [],
            notes: [],
            friends: [],
            sessionHistory: [],
            customAffirmations: [],
            cart: []
        };
        
        this.loadState();
    }

    loadState() {
        const savedState = storage.load();
        if (savedState) {
            this.state = { ...this.state, ...savedState };
        }
    }

    saveState() {
        storage.save(this.state);
    }

    updateState(updates) {
        this.state = { ...this.state, ...updates };
        this.saveState();
    }

    getState() {
        return this.state;
    }

    get(key) {
        return this.state[key];
    }

    set(key, value) {
        this.state[key] = value;
        this.saveState();
    }

    // Auto-save every 30 seconds
    startAutoSave() {
        setInterval(() => {
            if (this.state.user) {
                this.saveState();
            }
        }, 30000);
    }
}

// Singleton instance
export const appState = new StateManager();


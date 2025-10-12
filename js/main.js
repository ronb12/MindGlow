// MindGlow - Main Application Entry Point
// A product of Bradley Virtual Solutions, LLC

import { CONFIG } from './config.js';
import { appState } from './utils/state.js';
import { navigation } from './utils/navigation.js';
import { theme } from './utils/theme.js';
import { auth } from './auth/auth.js';
import { dashboard } from './features/dashboard.js';
import { meditation } from './features/meditation.js';
import { breathing } from './features/breathing.js';
import { wellness } from './features/wellness.js';
import { journal } from './features/journal.js';
import { community } from './features/community.js';
import { library } from './features/library.js';
import { settings } from './features/settings.js';
import { pomodoro } from './features/pomodoro.js';

class MindGlowApp {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        if (this.initialized) return;

        console.log(`%c🧘 ${CONFIG.appName} v${CONFIG.version}`, 'color: #6366f1; font-size: 20px; font-weight: bold');
        console.log(`%cA product of ${CONFIG.company}`, 'color: #8b5cf6; font-size: 14px');

        // Show loading screen
        this.showLoadingScreen();

        // Wait for DOM to be ready
        await this.waitForDOM();

        // Initialize core utilities
        this.initializeUtilities();

        // Initialize authentication
        auth.initialize();

        // Initialize all features
        this.initializeFeatures();

        // Setup event listeners
        this.setupEventListeners();

        // Start auto-save
        appState.startAutoSave();

        // Hide loading screen
        setTimeout(() => this.hideLoadingScreen(), 2000);

        this.initialized = true;
        console.log('✅ MindGlow initialized successfully!');
    }

    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const authSection = document.getElementById('auth-section');
        
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        if (authSection) {
            authSection.classList.remove('hidden');
        }
    }

    initializeUtilities() {
        navigation.initialize();
        theme.initialize();
    }

    initializeFeatures() {
        // Initialize all feature modules
        dashboard.initialize();
        meditation.initialize();
        breathing.initialize();
        wellness.initialize();
        journal.initialize();
        community.initialize();
        library.initialize();
        settings.initialize();
        pomodoro.initialize();
    }

    setupEventListeners() {
        // Listen for stats updates
        window.addEventListener('statsUpdated', () => {
            dashboard.loadStats();
        });

        // Listen for quick actions from dashboard
        window.addEventListener('quickAction', (e) => {
            this.handleQuickAction(e.detail);
        });

        // Listen for user login
        window.addEventListener('userLoggedIn', () => {
            this.onUserLogin();
        });
    }

    handleQuickAction(action) {
        switch(action) {
            case 'quick-meditate':
                navigation.navigateTo('meditate');
                meditation.startSession(5);
                break;
            case 'breathing':
                navigation.navigateTo('breathe');
                break;
            case 'mood-check':
                navigation.navigateTo('wellness');
                break;
            case 'sleep-story':
                navigation.navigateTo('meditate');
                break;
        }
    }

    onUserLogin() {
        // Refresh all features when user logs in
        dashboard.loadStats();
        wellness.renderHabits();
        wellness.renderWaterGlasses();
    }
}

// Create and initialize the app
const app = new MindGlowApp();
app.initialize();

// Export for debugging
window.MindGlow = {
    app,
    state: appState,
    navigation,
    theme,
    version: CONFIG.version
};


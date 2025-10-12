// Dashboard Feature Module

import { appState } from '../utils/state.js';
import { getRandomQuote } from '../data/quotes.js';
import { updateProgress } from '../utils/helpers.js';

export class DashboardFeature {
    constructor() {
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;
        
        this.displayQuote();
        this.loadStats();
        this.setupQuickActions();
        
        // Listen for user login
        window.addEventListener('userLoggedIn', () => {
            this.displayQuote();
            this.loadStats();
        });
        
        this.initialized = true;
    }

    displayQuote() {
        const quote = getRandomQuote();
        const quoteElement = document.getElementById('daily-quote');
        const authorElement = document.getElementById('quote-author');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = quote.text;
            authorElement.textContent = `- ${quote.author}`;
        }
    }

    loadStats() {
        const state = appState.getState();
        
        this.updateElement('streak-count', state.streak);
        this.updateElement('total-minutes', state.totalMinutes);
        this.updateElement('badges-earned', state.badges);
        this.updateElement('wellness-score', state.wellnessScore);
        
        // Update progress bars
        this.updateElement('meditation-done', 0);
        this.updateElement('water-done', state.waterIntake);
        this.updateElement('habits-done', state.habits.filter(h => h.completed).length);
        
        updateProgress('water-progress', state.waterIntake, 8);
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    setupQuickActions() {
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    handleQuickAction(action) {
        const event = new CustomEvent('quickAction', { detail: action });
        window.dispatchEvent(event);
    }

    updateProgress(current, goal, elementId) {
        updateProgress(elementId, current, goal);
    }
}

// Singleton instance
export const dashboard = new DashboardFeature();


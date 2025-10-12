// Settings Feature Module

import { appState } from '../utils/state.js';
import { showNotification } from '../utils/helpers.js';

export class SettingsFeature {
    constructor() {}

    initialize() {
        this.setupProfile();
        this.setupGoals();
        this.setupBackgrounds();
        this.setupDataManagement();
        this.setupCalendar();
    }

    setupProfile() {
        const updateBtn = document.getElementById('update-profile');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.updateProfile());
        }
    }

    setupGoals() {
        const updateBtn = document.getElementById('update-goal');
        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.updateGoal());
        }
    }

    setupBackgrounds() {
        this.renderBackgroundOptions();
    }

    setupDataManagement() {
        const exportBtn = document.getElementById('export-data');
        const historyBtn = document.getElementById('view-history');
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
        
        if (historyBtn) {
            historyBtn.addEventListener('click', () => this.viewHistory());
        }
    }

    setupCalendar() {
        const syncBtn = document.getElementById('sync-calendar');
        if (syncBtn) {
            syncBtn.addEventListener('click', () => this.syncCalendar());
        }
    }

    updateProfile() {
        const name = document.getElementById('profile-name').value;
        const email = document.getElementById('profile-email').value;
        
        const state = appState.getState();
        const user = { ...state.user };
        
        if (name) {
            user.name = name;
            document.getElementById('user-name').textContent = name;
        }
        if (email) {
            user.email = email;
        }
        
        appState.set('user', user);
        showNotification('Profile updated!');
    }

    updateGoal() {
        const goal = parseInt(document.getElementById('meditation-goal').value);
        if (goal) {
            appState.set('meditationGoal', goal);
            showNotification(`Meditation goal updated to ${goal} minutes!`);
        }
    }

    renderBackgroundOptions() {
        const backgrounds = [
            { color: '#6366f1', name: 'Indigo' },
            { color: '#8b5cf6', name: 'Purple' },
            { color: '#ec4899', name: 'Pink' },
            { color: '#10b981', name: 'Green' },
            { color: '#f59e0b', name: 'Orange' },
            { color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', name: 'Purple Gradient' },
            { color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', name: 'Pink Gradient' },
            { color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', name: 'Blue Gradient' }
        ];
        
        const container = document.getElementById('background-options');
        if (!container) return;
        
        // Get saved background
        const savedBg = localStorage.getItem('appBackground') || backgrounds[0].color;
        
        container.innerHTML = backgrounds.map((bg, i) => `
            <div class="background-option ${bg.color === savedBg ? 'active' : ''}" 
                 style="background: ${bg.color}" 
                 data-bg="${bg.color}"
                 title="${bg.name}"></div>
        `).join('');
        
        // Apply saved background
        this.applyBackground(savedBg);
        
        // Add click handlers
        container.querySelectorAll('.background-option').forEach(option => {
            option.addEventListener('click', () => {
                const bgColor = option.dataset.bg;
                
                // Update UI
                container.querySelectorAll('.background-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                
                // Apply background
                this.applyBackground(bgColor);
                
                // Save preference
                localStorage.setItem('appBackground', bgColor);
                
                console.log(`✅ Background changed to: ${option.title}`);
            });
        });
    }
    
    applyBackground(bgColor) {
        // Apply to body for visible effect
        const body = document.body;
        
        // Create a visible but not overwhelming background
        if (document.body.hasAttribute('data-theme')) {
            // Dark mode - use 60% opacity overlay
            body.style.background = `linear-gradient(rgba(17,24,39,0.6), rgba(17,24,39,0.6)), ${bgColor}`;
        } else {
            // Light mode - use 60% opacity overlay  
            body.style.background = `linear-gradient(rgba(249,250,251,0.6), rgba(249,250,251,0.6)), ${bgColor}`;
        }
        
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundSize = 'cover';
        
        console.log(`🎨 Background applied: ${bgColor.substring(0, 50)}...`);
    }

    exportData() {
        const state = appState.getState();
        const data = JSON.stringify(state, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindglow-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    viewHistory() {
        const modal = document.getElementById('history-modal');
        const content = document.getElementById('history-content');
        
        if (!modal || !content) return;
        
        const state = appState.getState();
        content.innerHTML = state.sessionHistory.reverse().map(session => `
            <div class="history-item">
                <h4>${session.type.charAt(0).toUpperCase() + session.type.slice(1)} Session</h4>
                <p>Duration: ${session.duration} minutes</p>
                <p class="date">${new Date(session.date).toLocaleString()}</p>
            </div>
        `).join('');
        
        modal.classList.remove('hidden');
        
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
    }

    syncCalendar() {
        showNotification('Calendar sync feature coming soon! This will integrate with your device calendar.');
    }
}

// Singleton instance
export const settings = new SettingsFeature();


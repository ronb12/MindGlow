// Settings Feature Module

import { appState } from '../utils/state.js';
import { showNotification } from '../utils/helpers.js';
import { pexelsAPI } from '../utils/pexels.js';

export class SettingsFeature {
    constructor() {
        this.dailyWallpaper = null;
    }

    initialize() {
        this.setupProfile();
        this.setupGoals();
        this.setupBackgrounds();
        this.setupDataManagement();
        this.setupCalendar();
        this.setupDailyWallpaper();
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
        // Apply background color directly to body (very visible)
        const body = document.body;
        body.style.background = bgColor;
        body.style.backgroundAttachment = 'fixed';
        body.style.backgroundSize = 'cover';
        
        // Add subtle pattern overlay for texture (optional)
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            // Light semi-transparent overlay for readability
            if (document.body.hasAttribute('data-theme')) {
                mainContent.style.backgroundColor = 'rgba(17, 24, 39, 0.85)';
            } else {
                mainContent.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            }
        }
        
        console.log(`🎨 Background applied: ${bgColor}`);
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

    // Setup daily wallpaper feature
    setupDailyWallpaper() {
        const container = document.getElementById('background-options');
        if (!container) return;

        // Add daily wallpaper button
        if (!document.getElementById('daily-wallpaper-btn')) {
            const buttonHTML = `
                <button id="daily-wallpaper-btn" class="btn-primary" style="width: 100%; margin-top: 15px;">
                    <i class="fas fa-calendar-day"></i> Get Daily Wallpaper
                </button>
            `;
            container.insertAdjacentHTML('afterend', buttonHTML);

            document.getElementById('daily-wallpaper-btn').addEventListener('click', () => {
                this.loadDailyWallpaper();
            });
        }
    }

    // Load daily wallpaper from Pexels
    async loadDailyWallpaper() {
        try {
            showNotification('Loading today\'s wallpaper...', 'info');
            
            this.dailyWallpaper = await pexelsAPI.getDailyWallpaper();
            
            if (this.dailyWallpaper) {
                // Apply the daily wallpaper
                const wallpaperUrl = this.dailyWallpaper.src.large2x;
                document.body.style.backgroundImage = `
                    linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
                    url(${wallpaperUrl})
                `;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                document.body.style.backgroundAttachment = 'fixed';
                
                showNotification(`Today's wallpaper by ${this.dailyWallpaper.photographer} 📸`, 'success');
                
                // Save to localStorage so it persists
                localStorage.setItem('dailyWallpaper', JSON.stringify({
                    url: wallpaperUrl,
                    photographer: this.dailyWallpaper.photographer,
                    date: new Date().toDateString()
                }));
            }
        } catch (error) {
            console.error('Error loading daily wallpaper:', error);
            showNotification('Could not load daily wallpaper', 'error');
        }
    }
}

// Singleton instance
export const settings = new SettingsFeature();


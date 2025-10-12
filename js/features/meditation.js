// Meditation Feature Module

import { appState } from '../utils/state.js';
import { meditationSessions, getSessionsByCategory, getSessionById } from '../data/meditations.js';
import { ambientSounds } from '../data/sounds.js';
import { updateProgress, showNotification } from '../utils/helpers.js';

export class MeditationFeature {
    constructor() {
        this.timer = null;
        this.selectedTime = 10;
    }

    initialize() {
        this.renderSessions('all');
        this.renderAmbientSounds();
        this.setupTimer();
        this.setupCategories();
    }

    setupCategories() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderSessions(btn.dataset.category);
            });
        });
    }

    renderSessions(category) {
        const grid = document.getElementById('meditation-grid');
        if (!grid) return;
        
        const sessions = getSessionsByCategory(category);
        
        grid.innerHTML = sessions.map(session => `
            <div class="meditation-card" data-id="${session.id}">
                <h4>${session.title}</h4>
                <p>${session.description}</p>
                <p class="duration"><i class="fas fa-clock"></i> ${session.duration} min</p>
            </div>
        `).join('');
        
        grid.querySelectorAll('.meditation-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                const session = getSessionById(id);
                this.startSession(session.duration);
            });
        });
    }

    renderAmbientSounds() {
        const grid = document.getElementById('sounds-grid');
        if (!grid) return;
        
        grid.innerHTML = ambientSounds.map(sound => `
            <div class="sound-card" data-id="${sound.id}">
                <i class="fas fa-${sound.icon}"></i>
                <p>${sound.name}</p>
            </div>
        `).join('');
        
        grid.querySelectorAll('.sound-card').forEach(card => {
            card.addEventListener('click', () => {
                grid.querySelectorAll('.sound-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }

    setupTimer() {
        const timerBtns = document.querySelectorAll('.timer-btn');
        const startBtn = document.getElementById('start-timer');
        
        timerBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedTime = parseInt(btn.dataset.time);
                document.getElementById('timer-minutes').textContent = this.selectedTime;
                document.getElementById('timer-seconds').textContent = '00';
            });
        });
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startSession(this.selectedTime);
            });
        }
    }

    startSession(minutes) {
        let seconds = minutes * 60;
        
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            seconds--;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            
            document.getElementById('timer-minutes').textContent = mins.toString().padStart(2, '0');
            document.getElementById('timer-seconds').textContent = secs.toString().padStart(2, '0');
            
            if (seconds <= 0) {
                clearInterval(this.timer);
                this.completeSession(minutes);
            }
        }, 1000);
    }

    completeSession(minutes) {
        const state = appState.getState();
        
        appState.updateState({
            totalMinutes: state.totalMinutes + minutes,
            streak: state.streak + 1,
            wellnessScore: state.wellnessScore + 10,
            sessionHistory: [
                ...state.sessionHistory,
                {
                    type: 'meditation',
                    duration: minutes,
                    date: new Date().toISOString()
                }
            ]
        });
        
        // Update progress
        const current = parseInt(document.getElementById('meditation-done').textContent);
        document.getElementById('meditation-done').textContent = current + minutes;
        updateProgress('meditation-progress', current + minutes, state.meditationGoal);
        
        // Reload stats
        window.dispatchEvent(new Event('statsUpdated'));
        
        showNotification('Meditation session complete! 🎉');
    }
}

// Singleton instance
export const meditation = new MeditationFeature();


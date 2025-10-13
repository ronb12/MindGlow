// Meditation Feature Module

import { appState } from '../utils/state.js';
import { meditationSessions, getSessionsByCategory, getSessionById } from '../data/meditations.js';
import { ambientSounds } from '../data/sounds.js';
import { updateProgress, showNotification } from '../utils/helpers.js';
import { soundGenerator } from '../utils/audio-generator.js';

export class MeditationFeature {
    constructor() {
        this.timer = null;
        this.selectedTime = 10;
        this.currentSound = null;
        this.volume = 0.4;
    }

    initialize() {
        this.renderSessions('all');
        this.renderAmbientSounds();
        this.setupTimer();
        this.setupCategories();
        this.setupVolumeControl();
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
        
        // Create sound cards (Web Audio API - no audio elements needed)
        grid.innerHTML = ambientSounds.map(sound => `
            <div class="sound-card" data-id="${sound.id}" data-name="${sound.name}">
                <i class="fas fa-${sound.icon}"></i>
                <p>${sound.name}</p>
            </div>
        `).join('');
        
        // Setup click handlers for playback
        grid.querySelectorAll('.sound-card').forEach(card => {
            card.addEventListener('click', () => {
                const soundId = parseInt(card.dataset.id);
                const soundName = card.dataset.name;
                this.playSound(soundId, soundName);
                
                // Update visual state
                grid.querySelectorAll('.sound-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
        
        // Auto-select first sound (visual only)
        const firstCard = grid.querySelector('.sound-card');
        if (firstCard) {
            firstCard.classList.add('active');
        }
        
        // Add instructions for user
        const soundsSection = document.querySelector('.sounds-section h3');
        if (soundsSection && !document.getElementById('sound-instructions')) {
            const instructions = document.createElement('p');
            instructions.id = 'sound-instructions';
            instructions.style.cssText = 'text-align: center; margin: 0.5rem 0; opacity: 0.7; font-size: 0.9rem;';
            instructions.innerHTML = '🎵 Click any sound below - <strong>Each sound name matches what you\'ll hear!</strong>';
            soundsSection.insertAdjacentElement('afterend', instructions);
        }
    }

    playSound(soundId, soundName) {
        try {
            // Set volume
            soundGenerator.setVolume(this.volume);
            
            // Play the appropriate sound using Web Audio API
            const soundMethods = {
                1: () => soundGenerator.playRain(),
                2: () => soundGenerator.playOcean(),
                3: () => soundGenerator.playForest(),
                4: () => soundGenerator.playBirds(),
                5: () => soundGenerator.playWind(),
                6: () => soundGenerator.playFire(),
                7: () => soundGenerator.playStream(),
                8: () => soundGenerator.playThunder()
            };
            
            if (soundMethods[soundId]) {
                soundMethods[soundId]();
                this.currentSound = soundId;
                
                // Update instructions
                const instructions = document.getElementById('sound-instructions');
                if (instructions) {
                    instructions.innerHTML = `🎵 Now playing: <strong>${soundName}</strong> - Sound matches the name!`;
                }
                
                showNotification(`Playing ${soundName}`, 'success');
            } else {
                console.error(`Unknown sound ID: ${soundId}`);
                showNotification(`Sound not found`, 'error');
            }
            
        } catch (err) {
            console.error(`❌ Failed to play sound: ${soundName}`, err);
            showNotification(`Error playing ${soundName}. Try again.`, 'error');
        }
    }

    setupVolumeControl() {
        // Create volume control if it doesn't exist
        const soundsSection = document.querySelector('.sounds-section');
        if (!soundsSection) return;
        
        let volumeControl = document.getElementById('sound-volume-control');
        if (!volumeControl) {
            const volumeHtml = `
                <div class="volume-control" style="margin-top: 1rem; display: flex; align-items: center; gap: 1rem; justify-content: center;">
                    <i class="fas fa-volume-down" style="font-size: 1.2rem;"></i>
                    <input type="range" id="sound-volume-control" min="0" max="100" value="40" 
                           style="width: 200px; cursor: pointer;">
                    <i class="fas fa-volume-up" style="font-size: 1.2rem;"></i>
                    <span id="volume-percentage" style="min-width: 40px;">40%</span>
                </div>
            `;
            soundsSection.insertAdjacentHTML('beforeend', volumeHtml);
            volumeControl = document.getElementById('sound-volume-control');
        }
        
        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                const newVolume = parseInt(e.target.value) / 100;
                this.volume = newVolume;
                
                // Update sound generator volume
                soundGenerator.setVolume(newVolume);
                
                // Update percentage display
                const percentageDisplay = document.getElementById('volume-percentage');
                if (percentageDisplay) {
                    percentageDisplay.textContent = `${Math.round(newVolume * 100)}%`;
                }
                
                console.log(`🔊 Volume set to: ${Math.round(newVolume * 100)}%`);
            });
        }
    }

    stopAllSounds() {
        soundGenerator.stop();
        this.currentSound = null;
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


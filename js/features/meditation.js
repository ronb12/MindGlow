// Meditation Feature Module

import { appState } from '../utils/state.js';
import { meditationSessions, getSessionsByCategory, getSessionById } from '../data/meditations.js';
import { ambientSounds } from '../data/sounds.js';
import { updateProgress, showNotification } from '../utils/helpers.js';

export class MeditationFeature {
    constructor() {
        this.timer = null;
        this.selectedTime = 10;
        this.audioElements = new Map();
        this.currentSound = null;
        this.volume = 0.5;
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
        
        // Create sound cards with real audio elements
        grid.innerHTML = ambientSounds.map(sound => `
            <div class="sound-card" data-id="${sound.id}" data-name="${sound.name}">
                <i class="fas fa-${sound.icon}"></i>
                <p>${sound.name}</p>
                <audio id="sound-${sound.id}" src="${sound.url}" loop preload="metadata" crossorigin="anonymous"></audio>
            </div>
        `).join('');
        
        // Store audio elements
        ambientSounds.forEach(sound => {
            const audio = document.getElementById(`sound-${sound.id}`);
            if (audio) {
                audio.volume = this.volume;
                this.audioElements.set(sound.id, audio);
                
                // Add error handling
                audio.addEventListener('error', (e) => {
                    console.error(`Failed to load ${sound.name}:`, e);
                });
                
                audio.addEventListener('loadeddata', () => {
                    console.log(`✅ ${sound.name} loaded successfully`);
                });
            }
        });
        
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
            instructions.textContent = '🎵 Click any sound to play high-quality ambient audio';
            soundsSection.insertAdjacentElement('afterend', instructions);
        }
    }

    playSound(soundId, soundName) {
        // Stop current sound
        if (this.currentSound && this.audioElements.has(this.currentSound)) {
            const currentAudio = this.audioElements.get(this.currentSound);
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        // Play new sound
        const newAudio = this.audioElements.get(soundId);
        if (newAudio) {
            newAudio.volume = this.volume;
            
            const playPromise = newAudio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`✅ Playing ambient sound: ${soundName}`);
                        this.currentSound = soundId;
                        
                        // Update instructions
                        const instructions = document.getElementById('sound-instructions');
                        if (instructions) {
                            instructions.textContent = `🎵 Now playing: ${soundName}`;
                        }
                        
                        showNotification(`Playing ${soundName}`, 'success');
                    })
                    .catch(err => {
                        console.error(`❌ Failed to play sound: ${soundName}`, err);
                        
                        // User-friendly error messages
                        if (err.name === 'NotAllowedError') {
                            showNotification(`Click again to play ${soundName}`, 'warning');
                        } else if (err.name === 'NotSupportedError') {
                            showNotification(`${soundName} format not supported`, 'error');
                        } else {
                            showNotification(`Loading ${soundName}...`, 'info');
                            // Try again after a short delay
                            setTimeout(() => {
                                newAudio.play()
                                    .then(() => {
                                        console.log(`✅ ${soundName} playing after retry`);
                                        const instructions = document.getElementById('sound-instructions');
                                        if (instructions) {
                                            instructions.textContent = `🎵 Now playing: ${soundName}`;
                                        }
                                    })
                                    .catch(e => console.error(`Retry failed for ${soundName}:`, e));
                            }, 1000);
                        }
                    });
            }
        } else {
            console.error(`No audio element found for sound ID: ${soundId}`);
            showNotification(`Sound not found`, 'error');
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
                    <input type="range" id="sound-volume-control" min="0" max="100" value="50" 
                           style="width: 200px; cursor: pointer;">
                    <i class="fas fa-volume-up" style="font-size: 1.2rem;"></i>
                    <span id="volume-percentage" style="min-width: 40px;">50%</span>
                </div>
            `;
            soundsSection.insertAdjacentHTML('beforeend', volumeHtml);
            volumeControl = document.getElementById('sound-volume-control');
        }
        
        if (volumeControl) {
            volumeControl.addEventListener('input', (e) => {
                const newVolume = parseInt(e.target.value) / 100;
                this.volume = newVolume;
                
                // Update all audio elements
                this.audioElements.forEach(audio => {
                    audio.volume = newVolume;
                });
                
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
        this.audioElements.forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
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


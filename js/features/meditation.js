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
        this.volume = 0.6;
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
        
        // Create music cards with title and artist
        grid.innerHTML = ambientSounds.map(music => `
            <div class="music-card" data-id="${music.id}" data-category="${music.category}">
                <div class="music-icon">
                    <i class="fas fa-${music.icon}"></i>
                </div>
                <div class="music-info">
                    <h4 class="music-title">${music.title}</h4>
                    <p class="music-artist">by ${music.artist}</p>
                    <span class="music-category ${music.category.toLowerCase()}">${music.category}</span>
                    <span class="music-duration">${music.duration}</span>
                </div>
                <audio id="music-${music.id}" src="${music.url}" loop preload="metadata"></audio>
            </div>
        `).join('');
        
        // Store audio elements
        ambientSounds.forEach(music => {
            const audio = document.getElementById(`music-${music.id}`);
            if (audio) {
                audio.volume = this.volume;
                this.audioElements.set(music.id, audio);
            }
        });
        
        // Setup click handlers for playback
        grid.querySelectorAll('.music-card').forEach(card => {
            card.addEventListener('click', () => {
                const musicId = parseInt(card.dataset.id);
                const music = ambientSounds.find(m => m.id === musicId);
                this.playSound(musicId, music.title, music.artist);
                
                // Update visual state
                grid.querySelectorAll('.music-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
        
        // Auto-select first music (visual only)
        const firstCard = grid.querySelector('.music-card');
        if (firstCard) {
            firstCard.classList.add('active');
        }
        
        // Add instructions and attribution
        const soundsSection = document.querySelector('.sounds-section h3');
        if (soundsSection) {
            // Update section title
            soundsSection.textContent = 'Ambient Music';
            
            if (!document.getElementById('music-instructions')) {
                const instructions = document.createElement('p');
                instructions.id = 'music-instructions';
                instructions.style.cssText = 'text-align: center; margin: 0.5rem 0 1rem 0; opacity: 0.8; font-size: 0.95rem;';
                instructions.innerHTML = '🎵 16 tracks for meditation, relaxation & sleep • Click to play';
                soundsSection.insertAdjacentElement('afterend', instructions);
            }
            
            // Add CC attribution
            if (!document.getElementById('music-attribution')) {
                const attribution = document.createElement('p');
                attribution.id = 'music-attribution';
                attribution.style.cssText = 'text-align: center; margin-top: 1.5rem; padding: 1rem; opacity: 0.7; font-size: 0.85rem; border-top: 1px solid var(--border-color);';
                attribution.innerHTML = '🎼 Music by <strong>Kevin MacLeod</strong> (incompetech.com)<br>Licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" style="color: var(--primary-color);">Creative Commons: By Attribution 4.0</a>';
                soundsSection.parentElement.appendChild(attribution);
            }
        }
    }

    playSound(soundId, title, artist) {
        // Stop current music
        if (this.currentSound && this.audioElements.has(this.currentSound)) {
            const currentAudio = this.audioElements.get(this.currentSound);
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        
        // Play new music
        const newAudio = this.audioElements.get(soundId);
        if (newAudio) {
            newAudio.volume = this.volume;
            
            // Force load if not ready
            if (newAudio.readyState < 2) {
                newAudio.load();
            }
            
            const playPromise = newAudio.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log(`✅ Playing: ${title} by ${artist}`);
                        this.currentSound = soundId;
                        
                        // Update instructions with now playing info
                        const instructions = document.getElementById('music-instructions');
                        if (instructions) {
                            instructions.innerHTML = `🎵 Now playing: <strong>${title}</strong> by ${artist}`;
                        }
                        
                        showNotification(`Playing: ${title}`, 'success');
                    })
                    .catch(err => {
                        console.error(`❌ Failed to play: ${title}`, err);
                        console.error('Error details:', err.name, err.message);
                        
                        if (err.name === 'NotAllowedError') {
                            showNotification(`Click again to play ${title}`, 'warning');
                        } else if (err.name === 'NotSupportedError') {
                            showNotification(`${title} - Format not supported or URL unavailable`, 'error');
                        } else {
                            showNotification(`Loading ${title}... Please wait`, 'info');
                            // Retry up to 3 times with delays
                            this.retryPlayback(newAudio, title, artist, 0);
                        }
                    });
            }
        } else {
            console.error(`No audio element found for music ID: ${soundId}`);
        }
    }

    retryPlayback(audio, title, artist, attempt) {
        if (attempt >= 3) {
            console.error(`Failed to play ${title} after 3 attempts`);
            showNotification(`${title} unavailable. Try another track.`, 'error');
            return;
        }
        
        setTimeout(() => {
            audio.load(); // Force reload
            audio.play()
                .then(() => {
                    console.log(`✅ ${title} playing after retry #${attempt + 1}`);
                    this.currentSound = parseInt(audio.id.replace('music-', ''));
                    const instructions = document.getElementById('music-instructions');
                    if (instructions) {
                        instructions.innerHTML = `🎵 Now playing: <strong>${title}</strong> by ${artist}`;
                    }
                    showNotification(`Playing: ${title}`, 'success');
                })
                .catch(e => {
                    console.error(`Retry #${attempt + 1} failed for ${title}`);
                    this.retryPlayback(audio, title, artist, attempt + 1);
                });
        }, 1500 * (attempt + 1)); // Increasing delays: 1.5s, 3s, 4.5s
    }

    setupVolumeControl() {
        // Create volume control if it doesn't exist
        const soundsSection = document.querySelector('.sounds-section');
        if (!soundsSection) return;
        
        let volumeControl = document.getElementById('sound-volume-control');
        if (!volumeControl) {
            const volumeHtml = `
                <div class="volume-control" style="margin-top: 1.5rem; display: flex; align-items: center; gap: 1rem; justify-content: center;">
                    <i class="fas fa-volume-down" style="font-size: 1.2rem;"></i>
                    <input type="range" id="sound-volume-control" min="0" max="100" value="60" 
                           style="width: 200px; cursor: pointer;">
                    <i class="fas fa-volume-up" style="font-size: 1.2rem;"></i>
                    <span id="volume-percentage" style="min-width: 40px;">60%</span>
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


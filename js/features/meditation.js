// Meditation Feature Module

import { appState } from '../utils/state.js';
import { meditationSessions, getSessionsByCategory, getSessionById } from '../data/meditations.js';
import { ambientSounds } from '../data/sounds.js';
import { updateProgress, showNotification } from '../utils/helpers.js';
import { pexelsAPI } from '../utils/pexels.js';

export class MeditationFeature {
    constructor() {
        this.timer = null;
        this.selectedTime = 10;
        this.audioElements = new Map();
        this.currentSound = null;
        this.volume = 0.6;
        this.backgroundImages = [];
        this.currentVideoUrl = null;
    }

    initialize() {
        this.renderSessions('all');
        this.renderAmbientSounds();
        this.setupTimer();
        this.setupCategories();
        this.setupVolumeControl();
        this.loadMeditationBackgrounds();
        this.setupBackgroundControls();
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
                this.openMeditationModal(session);
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
        
        // Store audio elements and preload
        ambientSounds.forEach(music => {
            const audio = document.getElementById(`music-${music.id}`);
            if (audio) {
                audio.volume = this.volume;
                audio.preload = 'auto'; // Force preloading
                this.audioElements.set(music.id, audio);
                
                // Start loading immediately
                audio.load();
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
                instructions.innerHTML = '🎵 High-quality ambient music - Click any track to play';
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

    async playSound(soundId, title, artist) {
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
            
            // Wait for audio to be ready to play
            if (newAudio.readyState < 3) {
                console.log(`🔄 Loading ${title}... (readyState: ${newAudio.readyState})`);
                newAudio.load();
                
                // Wait for canplaythrough or timeout
                await new Promise((resolve) => {
                    const timeout = setTimeout(() => {
                        console.log('Loading timeout - attempting play anyway');
                        resolve();
                    }, 3000);
                    
                    const onReady = () => {
                        clearTimeout(timeout);
                        newAudio.removeEventListener('canplaythrough', onReady);
                        console.log(`✓ ${title} ready to play`);
                        resolve();
                    };
                    
                    if (newAudio.readyState >= 3) {
                        clearTimeout(timeout);
                        resolve();
                    } else {
                        newAudio.addEventListener('canplaythrough', onReady, { once: true });
                    }
                });
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

    // Load meditation backgrounds from Pexels
    async loadMeditationBackgrounds() {
        try {
            this.backgroundImages = await pexelsAPI.getMeditationPhotos(15);
            console.log('✅ Loaded', this.backgroundImages.length, 'meditation backgrounds');
        } catch (error) {
            console.error('Error loading backgrounds:', error);
        }
    }

    // Setup background controls
    setupBackgroundControls() {
        // Add background controls if not exists
        if (!document.getElementById('bg-controls')) {
            const controlsHTML = `
                <div id="bg-controls" style="position: fixed; bottom: 20px; right: 20px; z-index: 100; display: none; gap: 10px;">
                    <button id="change-bg" class="btn-secondary" style="padding: 10px 15px; border-radius: 8px;">
                        <i class="fas fa-image"></i> Change Background
                    </button>
                    <button id="toggle-video" class="btn-secondary" style="padding: 10px 15px; border-radius: 8px;">
                        <i class="fas fa-video"></i> Video Mode
                    </button>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', controlsHTML);

            // Change background button
            document.getElementById('change-bg').addEventListener('click', () => {
                this.changeRandomBackground();
            });

            // Toggle video button
            document.getElementById('toggle-video').addEventListener('click', () => {
                this.toggleVideoBackground();
            });
            
            // Show controls if we're on meditation page
            const currentPage = document.getElementById('meditate-page');
            if (currentPage && currentPage.classList.contains('active')) {
                document.getElementById('bg-controls').style.display = 'flex';
            }
        }
    }

    // Change to random background
    changeRandomBackground() {
        if (this.backgroundImages.length === 0) {
            showNotification('Loading backgrounds...', 'info');
            this.loadMeditationBackgrounds().then(() => {
                this.applyRandomBackground();
            });
        } else {
            this.applyRandomBackground();
        }
    }

    // Apply random background
    applyRandomBackground() {
        const randomImage = this.backgroundImages[Math.floor(Math.random() * this.backgroundImages.length)];
        if (randomImage) {
            document.body.style.backgroundImage = `
                linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)),
                url(${randomImage.src.large2x})
            `;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            
            showNotification(`Background by ${randomImage.photographer}`, 'success');
        }
    }

    // Toggle video background
    async toggleVideoBackground() {
        const videoBtn = document.getElementById('toggle-video');
        
        if (this.currentVideoUrl) {
            // Remove video
            const videoElement = document.getElementById('meditation-video-bg');
            if (videoElement) {
                videoElement.remove();
                this.currentVideoUrl = null;
                videoBtn.innerHTML = '<i class="fas fa-video"></i> Video Mode';
                showNotification('Video mode disabled', 'info');
            }
        } else {
            // Add video
            showNotification('Loading calming video...', 'info');
            const videos = await pexelsAPI.getCalmingVideos(5);
            
            if (videos.length > 0) {
                const video = videos[0];
                const videoFile = video.video_files.find(f => f.quality === 'hd' || f.quality === 'sd');
                
                if (videoFile) {
                    this.createVideoBackground(videoFile.link);
                    this.currentVideoUrl = videoFile.link;
                    videoBtn.innerHTML = '<i class="fas fa-times"></i> Exit Video';
                    showNotification('Video mode active', 'success');
                }
            }
        }
    }

    // Create video background
    createVideoBackground(videoUrl) {
        // Remove existing video if any
        const existing = document.getElementById('meditation-video-bg');
        if (existing) existing.remove();

        const videoHTML = `
            <video id="meditation-video-bg" autoplay loop muted playsinline
                   style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                          object-fit: cover; z-index: -1; opacity: 0.7;">
                <source src="${videoUrl}" type="video/mp4">
            </video>
        `;
        document.body.insertAdjacentHTML('afterbegin', videoHTML);
    }

    // Open meditation modal with video + music
    async openMeditationModal(session) {
        // Remove existing modal if any
        const existing = document.getElementById('meditation-modal');
        if (existing) existing.remove();

        showNotification('Loading meditation experience...', 'info');

        // Fetch a calming video from Pexels
        const videos = await pexelsAPI.getCalmingVideos(5);
        const videoUrl = videos.length > 0 ? 
            videos[0].video_files.find(f => f.quality === 'hd' || f.quality === 'sd')?.link : null;

        // Pick a random ambient music
        const randomMusic = ambientSounds[Math.floor(Math.random() * ambientSounds.length)];

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'meditation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        modal.innerHTML = `
            ${videoUrl ? `
                <video autoplay loop muted playsinline
                       style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                              object-fit: cover; opacity: 0.4;">
                    <source src="${videoUrl}" type="video/mp4">
                </video>
            ` : ''}
            
            <div style="position: relative; z-index: 10; max-width: 600px; width: 90%; 
                        background: rgba(0,0,0,0.7); padding: 40px; border-radius: 20px;
                        backdrop-filter: blur(10px); text-align: center; color: white;">
                
                <button id="close-meditation-modal" 
                        style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2);
                               border: none; color: white; font-size: 24px; cursor: pointer; 
                               width: 40px; height: 40px; border-radius: 50%; line-height: 40px;">
                    ×
                </button>

                <h2 style="margin: 0 0 10px 0; font-size: 32px;">${session.title}</h2>
                <p style="margin: 0 0 20px 0; opacity: 0.9; font-size: 16px;">${session.description}</p>
                
                <div style="margin: 30px 0;">
                    <div style="font-size: 72px; font-weight: 200; letter-spacing: 2px; font-family: 'Courier New', monospace;">
                        <span id="modal-timer-minutes">${session.duration.toString().padStart(2, '0')}</span>:<span id="modal-timer-seconds">00</span>
                    </div>
                </div>

                <div style="margin: 20px 0; padding: 20px; background: rgba(255,255,255,0.1); border-radius: 10px;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                        <i id="music-icon" class="fas fa-music" style="font-size: 18px;"></i>
                        <span style="font-size: 16px; font-weight: 600;">${randomMusic.title}</span>
                    </div>
                    <div style="opacity: 0.7; font-size: 14px; margin-bottom: 15px;">by ${randomMusic.artist}</div>
                    
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 15px;">
                        <i class="fas fa-volume-down" style="font-size: 14px;"></i>
                        <input type="range" id="modal-volume-slider" min="0" max="100" value="80" 
                               style="flex: 1; cursor: pointer; height: 6px; border-radius: 3px; 
                                      background: rgba(255,255,255,0.3); outline: none;">
                        <i class="fas fa-volume-up" style="font-size: 14px;"></i>
                        <span id="modal-volume-display" style="min-width: 35px; font-size: 13px;">80%</span>
                    </div>
                </div>

                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">
                    <button id="start-modal-session" class="btn-primary" 
                            style="padding: 15px 40px; font-size: 18px; border-radius: 30px;">
                        <i class="fas fa-play"></i> Start Session
                    </button>
                    <button id="pause-modal-session" class="btn-secondary" 
                            style="padding: 15px 40px; font-size: 18px; border-radius: 30px; display: none;">
                        <i class="fas fa-pause"></i> Pause
                    </button>
                </div>

                <audio id="modal-meditation-audio" loop preload="auto">
                    <source src="${randomMusic.url}" type="audio/mpeg">
                </audio>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup controls
        const audio = modal.querySelector('#modal-meditation-audio');
        const startBtn = modal.querySelector('#start-modal-session');
        const pauseBtn = modal.querySelector('#pause-modal-session');
        const closeBtn = modal.querySelector('#close-meditation-modal');
        const minutesEl = modal.querySelector('#modal-timer-minutes');
        const secondsEl = modal.querySelector('#modal-timer-seconds');

        let isRunning = false;
        let timeRemaining = session.duration * 60;
        let timerInterval = null;

        // Set audio volume to 80% for clear audibility
        audio.volume = 0.8;
        audio.muted = false; // CRITICAL: Ensure audio is NOT muted
        audio.preload = 'auto'; // Preload the audio
        
        console.log('🎵 Modal audio initialized:', {
            volume: audio.volume,
            muted: audio.muted,
            src: audio.querySelector('source')?.src
        });
        
        // Volume slider control
        const volumeSlider = modal.querySelector('#modal-volume-slider');
        const volumeDisplay = modal.querySelector('#modal-volume-display');
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = parseInt(e.target.value) / 100;
                audio.volume = volume;
                volumeDisplay.textContent = `${e.target.value}%`;
                console.log(`🔊 Modal volume: ${e.target.value}%`);
            });
        }
        
        // Start/Resume button
        startBtn.addEventListener('click', () => {
            if (!isRunning) {
                // CRITICAL: Ensure audio is unmuted and volume is set
                audio.muted = false;
                audio.volume = 0.8;
                
                // Load and play audio
                audio.load();
                
                const playPromise = audio.play();
                
if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            console.log('✅ Modal music playing at 80% volume');
                            console.log('🔊 Audio state:', {
                                playing: !audio.paused,
                                volume: audio.volume,
                                muted: audio.muted,
                                currentTime: audio.currentTime,
                                readyState: audio.readyState
                            });
                            
                            // Animate music icon to show it's playing
                            const musicIcon = modal.querySelector('#music-icon');
                            if (musicIcon) {
                                musicIcon.style.animation = 'pulse 2s ease-in-out infinite';
                            }
                            
                            // Show notification with volume info
                            showNotification(`🎵 Music playing at ${Math.round(audio.volume * 100)}% volume`, 'success');
                            
                            // Check audio is actually producing sound after 1 second
                            setTimeout(() => {
                                if (!audio.muted && audio.volume > 0 && !audio.paused) {
                                    console.log('✅ Audio confirmed playing with sound');
                                } else {
                                    console.warn('⚠️ Audio may be muted or paused');
                                    showNotification('🔊 If you can\'t hear music, check device volume', 'info');
                                }
                            }, 1000);
                        })
                        .catch(err => {
                            console.error('❌ Audio play failed:', err);
                            showNotification('Click Start again to enable music 🎵', 'warning');
                        });
                }
                
                timerInterval = setInterval(() => {
                    timeRemaining--;
                    const mins = Math.floor(timeRemaining / 60);
                    const secs = timeRemaining % 60;
                    minutesEl.textContent = mins.toString().padStart(2, '0');
                    secondsEl.textContent = secs.toString().padStart(2, '0');

                    if (timeRemaining <= 0) {
                        clearInterval(timerInterval);
                        this.completeSession(session.duration);
                        modal.remove();
                        showNotification('Meditation complete! 🎉', 'success');
                    }
                }, 1000);

                startBtn.style.display = 'none';
                pauseBtn.style.display = 'inline-block';
                isRunning = true;
            }
        });

        // Pause button
        pauseBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            audio.pause();
            startBtn.style.display = 'inline-block';
            pauseBtn.style.display = 'none';
            isRunning = false;
        });

        // Close button
        closeBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            audio.pause();
            modal.remove();
        });

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                clearInterval(timerInterval);
                audio.pause();
                modal.remove();
            }
        });
    }
}

// Singleton instance
export const meditation = new MeditationFeature();


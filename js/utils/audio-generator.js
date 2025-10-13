// Web Audio API - Generate High-Quality Ambient Sounds
// Each sound is carefully crafted to MATCH its label

export class AmbientSoundGenerator {
    constructor() {
        this.audioContext = null;
        this.currentSources = [];
        this.gainNode = null;
        this.volume = 0.4;
    }

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.volume;
        }
    }

    stop() {
        if (this.currentSources.length > 0) {
            this.currentSources.forEach(source => {
                try {
                    if (source.stop) source.stop();
                    if (source.disconnect) source.disconnect();
                } catch (e) {
                    // Already stopped
                }
            });
            this.currentSources = [];
        }
    }

    setVolume(volume) {
        this.volume = volume;
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }
    }

    // White noise generator
    createNoiseBuffer() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    // Pink noise (better for nature sounds)
    createPinkNoiseBuffer() {
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11;
            b6 = white * 0.115926;
        }
        return buffer;
    }

    playRain() {
        this.stop();
        this.init();

        // RAIN: Continuous pink noise with gentle filtering
        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.createPinkNoiseBuffer();
        noise.loop = true;

        // Filter for realistic rain sound (high frequency removed)
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000; // Softer, more rain-like
        filter.Q.value = 0.5;

        // Subtle variation
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.3;
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const rainGain = this.audioContext.createGain();
        rainGain.gain.value = 0.6;

        noise.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(this.gainNode);
        noise.start();
        lfo.start();

        this.currentSources = [noise, lfo];
        console.log('✅ Playing RAIN (continuous rainfall)');
    }

    playOcean() {
        this.stop();
        this.init();

        // OCEAN: Slow wave crashes with white noise
        // Wave motion (slow oscillation)
        const wave1 = this.audioContext.createOscillator();
        wave1.type = 'sine';
        wave1.frequency.value = 0.15; // Very slow waves

        const wave2 = this.audioContext.createOscillator();
        wave2.type = 'sine';
        wave2.frequency.value = 0.22; // Slightly faster for variation

        // Modulate the waves
        const waveLFO = this.audioContext.createOscillator();
        waveLFO.frequency.value = 0.08;
        const waveLFOGain = this.audioContext.createGain();
        waveLFOGain.gain.value = 0.05;
        waveLFO.connect(waveLFOGain);
        waveLFOGain.connect(wave1.frequency);

        // White noise for water texture
        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        // Bandpass filter for ocean character
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        filter.Q.value = 0.7;

        // Gain control for waves and noise
        const waveGain = this.audioContext.createGain();
        waveGain.gain.value = 0.15;
        
        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.value = 0.25;

        // Connect everything
        wave1.connect(waveGain);
        wave2.connect(waveGain);
        waveGain.connect(this.gainNode);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.gainNode);

        wave1.start();
        wave2.start();
        waveLFO.start();
        noise.start();

        this.currentSources = [wave1, wave2, waveLFO, noise];
        console.log('✅ Playing OCEAN (waves crashing)');
    }

    playForest() {
        this.stop();
        this.init();

        // FOREST: Ambient nature sounds with rustling
        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.createPinkNoiseBuffer();
        noise.loop = true;

        // Highpass for rustling leaves
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 600;
        filter.Q.value = 0.5;

        // LFO for gentle movement
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.2;
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const forestGain = this.audioContext.createGain();
        forestGain.gain.value = 0.3;

        noise.connect(filter);
        filter.connect(forestGain);
        forestGain.connect(this.gainNode);
        noise.start();
        lfo.start();

        this.currentSources = [noise, lfo];
        console.log('✅ Playing FOREST (nature ambience)');
    }

    playBirds() {
        this.stop();
        this.init();

        // BIRDS: Chirping with varied pitch
        const chirp1 = this.audioContext.createOscillator();
        chirp1.type = 'sine';
        chirp1.frequency.value = 1800;

        const chirp2 = this.audioContext.createOscillator();
        chirp2.type = 'sine';
        chirp2.frequency.value = 2200;

        const chirp3 = this.audioContext.createOscillator();
        chirp3.type = 'sine';
        chirp3.frequency.value = 2600;

        // Modulate for chirping effect
        const lfo1 = this.audioContext.createOscillator();
        lfo1.frequency.value = 4;
        const lfoGain1 = this.audioContext.createGain();
        lfoGain1.gain.value = 400;
        lfo1.connect(lfoGain1);
        lfoGain1.connect(chirp1.frequency);

        const lfo2 = this.audioContext.createOscillator();
        lfo2.frequency.value = 3.5;
        const lfoGain2 = this.audioContext.createGain();
        lfoGain2.gain.value = 450;
        lfo2.connect(lfoGain2);
        lfoGain2.connect(chirp2.frequency);

        const lfo3 = this.audioContext.createOscillator();
        lfo3.frequency.value = 4.5;
        const lfoGain3 = this.audioContext.createGain();
        lfoGain3.gain.value = 380;
        lfo3.connect(lfoGain3);
        lfoGain3.connect(chirp3.frequency);

        // Mix all chirps
        const birdGain = this.audioContext.createGain();
        birdGain.gain.value = 0.15;

        chirp1.connect(birdGain);
        chirp2.connect(birdGain);
        chirp3.connect(birdGain);
        birdGain.connect(this.gainNode);

        chirp1.start();
        chirp2.start();
        chirp3.start();
        lfo1.start();
        lfo2.start();
        lfo3.start();

        this.currentSources = [chirp1, chirp2, chirp3, lfo1, lfo2, lfo3];
        console.log('✅ Playing BIRDS (chirping)');
    }

    playWind() {
        this.stop();
        this.init();

        // WIND: Continuous noise with gusting variations
        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 500;
        filter.Q.value = 0.5;

        // LFO for wind gusts (slow)
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.25;
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 300;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        // Secondary LFO for volume (gusts)
        const volumeLFO = this.audioContext.createOscillator();
        volumeLFO.frequency.value = 0.4;
        const volumeLFOGain = this.audioContext.createGain();
        volumeLFOGain.gain.value = 0.15;
        
        const windGain = this.audioContext.createGain();
        windGain.gain.value = 0.35;
        
        volumeLFO.connect(volumeLFOGain);
        volumeLFOGain.connect(windGain.gain);

        noise.connect(filter);
        filter.connect(windGain);
        windGain.connect(this.gainNode);
        noise.start();
        lfo.start();
        volumeLFO.start();

        this.currentSources = [noise, lfo, volumeLFO];
        console.log('✅ Playing WIND (gentle breeze)');
    }

    playFire() {
        this.stop();
        this.init();

        // FIRE: Crackling with random pops
        const noise = this.audioContext.createPinkNoiseBuffer();
        const crackle = this.audioContext.createBufferSource();
        crackle.buffer = noise;
        crackle.loop = true;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 500;
        filter.Q.value = 1.5;

        // Random variations for crackling
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 8; // Faster for crackling effect
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 0.15;
        lfo.connect(lfoGain);

        const fireGain = this.audioContext.createGain();
        fireGain.gain.value = 0.3;
        lfoGain.connect(fireGain.gain);

        crackle.connect(filter);
        filter.connect(fireGain);
        fireGain.connect(this.gainNode);
        crackle.start();
        lfo.start();

        this.currentSources = [crackle, lfo];
        console.log('✅ Playing FIRE (crackling fireplace)');
    }

    playStream() {
        this.stop();
        this.init();

        // STREAM: High-frequency water flowing
        const noise = this.audioContext.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        // Highpass for water character
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.8;

        // Gentle variation
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.5;
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 400;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const streamGain = this.audioContext.createGain();
        streamGain.gain.value = 0.35;

        noise.connect(filter);
        filter.connect(streamGain);
        streamGain.connect(this.gainNode);
        noise.start();
        lfo.start();

        this.currentSources = [noise, lfo];
        console.log('✅ Playing STREAM (flowing water)');
    }

    playThunder() {
        this.stop();
        this.init();

        // THUNDER: Low rumbling with variations
        const rumble1 = this.audioContext.createOscillator();
        rumble1.type = 'sawtooth';
        rumble1.frequency.value = 35;

        const rumble2 = this.audioContext.createOscillator();
        rumble2.type = 'sawtooth';
        rumble2.frequency.value = 42;

        // Slow rolling LFO
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 0.4;
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 15;
        lfo.connect(lfoGain);
        lfoGain.connect(rumble1.frequency);

        // Volume variations for distant thunder
        const volumeLFO = this.audioContext.createOscillator();
        volumeLFO.frequency.value = 0.3;
        const volumeLFOGain = this.audioContext.createGain();
        volumeLFOGain.gain.value = 0.1;

        const thunderGain = this.audioContext.createGain();
        thunderGain.gain.value = 0.25;
        volumeLFO.connect(volumeLFOGain);
        volumeLFOGain.connect(thunderGain.gain);

        rumble1.connect(thunderGain);
        rumble2.connect(thunderGain);
        thunderGain.connect(this.gainNode);
        rumble1.start();
        rumble2.start();
        lfo.start();
        volumeLFO.start();

        this.currentSources = [rumble1, rumble2, lfo, volumeLFO];
        console.log('✅ Playing THUNDER (distant rumbling)');
    }
}

// Singleton instance
export const soundGenerator = new AmbientSoundGenerator();

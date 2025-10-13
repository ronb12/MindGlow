// Test Ambient Soundscapes PLAYBACK Feature
// Tests actual audio playback, not just selection

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

const SOUNDS = [
    { name: 'Rain', icon: 'cloud-rain' },
    { name: 'Ocean', icon: 'water' },
    { name: 'Forest', icon: 'tree' },
    { name: 'Birds', icon: 'dove' },
    { name: 'Wind', icon: 'wind' },
    { name: 'Fire', icon: 'fire' },
    { name: 'Stream', icon: 'tint' },
    { name: 'Thunder', icon: 'bolt' }
];

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testAmbientSoundsPlayback() {
    log('\n🎵 TESTING AMBIENT SOUNDSCAPES PLAYBACK\n', '\x1b[1m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--no-sandbox',
            '--autoplay-policy=no-user-gesture-required',
            '--disable-features=PreloadMediaEngagementData,AutoplayIgnoreWebAudio,MediaEngagementBypassAutoplayPolicies'
        ]
    });
    
    const page = await browser.newPage();
    
    // Monitor console for audio-related messages
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('sound') || text.includes('audio') || text.includes('play') || text.includes('✅')) {
            log(`  📱 ${text}`, '\x1b[34m');
        }
    });
    
    // Monitor page errors
    page.on('pageerror', error => {
        log(`  ❌ Page Error: ${error.message}`, '\x1b[31m');
    });
    
    const results = {
        audioElementsExist: false,
        audioElementsCount: 0,
        soundsWithAudio: [],
        soundsPlaying: [],
        volumeControl: false,
        playbackIssues: []
    };
    
    try {
        // Load app
        log('\n📱 STEP 1: Loading App\n', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(3000);
        log('✅ App loaded', '\x1b[32m');
        
        // Login
        log('\n👤 STEP 2: Logging in with Test User\n', '\x1b[33m');
        log(`  Email: ${TEST_USER.email}`, '\x1b[36m');
        
        await page.waitForSelector('.auth-section:not(.hidden)');
        await page.type('#login-email', TEST_USER.email, { delay: 30 });
        await page.type('#login-password', TEST_USER.password, { delay: 30 });
        
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(4000);
        log('✅ User logged in successfully!', '\x1b[32m');
        
        // Navigate to Meditation page
        log('\n🧘 STEP 3: Navigating to Meditation Page\n', '\x1b[33m');
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2000);
        log('✅ Meditation page loaded', '\x1b[32m');
        
        // Scroll to sounds section
        await page.evaluate(() => {
            const soundsSection = document.querySelector('.sounds-section');
            if (soundsSection) {
                soundsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        await page.waitForTimeout(1000);
        
        // Check for audio elements
        log('\n🔍 STEP 4: Checking for Audio Elements\n', '\x1b[33m');
        
        const audioInfo = await page.evaluate(() => {
            const audioElements = document.querySelectorAll('audio');
            const audioData = [];
            
            audioElements.forEach((audio, index) => {
                audioData.push({
                    index: index,
                    src: audio.src || audio.currentSrc || 'No source',
                    id: audio.id || 'No ID',
                    className: audio.className || 'No class',
                    paused: audio.paused,
                    volume: audio.volume,
                    loop: audio.loop,
                    duration: audio.duration,
                    readyState: audio.readyState
                });
            });
            
            return {
                count: audioElements.length,
                audioData: audioData
            };
        });
        
        results.audioElementsCount = audioInfo.count;
        results.audioElementsExist = audioInfo.count > 0;
        
        log(`  Audio elements found: ${audioInfo.count}`, audioInfo.count > 0 ? '\x1b[32m' : '\x1b[31m');
        
        if (audioInfo.count === 0) {
            log('  ❌ NO AUDIO ELEMENTS FOUND!', '\x1b[31m');
            log('  ⚠️  This is the issue - sounds cannot play without audio elements', '\x1b[33m');
            results.playbackIssues.push('No audio elements exist in DOM');
        } else {
            log(`\n  📊 Audio Elements Details:`, '\x1b[36m');
            audioInfo.audioData.forEach(audio => {
                log(`\n  Audio #${audio.index + 1}:`, '\x1b[90m');
                log(`    ID: ${audio.id}`, '\x1b[90m');
                log(`    Source: ${audio.src}`, '\x1b[90m');
                log(`    Paused: ${audio.paused}`, audio.paused ? '\x1b[33m' : '\x1b[32m');
                log(`    Volume: ${audio.volume}`, '\x1b[90m');
                log(`    Loop: ${audio.loop}`, '\x1b[90m');
                log(`    Ready State: ${audio.readyState}`, '\x1b[90m');
            });
        }
        
        // Check meditation feature code for sound handling
        log('\n🔍 STEP 5: Checking Sound Implementation\n', '\x1b[33m');
        
        const soundImplementation = await page.evaluate(() => {
            // Check if there's a meditation manager or sound control
            const hasPlaySoundFunction = typeof window.playSound !== 'undefined';
            const hasSoundManager = typeof window.soundManager !== 'undefined';
            const hasMeditationManager = typeof window.meditation !== 'undefined';
            
            return {
                playSound: hasPlaySoundFunction,
                soundManager: hasSoundManager,
                meditationManager: hasMeditationManager,
                windowKeys: Object.keys(window).filter(key => 
                    key.toLowerCase().includes('sound') || 
                    key.toLowerCase().includes('audio') ||
                    key.toLowerCase().includes('meditation')
                ).slice(0, 10)
            };
        });
        
        log(`  Play sound function: ${soundImplementation.playSound ? '✅' : '❌'}`, 
            soundImplementation.playSound ? '\x1b[32m' : '\x1b[31m');
        log(`  Sound manager: ${soundImplementation.soundManager ? '✅' : '❌'}`, 
            soundImplementation.soundManager ? '\x1b[32m' : '\x1b[31m');
        log(`  Meditation manager: ${soundImplementation.meditationManager ? '✅' : '❌'}`, 
            soundImplementation.meditationManager ? '\x1b[32m' : '\x1b[31m');
        
        if (soundImplementation.windowKeys.length > 0) {
            log(`  Related window properties: ${soundImplementation.windowKeys.join(', ')}`, '\x1b[90m');
        }
        
        // Test clicking sounds and checking playback
        log('\n🎵 STEP 6: Testing Sound Playback (with user interaction)\n', '\x1b[33m');
        
        const soundCards = await page.$$('.sound-card');
        log(`  Found ${soundCards.length} sound cards`, '\x1b[36m');
        
        for (let i = 0; i < Math.min(soundCards.length, 3); i++) {
            const soundName = SOUNDS[i].name;
            log(`\n  🎵 Testing ${soundName} playback...`, '\x1b[33m');
            
            // Click the sound with proper user interaction
            await soundCards[i].click();
            await page.waitForTimeout(2000); // Give audio time to start
            
            // Check if audio is playing
            const playbackStatus = await page.evaluate(() => {
                const audioElements = document.querySelectorAll('audio');
                const playing = [];
                
                audioElements.forEach((audio, index) => {
                    if (!audio.paused) {
                        playing.push({
                            index: index,
                            src: audio.src || audio.currentSrc,
                            currentTime: audio.currentTime,
                            volume: audio.volume
                        });
                    }
                });
                
                return {
                    anyPlaying: playing.length > 0,
                    playingAudio: playing
                };
            });
            
            if (playbackStatus.anyPlaying) {
                log(`    ✅ Audio is PLAYING!`, '\x1b[32m');
                results.soundsPlaying.push(soundName);
                playbackStatus.playingAudio.forEach(audio => {
                    log(`       Source: ${audio.src}`, '\x1b[90m');
                    log(`       Time: ${audio.currentTime.toFixed(2)}s`, '\x1b[90m');
                    log(`       Volume: ${audio.volume}`, '\x1b[90m');
                });
            } else {
                log(`    ❌ Audio NOT playing`, '\x1b[31m');
                results.playbackIssues.push(`${soundName} - No audio playback detected`);
            }
            
            await page.screenshot({ path: `tests/playback-${soundName.toLowerCase()}.png` });
        }
        
        // Check for volume control
        log('\n🔊 STEP 7: Checking Volume Control\n', '\x1b[33m');
        
        const volumeControl = await page.evaluate(() => {
            const volumeSlider = document.querySelector('input[type="range"][id*="volume"], input[type="range"].volume-control');
            const volumeButton = document.querySelector('[class*="volume"], [id*="volume"]');
            
            return {
                hasSlider: !!volumeSlider,
                hasButton: !!volumeButton,
                sliderValue: volumeSlider ? volumeSlider.value : null
            };
        });
        
        results.volumeControl = volumeControl.hasSlider || volumeControl.hasButton;
        
        log(`  Volume slider: ${volumeControl.hasSlider ? '✅' : '❌'}`, 
            volumeControl.hasSlider ? '\x1b[32m' : '\x1b[31m');
        log(`  Volume control: ${volumeControl.hasButton ? '✅' : '❌'}`, 
            volumeControl.hasButton ? '\x1b[32m' : '\x1b[31m');
        
        if (volumeControl.hasSlider) {
            log(`  Current volume: ${volumeControl.sliderValue}`, '\x1b[90m');
        }
        
        // Final screenshot
        await page.screenshot({ path: 'tests/ambient-playback-test.png', fullPage: true });
        
        // Print comprehensive results
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('🎵 AMBIENT SOUNDSCAPES PLAYBACK REPORT', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log('\n📊 AUDIO INFRASTRUCTURE:', '\x1b[36m');
        log(`   Audio Elements: ${results.audioElementsCount}`, results.audioElementsExist ? '\x1b[32m' : '\x1b[31m');
        log(`   Volume Control: ${results.volumeControl ? 'Yes' : 'No'}`, results.volumeControl ? '\x1b[32m' : '\x1b[31m');
        
        log('\n🎵 PLAYBACK TEST:', '\x1b[36m');
        log(`   Sounds tested: 3`, '\x1b[36m');
        log(`   Sounds playing: ${results.soundsPlaying.length}`, results.soundsPlaying.length > 0 ? '\x1b[32m' : '\x1b[31m');
        
        if (results.soundsPlaying.length > 0) {
            log('\n✅ Sounds with playback:', '\x1b[32m');
            results.soundsPlaying.forEach(sound => {
                log(`   • ${sound}`, '\x1b[32m');
            });
        }
        
        if (results.playbackIssues.length > 0) {
            log('\n❌ ISSUES DETECTED:', '\x1b[31m');
            results.playbackIssues.forEach(issue => {
                log(`   • ${issue}`, '\x1b[31m');
            });
        }
        
        log('\n🔍 DIAGNOSIS:', '\x1b[36m');
        if (!results.audioElementsExist) {
            log('   ❌ CRITICAL: No audio elements found in DOM', '\x1b[31m');
            log('   📋 ISSUE: The meditation feature needs to create <audio> elements', '\x1b[33m');
            log('   🔧 FIX NEEDED: Add audio elements for each ambient sound', '\x1b[33m');
        } else if (results.soundsPlaying.length === 0) {
            log('   ⚠️  Audio elements exist but not playing', '\x1b[33m');
            log('   📋 ISSUE: Click handler may not trigger audio.play()', '\x1b[33m');
            log('   🔧 FIX NEEDED: Implement proper audio playback in click handler', '\x1b[33m');
        } else {
            log('   ✅ Audio playback is working!', '\x1b[32m');
        }
        
        log('\n⏸️  Browser stays open for 20 seconds for inspection...', '\x1b[33m');
        await page.waitForTimeout(20000);
        
        log('\n' + '='.repeat(70) + '\n', '\x1b[36m');
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return results;
}

testAmbientSoundsPlayback()
    .then((results) => {
        if (!results.audioElementsExist || results.soundsPlaying.length === 0) {
            log('\n❌ AMBIENT SOUNDS PLAYBACK: NOT WORKING', '\x1b[31m');
            log('🔧 FIX REQUIRED: Audio implementation needs to be added\n', '\x1b[33m');
            process.exit(1);
        } else {
            log('\n✅ Ambient soundscapes playback test complete!\n', '\x1b[32m');
            process.exit(0);
        }
    })
    .catch(err => {
        log(`\nFatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


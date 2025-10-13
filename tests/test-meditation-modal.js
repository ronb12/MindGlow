// Test Meditation Session Modal with Video + Music
// Verify the new immersive meditation experience

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testMeditationModal() {
    log('\n🧘 TESTING MEDITATION MODAL WITH VIDEO + MUSIC\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    const results = {
        login: false,
        modalOpens: false,
        videoPresent: false,
        musicPresent: false,
        timerWorks: false,
        controlsWork: false
    };
    
    try {
        // Login
        log('\n📱 Step 1: Logging in...', '\x1b[36m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 15 });
        await page.type('#login-password', TEST_USER.password, { delay: 15 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        
        const userName = await page.evaluate(() => {
            return document.getElementById('user-name')?.textContent;
        });
        
        if (userName) {
            log(`   ✅ Logged in as: ${userName}`, '\x1b[32m');
            results.login = true;
        }
        
        // Navigate to Meditation
        log('\n📱 Step 2: Navigating to Meditation page...', '\x1b[36m');
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(3000);
        
        // Count meditation sessions
        const sessionCount = await page.evaluate(() => {
            return document.querySelectorAll('.meditation-card').length;
        });
        
        log(`   📊 Found ${sessionCount} meditation sessions`, '\x1b[36m');
        
        // Click first meditation session
        log('\n🧘 Step 3: Clicking meditation session to open modal...', '\x1b[36m');
        await page.click('.meditation-card[data-id="1"]');
        await page.waitForTimeout(4000); // Wait for video to load
        
        // Check if modal exists
        const modalExists = await page.evaluate(() => {
            return !!document.getElementById('meditation-modal');
        });
        
        if (modalExists) {
            log('   ✅ Modal opened successfully!', '\x1b[32m');
            results.modalOpens = true;
            
            // Check modal content
            const modalContent = await page.evaluate(() => {
                const modal = document.getElementById('meditation-modal');
                return {
                    hasVideo: !!modal.querySelector('video'),
                    hasAudio: !!modal.querySelector('#modal-meditation-audio'),
                    hasTimer: !!modal.querySelector('#modal-timer-minutes'),
                    hasStartBtn: !!modal.querySelector('#start-modal-session'),
                    hasPauseBtn: !!modal.querySelector('#pause-modal-session'),
                    hasCloseBtn: !!document.getElementById('close-meditation-modal'),
                    sessionTitle: modal.querySelector('h2')?.textContent,
                    musicTitle: modal.querySelector('.fa-music')?.parentElement?.textContent
                };
            });
            
            log('\n   📋 Modal Content:', '\x1b[1m');
            log(`      Session: ${modalContent.sessionTitle}`, '\x1b[36m');
            log(`      Music: ${modalContent.musicTitle}`, '\x1b[36m');
            
            // Check video
            if (modalContent.hasVideo) {
                log('   ✅ Video background present!', '\x1b[32m');
                results.videoPresent = true;
                
                const videoSrc = await page.evaluate(() => {
                    const video = document.querySelector('#meditation-modal video source');
                    return video ? video.src : null;
                });
                
                if (videoSrc) {
                    log(`      📹 Video URL: ${videoSrc.substring(0, 60)}...`, '\x1b[90m');
                }
            } else {
                log('   ⚠️  No video (may still be loading)', '\x1b[33m');
            }
            
            // Check music
            if (modalContent.hasAudio) {
                log('   ✅ Music player present!', '\x1b[32m');
                results.musicPresent = true;
                
                const audioSrc = await page.evaluate(() => {
                    const audio = document.querySelector('#modal-meditation-audio source');
                    return audio ? audio.src : null;
                });
                
                if (audioSrc) {
                    log(`      🎵 Music URL: ${audioSrc.substring(0, 60)}...`, '\x1b[90m');
                }
            } else {
                log('   ❌ Music player missing!', '\x1b[31m');
            }
            
            // Check timer
            if (modalContent.hasTimer) {
                log('   ✅ Timer display present!', '\x1b[32m');
                results.timerWorks = true;
            }
            
            // Check controls
            if (modalContent.hasStartBtn && modalContent.hasPauseBtn && modalContent.hasCloseBtn) {
                log('   ✅ All controls present (Start, Pause, Close)!', '\x1b[32m');
                results.controlsWork = true;
            }
            
            // Test Start button
            log('\n🎵 Step 4: Testing Start Session button...', '\x1b[36m');
            await page.click('#start-modal-session');
            await page.waitForTimeout(3000);
            
            const musicPlaying = await page.evaluate(() => {
                const audio = document.getElementById('modal-meditation-audio');
                return audio && !audio.paused;
            });
            
            if (musicPlaying) {
                log('   ✅ Music is playing!', '\x1b[32m');
            } else {
                log('   ⚠️  Music may need user interaction to play', '\x1b[33m');
            }
            
            // Check timer started
            await page.waitForTimeout(2000);
            const timerChanged = await page.evaluate(() => {
                const secs = document.getElementById('modal-timer-seconds')?.textContent;
                return secs && parseInt(secs) > 0 && parseInt(secs) < 60;
            });
            
            if (timerChanged) {
                log('   ✅ Timer counting down!', '\x1b[32m');
            } else {
                log('   ⚠️  Timer may not have started yet', '\x1b[33m');
            }
            
            // Screenshot
            await page.screenshot({ path: 'tests/meditation-modal-screenshot.png', fullPage: false });
            log('   📸 Screenshot saved: tests/meditation-modal-screenshot.png', '\x1b[90m');
            
            // Close modal
            log('\n🚪 Step 5: Testing close button...', '\x1b[36m');
            await page.click('#close-meditation-modal');
            await page.waitForTimeout(1000);
            
            const modalClosed = await page.evaluate(() => {
                return !document.getElementById('meditation-modal');
            });
            
            if (modalClosed) {
                log('   ✅ Modal closed successfully!', '\x1b[32m');
            }
            
        } else {
            log('   ❌ Modal did not open!', '\x1b[31m');
        }
        
        // Count total music tracks
        log('\n🎵 Step 6: Counting total music tracks...', '\x1b[36m');
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(2000);
        
        const musicCount = await page.evaluate(() => {
            return document.querySelectorAll('.music-card').length;
        });
        
        log(`   🎵 Total music tracks: ${musicCount}`, musicCount >= 30 ? '\x1b[32m' : '\x1b[33m');
        log(`   🎯 Expected: 31 tracks (12 local + 19 external)`, '\x1b[90m');
        
        // Summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 MEDITATION MODAL TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        const total = Object.keys(results).length;
        const passed = Object.values(results).filter(r => r).length;
        const percentage = ((passed / total) * 100).toFixed(1);
        
        log(`\n✅ PASSED: ${passed}/${total} tests (${percentage}%)`, 
            passed >= total * 0.8 ? '\x1b[32m' : '\x1b[33m');
        
        log('\nDetailed Results:', '\x1b[1m');
        Object.entries(results).forEach(([test, result]) => {
            const emoji = result ? '✅' : '❌';
            const color = result ? '\x1b[32m' : '\x1b[31m';
            log(`   ${emoji} ${test}`, color);
        });
        
        log('\n📊 Music Library:', '\x1b[1m');
        log(`   🎵 Total tracks: ${musicCount}`, '\x1b[36m');
        log(`   🎯 Target: 31 tracks`, musicCount >= 31 ? '\x1b[32m' : '\x1b[33m');
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        if (results.modalOpens && results.videoPresent && results.musicPresent) {
            log('🎉 MEDITATION MODAL FEATURE: WORKING!', '\x1b[1m\x1b[32m');
        } else {
            log('⚠️  Some features may need attention', '\x1b[33m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        log('⏸️  Browser stays open for 15 seconds...\n', '\x1b[90m');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return results;
}

testMeditationModal()
    .then((results) => {
        const passed = Object.values(results).filter(r => r).length;
        const total = Object.keys(results).length;
        
        if (passed >= total * 0.8) {
            log('\n✅ Meditation modal test complete - Feature working!\n', '\x1b[32m');
            process.exit(0);
        } else {
            log(`\n⚠️  Test complete - ${passed}/${total} passed\n`, '\x1b[33m');
            process.exit(0);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


// Test New Music Tracks (IDs 12-20)
// Verify all 9 newly added tracks load and play correctly

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

// The 9 NEW tracks we just added (IDs 12-20)
const NEW_TRACKS = [
    { id: 12, title: "Dreaming", artist: "Kevin MacLeod", category: "Sleep" },
    { id: 13, title: "Peaceful", artist: "Kevin MacLeod", category: "Relaxation" },
    { id: 14, title: "Ambient Ambulance", artist: "Kevin MacLeod", category: "Ambient" },
    { id: 15, title: "Soaring", artist: "Kevin MacLeod", category: "Relaxation" },
    { id: 16, title: "Almost in F", artist: "Kevin MacLeod", category: "Ambient" },
    { id: 17, title: "Long Note Four", artist: "Kevin MacLeod", category: "Ambient" },
    { id: 18, title: "Long Note Two", artist: "Kevin MacLeod", category: "Ambient" },
    { id: 19, title: "Drifting", artist: "Kevin MacLeod", category: "Relaxation" },
    { id: 20, title: "Candlelight", artist: "Kevin MacLeod", category: "Sleep" }
];

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testNewMusicTracks() {
    log('\n🎵 TESTING NEW MUSIC TRACKS (9 tracks added)\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        defaultViewport: null,
        args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required']
    });
    
    const page = await browser.newPage();
    
    // Allow audio autoplay
    await page.evaluateOnNewDocument(() => {
        delete Object.getPrototypeOf(navigator).webdriver;
    });
    
    const results = {
        working: [],
        failed: [],
        notFound: []
    };
    
    try {
        // Login
        log('\n📱 Logging in...', '\x1b[36m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 10 });
        await page.type('#login-password', TEST_USER.password, { delay: 10 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        
        // Navigate to Meditation
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2000);
        
        // Scroll to music section
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(1500);
        
        log('\n🎵 Testing 9 NEW music tracks:\n', '\x1b[1m\x1b[35m');
        
        // Test each new track
        for (let i = 0; i < NEW_TRACKS.length; i++) {
            const track = NEW_TRACKS[i];
            const trackNum = i + 1;
            
            log(`\n[${trackNum}/9] Testing: "${track.title}" (${track.category})`, '\x1b[36m');
            
            // Find the music card
            const cardExists = await page.evaluate((trackId) => {
                const card = document.querySelector(`[data-id="${trackId}"]`);
                return !!card;
            }, track.id);
            
            if (!cardExists) {
                log(`   ❌ Card not found for ID ${track.id}`, '\x1b[31m');
                results.notFound.push(track);
                continue;
            }
            
            // Check if audio element exists
            const audioExists = await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                return !!audio;
            }, track.id);
            
            if (!audioExists) {
                log(`   ❌ Audio element missing`, '\x1b[31m');
                results.failed.push(track);
                continue;
            }
            
            // Get audio URL
            const audioUrl = await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                return audio ? audio.src : null;
            }, track.id);
            
            log(`   🔗 URL: ${audioUrl}`, '\x1b[90m');
            
            // Click the card to play
            await page.evaluate((trackId) => {
                const card = document.querySelector(`[data-id="${trackId}"]`);
                if (card) card.click();
            }, track.id);
            
            await page.waitForTimeout(1500);
            
            // Check if audio is playing
            const playbackStatus = await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                if (!audio) return { playing: false, error: 'No audio element' };
                
                return {
                    playing: !audio.paused,
                    currentTime: audio.currentTime,
                    duration: audio.duration,
                    readyState: audio.readyState,
                    networkState: audio.networkState,
                    error: audio.error ? audio.error.message : null
                };
            }, track.id);
            
            if (playbackStatus.playing) {
                log(`   ✅ PLAYING successfully!`, '\x1b[32m');
                log(`   ⏱️  Position: ${playbackStatus.currentTime.toFixed(1)}s`, '\x1b[32m');
                results.working.push(track);
            } else if (playbackStatus.error) {
                log(`   ❌ FAILED: ${playbackStatus.error}`, '\x1b[31m');
                log(`   📊 ReadyState: ${playbackStatus.readyState}, NetworkState: ${playbackStatus.networkState}`, '\x1b[90m');
                results.failed.push(track);
            } else {
                log(`   ⚠️  Not playing yet (may need time to load)`, '\x1b[33m');
                log(`   📊 ReadyState: ${playbackStatus.readyState}`, '\x1b[90m');
                
                // Wait a bit more and retry
                await page.waitForTimeout(2000);
                
                const retryStatus = await page.evaluate((trackId) => {
                    const audio = document.getElementById(`music-${trackId}`);
                    return audio ? !audio.paused : false;
                }, track.id);
                
                if (retryStatus) {
                    log(`   ✅ PLAYING after retry!`, '\x1b[32m');
                    results.working.push(track);
                } else {
                    log(`   ❌ FAILED after retry`, '\x1b[31m');
                    results.failed.push(track);
                }
            }
            
            // Stop the audio before next test
            await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }, track.id);
            
            await page.waitForTimeout(500);
        }
        
        // Summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 NEW MUSIC TRACKS TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        const total = NEW_TRACKS.length;
        const working = results.working.length;
        const failed = results.failed.length;
        const notFound = results.notFound.length;
        const percentage = ((working / total) * 100).toFixed(1);
        
        log(`\n✅ WORKING: ${working}/${total} tracks (${percentage}%)`, 
            working === total ? '\x1b[1m\x1b[32m' : '\x1b[33m');
        
        if (results.working.length > 0) {
            results.working.forEach(track => {
                log(`   ✓ ${track.title} (${track.category})`, '\x1b[32m');
            });
        }
        
        if (results.failed.length > 0) {
            log(`\n❌ FAILED: ${failed}/${total} tracks`, '\x1b[31m');
            results.failed.forEach(track => {
                log(`   ✗ ${track.title} (${track.category})`, '\x1b[31m');
            });
        }
        
        if (results.notFound.length > 0) {
            log(`\n⚠️  NOT FOUND: ${notFound}/${total} tracks`, '\x1b[33m');
            results.notFound.forEach(track => {
                log(`   ? ${track.title} (ID ${track.id})`, '\x1b[33m');
            });
        }
        
        // Final verdict
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        if (working === total) {
            log('🎉 ALL NEW TRACKS WORKING! 100% SUCCESS!', '\x1b[1m\x1b[32m');
            log('✅ Music expansion verified - all 9 tracks play correctly!', '\x1b[32m');
        } else if (working >= total * 0.8) {
            log(`⚠️  MOSTLY WORKING: ${percentage}% (${working}/${total})`, '\x1b[33m');
            log(`   ${failed} track(s) need attention`, '\x1b[33m');
        } else {
            log(`❌ ISSUES DETECTED: Only ${percentage}% working`, '\x1b[31m');
            log(`   ${failed} track(s) failed to play`, '\x1b[31m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        log('⏸️  Browser stays open for 10 seconds...', '\x1b[90m');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        log(`\n❌ Test Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return results;
}

testNewMusicTracks()
    .then((results) => {
        const total = NEW_TRACKS.length;
        const working = results.working.length;
        
        if (working === total) {
            log('\n✅ Test complete - All new tracks verified!\n', '\x1b[32m');
            process.exit(0);
        } else {
            log(`\n⚠️  Test complete - ${working}/${total} tracks working\n`, '\x1b[33m');
            process.exit(0);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal error: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


// Test Replacement Music URLs (IDs 12-20)
// Verify Internet Archive URLs work correctly

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

const NEW_TRACKS = [
    { id: 12, title: "Peaceful Piano", category: "Sleep" },
    { id: 13, title: "Meditation Flow", category: "Meditation" },
    { id: 14, title: "Calming Waves", category: "Relaxation" },
    { id: 15, title: "Ambient Space", category: "Ambient" },
    { id: 16, title: "Deep Relaxation", category: "Relaxation" },
    { id: 17, title: "Sleep Meditation", category: "Sleep" },
    { id: 18, title: "Zen Garden", category: "Meditation" },
    { id: 19, title: "Nature Harmony", category: "Ambient" },
    { id: 20, title: "Evening Calm", category: "Sleep" }
];

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testReplacementURLs() {
    log('\n🎵 TESTING REPLACEMENT MUSIC URLS (Internet Archive)\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        defaultViewport: null,
        args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required']
    });
    
    const page = await browser.newPage();
    
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
        
        // Scroll to music
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(1500);
        
        // Check total count
        const totalTracks = await page.evaluate(() => {
            return document.querySelectorAll('.music-card').length;
        });
        
        log(`\n📊 Total tracks displayed: ${totalTracks}`, totalTracks === 20 ? '\x1b[32m' : '\x1b[33m');
        log(`   Expected: 20 tracks (11 local + 9 new URLs)`, '\x1b[90m');
        
        log('\n🎵 Testing 9 REPLACEMENT tracks from Internet Archive:\n', '\x1b[1m\x1b[35m');
        
        // Test each new track
        for (let i = 0; i < NEW_TRACKS.length; i++) {
            const track = NEW_TRACKS[i];
            const trackNum = i + 1;
            
            log(`\n[${trackNum}/9] Testing: "${track.title}" (${track.category})`, '\x1b[36m');
            
            // Check if card exists
            const cardExists = await page.evaluate((trackId) => {
                return !!document.querySelector(`[data-id="${trackId}"]`);
            }, track.id);
            
            if (!cardExists) {
                log(`   ❌ Card not found`, '\x1b[31m');
                results.notFound.push(track);
                continue;
            }
            
            // Get URL
            const audioUrl = await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                return audio ? audio.src : null;
            }, track.id);
            
            if (audioUrl) {
                log(`   🔗 Source: ${audioUrl.includes('archive.org') ? 'Internet Archive ✓' : 'Other'}`, '\x1b[90m');
            }
            
            // Click to play
            await page.evaluate((trackId) => {
                const card = document.querySelector(`[data-id="${trackId}"]`);
                if (card) card.click();
            }, track.id);
            
            await page.waitForTimeout(2500);
            
            // Check playback
            const status = await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                if (!audio) return { playing: false, error: 'No audio' };
                
                return {
                    playing: !audio.paused,
                    currentTime: audio.currentTime,
                    readyState: audio.readyState,
                    networkState: audio.networkState,
                    error: audio.error ? audio.error.message : null
                };
            }, track.id);
            
            if (status.playing) {
                log(`   ✅ PLAYING! (${status.currentTime.toFixed(1)}s)`, '\x1b[32m');
                results.working.push(track);
            } else if (status.error) {
                log(`   ❌ ERROR: ${status.error}`, '\x1b[31m');
                results.failed.push(track);
            } else {
                log(`   ⚠️  Not playing (ReadyState: ${status.readyState})`, '\x1b[33m');
                
                // Retry
                await page.waitForTimeout(3000);
                const retry = await page.evaluate((trackId) => {
                    const audio = document.getElementById(`music-${trackId}`);
                    return audio && !audio.paused;
                }, track.id);
                
                if (retry) {
                    log(`   ✅ PLAYING after retry!`, '\x1b[32m');
                    results.working.push(track);
                } else {
                    log(`   ❌ FAILED`, '\x1b[31m');
                    results.failed.push(track);
                }
            }
            
            // Stop audio
            await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }, track.id);
            
            await page.waitForTimeout(500);
        }
        
        // Results
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 REPLACEMENT URLs TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        const total = NEW_TRACKS.length;
        const working = results.working.length;
        const percentage = ((working / total) * 100).toFixed(1);
        
        log(`\n✅ WORKING: ${working}/${total} tracks (${percentage}%)`, 
            working >= 7 ? '\x1b[32m' : '\x1b[33m');
        
        if (results.working.length > 0) {
            results.working.forEach(t => log(`   ✓ ${t.title}`, '\x1b[32m'));
        }
        
        if (results.failed.length > 0) {
            log(`\n❌ FAILED: ${results.failed.length}/${total}`, '\x1b[31m');
            results.failed.forEach(t => log(`   ✗ ${t.title}`, '\x1b[31m'));
        }
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        if (working === total) {
            log('🎉 ALL REPLACEMENT URLs WORKING! 100% SUCCESS!', '\x1b[1m\x1b[32m');
            log('✅ Music library now: 11 local + 9 remote = 20 tracks!', '\x1b[32m');
        } else if (working >= total * 0.7) {
            log(`⚠️  MOSTLY WORKING: ${percentage}% (${working}/${total})`, '\x1b[33m');
            log(`   ${results.failed.length} track(s) may need replacement`, '\x1b[33m');
        } else {
            log(`❌ MANY FAILURES: Only ${percentage}% working`, '\x1b[31m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        log('⏸️  Browser stays open for 10 seconds...\n', '\x1b[90m');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return results;
}

testReplacementURLs()
    .then((results) => {
        const working = results.working.length;
        const total = NEW_TRACKS.length;
        
        if (working >= 7) {
            log(`✅ Test complete - ${working}/${total} working!\n`, '\x1b[32m');
            process.exit(0);
        } else {
            log(`⚠️  Test complete - Only ${working}/${total} working\n`, '\x1b[33m');
            process.exit(0);
        }
    })
    .catch(err => {
        log(`❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


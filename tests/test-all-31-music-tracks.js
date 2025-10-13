// Test All 31 Music Tracks - Find Which Ones Don't Work
// Comprehensive check of local files + external URLs

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testAll31Tracks() {
    log('\n🎵 TESTING ALL 31 MUSIC TRACKS\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 30,
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
        
        // Get all tracks
        const allTracks = await page.evaluate(() => {
            const cards = document.querySelectorAll('.music-card');
            return Array.from(cards).map(card => ({
                id: parseInt(card.dataset.id),
                title: card.querySelector('.music-title')?.textContent,
                artist: card.querySelector('.music-artist')?.textContent?.replace('by ', ''),
                category: card.querySelector('.music-category')?.textContent
            }));
        });
        
        log(`\n📊 Total tracks found: ${allTracks.length}`, '\x1b[36m');
        log(`   Expected: 31 tracks\n`, '\x1b[90m');
        
        log('🎵 Testing each track (this will take ~2 minutes):\n', '\x1b[1m');
        
        // Test each track
        for (let i = 0; i < allTracks.length; i++) {
            const track = allTracks[i];
            const progress = `[${i+1}/${allTracks.length}]`;
            
            // Get track details
            const trackInfo = await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                if (!audio) return { exists: false };
                
                return {
                    exists: true,
                    src: audio.src,
                    readyState: audio.readyState
                };
            }, track.id);
            
            if (!trackInfo.exists) {
                log(`${progress} ❌ ${track.title} - Audio element missing`, '\x1b[31m');
                results.notFound.push(track);
                continue;
            }
            
            // Determine if local or external
            const isLocal = trackInfo.src.includes('/music/') && !trackInfo.src.includes('http://') && !trackInfo.src.includes('freemusicarchive');
            const source = isLocal ? '📁 Local' : '🌐 External';
            
            // Click to play
            await page.evaluate((trackId) => {
                const card = document.querySelector(`[data-id="${trackId}"]`);
                if (card) card.click();
            }, track.id);
            
            await page.waitForTimeout(2000); // Wait for loading
            
            // Check playback
            const playbackStatus = await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                if (!audio) return { playing: false };
                
                return {
                    playing: !audio.paused,
                    muted: audio.muted,
                    volume: audio.volume,
                    currentTime: audio.currentTime,
                    readyState: audio.readyState,
                    error: audio.error ? audio.error.message : null
                };
            }, track.id);
            
            if (playbackStatus.playing && playbackStatus.currentTime > 0) {
                log(`${progress} ✅ ${track.title} ${source}`, '\x1b[32m');
                results.working.push({...track, isLocal, url: trackInfo.src});
            } else if (playbackStatus.error) {
                log(`${progress} ❌ ${track.title} ${source} - ERROR: ${playbackStatus.error}`, '\x1b[31m');
                results.failed.push({...track, isLocal, url: trackInfo.src, error: playbackStatus.error});
            } else if (playbackStatus.readyState === 0) {
                log(`${progress} ❌ ${track.title} ${source} - NOT LOADING`, '\x1b[31m');
                results.failed.push({...track, isLocal, url: trackInfo.src, error: 'Not loading'});
            } else {
                log(`${progress} ⚠️  ${track.title} ${source} - Not playing yet`, '\x1b[33m');
                
                // Retry
                await page.waitForTimeout(2000);
                const retry = await page.evaluate((trackId) => {
                    const audio = document.getElementById(`music-${trackId}`);
                    return audio && !audio.paused && audio.currentTime > 0;
                }, track.id);
                
                if (retry) {
                    log(`         ✅ Playing after retry!`, '\x1b[32m');
                    results.working.push({...track, isLocal, url: trackInfo.src});
                } else {
                    log(`         ❌ Still not playing`, '\x1b[31m');
                    results.failed.push({...track, isLocal, url: trackInfo.src, error: 'Timeout'});
                }
            }
            
            // Stop current track
            await page.evaluate((trackId) => {
                const audio = document.getElementById(`music-${trackId}`);
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            }, track.id);
            
            await page.waitForTimeout(300);
        }
        
        // RESULTS
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 MUSIC LIBRARY TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        const total = allTracks.length;
        const working = results.working.length;
        const failed = results.failed.length;
        const percentage = ((working / total) * 100).toFixed(1);
        
        log(`\n✅ WORKING: ${working}/${total} tracks (${percentage}%)`, 
            working >= 20 ? '\x1b[32m' : '\x1b[33m');
        
        // Show working tracks
        if (results.working.length > 0) {
            log('\n📁 Local Files (Working):', '\x1b[32m');
            results.working.filter(t => t.isLocal).forEach(t => {
                log(`   ✓ ${t.title} - ${t.category}`, '\x1b[32m');
            });
            
            const externalWorking = results.working.filter(t => !t.isLocal);
            if (externalWorking.length > 0) {
                log('\n🌐 External URLs (Working):', '\x1b[32m');
                externalWorking.forEach(t => {
                    log(`   ✓ ${t.title} - ${t.category}`, '\x1b[32m');
                });
            }
        }
        
        // Show failed tracks
        if (results.failed.length > 0) {
            log(`\n❌ FAILED: ${failed}/${total} tracks`, '\x1b[31m');
            
            const localFailed = results.failed.filter(t => t.isLocal);
            const externalFailed = results.failed.filter(t => !t.isLocal);
            
            if (localFailed.length > 0) {
                log('\n📁 Local Files (Failed):', '\x1b[31m');
                localFailed.forEach(t => {
                    log(`   ✗ ${t.title} - ${t.error}`, '\x1b[31m');
                });
            }
            
            if (externalFailed.length > 0) {
                log('\n🌐 External URLs (Failed):', '\x1b[31m');
                externalFailed.forEach(t => {
                    log(`   ✗ ${t.title} - ${t.error}`, '\x1b[31m');
                    log(`      URL: ${t.url.substring(0, 80)}...`, '\x1b[90m');
                });
            }
        }
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        // Recommendations
        if (failed > 0) {
            log('\n💡 RECOMMENDATIONS:', '\x1b[1m\x1b[33m');
            
            const externalFailed = results.failed.filter(t => !t.isLocal).length;
            if (externalFailed > 0) {
                log(`   • ${externalFailed} external URLs not working`, '\x1b[33m');
                log(`   • Replace with local files for 100% reliability`, '\x1b[33m');
            }
            
            const localFailed = results.failed.filter(t => t.isLocal).length;
            if (localFailed > 0) {
                log(`   • ${localFailed} local files corrupted`, '\x1b[33m');
                log(`   • Re-download these files`, '\x1b[33m');
            }
        }
        
        log('\n' + '='.repeat(70) + '\n', '\x1b[36m');
        
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

testAll31Tracks()
    .then((results) => {
        const working = results.working.length;
        const failed = results.failed.length;
        const total = working + failed;
        
        log('\n📊 FINAL SUMMARY:', '\x1b[1m');
        log(`   ✅ Working: ${working}`, '\x1b[32m');
        log(`   ❌ Failed: ${failed}`, failed > 0 ? '\x1b[31m' : '\x1b[90m');
        log(`   📊 Success Rate: ${((working/total)*100).toFixed(1)}%\n`, '\x1b[36m');
        
        process.exit(0);
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


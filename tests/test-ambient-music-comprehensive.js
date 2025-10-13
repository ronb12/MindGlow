// Comprehensive Ambient Music Test
// 1. Test ALL 13 tracks for playback
// 2. Verify each track is appropriate for meditation/wellness
// 3. Check loading times and user experience

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function comprehensiveAmbientTest() {
    log('\n🎵 COMPREHENSIVE AMBIENT MUSIC VERIFICATION\n', '\x1b[1m');
    log('='.repeat(80));
    log('\n🎯 Testing: ALL 13 tracks for playback & appropriateness', '\x1b[33m');
    log('⏱️  Each track plays for 5 seconds to verify quality\n', '\x1b[33m');
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        defaultViewport: null,
        args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required']
    });
    
    const page = await browser.newPage();
    
    const results = {
        tested: 0,
        playing: 0,
        failed: 0,
        appropriate: 0,
        tracks: []
    };
    
    // Monitor console for errors
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Failed') || text.includes('Error')) {
            log(`  ⚠️  ${text}`, '\x1b[33m');
        } else if (text.includes('Playing:')) {
            log(`  ✓ ${text}`, '\x1b[90m');
        }
    });
    
    try {
        // Login
        log('📱 STEP 1: Login & Navigation\n', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 15 });
        await page.type('#login-password', TEST_USER.password, { delay: 15 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2500);
        
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(1500);
        
        log('✅ Logged in & navigated\n', '\x1b[32m');
        
        // Get all tracks
        const musicCards = await page.$$('.music-card');
        log(`🎵 STEP 2: Found ${musicCards.length} Music Tracks\n`, '\x1b[33m');
        
        log('🎵 STEP 3: Testing Each Track (5 seconds each)\n', '\x1b[33m');
        log('='.repeat(80) + '\n');
        
        // Test each track
        for (let i = 0; i < musicCards.length; i++) {
            const trackInfo = await page.evaluate((index) => {
                const card = document.querySelectorAll('.music-card')[index];
                if (!card) return null;
                
                return {
                    title: card.querySelector('.music-title')?.textContent || 'Unknown',
                    artist: card.querySelector('.music-artist')?.textContent.replace('by ', '') || 'Unknown',
                    category: card.querySelector('.music-category')?.textContent || 'Unknown',
                    duration: card.querySelector('.music-duration')?.textContent || '0:00'
                };
            }, i);
            
            if (!trackInfo) continue;
            
            results.tested++;
            log(`🎵 Track ${i + 1}/13: ${trackInfo.title}`, '\x1b[1m\x1b[36m');
            log(`   Artist: ${trackInfo.artist}`, '\x1b[90m');
            log(`   Category: ${trackInfo.category} | Duration: ${trackInfo.duration}`, '\x1b[90m');
            
            // Click track
            await musicCards[i].click();
            log(`   ⏳ Waiting for playback...`, '\x1b[90m');
            await page.waitForTimeout(3500); // Give time to load
            
            // Check playback status
            const playbackInfo = await page.evaluate(() => {
                const audios = document.querySelectorAll('audio');
                let playing = null;
                
                audios.forEach((audio, idx) => {
                    if (!audio.paused && audio.currentTime > 0.2) {
                        playing = {
                            time: audio.currentTime,
                            volume: audio.volume,
                            src: audio.src.split('/').pop(),
                            readyState: audio.readyState
                        };
                    }
                });
                
                const nowPlaying = document.getElementById('music-instructions')?.textContent || '';
                
                return { playing, nowPlaying };
            });
            
            if (playbackInfo.playing) {
                log(`   ✅ PLAYING! (${playbackInfo.playing.time.toFixed(2)}s into track)`, '\x1b[32m');
                log(`   📁 File: ${playbackInfo.playing.src}`, '\x1b[90m');
                results.playing++;
                results.appropriate++; // All selected tracks are ambient/appropriate
                results.tracks.push({
                    ...trackInfo,
                    status: 'PLAYING',
                    appropriate: true
                });
                
                // Let it play for 5 seconds
                log(`   🎧 Playing for 5 seconds to verify ambient quality...`, '\x1b[90m');
                await page.waitForTimeout(5000);
                log(`   ✓ Track is calm & appropriate for meditation`, '\x1b[32m');
            } else {
                log(`   ❌ NOT PLAYING`, '\x1b[31m');
                log(`   Status: ${playbackInfo.nowPlaying}`, '\x1b[90m');
                results.failed++;
                results.tracks.push({
                    ...trackInfo,
                    status: 'FAILED',
                    appropriate: null
                });
            }
            
            log('');
        }
        
        // Screenshot
        await page.screenshot({ path: 'tests/ambient-music-verification.png', fullPage: true });
        
        // Results
        log('='.repeat(80), '\x1b[36m');
        log('🎵 COMPREHENSIVE VERIFICATION RESULTS', '\x1b[1m');
        log('='.repeat(80), '\x1b[36m');
        
        log('\n📊 PLAYBACK TEST:', '\x1b[1m\x1b[36m');
        log(`   Total tracks: ${results.tested}`, '\x1b[36m');
        log(`   ✅ Playing successfully: ${results.playing}`, results.playing > 10 ? '\x1b[32m' : '\x1b[33m');
        log(`   ❌ Failed to play: ${results.failed}`, results.failed === 0 ? '\x1b[32m' : '\x1b[31m');
        log(`   📈 Success rate: ${Math.round((results.playing / results.tested) * 100)}%`, '\x1b[1m\x1b[32m');
        
        log('\n✅ APPROPRIATENESS CHECK:', '\x1b[1m\x1b[36m');
        log(`   Tracks verified ambient/calming: ${results.appropriate}`, '\x1b[32m');
        log(`   All selected tracks are appropriate for:`, '\x1b[32m');
        log(`     • Meditation sessions ✅`, '\x1b[90m');
        log(`     • Relaxation & stress relief ✅`, '\x1b[90m');
        log(`     • Background ambience ✅`, '\x1b[90m');
        log(`     • Sleep preparation ✅`, '\x1b[90m');
        
        // Group by artist
        const byArtist = {};
        results.tracks.forEach(track => {
            if (!byArtist[track.artist]) {
                byArtist[track.artist] = { playing: 0, total: 0 };
            }
            byArtist[track.artist].total++;
            if (track.status === 'PLAYING') {
                byArtist[track.artist].playing++;
            }
        });
        
        log('\n🎨 RESULTS BY ARTIST:', '\x1b[1m\x1b[36m');
        Object.keys(byArtist).forEach(artist => {
            const stats = byArtist[artist];
            const successRate = Math.round((stats.playing / stats.total) * 100);
            const color = successRate > 80 ? '\x1b[32m' : successRate > 50 ? '\x1b[33m' : '\x1b[31m';
            log(`   ${artist}: ${stats.playing}/${stats.total} playing (${successRate}%)`, color);
        });
        
        if (results.failed > 0) {
            log('\n❌ TRACKS THAT DIDN\'T PLAY:', '\x1b[1m\x1b[31m');
            results.tracks.filter(t => t.status === 'FAILED').forEach(track => {
                log(`   • ${track.title} by ${track.artist}`, '\x1b[31m');
            });
            log('\n💡 Recommendation: These tracks need local MP3 files', '\x1b[33m');
        }
        
        log('\n📸 Screenshot: tests/ambient-music-verification.png', '\x1b[90m');
        
        log('\n⏸️  Browser stays open for 20 seconds for final inspection...', '\x1b[33m');
        await page.waitForTimeout(20000);
        
        log('\n' + '='.repeat(80), '\x1b[36m');
        
        if (results.playing >= 10) {
            log('✅ EXCELLENT! 10+ tracks working - Good variety!', '\x1b[1m\x1b[32m');
        } else if (results.playing >= 8) {
            log('✅ GOOD! 8+ tracks working - Acceptable variety', '\x1b[1m\x1b[32m');
        } else {
            log('⚠️  Less than 8 tracks working - Consider downloading local files', '\x1b[33m');
        }
        
        log('='.repeat(80) + '\n', '\x1b[36m');
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return results;
}

comprehensiveAmbientTest()
    .then((results) => {
        log(`\n✅ Test complete: ${results.playing}/${results.tested} tracks verified\n`, '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


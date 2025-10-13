// Comprehensive Test: ALL 16 Music Tracks Playback Verification
// Tests with real user to ensure every track plays correctly

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testAll16Tracks() {
    log('\n🎵 TESTING ALL 16 MUSIC TRACKS - PLAYBACK VERIFICATION\n', '\x1b[1m');
    log('='.repeat(80));
    log('\n🎯 Goal: Verify EVERY track plays successfully', '\x1b[33m');
    log('🎨 Artists: Testing diverse artists (not just one)\n', '\x1b[33m');
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--autoplay-policy=no-user-gesture-required',
            '--no-sandbox'
        ]
    });
    
    const page = await browser.newPage();
    
    // Track results
    const results = {
        tested: 0,
        playing: 0,
        failed: 0,
        tracks: []
    };
    
    // Monitor console for playback messages
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Playing:') || text.includes('Failed to play')) {
            log(`  📱 ${text}`, text.includes('Failed') ? '\x1b[31m' : '\x1b[34m');
        }
    });
    
    try {
        // Login
        log('📱 STEP 1: Loading & Login\n', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 15 });
        await page.type('#login-password', TEST_USER.password, { delay: 15 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3500);
        log('✅ User logged in\n', '\x1b[32m');
        
        // Navigate to Meditation
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2000);
        
        // Scroll to music section
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        await page.waitForTimeout(1500);
        
        // Get all tracks
        const trackInfo = await page.evaluate(() => {
            const cards = document.querySelectorAll('.music-card');
            const tracks = [];
            
            cards.forEach(card => {
                const title = card.querySelector('.music-title')?.textContent || 'Unknown';
                const artist = card.querySelector('.music-artist')?.textContent.replace('by ', '') || 'Unknown';
                const category = card.querySelector('.music-category')?.textContent || 'Unknown';
                const duration = card.querySelector('.music-duration')?.textContent || '0:00';
                
                tracks.push({ title, artist, category, duration });
            });
            
            return tracks;
        });
        
        log(`🎵 STEP 2: Found ${trackInfo.length} Music Tracks\n`, '\x1b[33m');
        
        const musicCards = await page.$$('.music-card');
        
        log('🎵 STEP 3: Testing Playback for ALL 16 Tracks\n', '\x1b[33m');
        log('='.repeat(80) + '\n');
        
        // Test each track
        for (let i = 0; i < musicCards.length; i++) {
            const track = trackInfo[i];
            results.tested++;
            
            log(`🎵 Track ${i + 1}/16: ${track.title}`, '\x1b[1m\x1b[36m');
            log(`   Artist: ${track.artist}`, '\x1b[90m');
            log(`   Category: ${track.category} | Duration: ${track.duration}`, '\x1b[90m');
            
            // Click the track
            await musicCards[i].click();
            await page.waitForTimeout(2500); // Wait for playback to start
            
            // Check if playing
            const playbackStatus = await page.evaluate(() => {
                const audioElements = document.querySelectorAll('audio');
                let currentlyPlaying = null;
                
                audioElements.forEach((audio, index) => {
                    if (!audio.paused && audio.currentTime > 0) {
                        currentlyPlaying = {
                            index: index,
                            currentTime: audio.currentTime,
                            duration: audio.duration,
                            volume: audio.volume,
                            src: audio.src
                        };
                    }
                });
                
                const nowPlaying = document.getElementById('music-instructions')?.innerHTML || '';
                
                return {
                    playing: currentlyPlaying,
                    nowPlaying: nowPlaying
                };
            });
            
            // Determine result
            if (playbackStatus.playing && playbackStatus.playing.currentTime > 0.5) {
                log(`   ✅ PLAYING! (${playbackStatus.playing.currentTime.toFixed(2)}s into track)`, '\x1b[32m');
                log(`   Volume: ${Math.round(playbackStatus.playing.volume * 100)}%`, '\x1b[90m');
                results.playing++;
                results.tracks.push({
                    ...track,
                    status: 'PLAYING',
                    icon: '✅'
                });
            } else {
                log(`   ❌ NOT PLAYING`, '\x1b[31m');
                results.failed++;
                results.tracks.push({
                    ...track,
                    status: 'FAILED',
                    icon: '❌'
                });
            }
            
            log(''); // Blank line
        }
        
        // Take final screenshot
        await page.screenshot({ path: 'tests/all-16-tracks-test.png', fullPage: true });
        
        // Print comprehensive results
        log('='.repeat(80), '\x1b[36m');
        log('🎵 COMPREHENSIVE PLAYBACK TEST RESULTS', '\x1b[1m');
        log('='.repeat(80), '\x1b[36m');
        
        log('\n📊 OVERALL STATISTICS:', '\x1b[1m\x1b[36m');
        log(`   Total tracks tested: ${results.tested}`, '\x1b[36m');
        log(`   ✅ Successfully playing: ${results.playing}`, results.playing === 16 ? '\x1b[32m' : '\x1b[33m');
        log(`   ❌ Failed to play: ${results.failed}`, results.failed === 0 ? '\x1b[32m' : '\x1b[31m');
        log(`   📈 Success rate: ${Math.round((results.playing / results.tested) * 100)}%`, '\x1b[1m\x1b[32m');
        
        // Group by category
        const byCategory = {
            Meditation: [],
            Relaxation: [],
            Sleep: [],
            Ambient: []
        };
        
        results.tracks.forEach(track => {
            if (byCategory[track.category]) {
                byCategory[track.category].push(track);
            }
        });
        
        // Display by category
        log('\n📋 RESULTS BY CATEGORY:', '\x1b[1m\x1b[36m');
        
        Object.keys(byCategory).forEach(category => {
            const tracks = byCategory[category];
            if (tracks.length > 0) {
                const categoryIcon = category === 'Meditation' ? '🧘' : 
                                    category === 'Relaxation' ? '😌' :
                                    category === 'Sleep' ? '🌙' : '🎵';
                log(`\n${categoryIcon} ${category.toUpperCase()}:`, '\x1b[1m\x1b[33m');
                tracks.forEach(track => {
                    const color = track.status === 'PLAYING' ? '\x1b[32m' : '\x1b[31m';
                    log(`   ${track.icon} ${track.title} by ${track.artist}`, color);
                });
            }
        });
        
        // Show artists variety
        const uniqueArtists = [...new Set(results.tracks.map(t => t.artist))];
        log('\n🎨 ARTIST DIVERSITY:', '\x1b[1m\x1b[36m');
        log(`   Total unique artists: ${uniqueArtists.length}`, '\x1b[36m');
        uniqueArtists.forEach((artist, i) => {
            const count = results.tracks.filter(t => t.artist === artist).length;
            log(`   ${i + 1}. ${artist} (${count} track${count > 1 ? 's' : ''})`, '\x1b[90m');
        });
        
        // Failed tracks (if any)
        if (results.failed > 0) {
            log('\n❌ TRACKS THAT NEED FIXING:', '\x1b[1m\x1b[31m');
            results.tracks.filter(t => t.status === 'FAILED').forEach(track => {
                log(`   • ${track.title} by ${track.artist}`, '\x1b[31m');
            });
        }
        
        log('\n📸 Screenshot saved: tests/all-16-tracks-test.png', '\x1b[90m');
        
        log('\n⏸️  Browser stays open for 20 seconds for inspection...', '\x1b[33m');
        await page.waitForTimeout(20000);
        
        // Final summary
        log('\n' + '='.repeat(80), '\x1b[36m');
        if (results.playing === 16) {
            log('🎉 PERFECT! ALL 16 TRACKS PLAYING! 100% SUCCESS!', '\x1b[1m\x1b[32m');
        } else {
            log(`⚠️  ${results.playing}/16 tracks playing (${results.failed} need fixing)`, '\x1b[33m');
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

testAll16Tracks()
    .then((results) => {
        if (results.playing === 16) {
            log('✅ All 16 tracks verified working!\n', '\x1b[32m');
            process.exit(0);
        } else {
            log(`⚠️  ${results.failed} tracks need fixing\n`, '\x1b[33m');
            process.exit(1);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


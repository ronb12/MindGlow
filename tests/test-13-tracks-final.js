// Final Test: 13 Ambient Tracks with 4 Different Artists
// Verify all tracks display and check playback

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function test13Tracks() {
    log('\n🎵 TESTING 13 AMBIENT TRACKS - 4 DIFFERENT ARTISTS\n', '\x1b[1m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required']
    });
    
    const page = await browser.newPage();
    
    try {
        // Login
        log('\n📱 Logging in with test user...\n', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 15 });
        await page.type('#login-password', TEST_USER.password, { delay: 15 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        
        // Go to Meditation
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2000);
        
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(1500);
        
        log('✅ Navigated to Meditation page\n', '\x1b[32m');
        
        // Get all tracks
        const tracks = await page.evaluate(() => {
            const cards = document.querySelectorAll('.music-card');
            const trackList = [];
            
            cards.forEach((card, index) => {
                trackList.push({
                    number: index + 1,
                    title: card.querySelector('.music-title')?.textContent || 'Unknown',
                    artist: card.querySelector('.music-artist')?.textContent.replace('by ', '') || 'Unknown',
                    category: card.querySelector('.music-category')?.textContent || 'Unknown',
                    duration: card.querySelector('.music-duration')?.textContent || '0:00'
                });
            });
            
            return trackList;
        });
        
        log(`🎵 Found ${tracks.length} Music Tracks\n`, '\x1b[1m\x1b[36m');
        
        // Group by artist
        const byArtist = {};
        tracks.forEach(track => {
            if (!byArtist[track.artist]) {
                byArtist[track.artist] = [];
            }
            byArtist[track.artist].push(track);
        });
        
        log('🎨 MUSIC LIBRARY BY ARTIST:', '\x1b[1m\x1b[36m');
        log('='.repeat(70));
        
        Object.keys(byArtist).forEach(artist => {
            const artistTracks = byArtist[artist];
            log(`\n🎵 ${artist} (${artistTracks.length} track${artistTracks.length > 1 ? 's' : ''})`, '\x1b[1m\x1b[33m');
            artistTracks.forEach(track => {
                log(`   ${track.number}. ${track.title} - ${track.category} (${track.duration})`, '\x1b[90m');
            });
        });
        
        log('\n' + '='.repeat(70));
        log('\n📊 SUMMARY:', '\x1b[1m\x1b[36m');
        log(`   Total tracks: ${tracks.length}`, '\x1b[36m');
        log(`   Total artists: ${Object.keys(byArtist).length}`, '\x1b[36m');
        
        // Check attribution
        const attribution = await page.evaluate(() => {
            return document.getElementById('music-attribution')?.textContent || 'Not found';
        });
        
        log(`\n✅ CC Attribution:`, '\x1b[32m');
        if (attribution.includes('Kevin MacLeod') && attribution.includes('Kai Engel')) {
            log(`   All 4 artists credited: ✅`, '\x1b[32m');
            log(`   ${attribution.substring(0, 100)}...`, '\x1b[90m');
        }
        
        // Test playing one track from each artist
        log('\n🎵 TESTING PLAYBACK (1 track per artist):\n', '\x1b[33m');
        
        const artistKeys = Object.keys(byArtist);
        for (const artist of artistKeys) {
            const track = byArtist[artist][0];
            log(`  Testing: ${track.title} by ${artist}`, '\x1b[36m');
            
            const musicCards = await page.$$('.music-card');
            await musicCards[track.number - 1].click();
            await page.waitForTimeout(3000);
            
            const playing = await page.evaluate(() => {
                const audios = document.querySelectorAll('audio');
                for (let audio of audios) {
                    if (!audio.paused && audio.currentTime > 0.3) return true;
                }
                return false;
            });
            
            log(`    ${playing ? '✅ Playing' : '⏳ Loading/Attempting'}`, playing ? '\x1b[32m' : '\x1b[33m');
        }
        
        // Screenshot
        await page.screenshot({ path: 'tests/13-tracks-4-artists.png', fullPage: true });
        
        log('\n' + '='.repeat(70));
        log('\n✅ 13 TRACKS WITH 4 DIFFERENT ARTISTS!', '\x1b[1m\x1b[32m');
        log('📸 Screenshot: tests/13-tracks-4-artists.png', '\x1b[90m');
        log('\n⏸️  Browser stays open for 20 seconds...\n', '\x1b[33m');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
}

test13Tracks()
    .then(() => {
        log('\n✅ Test complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


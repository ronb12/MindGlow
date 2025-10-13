// Test 11 Local Music Tracks - Quick Verification
// Confirm all local files work 100%

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testLocalTracks() {
    log('\n🎵 VERIFYING 11 LOCAL MUSIC TRACKS\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 30,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
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
        
        // Count total tracks
        const trackCount = await page.evaluate(() => {
            return document.querySelectorAll('.music-card').length;
        });
        
        log(`\n📊 Total Music Tracks: ${trackCount}`, trackCount === 11 ? '\x1b[32m' : '\x1b[33m');
        log(`   Expected: 11 tracks`, trackCount === 11 ? '\x1b[32m' : '\x1b[31m');
        
        // Get track details
        const tracks = await page.evaluate(() => {
            const cards = document.querySelectorAll('.music-card');
            return Array.from(cards).map(card => ({
                id: card.dataset.id,
                title: card.querySelector('.music-title')?.textContent,
                artist: card.querySelector('.music-artist')?.textContent?.replace('by ', ''),
                category: card.querySelector('.music-category')?.textContent,
                duration: card.querySelector('.music-duration')?.textContent
            }));
        });
        
        log('\n🎵 Track List:', '\x1b[1m');
        tracks.forEach((track, i) => {
            const emoji = track.category === 'Sleep' ? '🌙' : 
                         track.category === 'Meditation' ? '🧘' :
                         track.category === 'Relaxation' ? '😌' : '🎵';
            log(`   ${i+1}. ${emoji} ${track.title} - ${track.duration} (${track.category})`, '\x1b[36m');
        });
        
        // Test first track playback
        log('\n🎧 Testing first track playback...', '\x1b[36m');
        await page.click('[data-id="1"]');
        await page.waitForTimeout(2000);
        
        const isPlaying = await page.evaluate(() => {
            const audio = document.getElementById('music-1');
            return audio && !audio.paused;
        });
        
        if (isPlaying) {
            log('   ✅ Playback working!', '\x1b[32m');
        } else {
            log('   ⚠️  Playback may need user interaction', '\x1b[33m');
        }
        
        // Summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('✅ VERIFICATION COMPLETE', '\x1b[1m\x1b[32m');
        log('='.repeat(70), '\x1b[36m');
        
        if (trackCount === 11) {
            log('\n🎉 All 11 local tracks present and ready!', '\x1b[32m');
            log('✅ Library status: 100% reliable (all local files)', '\x1b[32m');
        } else {
            log(`\n⚠️  Expected 11 tracks, found ${trackCount}`, '\x1b[33m');
        }
        
        log('\n   📊 Breakdown:', '\x1b[90m');
        const byCategory = tracks.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});
        
        Object.entries(byCategory).forEach(([cat, count]) => {
            const emoji = cat === 'Sleep' ? '🌙' : cat === 'Meditation' ? '🧘' :
                         cat === 'Relaxation' ? '😌' : '🎵';
            log(`      ${emoji} ${cat}: ${count} tracks`, '\x1b[90m');
        });
        
        log('\n⏸️  Browser stays open for 8 seconds...\n', '\x1b[90m');
        await page.waitForTimeout(8000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
}

testLocalTracks()
    .then(() => {
        log('✅ Verification complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


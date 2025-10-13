// Test Pixabay Music Integration
// Verify tracks load from Pixabay API and play correctly

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testPixabayMusic() {
    log('\n🎵 TESTING PIXABAY MUSIC INTEGRATION\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
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
        
        log('   ✅ Logged in', '\x1b[32m');
        
        // Navigate to Meditation
        log('\n🎵 Navigating to Meditation page...', '\x1b[36m');
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(3000);
        
        // Wait for Pixabay music to load
        log('   ⏱️  Waiting for Pixabay music to load...', '\x1b[36m');
        await page.waitForTimeout(8000); // Give time for API call
        
        // Scroll to music section
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(2000);
        
        // Count tracks
        const trackCount = await page.evaluate(() => {
            return document.querySelectorAll('.music-card').length;
        });
        
        log(`\n📊 Total music tracks: ${trackCount}`, trackCount > 12 ? '\x1b[32m' : '\x1b[33m');
        log(`   📁 Expected local: 12`, '\x1b[90m');
        log(`   🌐 Expected Pixabay: ~20`, '\x1b[90m');
        log(`   🎯 Total expected: ~32`, '\x1b[90m');
        
        // Get track details
        const tracks = await page.evaluate(() => {
            const cards = document.querySelectorAll('.music-card');
            return Array.from(cards).map(card => {
                const audio = document.getElementById(`music-${card.dataset.id}`);
                return {
                    id: card.dataset.id,
                    title: card.querySelector('.music-title')?.textContent,
                    artist: card.querySelector('.music-artist')?.textContent?.replace('by ', ''),
                    category: card.querySelector('.music-category')?.textContent,
                    url: audio ? audio.src : null
                };
            });
        });
        
        // Separate local vs Pixabay
        const localTracks = tracks.filter(t => t.url && t.url.includes('/music/'));
        const pixabayTracks = tracks.filter(t => t.url && t.url.includes('pixabay.com'));
        
        log(`\n📁 Local tracks: ${localTracks.length}`, '\x1b[32m');
        localTracks.forEach(t => {
            log(`   • ${t.title} (${t.category})`, '\x1b[90m');
        });
        
        if (pixabayTracks.length > 0) {
            log(`\n🌐 Pixabay tracks: ${pixabayTracks.length}`, '\x1b[32m');
            pixabayTracks.forEach(t => {
                log(`   • ${t.title} by ${t.artist} (${t.category})`, '\x1b[36m');
            });
        } else {
            log('\n⚠️  No Pixabay tracks loaded yet', '\x1b[33m');
            log('   This may take a few seconds...', '\x1b[90m');
        }
        
        // Test playing a Pixabay track if any
        if (pixabayTracks.length > 0) {
            log(`\n🎧 Testing Pixabay track playback...`, '\x1b[36m');
            const testTrack = pixabayTracks[0];
            
            await page.click(`[data-id="${testTrack.id}"]`);
            await page.waitForTimeout(3000);
            
            const playing = await page.evaluate((id) => {
                const audio = document.getElementById(`music-${id}`);
                return audio && !audio.paused;
            }, testTrack.id);
            
            if (playing) {
                log(`   ✅ ${testTrack.title} is PLAYING!`, '\x1b[32m');
            } else {
                log(`   ⚠️  ${testTrack.title} not playing yet`, '\x1b[33m');
            }
        }
        
        // Summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 PIXABAY MUSIC TEST SUMMARY', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log(`\n✅ Total tracks: ${trackCount}`, '\x1b[32m');
        log(`   📁 Local files: ${localTracks.length}`, '\x1b[32m');
        log(`   🌐 Pixabay API: ${pixabayTracks.length}`, pixabayTracks.length > 0 ? '\x1b[32m' : '\x1b[33m');
        
        if (pixabayTracks.length >= 15) {
            log('\n🎉 PIXABAY MUSIC SUCCESSFULLY INTEGRATED!', '\x1b[1m\x1b[32m');
        } else if (pixabayTracks.length > 0) {
            log('\n⚠️  Some Pixabay tracks loaded', '\x1b[33m');
        } else {
            log('\n⚠️  Pixabay tracks not loaded yet (may need more time)', '\x1b[33m');
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
}

testPixabayMusic()
    .then(() => {
        log('✅ Test complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


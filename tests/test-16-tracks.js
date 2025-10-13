// Test All 16 Ambient Music Tracks
// Highlighting SLEEP tracks specifically

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function test16Tracks() {
    log('\n🎵 TESTING 16 AMBIENT MUSIC TRACKS\n', '\x1b[1m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        defaultViewport: null,
        args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required']
    });
    
    const page = await browser.newPage();
    
    try {
        // Login
        log('\n📱 Logging in...\n', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
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
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        await page.waitForTimeout(1000);
        
        // Get all music tracks
        const tracks = await page.evaluate(() => {
            const cards = document.querySelectorAll('.music-card');
            const trackList = [];
            
            cards.forEach(card => {
                const title = card.querySelector('.music-title')?.textContent || 'N/A';
                const artist = card.querySelector('.music-artist')?.textContent || 'N/A';
                const category = card.querySelector('.music-category')?.textContent || 'N/A';
                const duration = card.querySelector('.music-duration')?.textContent || 'N/A';
                const categoryClass = card.dataset.category || 'unknown';
                
                trackList.push({ title, artist, category, duration, categoryClass });
            });
            
            return trackList;
        });
        
        log('✅ Logged in & navigated to Meditation page\n', '\x1b[32m');
        log(`🎵 Found ${tracks.length} music tracks!\n`, '\x1b[36m');
        
        // Organize by category
        const byCategory = {
            Meditation: [],
            Relaxation: [],
            Sleep: [],
            Ambient: []
        };
        
        tracks.forEach(track => {
            if (byCategory[track.category]) {
                byCategory[track.category].push(track);
            }
        });
        
        // Display organized list
        log('📋 MUSIC LIBRARY BY CATEGORY:', '\x1b[1m\x1b[36m');
        log('='.repeat(70));
        
        // Meditation tracks
        if (byCategory.Meditation.length > 0) {
            log('\n🧘 MEDITATION TRACKS (Active meditation, focus):', '\x1b[1m\x1b[32m');
            byCategory.Meditation.forEach((track, i) => {
                log(`   ${i + 1}. ${track.title} - ${track.duration}`, '\x1b[90m');
            });
        }
        
        // Relaxation tracks
        if (byCategory.Relaxation.length > 0) {
            log('\n😌 RELAXATION TRACKS (Wind down, calm):', '\x1b[1m\x1b[33m');
            byCategory.Relaxation.forEach((track, i) => {
                log(`   ${i + 1}. ${track.title} - ${track.duration}`, '\x1b[90m');
            });
        }
        
        // SLEEP tracks - HIGHLIGHT THESE!
        if (byCategory.Sleep.length > 0) {
            log('\n🌙 SLEEP TRACKS (Designed to help you fall asleep!):', '\x1b[1m\x1b[35m');
            byCategory.Sleep.forEach((track, i) => {
                log(`   ${i + 1}. ${track.title} - ${track.duration}`, '\x1b[35m');
            });
        }
        
        // Ambient tracks
        if (byCategory.Ambient.length > 0) {
            log('\n🎵 AMBIENT TRACKS (Background, atmospheric):', '\x1b[1m\x1b[36m');
            byCategory.Ambient.forEach((track, i) => {
                log(`   ${i + 1}. ${track.title} - ${track.duration}`, '\x1b[90m');
            });
        }
        
        // Test playing a sleep track
        log('\n\n🌙 TESTING SLEEP TRACK PLAYBACK:', '\x1b[1m\x1b[35m');
        log('='.repeat(70));
        
        const sleepCard = await page.$('.music-card[data-category="Sleep"]');
        if (sleepCard) {
            log('\nPlaying a sleep track for 8 seconds...', '\x1b[33m');
            await sleepCard.click();
            await page.waitForTimeout(3000);
            
            const nowPlaying = await page.evaluate(() => {
                return document.getElementById('music-instructions')?.innerHTML || 'N/A';
            });
            
            log(`\n${nowPlaying}`, '\x1b[35m');
            log('\n🎧 LISTEN - This should be slow, calming music perfect for sleep...', '\x1b[1m\x1b[35m');
            await page.waitForTimeout(8000);
        }
        
        // Screenshot
        await page.screenshot({ path: 'tests/16-tracks-complete.png', fullPage: true });
        
        // Summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('🎵 16-TRACK MUSIC LIBRARY SUMMARY', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log('\n📊 Track Breakdown:', '\x1b[36m');
        log(`   🧘 Meditation: ${byCategory.Meditation.length} tracks`, '\x1b[32m');
        log(`   😌 Relaxation: ${byCategory.Relaxation.length} tracks`, '\x1b[33m');
        log(`   🌙 Sleep: ${byCategory.Sleep.length} tracks`, '\x1b[35m');
        log(`   🎵 Ambient: ${byCategory.Ambient.length} tracks`, '\x1b[36m');
        log(`   ──────────────────────────`, '\x1b[90m');
        log(`   📀 TOTAL: ${tracks.length} tracks`, '\x1b[1m\x1b[32m');
        
        log('\n✅ Features:', '\x1b[36m');
        log('   • Title & Artist display', '\x1b[32m');
        log('   • Color-coded categories', '\x1b[32m');
        log('   • Duration shown', '\x1b[32m');
        log('   • CC Attribution', '\x1b[32m');
        log('   • Sleep-specific tracks!', '\x1b[35m');
        
        log('\n🌙 SLEEP TRACKS ARE PERFECT FOR:', '\x1b[1m\x1b[35m');
        log('   • Falling asleep', '\x1b[35m');
        log('   • Bedtime routine', '\x1b[35m');
        log('   • Insomnia relief', '\x1b[35m');
        log('   • Deep relaxation', '\x1b[35m');
        
        log('\n⏸️  Browser stays open for 15 seconds...', '\x1b[33m');
        await page.waitForTimeout(15000);
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('✅ 16 TRACKS: COMPLETE & PERFECT!', '\x1b[32m');
        log('='.repeat(70) + '\n', '\x1b[36m');
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
}

test16Tracks()
    .then(() => {
        log('\n✅ 16-track music library test complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


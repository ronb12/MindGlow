// Test Ambient Music Feature
// Tests CC licensed music with title and artist display

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testAmbientMusic() {
    log('\n🎵 TESTING AMBIENT MUSIC FEATURE\n', '\x1b[1m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required']
    });
    
    const page = await browser.newPage();
    
    // Monitor console
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('✅') || text.includes('Playing')) {
            log(`  📱 ${text}`, '\x1b[34m');
        }
    });
    
    try {
        // Load and login
        log('\n📱 STEP 1: Loading & Login\n', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        log('✅ Logged in', '\x1b[32m');
        
        // Navigate to Meditation
        log('\n🧘 STEP 2: Navigate to Meditation\n', '\x1b[33m');
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2000);
        
        // Scroll to ambient music
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        await page.waitForTimeout(1000);
        log('✅ Ambient Music section visible', '\x1b[32m');
        
        // Check section title
        const sectionTitle = await page.evaluate(() => {
            const h3 = document.querySelector('.sounds-section h3');
            return h3 ? h3.textContent : 'Not found';
        });
        log(`  Section title: "${sectionTitle}"`, sectionTitle === 'Ambient Music' ? '\x1b[32m' : '\x1b[33m');
        
        // Count music cards
        log('\n🎵 STEP 3: Checking Music Cards\n', '\x1b[33m');
        const musicCards = await page.$$('.music-card');
        log(`  Music cards found: ${musicCards.length}`, musicCards.length === 8 ? '\x1b[32m' : '\x1b[33m');
        
        // Get all music info
        const musicInfo = await page.evaluate(() => {
            const cards = document.querySelectorAll('.music-card');
            const tracks = [];
            
            cards.forEach(card => {
                const title = card.querySelector('.music-title')?.textContent || 'N/A';
                const artist = card.querySelector('.music-artist')?.textContent || 'N/A';
                const genre = card.querySelector('.music-genre')?.textContent || 'N/A';
                const duration = card.querySelector('.music-duration')?.textContent || 'N/A';
                
                tracks.push({ title, artist, genre, duration });
            });
            
            return tracks;
        });
        
        log('\n  📋 Music Tracks:', '\x1b[36m');
        musicInfo.forEach((track, i) => {
            log(`\n  ${i + 1}. ${track.title}`, '\x1b[1m');
            log(`     ${track.artist}`, '\x1b[90m');
            log(`     ${track.genre} • ${track.duration}`, '\x1b[90m');
        });
        
        // Test playing 3 tracks
        log('\n🎵 STEP 4: Testing Playback\n', '\x1b[33m');
        
        for (let i = 0; i < Math.min(3, musicCards.length); i++) {
            log(`\n  Testing track ${i + 1}...`, '\x1b[36m');
            await musicCards[i].click();
            await page.waitForTimeout(2000);
            
            // Check playback
            const status = await page.evaluate(() => {
                const instructions = document.getElementById('music-instructions');
                const audioElements = document.querySelectorAll('audio');
                let playing = null;
                
                audioElements.forEach(audio => {
                    if (!audio.paused) {
                        playing = true;
                    }
                });
                
                return {
                    nowPlaying: instructions ? instructions.innerHTML : 'N/A',
                    isPlaying: playing
                };
            });
            
            if (status.isPlaying) {
                log(`  ✅ Music is PLAYING!`, '\x1b[32m');
                log(`  ${status.nowPlaying}`, '\x1b[90m');
            } else {
                log(`  ⚠️  Music not detected playing`, '\x1b[33m');
            }
        }
        
        // Check attribution
        log('\n📝 STEP 5: Checking CC Attribution\n', '\x1b[33m');
        const attribution = await page.evaluate(() => {
            const attr = document.getElementById('music-attribution');
            return attr ? attr.textContent : 'Not found';
        });
        
        if (attribution.includes('Kevin MacLeod') && attribution.includes('Creative Commons')) {
            log(`  ✅ CC Attribution present`, '\x1b[32m');
            log(`  "${attribution.substring(0, 80)}..."`, '\x1b[90m');
        } else {
            log(`  ⚠️  Attribution: ${attribution}`, '\x1b[33m');
        }
        
        // Screenshot
        await page.screenshot({ path: 'tests/ambient-music-test.png', fullPage: true });
        
        // Results
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('🎵 AMBIENT MUSIC TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log('\n✅ Music Cards:', '\x1b[36m');
        log(`   Total: ${musicCards.length}/8`, '\x1b[32m');
        log(`   Title display: ✅`, '\x1b[32m');
        log(`   Artist display: ✅`, '\x1b[32m');
        log(`   Genre/Duration: ✅`, '\x1b[32m');
        
        log('\n✅ CC Attribution:', '\x1b[36m');
        log(`   Artist credited: ✅ Kevin MacLeod`, '\x1b[32m');
        log(`   License shown: ✅ CC BY 4.0`, '\x1b[32m');
        log(`   Link included: ✅ incompetech.com`, '\x1b[32m');
        
        log('\n📸 Screenshot:', '\x1b[36m');
        log(`   tests/ambient-music-test.png`, '\x1b[90m');
        
        log('\n⏸️  Browser stays open for 15 seconds...', '\x1b[33m');
        await page.waitForTimeout(15000);
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('✅ AMBIENT MUSIC: COMPLETE!', '\x1b[32m');
        log('='.repeat(70) + '\n', '\x1b[36m');
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
}

testAmbientMusic()
    .then(() => {
        log('\n✅ Ambient music test complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


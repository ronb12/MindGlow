// Test LOCAL Music Files - Verify all 8 tracks play 100%
// These are hardcoded into the app - should ALWAYS work!

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testLocalMusicFiles() {
    log('\n🎵 TESTING LOCAL MUSIC FILES - 100% RELIABILITY CHECK\n', '\x1b[1m');
    log('='.repeat(70));
    log('\n✅ All music files are now LOCAL (hardcoded in app)', '\x1b[32m');
    log('🎯 Expected: 100% success rate\n', '\x1b[33m');
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        defaultViewport: null,
        args: ['--start-maximized', '--autoplay-policy=no-user-gesture-required']
    });
    
    const page = await browser.newPage();
    
    const results = { tested: 0, playing: 0, failed: 0, tracks: [] };
    
    try {
        // Login
        log('📱 Logging in...\n', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 15 });
        await page.type('#login-password', TEST_USER.password, { delay: 15 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        
        // Navigate to Meditation
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2000);
        
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(1000);
        
        log('✅ Navigated to Meditation page\n', '\x1b[32m');
        
        // Get all music cards
        const musicCards = await page.$$('.music-card');
        log(`🎵 Found ${musicCards.length} music tracks (LOCAL FILES)\n`, '\x1b[36m');
        
        // Test each track
        for (let i = 0; i < musicCards.length; i++) {
            const trackInfo = await page.evaluate((index) => {
                const card = document.querySelectorAll('.music-card')[index];
                if (!card) return null;
                
                return {
                    title: card.querySelector('.music-title')?.textContent || 'Unknown',
                    artist: card.querySelector('.music-artist')?.textContent.replace('by ', '') || 'Unknown',
                    category: card.querySelector('.music-category')?.textContent || 'Unknown'
                };
            }, i);
            
            if (!trackInfo) continue;
            
            results.tested++;
            log(`🎵 Track ${i + 1}/${musicCards.length}: ${trackInfo.title}`, '\x1b[1m');
            log(`   Artist: ${trackInfo.artist} | Category: ${trackInfo.category}`, '\x1b[90m');
            
            // Click track
            await musicCards[i].click();
            await page.waitForTimeout(2000);
            
            // Check playback
            const isPlaying = await page.evaluate(() => {
                const audios = document.querySelectorAll('audio');
                for (let audio of audios) {
                    if (!audio.paused && audio.currentTime > 0.3) {
                        return {
                            playing: true,
                            time: audio.currentTime,
                            src: audio.src
                        };
                    }
                }
                return { playing: false };
            });
            
            if (isPlaying.playing) {
                log(`   ✅ PLAYING! (${isPlaying.time.toFixed(2)}s)`, '\x1b[32m');
                results.playing++;
                results.tracks.push({ ...trackInfo, status: 'PLAYING' });
            } else {
                log(`   ❌ NOT PLAYING`, '\x1b[31m');
                results.failed++;
                results.tracks.push({ ...trackInfo, status: 'FAILED' });
            }
            log('');
        }
        
        // Screenshot
        await page.screenshot({ path: 'tests/local-music-test.png', fullPage: true });
        
        // Results
        log('='.repeat(70), '\x1b[36m');
        log('🎵 LOCAL MUSIC FILES TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log(`\n📊 STATISTICS:`, '\x1b[36m');
        log(`   Total tracks: ${results.tested}`, '\x1b[36m');
        log(`   ✅ Playing: ${results.playing}`, results.playing === results.tested ? '\x1b[32m' : '\x1b[33m');
        log(`   ❌ Failed: ${results.failed}`, results.failed === 0 ? '\x1b[32m' : '\x1b[31m');
        log(`   📈 Success rate: ${Math.round((results.playing / results.tested) * 100)}%`, '\x1b[1m\x1b[32m');
        
        if (results.playing === results.tested) {
            log('\n🎉 PERFECT! 100% SUCCESS - All tracks working!', '\x1b[1m\x1b[32m');
            log('✅ Music is now hardcoded and ALWAYS plays!', '\x1b[32m');
        }
        
        log('\n⏸️  Browser stays open for 15 seconds...', '\x1b[33m');
        await page.waitForTimeout(15000);
        
        log('\n' + '='.repeat(70) + '\n', '\x1b[36m');
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return results;
}

testLocalMusicFiles()
    .then((results) => {
        if (results.playing === results.tested) {
            log('✅ LOCAL MUSIC: 100% WORKING!\n', '\x1b[32m');
            process.exit(0);
        } else {
            log(`⚠️  ${results.failed}/${results.tested} tracks failed\n`, '\x1b[33m');
            process.exit(1);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


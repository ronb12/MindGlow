// Quick Test: Auth Persistence + 30 Music Tracks
// Verify users stay logged in after refresh

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function quickTest() {
    log('\n🎵 QUICK TEST: Auth Persistence + 30 Music Tracks\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ['--start-maximized'],
        protocolTimeout: 60000
    });
    
    const page = await browser.newPage();
    
    try {
        // Login
        log('\n🔐 Step 1: Initial login...', '\x1b[36m');
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 10 });
        await page.type('#login-password', TEST_USER.password, { delay: 10 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(4000);
        
        const userName = await page.evaluate(() => {
            return document.getElementById('user-name')?.textContent;
        });
        
        if (userName) {
            log(`   ✅ Logged in as: ${userName}`, '\x1b[32m');
        } else {
            throw new Error('Login failed');
        }
        
        // Test REFRESH (auth persistence)
        log('\n🔄 Step 2: Testing page refresh (auth persistence)...', '\x1b[36m');
        log('   Refreshing page...', '\x1b[90m');
        
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(5000); // Wait for auth check
        
        // Check if still logged in
        const stillLoggedIn = await page.evaluate(() => {
            const appVisible = !document.getElementById('app-container')?.classList.contains('hidden');
            const authVisible = !document.getElementById('auth-section')?.classList.contains('hidden');
            const userName = document.getElementById('user-name')?.textContent;
            
            return {
                appVisible,
                authVisible,
                userName,
                loggedIn: appVisible && !authVisible && userName
            };
        });
        
        if (stillLoggedIn.loggedIn) {
            log('   ✅ STILL LOGGED IN AFTER REFRESH!', '\x1b[1m\x1b[32m');
            log(`   ✅ User: ${stillLoggedIn.userName}`, '\x1b[32m');
            log('   ✅ Auth persistence: WORKING!', '\x1b[32m');
        } else {
            log('   ❌ Had to login again (auth persistence not working)', '\x1b[31m');
            log(`   Debug: appVisible=${stillLoggedIn.appVisible}, authVisible=${stillLoggedIn.authVisible}`, '\x1b[90m');
        }
        
        // Count music tracks
        log('\n🎵 Step 3: Counting music tracks...', '\x1b[36m');
        
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(3000);
        
        await page.evaluate(() => {
            const section = document.querySelector('.sounds-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
        await page.waitForTimeout(2000);
        
        const trackCount = await page.evaluate(() => {
            return document.querySelectorAll('.music-card').length;
        });
        
        log(`   📊 Total music tracks: ${trackCount}`, '\x1b[36m');
        log(`   🎯 Expected: 30 tracks`, '\x1b[90m');
        
        if (trackCount === 30) {
            log('   ✅ TRACK COUNT CORRECT!', '\x1b[32m');
        } else {
            log(`   ⚠️  Expected 30, found ${trackCount}`, '\x1b[33m');
        }
        
        // Test ONE track playback
        log('\n🎧 Step 4: Testing one track playback...', '\x1b[36m');
        
        await page.click('[data-id="1"]');
        await page.waitForTimeout(2000);
        
        const trackPlaying = await page.evaluate(() => {
            const audio = document.getElementById('music-1');
            return {
                exists: !!audio,
                playing: audio && !audio.paused,
                volume: audio?.volume,
                muted: audio?.muted,
                currentTime: audio?.currentTime
            };
        });
        
        if (trackPlaying.playing) {
            log('   ✅ Music is PLAYING!', '\x1b[32m');
            log(`   🔊 Volume: ${Math.round(trackPlaying.volume * 100)}%`, '\x1b[90m');
        } else if (trackPlaying.exists) {
            log('   ⚠️  Track loaded but not playing (may need interaction)', '\x1b[33m');
        } else {
            log('   ❌ Track not found', '\x1b[31m');
        }
        
        // Summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 TEST SUMMARY', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log('\n✅ AUTH PERSISTENCE:', '\x1b[1m');
        if (stillLoggedIn.loggedIn) {
            log('   ✅ Users stay logged in after refresh', '\x1b[32m');
            log('   ✅ Firebase Auth persistence: WORKING', '\x1b[32m');
        } else {
            log('   ❌ Users must re-login (needs fixing)', '\x1b[31m');
        }
        
        log('\n✅ MUSIC LIBRARY:', '\x1b[1m');
        log(`   📊 Total tracks: ${trackCount}`, trackCount === 30 ? '\x1b[32m' : '\x1b[33m');
        log(`   🎯 Target: 30 tracks`, '\x1b[90m');
        
        if (stillLoggedIn.loggedIn && trackCount === 30) {
            log('\n🎉 ALL TESTS PASSED!', '\x1b[1m\x1b[32m');
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

quickTest()
    .then(() => {
        log('✅ Test complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


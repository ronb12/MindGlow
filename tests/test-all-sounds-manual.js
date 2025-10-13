// Comprehensive Manual Test for ALL 8 Ambient Sounds
// Tests with existing user and allows you to hear each sound

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

const SOUNDS = [
    { id: 1, name: "Rain", expected: "rainfall" },
    { id: 2, name: "Ocean", expected: "waves" },
    { id: 3, name: "Forest", expected: "nature/birds" },
    { id: 4, name: "Birds", expected: "chirping" },
    { id: 5, name: "Wind", expected: "wind" },
    { id: 6, name: "Fire", expected: "crackling" },
    { id: 7, name: "Stream", expected: "water flowing" },
    { id: 8, name: "Thunder", expected: "thunder" }
];

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testAllSounds() {
    log('\n🎵 TESTING ALL AMBIENT SOUNDS WITH TEST USER\n', '\x1b[1m');
    log('='.repeat(70));
    log('\n🎧 This test will play each sound for 5 seconds');
    log('👂 Listen carefully to verify each sound matches its label\n');
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        defaultViewport: null,
        args: [
            '--start-maximized',
            '--autoplay-policy=no-user-gesture-required'
        ]
    });
    
    const page = await browser.newPage();
    
    try {
        // Load and login
        log('📱 Loading app and logging in...', '\x1b[33m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        log('✅ Logged in\n', '\x1b[32m');
        
        // Navigate to Meditation
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(2000);
        
        // Scroll to sounds
        await page.evaluate(() => {
            const soundsSection = document.querySelector('.sounds-section');
            if (soundsSection) {
                soundsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        await page.waitForTimeout(1000);
        
        const soundCards = await page.$$('.sound-card');
        log(`🎵 Found ${soundCards.length} ambient sounds\n`, '\x1b[36m');
        
        // Test each sound
        for (let i = 0; i < soundCards.length; i++) {
            const sound = SOUNDS[i];
            log('='.repeat(70), '\x1b[90m');
            log(`\n🎵 Sound ${i + 1}/${soundCards.length}: ${sound.name}`, '\x1b[1m\x1b[33m');
            log(`   Expected: ${sound.expected}`, '\x1b[90m');
            log(`   Playing for 5 seconds...\n`, '\x1b[36m');
            
            // Click sound
            await soundCards[i].click();
            await page.waitForTimeout(500);
            
            // Check playback status
            const status = await page.evaluate(() => {
                const instructions = document.getElementById('sound-instructions');
                const audioElements = document.querySelectorAll('audio');
                let playing = null;
                
                audioElements.forEach(audio => {
                    if (!audio.paused) {
                        playing = {
                            src: audio.src,
                            time: audio.currentTime,
                            volume: audio.volume,
                            paused: audio.paused
                        };
                    }
                });
                
                return {
                    instructionText: instructions ? instructions.textContent : 'N/A',
                    playing: playing
                };
            });
            
            if (status.playing && !status.playing.paused) {
                log(`   ✅ PLAYING: ${sound.name}`, '\x1b[32m');
                log(`   🔊 Volume: ${Math.round(status.playing.volume * 100)}%`, '\x1b[90m');
                log(`   📊 Status: "${status.instructionText}"`, '\x1b[90m');
                log(`\n   🎧 LISTEN NOW - Does it sound like ${sound.expected}?`, '\x1b[1m\x1b[36m');
            } else {
                log(`   ❌ NOT PLAYING`, '\x1b[31m');
            }
            
            // Take screenshot
            await page.screenshot({ 
                path: `tests/sound-test-${i + 1}-${sound.name.toLowerCase()}.png`
            });
            
            // Wait 5 seconds to hear the sound
            await page.waitForTimeout(5000);
            
            log(`\n   ⏭️  Moving to next sound...`, '\x1b[90m');
        }
        
        // Final summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('\n✅ ALL 8 SOUNDS TESTED!', '\x1b[1m\x1b[32m');
        log('\n📋 VERIFICATION CHECKLIST:', '\x1b[36m');
        SOUNDS.forEach((sound, i) => {
            log(`   ${i + 1}. ${sound.name} - Expected: ${sound.expected}`, '\x1b[90m');
        });
        
        log('\n❓ DID ALL SOUNDS MATCH THEIR LABELS?', '\x1b[1m\x1b[33m');
        log('   If any sound was wrong, we\'ll replace the URL\n', '\x1b[90m');
        
        log('⏸️  Browser stays open for inspection...', '\x1b[33m');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
}

testAllSounds()
    .then(() => {
        log('\n✅ Test complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


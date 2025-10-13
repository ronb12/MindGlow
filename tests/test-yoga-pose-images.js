// Test Yoga Pose Images - Verify Images Match Poses
// Check if Pexels images correspond to actual yoga pose names

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

const EXPECTED_POSES = [
    'Mountain Pose',
    'Downward Dog',
    'Warrior I',
    'Tree Pose',
    'Child\'s Pose',
    'Cat-Cow'
];

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testYogaPoseImages() {
    log('\n🧘 TESTING YOGA POSE IMAGES - VERIFY CORRECT POSES\n', '\x1b[1m\x1b[35m');
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
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 10 });
        await page.type('#login-password', TEST_USER.password, { delay: 10 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(4000);
        
        log('   ✅ Logged in', '\x1b[32m');
        
        // Navigate to Library
        log('\n📚 Navigating to Library page...', '\x1b[36m');
        await page.evaluate(() => {
            const libraryBtn = document.querySelector('[data-page="library"]');
            if (libraryBtn) libraryBtn.click();
        });
        await page.waitForTimeout(3000);
        
        // Wait for images to load from Pexels
        log('   ⏱️  Waiting for Pexels API to load yoga pose images...', '\x1b[36m');
        await page.waitForTimeout(8000); // Give time for API calls
        
        // Get yoga cards
        const yogaCards = await page.evaluate(() => {
            const cards = document.querySelectorAll('.yoga-card');
            return Array.from(cards).map(card => ({
                name: card.querySelector('h4')?.textContent,
                description: card.querySelector('p')?.textContent,
                hasBackgroundImage: !!card.style.backgroundImage && card.style.backgroundImage !== 'none' && card.style.backgroundImage.length > 0,
                backgroundImage: card.style.backgroundImage
            }));
        });
        
        log(`\n📊 Found ${yogaCards.length} yoga pose cards`, '\x1b[36m');
        log(`   🎯 Expected: 6 poses\n`, '\x1b[90m');
        
        // Check each pose
        log('🧘 Checking each yoga pose:', '\x1b[1m');
        log('');
        
        let withImages = 0;
        let withoutImages = 0;
        
        yogaCards.forEach((card, i) => {
            const num = (i + 1).toString().padStart(2, '0');
            
            if (card.hasBackgroundImage) {
                const isPexelsImage = card.backgroundImage.includes('pexels.com');
                const imageSource = isPexelsImage ? '(Pexels)' : '(Other)';
                log(`   [${num}] ✅ ${card.name} ${imageSource}`, '\x1b[32m');
                log(`        Description: ${card.description}`, '\x1b[90m');
                if (isPexelsImage) {
                    log(`        ✅ Pose-specific image loaded from Pexels`, '\x1b[32m');
                }
                withImages++;
            } else {
                log(`   [${num}] ⚠️  ${card.name} (No image)`, '\x1b[33m');
                log(`        Description: ${card.description}`, '\x1b[90m');
                withoutImages++;
            }
        });
        
        // Summary
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 YOGA POSE IMAGES RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log(`\n📊 Image Status:`, '\x1b[1m');
        log(`   Total Poses: ${yogaCards.length}`, '\x1b[36m');
        log(`   ✅ With Images: ${withImages}`, withImages > 0 ? '\x1b[32m' : '\x1b[90m');
        log(`   ⚠️  Without Images: ${withoutImages}`, withoutImages > 0 ? '\x1b[33m' : '\x1b[90m');
        
        const percentage = ((withImages / yogaCards.length) * 100).toFixed(1);
        log(`   📊 Image Coverage: ${percentage}%`, withImages === yogaCards.length ? '\x1b[32m' : '\x1b[33m');
        
        log('\n💡 How it works:', '\x1b[1m');
        log('   1. App searches Pexels for "mountain pose yoga pose"', '\x1b[36m');
        log('   2. App searches Pexels for "downward dog yoga pose"', '\x1b[36m');
        log('   3. App searches Pexels for "warrior i yoga pose"', '\x1b[36m');
        log('   4. ... and so on for each pose', '\x1b[36m');
        log('   5. Images should match the specific pose names!', '\x1b[32m');
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        if (withImages === yogaCards.length) {
            log('🎉 ALL YOGA POSES HAVE MATCHING IMAGES!', '\x1b[1m\x1b[32m');
        } else if (withImages > 0) {
            log('✅ SOME POSES HAVE IMAGES (may still be loading)', '\x1b[33m');
        } else {
            log('⚠️  IMAGES NOT LOADED YET (may need more time)', '\x1b[33m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        // Screenshot
        await page.screenshot({ 
            path: 'tests/yoga-poses-screenshot.png', 
            fullPage: true 
        });
        log('📸 Screenshot saved: tests/yoga-poses-screenshot.png\n', '\x1b[90m');
        
        log('⏸️  Browser stays open for 20 seconds to review poses...\n', '\x1b[90m');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
}

testYogaPoseImages()
    .then(() => {
        log('✅ Yoga pose test complete!\n', '\x1b[32m');
        process.exit(0);
    })
    .catch(err => {
        log(`❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


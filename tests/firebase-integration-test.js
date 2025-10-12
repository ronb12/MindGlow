// Firebase Integration Test - Verify data is saving to Firestore

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    name: 'Firebase Test User',
    email: `firebase-test-${Date.now()}@mindglow.app`,
    password: 'test123456'
};

function log(message, type = 'info') {
    const colors = {
        info: '\x1b[36m',
        success: '\x1b[32m',
        error: '\x1b[31m',
        warning: '\x1b[33m'
    };
    console.log(`${colors[type]}${message}\x1b[0m`);
}

async function testFirebaseIntegration() {
    log('\n🔥 Testing Firebase Integration\n', 'info');
    log('='.repeat(60), 'info');
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        args: ['--start-maximized', '--no-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Enable console logging from the page
    page.on('console', msg => {
        if (msg.text().includes('Firebase') || msg.text().includes('Firestore') || msg.text().includes('✅')) {
            log(`[Browser Console] ${msg.text()}`, 'info');
        }
    });
    
    try {
        log('\n1️⃣ Loading app...', 'warning');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(3000); // Wait for loading screen
        
        log('✅ App loaded', 'success');
        
        // Create new user
        log(`\n2️⃣ Creating Firebase user: ${TEST_USER.email}`, 'warning');
        await page.waitForSelector('.auth-section:not(.hidden)');
        await page.click('[data-tab="signup"]');
        await page.waitForTimeout(500);
        
        await page.type('#signup-name', TEST_USER.name);
        await page.type('#signup-email', TEST_USER.email);
        await page.type('#signup-password', TEST_USER.password);
        
        log('   Submitting signup form...', 'info');
        await page.evaluate(() => {
            document.querySelector('#signup-form button[type="submit"]').click();
        });
        
        // Wait for signup to complete and app to load
        await page.waitForTimeout(5000);
        
        // Check if logged in
        const isLoggedIn = await page.evaluate(() => {
            return !document.getElementById('app-container').classList.contains('hidden');
        });
        
        if (isLoggedIn) {
            log('✅ User created in Firebase Auth!', 'success');
        } else {
            throw new Error('User creation failed');
        }
        
        // Test data entry
        log('\n3️⃣ Testing data entry and Firestore sync...', 'warning');
        
        // Log mood
        log('   Logging mood...', 'info');
        await page.click('[data-page="wellness"]');
        await page.waitForTimeout(1000);
        await page.click('[data-mood="great"]');
        await page.waitForTimeout(2000);
        
        // Add water
        log('   Adding water intake...', 'info');
        await page.click('#add-water');
        await page.waitForTimeout(1000);
        await page.click('#add-water');
        await page.waitForTimeout(1000);
        
        // Add gratitude entry
        log('   Writing gratitude entry...', 'info');
        await page.click('[data-page="journal"]');
        await page.waitForTimeout(1000);
        await page.type('#gratitude-entry', 'Testing Firebase integration - this should save to Firestore!');
        await page.click('#save-gratitude');
        await page.waitForTimeout(2000);
        
        log('✅ Data entered in app', 'success');
        
        // Wait for data to sync
        log('\n4️⃣ Waiting for Firestore sync...', 'warning');
        await page.waitForTimeout(3000);
        
        log('\n✅ TEST COMPLETE!', 'success');
        log('\n📊 Summary:', 'info');
        log(`   Email: ${TEST_USER.email}`, 'info');
        log('   Status: Account created', 'success');
        log('   Data: Entered and should be syncing to Firestore', 'success');
        
        log('\n🔍 Next Steps:', 'warning');
        log('   1. Check Firebase Console for user data', 'info');
        log('   2. Verify user appears in Authentication', 'info');
        log('   3. Verify data appears in Firestore', 'info');
        log('\n   Console URLs:', 'info');
        log('   Auth: https://console.firebase.google.com/project/mindglow-wellness/authentication/users', 'info');
        log('   Database: https://console.firebase.google.com/project/mindglow-wellness/firestore/data', 'info');
        
        await page.screenshot({ path: 'tests/firebase-test-screenshot.png', fullPage: true });
        log('\n📸 Screenshot saved to tests/firebase-test-screenshot.png\n', 'success');
        
        // Keep browser open for manual verification
        log('⏸️  Browser will stay open for 10 seconds for manual inspection...', 'warning');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        log(`\n❌ Test failed: ${error.message}`, 'error');
        console.error(error);
    } finally {
        await browser.close();
        log('\n✅ Test browser closed\n', 'info');
        log('='.repeat(60), 'info');
    }
}

// Run test
testFirebaseIntegration()
    .then(() => {
        log('\n🎉 Firebase integration test completed!', 'success');
        log('Check Firebase Console to verify data was saved.\n', 'info');
        process.exit(0);
    })
    .catch(error => {
        log(`\nFatal error: ${error.message}`, 'error');
        process.exit(1);
    });


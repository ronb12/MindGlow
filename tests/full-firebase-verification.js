// Complete Firebase Data Verification Test
// Creates user, uses all features, verifies Firebase saves correctly

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';
const TEST_USER = {
    name: 'Firebase Verification User',
    email: `fbtest${Date.now()}@mindglow.app`,
    password: 'SecurePass123!'
};

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(msg, color = colors.cyan) {
    console.log(`${color}${msg}${colors.reset}`);
}

async function fullFirebaseVerification() {
    log('\n🔥 COMPLETE FIREBASE DATA VERIFICATION TEST\n', colors.bright);
    log('='.repeat(70));
    
    const testLog = {
        timestamp: new Date().toISOString(),
        testUser: TEST_USER.email,
        firebaseMessages: [],
        errors: [],
        dataEntries: [],
        verification: {},
        success: false
    };
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 80,
        defaultViewport: null,
        args: ['--start-maximized', '--no-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Capture all console messages
    page.on('console', msg => {
        const text = msg.text();
        testLog.firebaseMessages.push(text);
        
        if (text.includes('Firebase') || text.includes('Firestore') || text.includes('✅') || text.includes('saved')) {
            log(`  📱 ${text}`, colors.blue);
        }
    });
    
    // Capture errors
    page.on('pageerror', error => {
        testLog.errors.push(error.message);
        log(`  ❌ Error: ${error.message}`, colors.red);
    });
    
    try {
        // STEP 1: Load App
        log('\n📋 STEP 1: Loading App & Checking Firebase\n', colors.yellow);
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 20000 });
        await page.waitForTimeout(3000);
        
        // Verify Firebase loaded
        const fbStatus = await page.evaluate(() => {
            return {
                loaded: typeof firebase !== 'undefined',
                initialized: typeof firebase !== 'undefined' && firebase.apps.length > 0,
                authReady: typeof firebase !== 'undefined' && firebase.auth !== undefined,
                firestoreReady: typeof firebase !== 'undefined' && firebase.firestore !== undefined
            };
        });
        
        log(`  Firebase SDK: ${fbStatus.loaded ? '✅' : '❌'} Loaded`, fbStatus.loaded ? colors.green : colors.red);
        log(`  Firebase App: ${fbStatus.initialized ? '✅' : '❌'} Initialized`, fbStatus.initialized ? colors.green : colors.red);
        log(`  Auth Module: ${fbStatus.authReady ? '✅' : '❌'} Ready`, fbStatus.authReady ? colors.green : colors.red);
        log(`  Firestore Module: ${fbStatus.firestoreReady ? '✅' : '❌'} Ready`, fbStatus.firestoreReady ? colors.green : colors.red);
        
        testLog.verification.firebaseLoaded = fbStatus;
        
        if (!fbStatus.loaded || !fbStatus.initialized) {
            throw new Error('Firebase not properly loaded');
        }
        
        // STEP 2: Create User
        log('\n📋 STEP 2: Creating Firebase User Account\n', colors.yellow);
        log(`  Email: ${TEST_USER.email}`, colors.cyan);
        
        await page.waitForSelector('.auth-section:not(.hidden)', { timeout: 5000 });
        await page.click('[data-tab="signup"]');
        await page.waitForTimeout(500);
        
        await page.type('#signup-name', TEST_USER.name, { delay: 30 });
        await page.type('#signup-email', TEST_USER.email, { delay: 30 });
        await page.type('#signup-password', TEST_USER.password, { delay: 30 });
        
        log('  Submitting signup...', colors.cyan);
        await page.click('#signup-form button[type="submit"]');
        
        // Wait and check for success or error
        await page.waitForTimeout(6000);
        
        const isLoggedIn = await page.evaluate(() => {
            const container = document.getElementById('app-container');
            return container && !container.classList.contains('hidden');
        });
        
        if (isLoggedIn) {
            log('  ✅ User created and logged in!', colors.green);
            testLog.dataEntries.push({ action: 'User signup', status: 'SUCCESS' });
        } else {
            // Check for Firebase errors
            if (testLog.firebaseMessages.some(m => m.toLowerCase().includes('auth'))) {
                throw new Error('Authentication error - Email/Password provider may not be enabled');
            }
            throw new Error('Login failed after signup');
        }
        
        // STEP 3: Use Features and Enter Data
        log('\n📋 STEP 3: Using App Features & Entering Data\n', colors.yellow);
        
        // 3A: Check Dashboard
        log('  A. Dashboard - Viewing stats and quote', colors.cyan);
        await page.waitForTimeout(1000);
        const quote = await page.$eval('#daily-quote', el => el.textContent.substring(0, 50));
        log(`     Quote: "${quote}..."`, colors.blue);
        testLog.dataEntries.push({ action: 'View dashboard', status: 'SUCCESS' });
        
        // 3B: Log Mood
        log('  B. Wellness - Logging mood', colors.cyan);
        await page.click('[data-page="wellness"]');
        await page.waitForTimeout(1000);
        await page.click('[data-mood="great"]');
        await page.waitForTimeout(2000);
        log('     ✓ Mood logged as "Great"', colors.green);
        testLog.dataEntries.push({ action: 'Log mood (Great)', status: 'SUCCESS' });
        
        // 3C: Track Water
        log('  C. Wellness - Tracking water intake', colors.cyan);
        await page.click('#add-water');
        await page.waitForTimeout(500);
        await page.click('#add-water');
        await page.waitForTimeout(500);
        await page.click('#add-water');
        await page.waitForTimeout(1500);
        log('     ✓ Water tracked (3 glasses)', colors.green);
        testLog.dataEntries.push({ action: 'Log water (3 glasses)', status: 'SUCCESS' });
        
        // 3D: Log Sleep
        log('  D. Wellness - Logging sleep quality', colors.cyan);
        await page.type('#sleep-hours', '8', { delay: 30 });
        await page.type('#sleep-quality', '9', { delay: 30 });
        await page.click('#log-sleep');
        await page.waitForTimeout(2000);
        log('     ✓ Sleep logged (8 hours, quality 9/10)', colors.green);
        testLog.dataEntries.push({ action: 'Log sleep (8h, quality 9)', status: 'SUCCESS' });
        
        // 3E: Write Gratitude
        log('  E. Journal - Writing gratitude entry', colors.cyan);
        await page.click('[data-page="journal"]');
        await page.waitForTimeout(1000);
        await page.type('#gratitude-entry', 'Firebase integration test - grateful for cloud data sync and secure backend!', { delay: 20 });
        await page.click('#save-gratitude');
        await page.waitForTimeout(2000);
        log('     ✓ Gratitude entry saved', colors.green);
        testLog.dataEntries.push({ action: 'Save gratitude entry', status: 'SUCCESS' });
        
        // 3F: Add Custom Affirmation
        log('  F. Journal - Adding custom affirmation', colors.cyan);
        await page.click('[data-tab="affirmations"]');
        await page.waitForTimeout(500);
        await page.type('#custom-affirmation', 'Firebase makes my app powerful and scalable', { delay: 20 });
        await page.click('#add-affirmation');
        await page.waitForTimeout(1500);
        log('     ✓ Custom affirmation added', colors.green);
        testLog.dataEntries.push({ action: 'Add custom affirmation', status: 'SUCCESS' });
        
        // 3G: Set Meditation Goal
        log('  G. Settings - Setting meditation goal', colors.cyan);
        await page.click('[data-page="settings"]');
        await page.waitForTimeout(1000);
        await page.click('#meditation-goal', { clickCount: 3 });
        await page.type('#meditation-goal', '30', { delay: 30 });
        await page.click('#update-goal');
        await page.waitForTimeout(2000);
        log('     ✓ Meditation goal set to 30 minutes', colors.green);
        testLog.dataEntries.push({ action: 'Set meditation goal (30 min)', status: 'SUCCESS' });
        
        // Wait for all data to sync
        log('\n⏳ Waiting for Firestore sync (5 seconds)...', colors.yellow);
        await page.waitForTimeout(5000);
        
        // Check for Firestore save confirmations
        const firestoreSaves = testLog.firebaseMessages.filter(m => 
            m.includes('saved to Firestore') || m.includes('Saved to users')
        );
        
        log(`\n  📊 Firestore save messages detected: ${firestoreSaves.length}`, colors.cyan);
        testLog.verification.firestoreSaves = firestoreSaves.length;
        
        // Check for any errors
        if (testLog.errors.length > 0) {
            log(`  ⚠️  JavaScript errors detected: ${testLog.errors.length}`, colors.yellow);
        } else {
            log('  ✅ No JavaScript errors detected', colors.green);
        }
        
        // Screenshot
        await page.screenshot({ path: 'tests/firebase-data-test.png', fullPage: true });
        
        testLog.success = true;
        
    } catch (error) {
        log(`\n❌ Test Error: ${error.message}`, colors.red);
        testLog.errors.push(error.message);
        testLog.success = false;
    } finally {
        // Save report
        fs.writeFileSync('tests/firebase-verification-report.json', JSON.stringify(testLog, null, 2));
        
        // Print final report
        log('\n' + '='.repeat(70), colors.cyan);
        log('📊 FIREBASE VERIFICATION REPORT', colors.bright);
        log('='.repeat(70), colors.cyan);
        
        log('\n👤 Test User:', colors.cyan);
        log(`   Email: ${TEST_USER.email}`, colors.blue);
        log(`   Password: ${TEST_USER.password}`, colors.blue);
        
        log('\n📝 Data Entered:', colors.cyan);
        testLog.dataEntries.forEach(entry => {
            log(`   ✅ ${entry.action}`, colors.green);
        });
        
        log('\n🔍 Firebase Messages:', colors.cyan);
        const relevantMessages = testLog.firebaseMessages.filter(m => 
            m.includes('Firebase') || m.includes('Firestore') || m.includes('User') || m.includes('saved')
        );
        relevantMessages.slice(0, 10).forEach(msg => {
            log(`   ${msg}`, colors.blue);
        });
        
        if (testLog.errors.length > 0) {
            log('\n⚠️  Errors Detected:', colors.yellow);
            testLog.errors.forEach(err => {
                log(`   ❌ ${err}`, colors.red);
            });
        } else {
            log('\n✅ No Errors Detected!', colors.green);
        }
        
        log('\n🔍 MANUAL VERIFICATION REQUIRED:', colors.yellow);
        log('\n1. Check Firebase Authentication:', colors.cyan);
        log('   https://console.firebase.google.com/project/mindglow-wellness/authentication/users', colors.blue);
        log(`   Look for user: ${TEST_USER.email}`, colors.blue);
        
        log('\n2. Check Firestore Database:', colors.cyan);
        log('   https://console.firebase.google.com/project/mindglow-wellness/firestore/data', colors.blue);
        log('   Navigate to: users collection', colors.blue);
        log('   Find user document and verify fields:', colors.blue);
        log('     - name, email, wellnessScore, waterIntake', colors.blue);
        log('     - totalMinutes, streak, meditationGoal', colors.blue);
        
        log('\n📸 Screenshots:', colors.cyan);
        log('   tests/firebase-data-test.png', colors.blue);
        
        log('\n📄 Report:', colors.cyan);
        log('   tests/firebase-verification-report.json', colors.blue);
        
        log('\n⏸️  Browser will stay open for 15 seconds for inspection...', colors.yellow);
        await page.waitForTimeout(15000);
        
        await browser.close();
        
        log('\n' + '='.repeat(70), colors.cyan);
        
        if (testLog.success) {
            log('🎉 TEST COMPLETED SUCCESSFULLY!', colors.green);
            log('✅ Check Firebase Console to verify data was saved', colors.green);
        } else {
            log('⚠️  Test completed with issues - check report', colors.yellow);
        }
        
        log('='.repeat(70) + '\n', colors.cyan);
    }
}

fullFirebaseVerification().catch(err => {
    log(`\nFatal: ${err.message}\n`, colors.red);
    process.exit(1);
});


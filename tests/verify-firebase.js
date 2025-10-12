// Simple Firebase Connection Test
// Verifies Firebase is properly configured and accessible

const puppeteer = require('puppeteer');

async function verifyFirebase() {
    console.log('\n🔥 Firebase Connection Verification\n');
    console.log('='.repeat(60));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 50,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const text = msg.text();
        consoleMessages.push(text);
        console.log(`[Browser] ${text}`);
    });
    
    // Capture errors
    page.on('pageerror', error => {
        console.log(`[Error] ${error.message}`);
    });
    
    try {
        console.log('\n📡 Loading app...');
        await page.goto('http://localhost:8080', { waitUntil: 'networkidle2' });
        await page.waitForTimeout(5000);
        
        // Check Firebase initialization
        const firebaseStatus = await page.evaluate(() => {
            return {
                firebaseLoaded: typeof firebase !== 'undefined',
                authLoaded: typeof firebase !== 'undefined' && firebase.auth !== undefined,
                firestoreLoaded: typeof firebase !== 'undefined' && firebase.firestore !== undefined,
                appInitialized: typeof firebase !== 'undefined' && firebase.apps.length > 0
            };
        });
        
        console.log('\n📊 Firebase Status:');
        console.log('  Firebase SDK:', firebaseStatus.firebaseLoaded ? '✅ Loaded' : '❌ Not loaded');
        console.log('  Auth Module:', firebaseStatus.authLoaded ? '✅ Loaded' : '❌ Not loaded');
        console.log('  Firestore Module:', firebaseStatus.firestoreLoaded ? '✅ Loaded' : '❌ Not loaded');
        console.log('  App Initialized:', firebaseStatus.appInitialized ? '✅ Yes' : '❌ No');
        
        // Check for Firebase init message in console
        const hasInitMessage = consoleMessages.some(msg => msg.includes('Firebase initialized'));
        console.log('  Init Message:', hasInitMessage ? '✅ Found' : '❌ Not found');
        
        // Take screenshot
        await page.screenshot({ path: 'tests/firebase-status.png', fullPage: true });
        console.log('\n📸 Screenshot saved: tests/firebase-status.png');
        
        if (firebaseStatus.firebaseLoaded && firebaseStatus.appInitialized) {
            console.log('\n✅ Firebase is properly configured and loaded!');
        } else {
            console.log('\n⚠️  Firebase may have loading issues - check browser console');
        }
        
        console.log('\n⏸️  Keeping browser open for 10 seconds for inspection...');
        await page.waitForTimeout(10000);
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await browser.close();
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
}

verifyFirebase().then(() => process.exit(0)).catch(() => process.exit(1));


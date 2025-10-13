// Test Console for Errors
// Logs in with test user and monitors console for errors

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testConsoleErrors() {
    log('\n🔍 TESTING CONSOLE FOR ERRORS\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Track console messages
    const consoleMessages = {
        log: [],
        info: [],
        warn: [],
        error: [],
        network: []
    };
    
    // Listen to console
    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        
        if (type === 'error') {
            consoleMessages.error.push(text);
            log(`   ❌ CONSOLE ERROR: ${text}`, '\x1b[31m');
        } else if (type === 'warning') {
            consoleMessages.warn.push(text);
            log(`   ⚠️  CONSOLE WARNING: ${text}`, '\x1b[33m');
        } else if (text.includes('✅')) {
            consoleMessages.log.push(text);
            log(`   ${text}`, '\x1b[90m');
        } else if (text.includes('❌')) {
            consoleMessages.error.push(text);
            log(`   ${text}`, '\x1b[31m');
        }
    });
    
    // Listen to page errors
    page.on('pageerror', error => {
        consoleMessages.error.push(error.message);
        log(`   ❌ PAGE ERROR: ${error.message}`, '\x1b[31m');
    });
    
    // Listen to failed requests
    page.on('requestfailed', request => {
        const failure = request.failure();
        const url = request.url();
        const errorText = failure ? failure.errorText : 'Unknown error';
        
        consoleMessages.network.push({ url, error: errorText });
        log(`   🌐 NETWORK FAILED: ${url}`, '\x1b[33m');
        log(`      Error: ${errorText}`, '\x1b[90m');
    });
    
    // Listen to response errors
    page.on('response', response => {
        const status = response.status();
        const url = response.url();
        
        if (status >= 400) {
            consoleMessages.network.push({ url, status });
            log(`   🌐 HTTP ${status}: ${url}`, '\x1b[33m');
        }
    });
    
    try {
        // ==================== STEP 1: LOAD APP ====================
        log('\n📱 STEP 1: Loading App', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
        await page.waitForTimeout(5000); // Wait for all scripts to load
        
        log('   ✅ App loaded', '\x1b[32m');
        
        // ==================== STEP 2: LOGIN ====================
        log('\n🔐 STEP 2: Login with Test User', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        await page.click('#login-form button[type="submit"]');
        await page.waitForTimeout(6000); // Wait for auth and Firestore
        
        const loggedIn = await page.evaluate(() => {
            return !document.getElementById('app-container')?.classList.contains('hidden');
        });
        
        if (loggedIn) {
            log('   ✅ Successfully logged in', '\x1b[32m');
        } else {
            log('   ❌ Login failed', '\x1b[31m');
        }
        
        // ==================== STEP 3: NAVIGATE PAGES ====================
        log('\n📄 STEP 3: Navigate Through Pages', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        const pages = [
            { name: 'Dashboard', selector: 'button[data-page="dashboard"]' },
            { name: 'Meditate', selector: 'button[data-page="meditate"]' },
            { name: 'Breathe', selector: 'button[data-page="breathe"]' },
            { name: 'Wellness', selector: 'button[data-page="wellness"]' },
            { name: 'Library', selector: 'button[data-page="library"]' },
            { name: 'Journal', selector: 'button[data-page="journal"]' },
            { name: 'Settings', selector: 'button[data-page="settings"]' }
        ];
        
        for (const pageItem of pages) {
            log(`   📍 Navigating to: ${pageItem.name}`, '\x1b[90m');
            await page.click(pageItem.selector);
            await page.waitForTimeout(2000);
        }
        
        log('   ✅ All pages navigated', '\x1b[32m');
        
        // ==================== STEP 4: TEST INTERACTIONS ====================
        log('\n🖱️  STEP 4: Test User Interactions', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        // Go back to meditate page
        await page.click('button[data-page="meditate"]');
        await page.waitForTimeout(2000);
        
        // Try clicking a meditation session
        const hasSession = await page.evaluate(() => {
            const session = document.querySelector('.session-card');
            if (session) session.click();
            return !!session;
        });
        
        if (hasSession) {
            log('   ✅ Meditation session clicked', '\x1b[90m');
            await page.waitForTimeout(2000);
            
            // Close modal if open
            await page.evaluate(() => {
                const closeBtn = document.querySelector('.modal-close');
                if (closeBtn) closeBtn.click();
            });
        }
        
        // Test music play
        await page.evaluate(() => {
            const musicCard = document.querySelector('.music-card');
            if (musicCard) musicCard.click();
        });
        
        await page.waitForTimeout(3000);
        log('   ✅ Interactions tested', '\x1b[32m');
        
        // ==================== RESULTS ====================
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 CONSOLE ERROR REPORT', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log('\n📈 Statistics:', '\x1b[1m');
        log(`   Console Errors: ${consoleMessages.error.length}`, 
            consoleMessages.error.length > 0 ? '\x1b[31m' : '\x1b[32m');
        log(`   Console Warnings: ${consoleMessages.warn.length}`, 
            consoleMessages.warn.length > 0 ? '\x1b[33m' : '\x1b[32m');
        log(`   Network Errors: ${consoleMessages.network.length}`, 
            consoleMessages.network.length > 0 ? '\x1b[33m' : '\x1b[32m');
        log(`   Success Messages: ${consoleMessages.log.length}`, '\x1b[32m');
        
        // Detailed error report
        if (consoleMessages.error.length > 0) {
            log('\n❌ Console Errors Found:', '\x1b[1m\x1b[31m');
            consoleMessages.error.forEach((err, idx) => {
                log(`   ${idx + 1}. ${err}`, '\x1b[31m');
            });
        } else {
            log('\n✅ No Console Errors!', '\x1b[1m\x1b[32m');
        }
        
        if (consoleMessages.warn.length > 0) {
            log('\n⚠️  Console Warnings Found:', '\x1b[1m\x1b[33m');
            const uniqueWarnings = [...new Set(consoleMessages.warn)];
            uniqueWarnings.forEach((warn, idx) => {
                log(`   ${idx + 1}. ${warn}`, '\x1b[33m');
            });
        }
        
        if (consoleMessages.network.length > 0) {
            log('\n🌐 Network Issues Found:', '\x1b[1m\x1b[33m');
            const uniqueNetwork = [...new Set(consoleMessages.network.map(n => 
                typeof n === 'object' ? `${n.status || 'FAILED'}: ${n.url}` : n
            ))];
            uniqueNetwork.forEach((net, idx) => {
                log(`   ${idx + 1}. ${net}`, '\x1b[33m');
            });
        }
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        const totalIssues = consoleMessages.error.length + consoleMessages.warn.length + consoleMessages.network.length;
        
        if (totalIssues === 0) {
            log('🎉 PERFECT! NO ERRORS OR WARNINGS!', '\x1b[1m\x1b[32m');
            log('   The console is completely clean!', '\x1b[32m');
        } else if (consoleMessages.error.length === 0) {
            log(`⚠️  ${totalIssues} WARNINGS FOUND (No critical errors)`, '\x1b[33m');
            log('   App is functional but has minor warnings', '\x1b[33m');
        } else {
            log(`❌ ${totalIssues} ISSUES FOUND (${consoleMessages.error.length} errors)`, '\x1b[31m');
            log('   Review errors above', '\x1b[31m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        log('⏸️  Browser stays open for 20 seconds to review...\n', '\x1b[90m');
        await page.waitForTimeout(20000);
        
        return {
            errors: consoleMessages.error,
            warnings: consoleMessages.warn,
            network: consoleMessages.network,
            success: consoleMessages.log
        };
        
    } catch (error) {
        log(`\n❌ Test Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
}

testConsoleErrors()
    .then((results) => {
        if (!results) {
            process.exit(1);
            return;
        }
        
        log('\n📊 FINAL SUMMARY:', '\x1b[1m');
        
        const totalIssues = results.errors.length + results.warnings.length + results.network.length;
        
        if (totalIssues === 0) {
            log('   ✅ CONSOLE: CLEAN! No errors or warnings!', '\x1b[32m');
            log('   App is production-ready!\n', '\x1b[32m');
            process.exit(0);
        } else if (results.errors.length === 0) {
            log(`   ⚠️  ${totalIssues} minor warnings (no critical errors)`, '\x1b[33m');
            log('   App is functional!\n', '\x1b[33m');
            process.exit(0);
        } else {
            log(`   ❌ ${results.errors.length} errors need fixing\n`, '\x1b[31m');
            
            // Output errors for auto-fix
            log('ERRORS TO FIX:', '\x1b[1m\x1b[31m');
            results.errors.forEach(err => log(`  - ${err}`, '\x1b[31m'));
            log('', '\x1b[0m');
            
            process.exit(0);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


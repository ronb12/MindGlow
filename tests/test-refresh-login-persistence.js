// Test Login Persistence After Refresh
// Verify user stays logged in after page refresh

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testRefreshPersistence() {
    log('\n🔄 TESTING LOGIN PERSISTENCE AFTER REFRESH\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 150,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging from page
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('Firebase') || text.includes('auth') || text.includes('User') || text.includes('logged')) {
            log(`   [Browser Console] ${text}`, '\x1b[90m');
        }
    });
    
    const testResults = {
        initialLogin: false,
        refresh1: false,
        refresh2: false,
        refresh3: false
    };
    
    try {
        // ==================== STEP 1: INITIAL LOGIN ====================
        log('\n📱 STEP 1: Initial Login', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3000);
        
        // Type credentials
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        
        // Click login
        await page.click('#login-form button[type="submit"]');
        await page.waitForTimeout(5000); // Wait for auth to complete
        
        // Check if logged in
        const loggedIn = await page.evaluate(() => {
            const appVisible = !document.getElementById('app-container')?.classList.contains('hidden');
            const authHidden = document.getElementById('auth-section')?.classList.contains('hidden');
            const userName = document.getElementById('user-name')?.textContent;
            
            return {
                appVisible,
                authHidden,
                userName,
                loggedIn: appVisible && authHidden && userName
            };
        });
        
        if (loggedIn.loggedIn) {
            log(`   ✅ Successfully logged in as: ${loggedIn.userName}`, '\x1b[32m');
            testResults.initialLogin = true;
        } else {
            log(`   ❌ Login failed!`, '\x1b[31m');
            log(`      App visible: ${loggedIn.appVisible}, Auth hidden: ${loggedIn.authHidden}`, '\x1b[90m');
            throw new Error('Initial login failed');
        }
        
        // ==================== STEP 2: FIRST REFRESH ====================
        log('\n🔄 STEP 2: First Refresh Test', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        log('   Refreshing page...', '\x1b[36m');
        
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(6000); // Wait for auth state check
        
        const afterRefresh1 = await page.evaluate(() => {
            const appVisible = !document.getElementById('app-container')?.classList.contains('hidden');
            const authVisible = !document.getElementById('auth-section')?.classList.contains('hidden');
            const userName = document.getElementById('user-name')?.textContent;
            
            // Check localStorage backup
            const hasBackup = localStorage.getItem('mindglow_logged_in') === 'true';
            const backupUser = localStorage.getItem('mindglow_user_backup');
            
            return {
                appVisible,
                authVisible,
                userName,
                hasBackup,
                backupUser,
                loggedIn: appVisible && !authVisible && userName
            };
        });
        
        log(`   App visible: ${afterRefresh1.appVisible}`, '\x1b[90m');
        log(`   Auth visible: ${afterRefresh1.authVisible}`, '\x1b[90m');
        log(`   User name: ${afterRefresh1.userName || 'null'}`, '\x1b[90m');
        log(`   localStorage backup: ${afterRefresh1.hasBackup ? 'Yes' : 'No'}`, '\x1b[90m');
        
        if (afterRefresh1.loggedIn) {
            log(`   ✅ STILL LOGGED IN! User: ${afterRefresh1.userName}`, '\x1b[1m\x1b[32m');
            testResults.refresh1 = true;
        } else {
            log(`   ❌ LOGGED OUT after refresh!`, '\x1b[1m\x1b[31m');
            log(`      This is the problem - user should still be logged in`, '\x1b[31m');
        }
        
        // ==================== STEP 3: SECOND REFRESH ====================
        log('\n🔄 STEP 3: Second Refresh Test', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        log('   Refreshing page again...', '\x1b[36m');
        
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(6000);
        
        const afterRefresh2 = await page.evaluate(() => {
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
        
        if (afterRefresh2.loggedIn) {
            log(`   ✅ STILL LOGGED IN! User: ${afterRefresh2.userName}`, '\x1b[1m\x1b[32m');
            testResults.refresh2 = true;
        } else {
            log(`   ❌ LOGGED OUT after 2nd refresh`, '\x1b[31m');
        }
        
        // ==================== STEP 4: THIRD REFRESH ====================
        log('\n🔄 STEP 4: Third Refresh Test', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        log('   Refreshing page one more time...', '\x1b[36m');
        
        await page.reload({ waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(6000);
        
        const afterRefresh3 = await page.evaluate(() => {
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
        
        if (afterRefresh3.loggedIn) {
            log(`   ✅ STILL LOGGED IN! User: ${afterRefresh3.userName}`, '\x1b[1m\x1b[32m');
            testResults.refresh3 = true;
        } else {
            log(`   ❌ LOGGED OUT after 3rd refresh`, '\x1b[31m');
        }
        
        // ==================== RESULTS ====================
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 REFRESH PERSISTENCE TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log('\n🧪 Test Results:', '\x1b[1m');
        log(`   ${testResults.initialLogin ? '✅' : '❌'} Initial Login`, testResults.initialLogin ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.refresh1 ? '✅' : '❌'} After 1st Refresh`, testResults.refresh1 ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.refresh2 ? '✅' : '❌'} After 2nd Refresh`, testResults.refresh2 ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.refresh3 ? '✅' : '❌'} After 3rd Refresh`, testResults.refresh3 ? '\x1b[32m' : '\x1b[31m');
        
        const passedTests = Object.values(testResults).filter(r => r).length;
        const totalTests = Object.keys(testResults).length;
        
        log(`\n   📊 Pass Rate: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`, 
            passedTests === totalTests ? '\x1b[32m' : '\x1b[33m');
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        if (passedTests === totalTests) {
            log('🎉 AUTH PERSISTENCE WORKING PERFECTLY!', '\x1b[1m\x1b[32m');
            log('   Users stay logged in through multiple refreshes!', '\x1b[32m');
        } else if (testResults.initialLogin && !testResults.refresh1) {
            log('❌ AUTH PERSISTENCE NOT WORKING!', '\x1b[1m\x1b[31m');
            log('   Users get logged out on refresh', '\x1b[31m');
            log('   Issue: Firebase persistence or localStorage not working', '\x1b[31m');
        } else {
            log('⚠️  PARTIAL SUCCESS', '\x1b[33m');
            log(`   ${passedTests}/${totalTests} tests passed`, '\x1b[33m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        log('⏸️  Browser stays open for 20 seconds to review...\n', '\x1b[90m');
        await page.waitForTimeout(20000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return testResults;
}

testRefreshPersistence()
    .then((results) => {
        const passedTests = Object.values(results).filter(r => r).length;
        const totalTests = Object.keys(results).length;
        
        log('\n📊 FINAL RESULT:', '\x1b[1m');
        
        if (passedTests === totalTests) {
            log('   ✅ AUTH PERSISTENCE: WORKING!', '\x1b[32m');
            log('   Users stay logged in after refresh!\n', '\x1b[32m');
            process.exit(0);
        } else if (results.initialLogin && !results.refresh1) {
            log('   ❌ AUTH PERSISTENCE: NOT WORKING', '\x1b[31m');
            log('   Users get logged out on refresh\n', '\x1b[31m');
            process.exit(1);
        } else {
            log(`   ⚠️  ${passedTests}/${totalTests} tests passed\n`, '\x1b[33m');
            process.exit(0);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


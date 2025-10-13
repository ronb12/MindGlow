// Quick test for yoga pose modals
const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 300,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Capture console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            log(`❌ CONSOLE ERROR: ${msg.text()}`, '\x1b[31m');
        }
    });
    
    page.on('pageerror', error => {
        log(`❌ PAGE ERROR: ${error.message}`, '\x1b[31m');
    });
    
    try {
        log('\n🧪 Testing Yoga Pose Modals\n', '\x1b[1m');
        
        // Login
        log('1. Loading app...', '\x1b[36m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 60000 });
        await page.waitForTimeout(3000);
        
        log('2. Logging in...', '\x1b[36m');
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        await page.click('#login-form button[type="submit"]');
        await page.waitForTimeout(5000);
        
        // Navigate to Library
        log('3. Going to Library...', '\x1b[36m');
        await page.click('button[data-page="library"]');
        await page.waitForTimeout(3000);
        
        // Check for yoga cards
        const yogaInfo = await page.evaluate(() => {
            const cards = document.querySelectorAll('.yoga-card');
            const grid = document.getElementById('yoga-grid');
            
            return {
                cardsFound: cards.length,
                gridExists: !!grid,
                firstCardHtml: cards[0]?.outerHTML || 'No cards',
                hasClickHandler: cards[0]?.onclick !== undefined || cards[0]?.dataset.poseIndex !== undefined
            };
        });
        
        log(`\n📊 Yoga Cards Info:`, '\x1b[1m');
        log(`   Found: ${yogaInfo.cardsFound} cards`, yogaInfo.cardsFound > 0 ? '\x1b[32m' : '\x1b[31m');
        log(`   Grid exists: ${yogaInfo.gridExists}`, '\x1b[90m');
        log(`   Has data-pose-index: ${yogaInfo.hasClickHandler}`, '\x1b[90m');
        
        if (yogaInfo.cardsFound === 0) {
            log('\n❌ NO YOGA CARDS FOUND!', '\x1b[31m');
            log('   The cards are not being rendered.', '\x1b[31m');
        }
        
        // Try clicking first yoga pose
        log('\n4. Clicking first yoga pose...', '\x1b[36m');
        
        const clicked = await page.evaluate(() => {
            const firstCard = document.querySelector('.yoga-card');
            if (firstCard) {
                firstCard.click();
                return true;
            }
            return false;
        });
        
        if (!clicked) {
            log('   ❌ Could not click - no card found', '\x1b[31m');
        } else {
            log('   ✅ Clicked card', '\x1b[32m');
        }
        
        await page.waitForTimeout(2000);
        
        // Check if modal appeared
        const modalInfo = await page.evaluate(() => {
            const modal = document.getElementById('yoga-pose-modal');
            const modalOverlay = document.querySelector('.modal-overlay');
            
            if (!modal) {
                return { 
                    exists: false, 
                    visible: false,
                    overlayExists: !!modalOverlay,
                    reason: 'Modal element (#yoga-pose-modal) not found in DOM'
                };
            }
            
            const styles = window.getComputedStyle(modal);
            const isVisible = styles.display !== 'none' && styles.visibility !== 'hidden';
            
            return {
                exists: true,
                visible: isVisible,
                display: styles.display,
                poseName: modal.querySelector('.yoga-modal-header h2')?.textContent,
                hasContent: modal.querySelector('.yoga-instructions li') !== null
            };
        });
        
        log(`\n📊 Modal Status:`, '\x1b[1m');
        log(`   Modal exists: ${modalInfo.exists}`, modalInfo.exists ? '\x1b[32m' : '\x1b[31m');
        log(`   Modal visible: ${modalInfo.visible}`, modalInfo.visible ? '\x1b[32m' : '\x1b[31m');
        
        if (modalInfo.exists && modalInfo.visible) {
            log(`   ✅ MODAL OPENED!`, '\x1b[1m\x1b[32m');
            log(`   Pose: ${modalInfo.poseName}`, '\x1b[32m');
            log(`   Has content: ${modalInfo.hasContent}`, '\x1b[32m');
        } else if (modalInfo.exists && !modalInfo.visible) {
            log(`   ⚠️  Modal exists but not visible`, '\x1b[33m');
            log(`   Display: ${modalInfo.display}`, '\x1b[33m');
        } else {
            log(`   ❌ MODAL NOT WORKING`, '\x1b[1m\x1b[31m');
            log(`   ${modalInfo.reason}`, '\x1b[31m');
        }
        
        // Check if library.js is loaded
        const libraryLoaded = await page.evaluate(() => {
            return typeof window.library !== 'undefined';
        });
        
        log(`\n📊 Debug Info:`, '\x1b[1m');
        log(`   library.js loaded: ${libraryLoaded}`, libraryLoaded ? '\x1b[32m' : '\x1b[31m');
        
        log('\n⏸️  Keeping browser open for 15 seconds to review...\n', '\x1b[90m');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        log(`\n❌ Test Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
})();


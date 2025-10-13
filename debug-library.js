// Deep debug of library feature
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
        slowMo: 500,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
        await page.waitForTimeout(3000);
        
        log('Logging in...', '\x1b[36m');
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        await page.click('#login-form button[type="submit"]');
        await page.waitForTimeout(5000);
        
        log('Going to Library...', '\x1b[36m');
        await page.click('button[data-page="library"]');
        await page.waitForTimeout(3000);
        
        // Deep inspection
        const debug = await page.evaluate(() => {
            const results = {};
            
            // Check if library module is loaded
            results.libraryExists = typeof library !== 'undefined';
            
            // Check yoga cards
            const cards = document.querySelectorAll('.yoga-card');
            results.cardCount = cards.length;
            
            if (cards.length > 0) {
                const firstCard = cards[0];
                results.cardHTML = firstCard.outerHTML.substring(0, 200);
                results.hasPoseIndex = firstCard.dataset.poseIndex !== undefined;
                results.poseIndexValue = firstCard.dataset.poseIndex;
                
                // Check for event listeners (not available in page context)
                results.hasClickListener = 'Check manually';
            }
            
            // Check if library.js was imported
            const scripts = Array.from(document.querySelectorAll('script[type="module"]'));
            results.moduleScripts = scripts.map(s => s.src).filter(src => src.includes('library'));
            
            // Try to get the library object
            if (typeof library !== 'undefined') {
                results.libraryMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(library));
            }
            
            return results;
        });
        
        log('\n=== DEBUG RESULTS ===', '\x1b[1m\x1b[35m');
        log(`Library module loaded: ${debug.libraryExists}`, debug.libraryExists ? '\x1b[32m' : '\x1b[31m');
        log(`Yoga cards found: ${debug.cardCount}`, '\x1b[90m');
        
        if (debug.cardCount > 0) {
            log(`Card has pose-index: ${debug.hasPoseIndex}`, debug.hasPoseIndex ? '\x1b[32m' : '\x1b[31m');
            log(`Pose index value: ${debug.poseIndexValue}`, '\x1b[90m');
            log(`Has click listener: ${debug.hasClickListener}`, '\x1b[90m');
        }
        
        log(`Library scripts: ${JSON.stringify(debug.moduleScripts)}`, '\x1b[90m');
        
        if (debug.libraryMethods) {
            log(`Library methods: ${debug.libraryMethods.join(', ')}`, '\x1b[90m');
        }
        
        // Now manually click and watch
        log('\n=== ATTEMPTING MANUAL CLICK ===', '\x1b[1m\x1b[35m');
        
        await page.evaluate(() => {
            const firstCard = document.querySelector('.yoga-card');
            if (firstCard) {
                console.log('Before click - checking for modal...');
                console.log('Yoga poses data:', typeof yogaPoses !== 'undefined' ? yogaPoses : 'NOT LOADED');
                
                // Manually trigger what should happen
                const index = parseInt(firstCard.dataset.poseIndex);
                console.log('Pose index:', index);
                
                // Try to call the method directly
                if (typeof library !== 'undefined' && typeof library.showYogaPoseModal === 'function') {
                    console.log('Calling library.showYogaPoseModal directly...');
                    library.showYogaPoseModal(yogaPoses[index], library.yogaImages[index]);
                } else {
                    console.log('library.showYogaPoseModal NOT FOUND!');
                    console.log('library object:', library);
                }
            }
        });
        
        await page.waitForTimeout(2000);
        
        const modalCheck = await page.evaluate(() => {
            const modal = document.getElementById('yoga-pose-modal');
            return {
                exists: !!modal,
                visible: modal ? window.getComputedStyle(modal).display !== 'none' : false
            };
        });
        
        log(`\nModal after manual call:`, '\x1b[1m');
        log(`  Exists: ${modalCheck.exists}`, modalCheck.exists ? '\x1b[32m' : '\x1b[31m');
        log(`  Visible: ${modalCheck.visible}`, modalCheck.visible ? '\x1b[32m' : '\x1b[31m');
        
        log('\nBrowser will stay open for 30 seconds...\n', '\x1b[90m');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        log(`Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
})();


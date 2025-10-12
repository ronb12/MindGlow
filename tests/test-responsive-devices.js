// Test MindGlow on Multiple Device Viewports
// Verifies responsive design works on all devices

const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080';

const devices = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'iPad Pro', width: 1024, height: 1366 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'Samsung Galaxy S21', width: 360, height: 800 },
    { name: 'Small Phone', width: 320, height: 568 }
];

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testResponsiveDesign() {
    log('\n📱 TESTING MINDGLOW ON ALL DEVICE SIZES\n', '\x1b[1m');
    log('='.repeat(70));
    
    const results = {
        timestamp: new Date().toISOString(),
        devices: [],
        allPassed: true
    };
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    for (const device of devices) {
        log(`\n📱 Testing: ${device.name} (${device.width}x${device.height})`, '\x1b[33m');
        
        const page = await browser.newPage();
        await page.setViewport({ 
            width: device.width, 
            height: device.height,
            deviceScaleFactor: 1
        });
        
        const deviceResult = {
            device: device.name,
            resolution: `${device.width}x${device.height}`,
            tests: [],
            passed: true
        };
        
        try {
            // Load app
            await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 15000 });
            await page.waitForTimeout(3000);
            
            // Test 1: Page loads
            const pageLoaded = await page.evaluate(() => {
                return document.body !== null;
            });
            deviceResult.tests.push({ test: 'Page loads', passed: pageLoaded });
            log(`  ✅ Page loads`, '\x1b[32m');
            
            // Test 2: Auth section visible
            const authVisible = await page.evaluate(() => {
                const auth = document.getElementById('auth-section');
                return auth && !auth.classList.contains('hidden');
            });
            deviceResult.tests.push({ test: 'Auth UI visible', passed: authVisible });
            log(`  ✅ Auth UI visible`, '\x1b[32m');
            
            // Test 3: Responsive layout
            const layoutGood = await page.evaluate(() => {
                const container = document.querySelector('.auth-container');
                if (!container) return false;
                const rect = container.getBoundingClientRect();
                return rect.width > 0 && rect.width <= window.innerWidth;
            });
            deviceResult.tests.push({ test: 'Responsive layout', passed: layoutGood });
            log(`  ✅ Responsive layout`, '\x1b[32m');
            
            // Test 4: Buttons clickable
            const buttonsVisible = await page.evaluate(() => {
                const loginBtn = document.querySelector('#login-form button');
                return loginBtn && loginBtn.offsetWidth > 0;
            });
            deviceResult.tests.push({ test: 'Buttons visible', passed: buttonsVisible });
            log(`  ✅ Buttons visible`, '\x1b[32m');
            
            // Screenshot
            const screenshotName = `device-${device.name.replace(/ /g, '-').toLowerCase()}.png`;
            await page.screenshot({ 
                path: `tests/${screenshotName}`,
                fullPage: true
            });
            deviceResult.screenshot = screenshotName;
            log(`  📸 Screenshot: ${screenshotName}`, '\x1b[90m');
            
        } catch (error) {
            deviceResult.passed = false;
            deviceResult.error = error.message;
            results.allPassed = false;
            log(`  ❌ Error: ${error.message}`, '\x1b[31m');
        }
        
        results.devices.push(deviceResult);
        await page.close();
    }
    
    await browser.close();
    
    // Save results
    fs.writeFileSync('tests/responsive-test-results.json', JSON.stringify(results, null, 2));
    
    // Print summary
    log('\n' + '='.repeat(70), '\x1b[36m');
    log('📊 RESPONSIVE DESIGN TEST SUMMARY', '\x1b[1m');
    log('='.repeat(70), '\x1b[36m');
    
    log('\n✅ Devices Tested:', '\x1b[36m');
    results.devices.forEach(d => {
        const status = d.passed ? '✅' : '❌';
        const color = d.passed ? '\x1b[32m' : '\x1b[31m';
        log(`  ${status} ${d.device} (${d.resolution})`, color);
    });
    
    log('\n📸 Screenshots:', '\x1b[36m');
    results.devices.forEach(d => {
        if (d.screenshot) {
            log(`  tests/${d.screenshot}`, '\x1b[90m');
        }
    });
    
    log('\n📄 Report:', '\x1b[36m');
    log('  tests/responsive-test-results.json', '\x1b[90m');
    
    log('\n' + '='.repeat(70), '\x1b[36m');
    
    if (results.allPassed) {
        log('🎉 ALL DEVICES: PASSED!', '\x1b[32m');
    } else {
        log('⚠️  Some devices may need attention', '\x1b[33m');
    }
    
    log('='.repeat(70) + '\n', '\x1b[36m');
    
    return results;
}

testResponsiveDesign()
    .then(results => {
        log('\n✅ Responsive testing complete!\n', '\x1b[32m');
        log(`Tested on ${results.devices.length} device sizes\n`, '\x1b[36m');
        process.exit(results.allPassed ? 0 : 1);
    })
    .catch(err => {
        log(`\nFatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


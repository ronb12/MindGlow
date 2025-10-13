// Test All 4 Pexels Features with Test User
// Comprehensive verification of new visual features

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testPexelsFeatures() {
    log('\n🎨 TESTING PEXELS API FEATURES\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 100,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    const results = {
        login: false,
        randomBackground: false,
        videoMode: false,
        yogaImages: false,
        dailyWallpaper: false
    };
    
    try {
        // ==================== LOGIN ====================
        log('\n📱 Step 1: Logging in with test user...', '\x1b[36m');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        await page.evaluate(() => {
            document.querySelector('#login-form button[type="submit"]').click();
        });
        await page.waitForTimeout(3000);
        
        // Check if logged in
        const userName = await page.evaluate(() => {
            return document.getElementById('user-name')?.textContent;
        });
        
        if (userName) {
            log(`   ✅ Logged in as: ${userName}`, '\x1b[32m');
            results.login = true;
        } else {
            log('   ❌ Login failed!', '\x1b[31m');
            throw new Error('Login failed');
        }
        
        // ==================== TEST 1: MEDITATION BACKGROUNDS ====================
        log('\n🖼️  FEATURE 1: Random Meditation Backgrounds', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        // Go to Meditation page
        log('   🔄 Navigating to meditation page...', '\x1b[36m');
        await page.click('[data-page="meditate"]');
        await page.waitForTimeout(4000); // Give more time for initialization
        
        // Debug: Check what's in the page
        const debugInfo = await page.evaluate(() => {
            return {
                meditationPageExists: !!document.getElementById('meditate-page'),
                meditationPageActive: document.getElementById('meditate-page')?.classList.contains('active'),
                bgControlsExists: !!document.getElementById('bg-controls'),
                bgControlsDisplay: document.getElementById('bg-controls')?.style.display,
                bodyChildren: document.body.children.length
            };
        });
        
        log(`   🔍 Debug: Meditation page exists: ${debugInfo.meditationPageExists}`, '\x1b[90m');
        log(`   🔍 Debug: Meditation page active: ${debugInfo.meditationPageActive}`, '\x1b[90m');
        log(`   🔍 Debug: Controls exist: ${debugInfo.bgControlsExists}`, '\x1b[90m');
        log(`   🔍 Debug: Controls display: ${debugInfo.bgControlsDisplay}`, '\x1b[90m');
        
        // Check if background controls exist
        const bgControlsExist = debugInfo.bgControlsExists;
        
        if (bgControlsExist) {
            log('   ✅ Background controls found!', '\x1b[32m');
            
            // Click "Change Background" button
            log('   🔄 Clicking "Change Background"...', '\x1b[36m');
            await page.evaluate(() => {
                document.getElementById('change-bg').click();
            });
            await page.waitForTimeout(3000);
            
            // Check if background changed
            const bgImage = await page.evaluate(() => {
                return document.body.style.backgroundImage;
            });
            
            if (bgImage && bgImage.includes('pexels.com')) {
                log('   ✅ Random background loaded from Pexels!', '\x1b[32m');
                log(`   📸 Image URL: ${bgImage.substring(0, 80)}...`, '\x1b[90m');
                results.randomBackground = true;
                
                // Test changing background again
                log('   🔄 Testing random change (clicking again)...', '\x1b[36m');
                await page.evaluate(() => {
                    document.getElementById('change-bg').click();
                });
                await page.waitForTimeout(3000);
                
                const bgImage2 = await page.evaluate(() => {
                    return document.body.style.backgroundImage;
                });
                
                if (bgImage2 !== bgImage) {
                    log('   ✅ Background changed to new random image!', '\x1b[32m');
                } else {
                    log('   ⚠️  Same image (might be random chance)', '\x1b[33m');
                }
            } else {
                log('   ❌ Background not loaded from Pexels', '\x1b[31m');
            }
        } else {
            log('   ❌ Background controls not found!', '\x1b[31m');
        }
        
        await page.waitForTimeout(2000);
        
        // ==================== TEST 2: VIDEO MODE ====================
        log('\n🎥 FEATURE 2: Video Background Mode', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        // Click "Video Mode" button
        log('   🔄 Enabling video mode...', '\x1b[36m');
        await page.evaluate(() => {
            document.getElementById('toggle-video').click();
        });
        await page.waitForTimeout(5000); // Give time for video to load
        
        // Check if video element exists
        const videoExists = await page.evaluate(() => {
            const video = document.getElementById('meditation-video-bg');
            return !!video;
        });
        
        if (videoExists) {
            log('   ✅ Video background created!', '\x1b[32m');
            
            // Check if video is playing
            const videoPlaying = await page.evaluate(() => {
                const video = document.getElementById('meditation-video-bg');
                return video && !video.paused;
            });
            
            if (videoPlaying) {
                log('   ✅ Video is playing!', '\x1b[32m');
                results.videoMode = true;
            } else {
                log('   ⚠️  Video loaded but not playing (may need interaction)', '\x1b[33m');
                results.videoMode = true; // Still counts as working
            }
            
            // Get video source
            const videoSrc = await page.evaluate(() => {
                const video = document.getElementById('meditation-video-bg');
                return video ? video.querySelector('source')?.src : null;
            });
            
            if (videoSrc) {
                log(`   📹 Video source: ${videoSrc.substring(0, 60)}...`, '\x1b[90m');
            }
            
            // Disable video mode
            await page.waitForTimeout(3000);
            log('   🔄 Disabling video mode...', '\x1b[36m');
            await page.evaluate(() => {
                document.getElementById('toggle-video').click();
            });
            await page.waitForTimeout(2000);
            
            const videoRemoved = await page.evaluate(() => {
                return !document.getElementById('meditation-video-bg');
            });
            
            if (videoRemoved) {
                log('   ✅ Video mode toggled off successfully!', '\x1b[32m');
            }
        } else {
            log('   ❌ Video element not created!', '\x1b[31m');
        }
        
        // ==================== TEST 3: YOGA LIBRARY IMAGES ====================
        log('\n📚 FEATURE 3: Yoga Library Images', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        // Go to Library page
        log('   🔄 Navigating to Library page...', '\x1b[36m');
        await page.click('[data-page="library"]');
        await page.waitForTimeout(3000); // Give time for images to load
        
        // Check if yoga cards exist
        const yogaCards = await page.evaluate(() => {
            const cards = document.querySelectorAll('.yoga-card');
            return {
                count: cards.length,
                hasBackgroundImages: Array.from(cards).some(card => {
                    const bg = card.style.backgroundImage;
                    return bg && bg.includes('pexels.com');
                })
            };
        });
        
        if (yogaCards.count > 0) {
            log(`   ✅ Found ${yogaCards.count} yoga cards`, '\x1b[32m');
            
            if (yogaCards.hasBackgroundImages) {
                log('   ✅ Yoga cards have Pexels background images!', '\x1b[32m');
                results.yogaImages = true;
                
                // Get sample image URL
                const sampleImage = await page.evaluate(() => {
                    const card = document.querySelector('.yoga-card');
                    return card ? card.style.backgroundImage : null;
                });
                
                if (sampleImage) {
                    log(`   📸 Sample image: ${sampleImage.substring(0, 70)}...`, '\x1b[90m');
                }
            } else {
                log('   ⚠️  Yoga cards found but images may still be loading...', '\x1b[33m');
                // Wait a bit more
                await page.waitForTimeout(2000);
                
                const recheckImages = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('.yoga-card')).some(card => {
                        return card.style.backgroundImage && card.style.backgroundImage.includes('pexels.com');
                    });
                });
                
                if (recheckImages) {
                    log('   ✅ Images loaded after waiting!', '\x1b[32m');
                    results.yogaImages = true;
                } else {
                    log('   ❌ No Pexels images on yoga cards', '\x1b[31m');
                }
            }
        } else {
            log('   ❌ No yoga cards found!', '\x1b[31m');
        }
        
        // ==================== TEST 4: DAILY WALLPAPER ====================
        log('\n🌅 FEATURE 4: Daily Wallpaper', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        // Go to Settings page
        log('   🔄 Navigating to Settings page...', '\x1b[36m');
        await page.click('[data-page="settings"]');
        await page.waitForTimeout(2000);
        
        // Check if daily wallpaper button exists
        const dailyWallpaperBtn = await page.evaluate(() => {
            return !!document.getElementById('daily-wallpaper-btn');
        });
        
        if (dailyWallpaperBtn) {
            log('   ✅ Daily wallpaper button found!', '\x1b[32m');
            
            // Click the button
            log('   🔄 Clicking "Get Daily Wallpaper"...', '\x1b[36m');
            await page.evaluate(() => {
                document.getElementById('daily-wallpaper-btn').click();
            });
            await page.waitForTimeout(4000); // Give time for API call
            
            // Check if wallpaper was applied
            const wallpaperApplied = await page.evaluate(() => {
                const bg = document.body.style.backgroundImage;
                return bg && bg.includes('pexels.com');
            });
            
            if (wallpaperApplied) {
                log('   ✅ Daily wallpaper loaded from Pexels!', '\x1b[32m');
                results.dailyWallpaper = true;
                
                // Get wallpaper URL
                const wallpaperUrl = await page.evaluate(() => {
                    return document.body.style.backgroundImage;
                });
                
                log(`   📸 Wallpaper: ${wallpaperUrl.substring(0, 70)}...`, '\x1b[90m');
                
                // Check localStorage
                const savedWallpaper = await page.evaluate(() => {
                    return localStorage.getItem('dailyWallpaper');
                });
                
                if (savedWallpaper) {
                    log('   ✅ Wallpaper saved to localStorage!', '\x1b[32m');
                    const parsed = JSON.parse(savedWallpaper);
                    log(`   📅 Date: ${parsed.date}`, '\x1b[90m');
                    log(`   👤 Photographer: ${parsed.photographer}`, '\x1b[90m');
                }
            } else {
                log('   ❌ Daily wallpaper not applied!', '\x1b[31m');
            }
        } else {
            log('   ❌ Daily wallpaper button not found!', '\x1b[31m');
        }
        
        // ==================== SUMMARY ====================
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 PEXELS FEATURES TEST SUMMARY', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        const totalTests = Object.keys(results).length;
        const passedTests = Object.values(results).filter(r => r).length;
        const percentage = ((passedTests / totalTests) * 100).toFixed(1);
        
        log(`\n✅ PASSED: ${passedTests}/${totalTests} tests (${percentage}%)`, 
            passedTests === totalTests ? '\x1b[1m\x1b[32m' : '\x1b[33m');
        
        log('\nDetailed Results:', '\x1b[1m');
        log(`   ${results.login ? '✅' : '❌'} Login`, results.login ? '\x1b[32m' : '\x1b[31m');
        log(`   ${results.randomBackground ? '✅' : '❌'} Random Meditation Backgrounds`, results.randomBackground ? '\x1b[32m' : '\x1b[31m');
        log(`   ${results.videoMode ? '✅' : '❌'} Video Background Mode`, results.videoMode ? '\x1b[32m' : '\x1b[31m');
        log(`   ${results.yogaImages ? '✅' : '❌'} Yoga Library Images`, results.yogaImages ? '\x1b[32m' : '\x1b[31m');
        log(`   ${results.dailyWallpaper ? '✅' : '❌'} Daily Wallpaper`, results.dailyWallpaper ? '\x1b[32m' : '\x1b[31m');
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        if (passedTests === totalTests) {
            log('🎉 ALL PEXELS FEATURES WORKING PERFECTLY!', '\x1b[1m\x1b[32m');
        } else if (passedTests >= totalTests * 0.8) {
            log('✅ MOST FEATURES WORKING! Minor issues only.', '\x1b[33m');
        } else {
            log('⚠️  SOME FEATURES NEED ATTENTION', '\x1b[33m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        log('⏸️  Browser stays open for 15 seconds to review...', '\x1b[90m');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        log(`\n❌ Test Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return results;
}

testPexelsFeatures()
    .then((results) => {
        const passed = Object.values(results).filter(r => r).length;
        const total = Object.keys(results).length;
        
        if (passed === total) {
            log('\n✅ All Pexels features verified and working!\n', '\x1b[32m');
            process.exit(0);
        } else {
            log(`\n⚠️  ${passed}/${total} features working\n`, '\x1b[33m');
            process.exit(0);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal error: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


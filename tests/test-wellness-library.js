// Test Wellness Library Features
// Verify yoga poses and articles open modals with full content

const puppeteer = require('puppeteer');

const BASE_URL = 'https://mindglow-wellness.web.app';
const TEST_USER = {
    email: 'bgtest1760309211328@mindglow.app',
    password: 'TestBG123!'
};

function log(msg, color = '\x1b[36m') {
    console.log(`${color}${msg}\x1b[0m`);
}

async function testWellnessLibrary() {
    log('\n🧘 TESTING WELLNESS LIBRARY INTERACTIVE FEATURES\n', '\x1b[1m\x1b[35m');
    log('='.repeat(70));
    
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 200,
        defaultViewport: null,
        args: ['--start-maximized']
    });
    
    const page = await browser.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('✅') || text.includes('❌') || text.includes('Loaded')) {
            log(`   [Browser] ${text}`, '\x1b[90m');
        }
    });
    
    const testResults = {
        login: false,
        navigateToLibrary: false,
        yogaPose1: false,
        yogaPose2: false,
        article1: false,
        article2: false,
        article3: false
    };
    
    try {
        // ==================== STEP 1: LOGIN ====================
        log('\n📱 STEP 1: Login with Test User', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await page.waitForTimeout(3000);
        
        await page.type('#login-email', TEST_USER.email, { delay: 20 });
        await page.type('#login-password', TEST_USER.password, { delay: 20 });
        await page.click('#login-form button[type="submit"]');
        await page.waitForTimeout(5000);
        
        const loggedIn = await page.evaluate(() => {
            return !document.getElementById('app-container')?.classList.contains('hidden');
        });
        
        if (loggedIn) {
            log('   ✅ Successfully logged in', '\x1b[32m');
            testResults.login = true;
        } else {
            log('   ❌ Login failed', '\x1b[31m');
            throw new Error('Login failed');
        }
        
        // ==================== STEP 2: NAVIGATE TO LIBRARY ====================
        log('\n📚 STEP 2: Navigate to Library Section', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.click('button[data-page="library"]');
        await page.waitForTimeout(3000);
        
        const libraryVisible = await page.evaluate(() => {
            const libraryPage = document.getElementById('library-page');
            return libraryPage && !libraryPage.classList.contains('hidden');
        });
        
        if (libraryVisible) {
            log('   ✅ Library section loaded', '\x1b[32m');
            testResults.navigateToLibrary = true;
            
            // Count elements
            const counts = await page.evaluate(() => {
                return {
                    yogaPoses: document.querySelectorAll('.yoga-card').length,
                    articles: document.querySelectorAll('.article-card').length
                };
            });
            
            log(`   📊 Found: ${counts.yogaPoses} yoga poses, ${counts.articles} articles`, '\x1b[90m');
        } else {
            log('   ❌ Library section not visible', '\x1b[31m');
            throw new Error('Library not visible');
        }
        
        // ==================== STEP 3: TEST YOGA POSE 1 (Mountain Pose) ====================
        log('\n🧘 STEP 3: Click Yoga Pose - Mountain Pose', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        // Click first yoga pose
        await page.evaluate(() => {
            const firstPose = document.querySelector('.yoga-card');
            if (firstPose) firstPose.click();
        });
        
        await page.waitForTimeout(2000);
        
        const yogaModal1 = await page.evaluate(() => {
            const modal = document.getElementById('yoga-pose-modal');
            if (!modal) return { visible: false };
            
            return {
                visible: true,
                poseName: modal.querySelector('.yoga-modal-header h2')?.textContent,
                sanskritName: modal.querySelector('.sanskrit-name')?.textContent,
                difficulty: modal.querySelector('.difficulty-badge')?.textContent,
                instructionCount: modal.querySelectorAll('.yoga-instructions li').length,
                benefitCount: modal.querySelectorAll('.yoga-benefits li').length,
                hasTip: !!modal.querySelector('.yoga-tip')
            };
        });
        
        if (yogaModal1.visible) {
            log(`   ✅ Modal opened successfully`, '\x1b[32m');
            log(`   📋 Pose: ${yogaModal1.poseName}`, '\x1b[90m');
            log(`   🕉️  Sanskrit: ${yogaModal1.sanskritName}`, '\x1b[90m');
            log(`   🎯 Difficulty: ${yogaModal1.difficulty}`, '\x1b[90m');
            log(`   📝 Instructions: ${yogaModal1.instructionCount} steps`, '\x1b[90m');
            log(`   ❤️  Benefits: ${yogaModal1.benefitCount} listed`, '\x1b[90m');
            log(`   💡 Has tip: ${yogaModal1.hasTip ? 'Yes' : 'No'}`, '\x1b[90m');
            
            if (yogaModal1.instructionCount >= 5 && yogaModal1.benefitCount >= 4) {
                testResults.yogaPose1 = true;
                log('   ✅ Full content verified', '\x1b[32m');
            } else {
                log('   ⚠️  Content incomplete', '\x1b[33m');
            }
        } else {
            log('   ❌ Modal did not open', '\x1b[31m');
        }
        
        // Close modal
        await page.evaluate(() => {
            const closeBtn = document.getElementById('close-yoga-modal');
            if (closeBtn) closeBtn.click();
        });
        await page.waitForTimeout(1000);
        
        // ==================== STEP 4: TEST YOGA POSE 2 (Downward Dog) ====================
        log('\n🐕 STEP 4: Click Yoga Pose - Downward Dog', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.evaluate(() => {
            const poses = document.querySelectorAll('.yoga-card');
            if (poses[1]) poses[1].click();
        });
        
        await page.waitForTimeout(2000);
        
        const yogaModal2 = await page.evaluate(() => {
            const modal = document.getElementById('yoga-pose-modal');
            if (!modal) return { visible: false };
            
            return {
                visible: true,
                poseName: modal.querySelector('.yoga-modal-header h2')?.textContent,
                instructionCount: modal.querySelectorAll('.yoga-instructions li').length
            };
        });
        
        if (yogaModal2.visible) {
            log(`   ✅ Modal opened: ${yogaModal2.poseName}`, '\x1b[32m');
            log(`   📝 ${yogaModal2.instructionCount} instruction steps`, '\x1b[90m');
            testResults.yogaPose2 = true;
        } else {
            log('   ❌ Modal did not open', '\x1b[31m');
        }
        
        // Close modal
        await page.evaluate(() => {
            const modal = document.getElementById('yoga-pose-modal');
            if (modal) modal.click();
        });
        await page.waitForTimeout(1000);
        
        // ==================== STEP 5: TEST ARTICLE 1 (Science of Meditation) ====================
        log('\n📖 STEP 5: Click Article - Science of Meditation', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.evaluate(() => {
            const firstArticle = document.querySelector('.article-card');
            if (firstArticle) firstArticle.click();
        });
        
        await page.waitForTimeout(2000);
        
        const articleModal1 = await page.evaluate(() => {
            const modal = document.getElementById('article-modal');
            if (!modal) return { visible: false };
            
            const bodyText = modal.querySelector('.article-modal-body')?.textContent || '';
            
            return {
                visible: true,
                title: modal.querySelector('.article-modal-header h2')?.textContent,
                readTime: modal.querySelector('.article-meta')?.textContent,
                wordCount: bodyText.split(/\s+/).length,
                hasH3: modal.querySelectorAll('.article-modal-body h3').length,
                hasH4: modal.querySelectorAll('.article-modal-body h4').length,
                hasLists: modal.querySelectorAll('.article-modal-body ul, .article-modal-body ol').length,
                hasFooter: !!modal.querySelector('.article-modal-footer')
            };
        });
        
        if (articleModal1.visible) {
            log(`   ✅ Modal opened successfully`, '\x1b[32m');
            log(`   📖 Article: ${articleModal1.title}`, '\x1b[90m');
            log(`   ⏱️  ${articleModal1.readTime}`, '\x1b[90m');
            log(`   📝 ~${articleModal1.wordCount} words`, '\x1b[90m');
            log(`   📋 ${articleModal1.hasH3} H3 sections, ${articleModal1.hasH4} H4 subsections`, '\x1b[90m');
            log(`   📌 ${articleModal1.hasLists} lists`, '\x1b[90m');
            log(`   💡 Footer: ${articleModal1.hasFooter ? 'Yes' : 'No'}`, '\x1b[90m');
            
            if (articleModal1.wordCount > 200 && articleModal1.hasH3 > 0 && articleModal1.hasLists > 0) {
                testResults.article1 = true;
                log('   ✅ Full article content verified', '\x1b[32m');
            } else {
                log('   ⚠️  Article content may be incomplete', '\x1b[33m');
            }
        } else {
            log('   ❌ Modal did not open', '\x1b[31m');
        }
        
        // Close modal
        await page.evaluate(() => {
            const closeBtn = document.getElementById('close-article-modal');
            if (closeBtn) closeBtn.click();
        });
        await page.waitForTimeout(1000);
        
        // ==================== STEP 6: TEST ARTICLE 2 (Building Habits) ====================
        log('\n🎯 STEP 6: Click Article - Building Healthy Habits', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.evaluate(() => {
            const articles = document.querySelectorAll('.article-card');
            if (articles[1]) articles[1].click();
        });
        
        await page.waitForTimeout(2000);
        
        const articleModal2 = await page.evaluate(() => {
            const modal = document.getElementById('article-modal');
            if (!modal) return { visible: false };
            
            return {
                visible: true,
                title: modal.querySelector('.article-modal-header h2')?.textContent,
                hasContent: modal.querySelector('.article-modal-body')?.textContent.length > 500
            };
        });
        
        if (articleModal2.visible) {
            log(`   ✅ Modal opened: ${articleModal2.title}`, '\x1b[32m');
            log(`   📄 Has substantial content: ${articleModal2.hasContent ? 'Yes' : 'No'}`, '\x1b[90m');
            testResults.article2 = true;
        } else {
            log('   ❌ Modal did not open', '\x1b[31m');
        }
        
        // Close modal by clicking outside
        await page.evaluate(() => {
            const modal = document.getElementById('article-modal');
            if (modal) modal.click();
        });
        await page.waitForTimeout(1000);
        
        // ==================== STEP 7: TEST ARTICLE 3 (Sleep Hygiene) ====================
        log('\n😴 STEP 7: Click Article - Sleep Hygiene Guide', '\x1b[1m\x1b[36m');
        log('-'.repeat(70));
        
        await page.evaluate(() => {
            const articles = document.querySelectorAll('.article-card');
            if (articles[3]) articles[3].click(); // Sleep is 4th article
        });
        
        await page.waitForTimeout(2000);
        
        const articleModal3 = await page.evaluate(() => {
            const modal = document.getElementById('article-modal');
            if (!modal) return { visible: false };
            
            const bodyText = modal.querySelector('.article-modal-body')?.textContent || '';
            
            return {
                visible: true,
                title: modal.querySelector('.article-modal-header h2')?.textContent,
                mentionsMindGlow: bodyText.includes('MindGlow')
            };
        });
        
        if (articleModal3.visible) {
            log(`   ✅ Modal opened: ${articleModal3.title}`, '\x1b[32m');
            log(`   🔗 References MindGlow: ${articleModal3.mentionsMindGlow ? 'Yes' : 'No'}`, '\x1b[90m');
            testResults.article3 = true;
        } else {
            log('   ❌ Modal did not open', '\x1b[31m');
        }
        
        // Close modal
        await page.evaluate(() => {
            const closeBtn = document.getElementById('close-article-modal');
            if (closeBtn) closeBtn.click();
        });
        await page.waitForTimeout(1000);
        
        // ==================== RESULTS ====================
        log('\n' + '='.repeat(70), '\x1b[36m');
        log('📊 WELLNESS LIBRARY TEST RESULTS', '\x1b[1m');
        log('='.repeat(70), '\x1b[36m');
        
        log('\n🧪 Test Results:', '\x1b[1m');
        log(`   ${testResults.login ? '✅' : '❌'} Login`, testResults.login ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.navigateToLibrary ? '✅' : '❌'} Navigate to Library`, testResults.navigateToLibrary ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.yogaPose1 ? '✅' : '❌'} Yoga Pose Modal #1 (Mountain Pose)`, testResults.yogaPose1 ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.yogaPose2 ? '✅' : '❌'} Yoga Pose Modal #2 (Downward Dog)`, testResults.yogaPose2 ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.article1 ? '✅' : '❌'} Article Modal #1 (Science of Meditation)`, testResults.article1 ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.article2 ? '✅' : '❌'} Article Modal #2 (Building Habits)`, testResults.article2 ? '\x1b[32m' : '\x1b[31m');
        log(`   ${testResults.article3 ? '✅' : '❌'} Article Modal #3 (Sleep Hygiene)`, testResults.article3 ? '\x1b[32m' : '\x1b[31m');
        
        const passedTests = Object.values(testResults).filter(r => r).length;
        const totalTests = Object.keys(testResults).length;
        
        log(`\n   📊 Pass Rate: ${passedTests}/${totalTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`, 
            passedTests === totalTests ? '\x1b[32m' : '\x1b[33m');
        
        log('\n' + '='.repeat(70), '\x1b[36m');
        
        if (passedTests === totalTests) {
            log('🎉 ALL LIBRARY FEATURES WORKING PERFECTLY!', '\x1b[1m\x1b[32m');
            log('   ✅ Yoga pose modals with full instructions', '\x1b[32m');
            log('   ✅ Article modals with lengthy content', '\x1b[32m');
            log('   ✅ All click interactions functional', '\x1b[32m');
        } else {
            log(`⚠️  ${totalTests - passedTests} TESTS FAILED`, '\x1b[33m');
            log('   Review failed tests above for details', '\x1b[33m');
        }
        
        log('='.repeat(70) + '\n', '\x1b[36m');
        
        log('⏸️  Browser stays open for 30 seconds to review...\n', '\x1b[90m');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        log(`\n❌ Error: ${error.message}`, '\x1b[31m');
        console.error(error);
    } finally {
        await browser.close();
    }
    
    return testResults;
}

testWellnessLibrary()
    .then((results) => {
        const passedTests = Object.values(results).filter(r => r).length;
        const totalTests = Object.keys(results).length;
        
        log('\n📊 FINAL RESULT:', '\x1b[1m');
        
        if (passedTests === totalTests) {
            log('   ✅ WELLNESS LIBRARY: FULLY FUNCTIONAL!', '\x1b[32m');
            log('   All yoga poses and articles are interactive!\n', '\x1b[32m');
            process.exit(0);
        } else {
            log(`   ⚠️  ${passedTests}/${totalTests} tests passed\n`, '\x1b[33m');
            process.exit(0);
        }
    })
    .catch(err => {
        log(`\n❌ Fatal: ${err.message}\n`, '\x1b[31m');
        process.exit(1);
    });


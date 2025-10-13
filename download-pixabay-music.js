// Automated Pixabay Music Downloader
// Downloads 18 royalty-free music tracks from Pixabay
// A product of Bradley Virtual Solutions, LLC

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_KEY = '48553549-2dc3fce510aea40e30bbe9d31';
const API_URL = 'https://pixabay.com/api/';
const MUSIC_DIR = path.join(__dirname, 'music');

// Color console output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(msg, color = colors.blue) {
    console.log(`${color}${msg}${colors.reset}`);
}

// Download a file from URL
function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            
            file.on('finish', () => {
                file.close();
                resolve();
            });
            
            file.on('error', (err) => {
                fs.unlink(filepath, () => {});
                reject(err);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => {});
            reject(err);
        });
    });
}

// Fetch music from Pixabay API
async function fetchMusicFromPixabay(query, count = 5) {
    return new Promise((resolve, reject) => {
        const url = `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}&audio_type=music&per_page=${count}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.hits || []);
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}

// Main download function
async function downloadPixabayMusic() {
    log('\n🎵 PIXABAY MUSIC DOWNLOADER\n', colors.bold + colors.blue);
    log('='.repeat(70));
    
    const downloads = [];
    
    // Categories to download
    const categories = [
        { query: 'meditation music', prefix: 'meditation', icon: 'om', category: 'Meditation', count: 5 },
        { query: 'sleep music', prefix: 'sleep', icon: 'moon', category: 'Sleep', count: 5 },
        { query: 'relaxing music', prefix: 'relaxation', icon: 'cloud', category: 'Relaxation', count: 4 },
        { query: 'ambient music', prefix: 'ambient', icon: 'music', category: 'Ambient', count: 4 }
    ];
    
    log('\n📥 Fetching tracks from Pixabay API...\n', colors.blue);
    
    // Fetch tracks for each category
    for (const cat of categories) {
        try {
            log(`   🔍 Searching: "${cat.query}"...`, colors.blue);
            const hits = await fetchMusicFromPixabay(cat.query, cat.count);
            
            if (hits.length > 0) {
                log(`      ✅ Found ${hits.length} tracks`, colors.green);
                
                let fileNum = 4; // Start numbering after existing files
                if (cat.prefix === 'sleep') fileNum = 1;
                if (cat.prefix === 'relaxation') fileNum = 3;
                if (cat.prefix === 'ambient') fileNum = 5;
                
                for (const hit of hits.slice(0, cat.count)) {
                    const filename = `${cat.prefix}-${fileNum.toString().padStart(2, '0')}.mp3`;
                    const filepath = path.join(MUSIC_DIR, filename);
                    
                    // Check if file already exists
                    if (fs.existsSync(filepath)) {
                        const stats = fs.statSync(filepath);
                        if (stats.size > 100000) { // If > 100KB, consider it valid
                            log(`      ⏭️  Skipping ${filename} (already exists)`, colors.yellow);
                            fileNum++;
                            continue;
                        }
                    }
                    
                    downloads.push({
                        url: hit.previewURL, // Use preview URL (free, no attribution needed)
                        filepath: filepath,
                        filename: filename,
                        title: cleanTitle(hit.tags),
                        artist: hit.user || 'Pixabay Artist',
                        category: cat.category,
                        icon: cat.icon,
                        duration: formatDuration(hit.duration)
                    });
                    
                    fileNum++;
                }
            } else {
                log(`      ⚠️  No tracks found`, colors.yellow);
            }
        } catch (error) {
            log(`      ❌ Error: ${error.message}`, colors.red);
        }
    }
    
    if (downloads.length === 0) {
        log('\n⚠️  No new tracks to download!\n', colors.yellow);
        return;
    }
    
    // Download all tracks
    log(`\n📥 Downloading ${downloads.length} music tracks...\n`, colors.bold + colors.blue);
    
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < downloads.length; i++) {
        const track = downloads[i];
        const progress = `[${i + 1}/${downloads.length}]`;
        
        try {
            log(`${progress} Downloading: ${track.filename}...`, colors.blue);
            log(`         "${track.title}" by ${track.artist}`, colors.blue);
            
            await downloadFile(track.url, track.filepath);
            
            // Check file size
            const stats = fs.statSync(track.filepath);
            if (stats.size > 10000) {
                log(`         ✅ Downloaded (${(stats.size / 1024 / 1024).toFixed(1)} MB)`, colors.green);
                successCount++;
            } else {
                log(`         ⚠️  File too small (${stats.size} bytes) - may be error`, colors.yellow);
                failCount++;
            }
            
            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            log(`         ❌ Failed: ${error.message}`, colors.red);
            failCount++;
        }
    }
    
    // Summary
    log('\n' + '='.repeat(70), colors.blue);
    log('📊 DOWNLOAD SUMMARY', colors.bold);
    log('='.repeat(70), colors.blue);
    
    log(`\n✅ Successful: ${successCount}`, colors.green);
    log(`❌ Failed: ${failCount}`, failCount > 0 ? colors.red : colors.reset);
    log(`📊 Success Rate: ${((successCount / downloads.length) * 100).toFixed(1)}%`, colors.blue);
    
    if (successCount > 0) {
        log('\n🎉 MUSIC DOWNLOADED SUCCESSFULLY!', colors.bold + colors.green);
        log('\nNext steps:', colors.blue);
        log('   1. Run: node update-music-library.js', colors.yellow);
        log('   2. Or tell the AI: "update music library"', colors.yellow);
    }
    
    log('\n' + '='.repeat(70) + '\n', colors.blue);
}

// Helper functions
function cleanTitle(tags) {
    if (!tags) return 'Meditation Music';
    const words = tags.split(',')[0].trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
}

function formatDuration(seconds) {
    if (!seconds) return '3:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Run the downloader
log('\n🚀 Starting Pixabay Music Downloader...\n', colors.bold + colors.blue);
downloadPixabayMusic()
    .then(() => {
        log('✅ Download process complete!\n', colors.green);
        process.exit(0);
    })
    .catch(err => {
        log(`\n❌ Fatal error: ${err.message}\n`, colors.red);
        process.exit(1);
    });


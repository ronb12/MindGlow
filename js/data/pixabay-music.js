// Pixabay Music Tracks - Dynamically loaded
// These are fetched from Pixabay API and added to the music library

import { CONFIG } from '../config.js';

const API_KEY = CONFIG.pixabay.apiKey;
const API_URL = CONFIG.pixabay.apiUrl;

// Fetch 20 meditation/ambient music tracks from Pixabay
export async function fetchPixabayMusic() {
    const tracks = [];
    let trackId = 13; // Start after the 12 local tracks

    try {
        // Fetch music for different moods
        const queries = [
            { query: 'meditation music', category: 'Meditation', icon: 'om', limit: 5 },
            { query: 'sleep music', category: 'Sleep', icon: 'moon', limit: 5 },
            { query: 'relaxing music', category: 'Relaxation', icon: 'cloud', limit: 5 },
            { query: 'ambient music', category: 'Ambient', icon: 'music', limit: 5 }
        ];

        for (const queryObj of queries) {
            const response = await fetch(
                `${API_URL}?key=${API_KEY}&q=${encodeURIComponent(queryObj.query)}&audio_type=music&per_page=${queryObj.limit}`
            );

            if (response.ok) {
                const data = await response.json();
                
                if (data.hits && data.hits.length > 0) {
                    data.hits.forEach(hit => {
                        tracks.push({
                            id: trackId++,
                            title: cleanTitle(hit.tags),
                            artist: hit.user || 'Pixabay Artist',
                            icon: queryObj.icon,
                            url: hit.previewURL, // Preview URL - direct streaming
                            downloadUrl: hit.audioURL,
                            license: 'Pixabay License',
                            category: queryObj.category,
                            duration: formatDuration(hit.duration)
                        });
                    });
                }
            }
        }

        console.log('✅ Fetched', tracks.length, 'Pixabay music tracks');
        return tracks;
        
    } catch (error) {
        console.error('Error fetching Pixabay music:', error);
        return [];
    }
}

// Helper: Clean title from tags
function cleanTitle(tags) {
    if (!tags) return 'Meditation Music';
    const words = tags.split(',')[0].trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
}

// Helper: Format duration
function formatDuration(seconds) {
    if (!seconds) return '3:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}


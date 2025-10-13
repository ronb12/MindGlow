// Pixabay Music API Utility
// Fetch royalty-free music for meditation sessions
// A product of Bradley Virtual Solutions, LLC

import { CONFIG } from '../config.js';

const API_KEY = CONFIG.pixabay.apiKey;
const API_URL = CONFIG.pixabay.apiUrl;

class PixabayMusicAPI {
    constructor() {
        this.cachedTracks = [];
    }

    // Fetch meditation/ambient music tracks
    async getMeditationMusic(count = 20) {
        const queries = ['meditation', 'relaxing', 'ambient', 'calm', 'peaceful', 'sleep'];
        const tracks = [];

        try {
            for (const query of queries) {
                const response = await fetch(
                    `${API_URL}?key=${API_KEY}&q=${query}&audio_type=music&per_page=20`
                );
                
                if (!response.ok) {
                    console.warn(`Pixabay API error for ${query}:`, response.status);
                    continue;
                }
                
                const data = await response.json();
                
                if (data.hits && data.hits.length > 0) {
                    // Get first few tracks from each category
                    const categoryTracks = data.hits.slice(0, 4).map(hit => ({
                        id: hit.id,
                        title: this.cleanTitle(hit.tags),
                        artist: hit.user || 'Pixabay Artist',
                        url: hit.previewURL, // Use preview URL (works without download)
                        downloadUrl: hit.audioURL, // Full track (may require download)
                        duration: this.formatDuration(hit.duration),
                        category: this.categorizeTrack(query),
                        license: 'Pixabay License',
                        tags: hit.tags
                    }));
                    
                    tracks.push(...categoryTracks);
                }
                
                // Stop if we have enough
                if (tracks.length >= count) break;
            }

            this.cachedTracks = tracks.slice(0, count);
            console.log('✅ Fetched', this.cachedTracks.length, 'Pixabay music tracks');
            return this.cachedTracks;
            
        } catch (error) {
            console.error('Error fetching Pixabay music:', error);
            return [];
        }
    }

    // Clean up title from tags
    cleanTitle(tags) {
        if (!tags) return 'Untitled';
        const words = tags.split(',')[0].trim().split(' ');
        return words.slice(0, 3).join(' ').replace(/^\w/, c => c.toUpperCase());
    }

    // Format duration from seconds to MM:SS
    formatDuration(seconds) {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Categorize track based on search query
    categorizeTrack(query) {
        const map = {
            'meditation': 'Meditation',
            'relaxing': 'Relaxation',
            'ambient': 'Ambient',
            'calm': 'Relaxation',
            'peaceful': 'Ambient',
            'sleep': 'Sleep'
        };
        return map[query] || 'Ambient';
    }

    // Get cached tracks
    getCachedTracks() {
        return this.cachedTracks;
    }
}

export const pixabayMusic = new PixabayMusicAPI();


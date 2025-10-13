// Pexels API Utility
// Fetch images and videos from Pexels for meditation backgrounds
// A product of Bradley Virtual Solutions, LLC

import { CONFIG } from '../config.js';

const API_KEY = CONFIG.pexels.apiKey;
const API_URL = CONFIG.pexels.apiUrl;
const VIDEO_API_URL = CONFIG.pexels.videoApiUrl;

class PexelsAPI {
    constructor() {
        this.headers = {
            'Authorization': API_KEY
        };
    }

    // Fetch curated meditation/nature photos
    async getMeditationPhotos(perPage = 15) {
        const queries = ['meditation', 'nature', 'zen', 'calm', 'peaceful', 'yoga'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        try {
            const response = await fetch(
                `${API_URL}/search?query=${randomQuery}&per_page=${perPage}&orientation=landscape`,
                { headers: this.headers }
            );
            
            if (!response.ok) throw new Error('Pexels API error');
            
            const data = await response.json();
            return data.photos;
        } catch (error) {
            console.error('Error fetching photos:', error);
            return [];
        }
    }

    // Fetch specific category photos
    async getPhotosByCategory(category, perPage = 15) {
        try {
            const response = await fetch(
                `${API_URL}/search?query=${category}&per_page=${perPage}&orientation=landscape`,
                { headers: this.headers }
            );
            
            if (!response.ok) throw new Error('Pexels API error');
            
            const data = await response.json();
            return data.photos;
        } catch (error) {
            console.error('Error fetching photos:', error);
            return [];
        }
    }

    // Fetch calming nature videos
    async getCalmingVideos(perPage = 10) {
        const queries = ['meditation', 'ocean waves', 'forest', 'rain', 'waterfall', 'clouds'];
        const randomQuery = queries[Math.floor(Math.random() * queries.length)];
        
        try {
            const response = await fetch(
                `${VIDEO_API_URL}/search?query=${randomQuery}&per_page=${perPage}&orientation=landscape`,
                { headers: this.headers }
            );
            
            if (!response.ok) throw new Error('Pexels Video API error');
            
            const data = await response.json();
            return data.videos;
        } catch (error) {
            console.error('Error fetching videos:', error);
            return [];
        }
    }

    // Get daily wallpaper (curated by date)
    async getDailyWallpaper() {
        try {
            const response = await fetch(
                `${API_URL}/curated?per_page=1&page=${new Date().getDate()}`,
                { headers: this.headers }
            );
            
            if (!response.ok) throw new Error('Pexels API error');
            
            const data = await response.json();
            return data.photos[0];
        } catch (error) {
            console.error('Error fetching daily wallpaper:', error);
            return null;
        }
    }

    // Get yoga/wellness library images - specific to pose names
    async getYogaPoseImages(poseNames) {
        const images = [];
        
        try {
            for (const poseName of poseNames) {
                // Search for specific pose (e.g., "downward dog yoga pose")
                const searchQuery = `${poseName} yoga pose`;
                
                const response = await fetch(
                    `${API_URL}/search?query=${encodeURIComponent(searchQuery)}&per_page=1&orientation=landscape`,
                    { headers: this.headers }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.photos && data.photos.length > 0) {
                        images.push(data.photos[0]);
                    } else {
                        // Fallback: generic yoga image
                        images.push(null);
                    }
                } else {
                    images.push(null);
                }
                
                // Small delay between API calls
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            console.log('✅ Loaded', images.filter(img => img).length, 'specific yoga pose images');
            return images;
        } catch (error) {
            console.error('Error fetching yoga pose images:', error);
            return [];
        }
    }

    // Get random calming background
    async getRandomBackground() {
        const photos = await this.getMeditationPhotos(1);
        return photos[0];
    }
}

export const pexelsAPI = new PexelsAPI();


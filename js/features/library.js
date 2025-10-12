// Library Feature Module

import { yogaPoses, articles, getRandomTips } from '../data/content.js';

export class LibraryFeature {
    constructor() {}

    initialize() {
        this.renderYogaPoses();
        this.renderArticles();
        this.renderWellnessTips();
    }

    renderYogaPoses() {
        const grid = document.getElementById('yoga-grid');
        if (!grid) return;
        
        grid.innerHTML = yogaPoses.map(pose => `
            <div class="yoga-card">
                <h4>${pose.name}</h4>
                <p>${pose.description}</p>
            </div>
        `).join('');
    }

    renderArticles() {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;
        
        grid.innerHTML = articles.map(article => `
            <div class="article-card">
                <h4>${article.title}</h4>
                <p>${article.preview}</p>
            </div>
        `).join('');
    }

    renderWellnessTips() {
        const container = document.getElementById('wellness-tips');
        if (!container) return;
        
        const tips = getRandomTips(3);
        container.innerHTML = tips.map(tip => `
            <div class="tip-card">
                <i class="fas fa-lightbulb"></i>
                <p>${tip}</p>
            </div>
        `).join('');
    }
}

// Singleton instance
export const library = new LibraryFeature();


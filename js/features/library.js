// Library Feature Module

import { yogaPoses, articles, getRandomTips } from '../data/content.js';
import { mindfulEatingGuide } from '../data/mindful-eating.js';
import { pexelsAPI } from '../utils/pexels.js';

export class LibraryFeature {
    constructor() {
        this.yogaImages = [];
    }

    initialize() {
        this.renderYogaPoses();
        this.renderArticles();
        this.renderWellnessTips();
        this.setupMindfulEatingGuide();
        this.loadYogaImages();
    }
    
    setupMindfulEatingGuide() {
        const viewGuideBtn = document.querySelector('.eating-guide button');
        if (viewGuideBtn) {
            viewGuideBtn.addEventListener('click', () => this.showMindfulEatingGuide());
        }
    }
    
    showMindfulEatingGuide() {
        // Create modal for full guide
        const modal = document.createElement('div');
        modal.className = 'modal eating-guide-modal';
        modal.innerHTML = `
            <div class="modal-content eating-guide-content">
                <span class="close">&times;</span>
                <h2><i class="fas fa-utensils"></i> ${mindfulEatingGuide.title}</h2>
                <p class="subtitle">${mindfulEatingGuide.subtitle}</p>
                
                <div class="guide-section">
                    <h3><i class="fas fa-lightbulb"></i> Core Principles</h3>
                    <div class="principles-grid">
                        ${mindfulEatingGuide.principles.map(p => `
                            <div class="principle-card">
                                <h4>${p.title}</h4>
                                <p>${p.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="guide-section">
                    <h3><i class="fas fa-list-ol"></i> Step-by-Step Guide</h3>
                    ${mindfulEatingGuide.stepByStepGuide.map(s => `
                        <div class="step-card">
                            <div class="step-number">Step ${s.step}</div>
                            <h4>${s.title}</h4>
                            <ul>
                                ${s.instructions.map(i => `<li>${i}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="guide-section">
                    <h3><i class="fas fa-check-circle"></i> Practical Tips</h3>
                    ${mindfulEatingGuide.practicalTips.map(t => `
                        <div class="tips-category">
                            <h4>${t.category}</h4>
                            <ul>
                                ${t.tips.map(tip => `<li>${tip}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                
                <div class="guide-section">
                    <h3><i class="fas fa-star"></i> Benefits</h3>
                    <div class="benefits-grid">
                        ${mindfulEatingGuide.benefits.map(b => `
                            <div class="benefit-card">
                                <h4>${b.category}</h4>
                                <ul>
                                    ${b.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="guide-section">
                    <h3><i class="fas fa-hands-helping"></i> Techniques to Practice</h3>
                    ${mindfulEatingGuide.techniques.map(tech => `
                        <div class="technique-card">
                            <h4>${tech.name}</h4>
                            <p><em>${tech.description}</em></p>
                            ${tech.steps ? `<ol>${tech.steps.map(s => `<li>${s}</li>`).join('')}</ol>` : ''}
                            ${tech.scale ? `<ul>${tech.scale.map(s => `<li>${s}</li>`).join('')}</ul>` : ''}
                            ${tech.usage ? `<p class="usage-note"><strong>How to use:</strong> ${tech.usage}</p>` : ''}
                            ${tech.senses ? `
                                <ul>
                                    ${Object.entries(tech.senses).map(([sense, q]) => 
                                        `<li><strong>${sense.charAt(0).toUpperCase() + sense.slice(1)}:</strong> ${q}</li>`
                                    ).join('')}
                                </ul>
                            ` : ''}
                            ${tech.practice ? `<ul>${tech.practice.map(p => `<li>${p}</li>`).join('')}</ul>` : ''}
                        </div>
                    `).join('')}
                </div>
                
                <div class="guide-section">
                    <h3><i class="fas fa-question-circle"></i> Common Challenges & Solutions</h3>
                    <div class="challenges-list">
                        ${mindfulEatingGuide.commonChallenges.map(c => `
                            <div class="challenge-item">
                                <div class="challenge-q">
                                    <strong>Challenge:</strong> ${c.challenge}
                                </div>
                                <div class="challenge-a">
                                    <strong>Solution:</strong> ${c.solution}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="guide-section quotes-section">
                    <h3><i class="fas fa-quote-left"></i> Inspiration</h3>
                    ${mindfulEatingGuide.quotes.map(q => `
                        <blockquote>"${q}"</blockquote>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
        
        // Close modal
        const closeBtn = modal.querySelector('.close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    renderYogaPoses() {
        const grid = document.getElementById('yoga-grid');
        if (!grid) return;
        
        grid.innerHTML = yogaPoses.map((pose, index) => {
            const image = this.yogaImages[index];
            const bgStyle = image 
                ? `background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${image.src.medium}); background-size: cover; background-position: center;`
                : '';
            
            return `
                <div class="yoga-card" style="${bgStyle}">
                    <h4 style="color: ${image ? 'white' : 'inherit'}; text-shadow: ${image ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none'};">${pose.name}</h4>
                    <p style="color: ${image ? 'white' : 'inherit'}; text-shadow: ${image ? '1px 1px 2px rgba(0,0,0,0.8)' : 'none'};">${pose.description}</p>
                </div>
            `;
        }).join('');
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

    // Load yoga images from Pexels - SPECIFIC to each pose
    async loadYogaImages() {
        try {
            // Extract pose names
            const poseNames = yogaPoses.map(pose => pose.name);
            
            // Fetch images specific to each pose
            this.yogaImages = await pexelsAPI.getYogaPoseImages(poseNames);
            console.log('✅ Loaded', this.yogaImages.filter(img => img).length, 'specific yoga pose images');
            this.renderYogaPoses(); // Re-render with pose-specific images
        } catch (error) {
            console.error('Error loading yoga images:', error);
        }
    }
}

// Singleton instance
export const library = new LibraryFeature();


// Theme Management

export class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.toggle = null;
    }

    initialize() {
        this.toggle = document.getElementById('theme-toggle');
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        if (this.toggle) {
            this.toggle.checked = savedTheme === 'dark';
            this.toggle.addEventListener('change', () => {
                this.setTheme(this.toggle.checked ? 'dark' : 'light');
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        localStorage.setItem('theme', theme);
        
        // Reapply background for theme
        const savedBg = localStorage.getItem('appBackground');
        if (savedBg) {
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                if (theme === 'dark') {
                    mainContent.style.background = `linear-gradient(rgba(17,24,39,0.95), rgba(17,24,39,0.95)), ${savedBg}`;
                } else {
                    mainContent.style.background = `linear-gradient(rgba(255,255,255,0.95), rgba(255,255,255,0.95)), ${savedBg}`;
                }
            }
        }
    }

    getTheme() {
        return this.currentTheme;
    }

    toggleTheme() {
        this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }
}

// Singleton instance
export const theme = new ThemeManager();

